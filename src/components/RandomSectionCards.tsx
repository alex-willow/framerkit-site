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
  const [cards, setCards] = useState<(ComponentItem | null)[]>(
    Array(STATIC_SECTIONS.length).fill(null)
  );
  const [loaded, setLoaded] = useState<boolean[]>(
    Array(STATIC_SECTIONS.length).fill(false)
  );
  const [fading, setFading] = useState<boolean[]>(
    Array(STATIC_SECTIONS.length).fill(false)
  );

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
          const res = await fetch(
            `https://raw.githubusercontent.com/alex-willow/framerkit-data/main/${sec}.json`
          );

          if (res.ok) {
            const json = await res.json();
            const allItems: ComponentItem[] = json[sec] || [];
            data[sec] = allItems.filter(
              (item) => !item.key.toLowerCase().includes("dark")
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

      // Показываем скелетоны сначала
      setCards(Array(STATIC_SECTIONS.length).fill(null));
      setLoaded(Array(STATIC_SECTIONS.length).fill(false));

      // Через короткий таймаут показываем реальные карточки
      setTimeout(() => {
        setCards(initial);
        setLoaded(initial.map(i => i !== null));
        lastChangeRef.current = initial.map(() => now);
        startRotation();
      }, 800);
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
      timeoutRef.current = setTimeout(rotateOne, 1000);
      return;
    }

    const index = eligible[Math.floor(Math.random() * eligible.length)];
    const sec = STATIC_SECTIONS[index];
    const list = itemsBySection.current[sec] || [];

    if (!list.length) {
      timeoutRef.current = setTimeout(rotateOne, 1000);
      return;
    }

    const newCard = list[Math.floor(Math.random() * list.length)];
    rotatingRef.current = true;

    setFading(prev => {
      const arr = [...prev];
      arr[index] = true;
      return arr;
    });

    const preload = new Image();
    preload.src = newCard.image;

    const swap = () => {
      setTimeout(() => {
        setCards(prev => {
          const arr = [...prev];
          arr[index] = newCard;
          lastChangeRef.current[index] = Date.now();
          return arr;
        });

        setFading(prev => {
          const arr = [...prev];
          arr[index] = false;
          return arr;
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
      {STATIC_SECTIONS.map((section, index) => {
        const item = cards[index];
        const count = itemsBySection.current[section]?.length || 0;

        return (
          <Link
            key={section}
            to={item ? `/layout/${section}` : "#"}
            className="card"
            onMouseEnter={() => (hoveredRef.current[index] = true)}
            onMouseLeave={() => (hoveredRef.current[index] = false)}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {/* Скелетон */}
            {!loaded[index] && (
              <div className="skeleton-card">
                <div className="skeleton-card-image" />
                <div className="skeleton-card-info" />
              </div>
            )}

            {/* Карточка с названием и фоном, если изображение нет */}
            {loaded[index] && !item && (
              <div
                className="card-name-only"
                style={{
                  background: "var(--framer-color-bg)",
                  height: "100%",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "12px"
                }}
              >
                <div className="cardInfo">
                  <h3>
                    {section.charAt(0).toUpperCase() + section.slice(1)} · 0
                  </h3>
                  <div className="iconButton2">
                    <ArrowUpRight size={16} className="explore-icon" />
                  </div>
                </div>
              </div>
            )}

            {/* Карточка с изображением */}
            {loaded[index] && item && (
              <>
                <div className={`cardImage ${fading[index] ? "fadeOut" : "fadeIn"}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={e =>
                      (e.currentTarget.src =
                        "https://via.placeholder.com/280x160?text=Preview")
                    }
                  />
                </div>
                <div className="cardInfo">
                  <h3>
                    {section.charAt(0).toUpperCase() + section.slice(1)} · {count}
                  </h3>
                  <div className="iconButton2">
                    <ArrowUpRight size={16} className="explore-icon" />
                  </div>
                </div>
              </>
            )}
          </Link>
        );
      })}
    </>
  );
}
