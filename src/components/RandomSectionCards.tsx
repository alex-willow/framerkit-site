// src/components/RandomSectionCards.tsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

type ComponentItem = {
  key: string;
  title: string;
  image: string;
  url: string;
  type: "free" | "paid";
};

const STATIC_SECTIONS = [
  "navbar",
  "hero",
  "logo",
  "feature",
  "gallery",
  "testimonial",
  "contact",
  "pricing",
  "faq",
  "cta",
  "footer"
];

export default function RandomSectionCards() {
  const [cards, setCards] = useState<(ComponentItem | null)[]>(Array(STATIC_SECTIONS.length).fill(null));
  const [fading, setFading] = useState<boolean[]>(Array(STATIC_SECTIONS.length).fill(false));

  const hoveredRef = useRef<boolean[]>(Array(STATIC_SECTIONS.length).fill(false));
  const lastChangeRef = useRef<number[]>(Array(STATIC_SECTIONS.length).fill(0));
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rotatingRef = useRef(false);

  const itemsBySection = useRef<Record<string, ComponentItem[]>>({});

  useEffect(() => {
    const load = async () => {
      const data: Record<string, ComponentItem[]> = {};

      for (const sec of STATIC_SECTIONS) {
        try {
          // Исправлен URL: убраны лишние пробелы
          const res = await fetch(
            `https://raw.githubusercontent.com/alex-willow/framerkit-data/main/${sec}.json`
          );

          if (res.ok) {
            const json = await res.json();
            const allItems = json[sec] || [];
            data[sec] = allItems.filter(
              (item: ComponentItem) =>
                !item.key.toLowerCase().includes("dark")
            );
          } else {
            data[sec] = [];
          }
        } catch {
          data[sec] = [];
        }
      }

      itemsBySection.current = data;

      const now = Date.now();
      const initial = STATIC_SECTIONS.map(sec => {
        const items = data[sec];
        if (!items.length) return null;
        return items[Math.floor(Math.random() * items.length)];
      });

      setCards(initial);
      lastChangeRef.current = initial.map(() => now);
      startRotation();
    };

    load();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const rotateOne = () => {
    if (rotatingRef.current) return;

    const now = Date.now();
    const minInterval = 5000;
    const eligible: number[] = [];

    for (let i = 0; i < STATIC_SECTIONS.length; i++) {
      if (!hoveredRef.current[i] && now - lastChangeRef.current[i] >= minInterval) {
        eligible.push(i);
      }
    }

    if (!eligible.length) {
      timeoutRef.current = setTimeout(rotateOne, 1200);
      return;
    }

    const index = eligible[Math.floor(Math.random() * eligible.length)];
    const sec = STATIC_SECTIONS[index];
    const items = itemsBySection.current[sec];

    if (!items || items.length === 0) {
      timeoutRef.current = setTimeout(rotateOne, 1200);
      return;
    }

    const newCard = items[Math.floor(Math.random() * items.length)];
    rotatingRef.current = true;

    setFading(prev => {
      const c = [...prev];
      c[index] = true;
      return c;
    });

    const preload = new Image();
    preload.src = newCard.image;

    const swap = () => {
      setTimeout(() => {
        setCards(prev => {
          const c = [...prev];
          c[index] = newCard;
          lastChangeRef.current[index] = Date.now();
          return c;
        });
        setFading(prev => {
          const c = [...prev];
          c[index] = false;
          return c;
        });
        rotatingRef.current = false;
        timeoutRef.current = setTimeout(rotateOne, 1500);
      }, 400);
    };

    preload.onload = swap;
    preload.onerror = swap;
  };

  const startRotation = () => {
    timeoutRef.current = setTimeout(rotateOne, 6000);
  };

  return (
    <>
      {cards.map((item, index) => (
        <Link
          key={STATIC_SECTIONS[index]}
          to={item ? `/layout/${STATIC_SECTIONS[index]}` : "#"}
          className={item ? `card ${fading[index] ? "fadeOut" : "fadeIn"}` : "skeleton-card"}
          onMouseEnter={() => (hoveredRef.current[index] = true)}
          onMouseLeave={() => (hoveredRef.current[index] = false)}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {item ? (
            <>
              <div className="cardImage">
                <img
                  src={item.image}
                  alt={item.title}
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://via.placeholder.com/280x160?text=Preview")
                  }
                />
              </div>
              <div className="cardInfo">
                <h3>{item.title}</h3>
                <div className="iconButton2">
                  <ArrowUpRight size={16} className="explore-icon" />
                </div>
              </div>
              <div className="hoverOverlay" />
            </>
          ) : (
            <div className="skeleton-card-info"></div>
          )}
        </Link>
      ))}
    </>
  );
}