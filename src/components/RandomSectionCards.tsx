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
  "navbar", "hero", "logo", "feature", "testimonial",
  "faq", "contact", "pricing", "cta", "footer"
];

export default function RandomSectionCards() {
  const [cards, setCards] = useState<(ComponentItem | null)[]>(Array(6).fill(null));
  const [fading, setFading] = useState<boolean[]>(Array(6).fill(false));

  const cardsRef = useRef<(ComponentItem | null)[]>(Array(6).fill(null));
  const hoveredRef = useRef<boolean[]>(Array(6).fill(false));
  const lastChangeRef = useRef<number[]>(Array(6).fill(0));
  const allItemsRef = useRef<ComponentItem[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rotatingRef = useRef(false);

  // === Load data ===
  useEffect(() => {
    const load = async () => {
      const all: ComponentItem[] = [];

      for (const sec of STATIC_SECTIONS) {
        try {
          const res = await fetch(
            `https://raw.githubusercontent.com/alex-willow/framerkit-data/main/${sec}.json`
          );
          if (res.ok) {
            const json = await res.json();
            all.push(...(json[sec] || []));
          }
        } catch (_) {}
      }

      allItemsRef.current = all;

      if (all.length > 0) {
        const now = Date.now();
        const initial = Array.from({ length: 6 }, () =>
          all[Math.floor(Math.random() * all.length)]
        );

        setCards(initial);
        cardsRef.current = initial;
        lastChangeRef.current = initial.map(() => now);

        startRotation();
      }
    };

    load();
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  const rotateOne = () => {
    if (rotatingRef.current) return;

    const now = Date.now();
    const minInterval = 5000;

    const eligible: number[] = [];

    for (let i = 0; i < 6; i++) {
      if (!hoveredRef.current[i] && now - lastChangeRef.current[i] >= minInterval) {
        eligible.push(i);
      }
    }

    if (!eligible.length) {
      timeoutRef.current = setTimeout(rotateOne, 1000);
      return;
    }

    const index = eligible[Math.floor(Math.random() * eligible.length)];
    const newCard = allItemsRef.current[Math.floor(Math.random() * allItemsRef.current.length)];

    rotatingRef.current = true;

    setFading(prev => {
      const copy = [...prev];
      copy[index] = true;
      return copy;
    });

    const preload = new Image();
    preload.src = newCard.image;

    const swap = () => {
      setTimeout(() => {
        setCards(prev => {
          const copy = [...prev];
          copy[index] = newCard;
          cardsRef.current[index] = newCard;
          lastChangeRef.current[index] = Date.now();
          return copy;
        });

        setFading(prev => {
          const copy = [...prev];
          copy[index] = false;
          return copy;
        });

        rotatingRef.current = false;
        timeoutRef.current = setTimeout(rotateOne, 1500);
      }, 500);
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
          key={`section-card-${index}`}
          to={item ? `/layout/${item.key.split("-")[0]}` : "#"}
          className={`card ${fading[index] ? "fadeOut" : "fadeIn"}`}
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
            <div className="skeleton-card">
              <div className="skeleton-img" />
            </div>
          )}
        </Link>
      ))}
    </>
  );
}
