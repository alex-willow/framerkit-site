import { useEffect, useRef } from "react";

type HeroGridSnakeProps = {
  theme?: "light" | "dark";
  cellSize?: number;
};

type Direction = "up" | "right" | "down" | "left";

type GridPoint = {
  x: number;
  y: number;
};

type SnakeState = {
  trail: GridPoint[];
  direction: Direction;
  movesLeft: number;
  maxTrail: number;
  moveAccumulator: number;
  moveIntervalMs: number;
  dissolving: boolean;
  dissolveAccumulator: number;
  dissolveIntervalMs: number;
  isIntro?: boolean;
  target?: GridPoint;
  lingerMs?: number;
  stepFrom?: GridPoint;
  stepTo?: GridPoint;
};

const DIRECTIONS: Record<Direction, GridPoint> = {
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
};

const TURN_OPTIONS: Record<Direction, Direction[]> = {
  up: ["up", "left", "right"],
  right: ["right", "up", "down"],
  down: ["down", "left", "right"],
  left: ["left", "up", "down"],
};

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pickRandom = <T,>(list: T[]): T =>
  list[Math.floor(Math.random() * list.length)];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => t * t * (3 - 2 * t);

export default function HeroGridSnake({
  theme = "light",
  cellSize = 40,
}: HeroGridSnakeProps) {
  const MAX_ACTIVE_STROKES = 10;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let lastTs = performance.now();
    const snakes: SnakeState[] = [];

    let viewportWidth = 0;
    let viewportHeight = 0;
    let cols = 0;
    let rows = 0;
    let phaseX = 0;
    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      viewportWidth = rect.width;
      viewportHeight = rect.height;

      phaseX = ((viewportWidth - cellSize) / 2) % cellSize;
      if (phaseX < 0) phaseX += cellSize;

      cols = Math.max(4, Math.floor((viewportWidth - phaseX) / cellSize));
      rows = Math.max(4, Math.floor(viewportHeight / cellSize));

      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.width = Math.floor(viewportWidth * dpr);
      canvas.height = Math.floor(viewportHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawnSnakeFrom = (start: GridPoint) => {
      const validDirections = (["up", "right", "down", "left"] as Direction[]).filter(
        (dir) => {
          const delta = DIRECTIONS[dir];
          const nx = start.x + delta.x;
          const ny = start.y + delta.y;
          return nx >= 0 && nx <= cols && ny >= 0 && ny <= rows;
        }
      );
      const direction = validDirections.length
        ? pickRandom<Direction>(validDirections)
        : "right";
      const delta = DIRECTIONS[direction];
      const firstStep: GridPoint = {
        x: start.x + delta.x,
        y: start.y + delta.y,
      };

      snakes.push({
        trail: [start, firstStep],
        direction,
        movesLeft: randomBetween(8, 15),
        maxTrail: randomBetween(7, 11),
        moveAccumulator: 0,
        moveIntervalMs: randomBetween(270, 440),
        dissolving: false,
        dissolveAccumulator: 0,
        dissolveIntervalMs: randomBetween(95, 140),
        stepFrom: start,
        stepTo: firstStep,
      });
    };

    const pointInBounds = (point: GridPoint) =>
      point.x >= 0 && point.x <= cols && point.y >= 0 && point.y <= rows;

    const getNextPoint = (point: GridPoint, direction: Direction): GridPoint => {
      const delta = DIRECTIONS[direction];
      return { x: point.x + delta.x, y: point.y + delta.y };
    };

    const updateSnake = (snake: SnakeState, deltaMs: number) => {
      if (snake.dissolving) {
        snake.dissolveAccumulator += deltaMs;
        while (
          snake.dissolveAccumulator >= snake.dissolveIntervalMs &&
          snake.trail.length > 0
        ) {
          snake.dissolveAccumulator -= snake.dissolveIntervalMs;
          snake.trail.shift();
        }
        return;
      }

      snake.moveAccumulator += deltaMs;

      while (snake.moveAccumulator >= snake.moveIntervalMs) {
        snake.moveAccumulator -= snake.moveIntervalMs;

        const head = snake.trail[snake.trail.length - 1];
        const directions = TURN_OPTIONS[snake.direction];
        const ordered = [...directions].sort(() => Math.random() - 0.5);

        let nextDirection = snake.direction;
        let nextPoint = getNextPoint(head, nextDirection);

        for (const candidate of ordered) {
          const candidatePoint = getNextPoint(head, candidate);
          if (pointInBounds(candidatePoint)) {
            nextDirection = candidate;
            nextPoint = candidatePoint;
            break;
          }
        }

        if (!pointInBounds(nextPoint)) {
          snake.dissolving = true;
          break;
        }

        snake.direction = nextDirection;
        snake.stepFrom = head;
        snake.stepTo = nextPoint;

        snake.trail.push(nextPoint);
        if (snake.trail.length > snake.maxTrail) {
          snake.trail.shift();
        }

        snake.movesLeft -= 1;

        if (snake.movesLeft <= 0) {
          snake.dissolving = true;
          break;
        }
      }
    };

    const drawSnake = (snake: SnakeState) => {
      if (snake.trail.length < 1) return;

      const colorCore = theme === "dark" ? "167, 139, 250" : "110, 63, 243";
      const colorGlow = theme === "dark" ? "196, 181, 253" : "139, 92, 246";
      const alphaBase = theme === "dark" ? 0.48 : 0.4;
      const lineWidth = theme === "dark" ? 1.4 : 1.25;
      const glowWidth = lineWidth + (theme === "dark" ? 0.7 : 0.5);

      const toPixel = (p: GridPoint) => ({
        x: phaseX + p.x * cellSize,
        y: p.y * cellSize,
      });

      const drawPoints = [...snake.trail];

      if (!snake.dissolving && snake.stepFrom && snake.stepTo && drawPoints.length > 0) {
        const rawT = Math.max(
          0,
          Math.min(1, snake.moveAccumulator / snake.moveIntervalMs)
        );
        const t = easeInOut(rawT);

        drawPoints[drawPoints.length - 1] = {
          x: lerp(snake.stepFrom.x, snake.stepTo.x, t),
          y: lerp(snake.stepFrom.y, snake.stepTo.y, t),
        };
      }

      if (drawPoints.length < 2) return;

      const pixels = drawPoints.map(toPixel);

      // Важно: butt убирает круглые "точки" между шагами клетки.
      ctx.lineCap = "butt";
      ctx.lineJoin = "miter";

      for (let i = 0; i < pixels.length - 1; i += 1) {
        const progress = (i + 1) / (pixels.length - 1);
        const eased = Math.pow(progress, 1.35);
        const alpha = Math.max(0.04, alphaBase * eased);

        const p1 = pixels[i];
        const p2 = pixels[i + 1];

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineWidth = glowWidth;
        ctx.strokeStyle = `rgba(${colorGlow}, ${alpha * (theme === "dark" ? 0.18 : 0.22)})`;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = `rgba(${colorCore}, ${alpha})`;
        ctx.stroke();
      }

      // Небольшое мягкое свечение только у головы, чтобы линия не выглядела обрубленной.
      const head = pixels[pixels.length - 1];
      const headRadius = Math.max(0.8, lineWidth * 0.7);

      const headGlow = ctx.createRadialGradient(
        head.x,
        head.y,
        0,
        head.x,
        head.y,
        headRadius * 2.2
      );
      headGlow.addColorStop(
        0,
        `rgba(${colorGlow}, ${theme === "dark" ? 0.18 : 0.12})`
      );
      headGlow.addColorStop(1, `rgba(${colorGlow}, 0)`);

      ctx.beginPath();
      ctx.fillStyle = headGlow;
      ctx.arc(head.x, head.y, headRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();
    };

    const tick = (ts: number) => {
      const deltaMs = Math.min(64, ts - lastTs);
      lastTs = ts;

      ctx.clearRect(0, 0, viewportWidth, viewportHeight);

      for (let i = snakes.length - 1; i >= 0; i -= 1) {
        const snake = snakes[i];
        updateSnake(snake, deltaMs);
        drawSnake(snake);

        if (snake.trail.length === 0) {
          snakes.splice(i, 1);
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    resize();

    const host = canvas.parentElement;
    if (!host) return;

    let pointerDown = false;
    let lastSpawnAt = 0;
    let lastCellKey: string | null = null;

    const isInteractiveTarget = (target: EventTarget | null) => {
      const targetEl = target as HTMLElement | null;
      if (!targetEl) return false;
      return Boolean(
        targetEl.closest(
          "button, a, input, textarea, select, [role='button'], .authButton, .logoutButton, .theme-toggle-btn, .landing-nav-link"
        )
      );
    };

    const spawnFromPointer = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;

      if (localX < 0 || localY < 0 || localX > rect.width || localY > rect.height) {
        return;
      }

      const gx = Math.round((localX - phaseX) / cellSize);
      const gy = Math.round(localY / cellSize);

      const start: GridPoint = {
        x: Math.max(0, Math.min(cols, gx)),
        y: Math.max(0, Math.min(rows, gy)),
      };

      const cellKey = `${start.x}:${start.y}`;
      const now = performance.now();
      if (cellKey === lastCellKey || now - lastSpawnAt < 70) return;
      if (snakes.length >= MAX_ACTIVE_STROKES) return;

      spawnSnakeFrom(start);
      lastCellKey = cellKey;
      lastSpawnAt = now;
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (isInteractiveTarget(event.target)) return;
      pointerDown = true;
      spawnFromPointer(event.clientX, event.clientY);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!pointerDown) return;
      spawnFromPointer(event.clientX, event.clientY);
    };

    const handlePointerUp = () => {
      pointerDown = false;
      lastCellKey = null;
    };

    host.addEventListener("pointerdown", handlePointerDown);
    host.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      host.removeEventListener("pointerdown", handlePointerDown);
      host.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      resizeObserver.disconnect();
    };
  }, [cellSize, theme]);

  return <canvas ref={canvasRef} className="hero-grid-snake-layer" aria-hidden="true" />;
}
