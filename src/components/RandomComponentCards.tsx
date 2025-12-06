// src/components/RandomComponentCards.tsx
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

const COMPONENT_SECTIONS = [
  "accordion", "avatar", "badge", "button", "card",
  "icon", "input", "form", "pricingcard", "rating", "testimonialcard"
];

export default function RandomComponentCards() {
  const [cards, setCards] = useState<(ComponentItem | null)[]>(Array(6).fill(null));
  const [fading, setFading] = useState<boolean[]>(Array(6).fill(false));

  const cardsRef = useRef<(ComponentItem | null)[]>(Array(6).fill(null));
  const hoveredIndexesRef = useRef<boolean[]>(Array(6).fill(false));
  const lastChangeTimeRef = useRef<number[]>(Array(6).fill(0));
  const allItemsRef = useRef<ComponentItem[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRotatingRef = useRef(false);

  useEffect(() => {
    const loadComponents = async () => {
      const all: ComponentItem[] = [];

      for (const sec of COMPONENT_SECTIONS) {
        try {
          const res = await fetch(
            `https://raw.githubusercontent.com/alex-willow/framerkit-data/components/${sec}.json`
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
        lastChangeTimeRef.current = initial.map(() => now);
        startRotation();
      }
    };

    loadComponents();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const rotateOneCard = () => {
    if (isRotatingRef.current) return;

    const now = Date.now();
    const minInterval = 5000;

    const eligible = [];

    for (let i = 0; i < 6; i++) {
      if (!hoveredIndexesRef.current[i] && now - lastChangeTimeRef.current[i] >= minInterval) {
        eligible.push(i);
      }
    }

    if (!eligible.length) {
      timeoutRef.current = setTimeout(rotateOneCard, 1000);
      return;
    }

    const index = eligible[Math.floor(Math.random() * eligible.length)];
    const newCard = allItemsRef.current[Math.floor(Math.random() * allItemsRef.current.length)];

    isRotatingRef.current = true;

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
          cardsRef.current[index] = newCard;
          lastChangeTimeRef.current[index] = Date.now();
          return arr;
        });

        setFading(prev => {
          const arr = [...prev];
          arr[index] = false;
          return arr;
        });

        isRotatingRef.current = false;
        timeoutRef.current = setTimeout(rotateOneCard, 1500);
      }, 500);
    };

    preload.onload = swap;
    preload.onerror = swap;
  };

  const startRotation = () => {
    timeoutRef.current = setTimeout(rotateOneCard, 6000);
  };

  return (
    <>
      {cards.map((item, index) => (
        <Link
          key={`random-card-${index}`}
          to={item ? `/components/${item.key.split("-")[0]}` : "#"}
          className={`card ${fading[index] ? "fadeOut" : "fadeIn"}`}
          onMouseEnter={() => (hoveredIndexesRef.current[index] = true)}
          onMouseLeave={() => (hoveredIndexesRef.current[index] = false)}
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
                      "https://via.placeholder.com/280x160?text=Component")
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
