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
  "accordion",
  "accordiongroup",
  "avatar",
  "avatargroup",
  "badge",
  "button",
  "card",
  "icon",
  "input",
  "form",
  "pricingcard",
  "rating",
  "testimonialcard"
];

export default function RandomComponentCards() {
  const [cards, setCards] = useState<(ComponentItem | null)[]>(Array(COMPONENT_SECTIONS.length).fill(null));
  const [fading, setFading] = useState<boolean[]>(Array(COMPONENT_SECTIONS.length).fill(false));

  const hoveredRef = useRef<boolean[]>(Array(COMPONENT_SECTIONS.length).fill(false));
  const lastChangeRef = useRef<number[]>(Array(COMPONENT_SECTIONS.length).fill(0));
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rotatingRef = useRef(false);

  // Храним данные по категориям
  const itemsBySection = useRef<Record<string, ComponentItem[]>>({});

  useEffect(() => {
    const load = async () => {
      const data: Record<string, ComponentItem[]> = {};

      for (const sec of COMPONENT_SECTIONS) {
        try {
          const res = await fetch(
            `https://raw.githubusercontent.com/alex-willow/framerkit-data/components/${sec}.json`
          );
          if (!res.ok) {
            data[sec] = [];
            continue;
          }

          const json = await res.json();

          // Находим ключ в объекте JSON независимо от регистра
          const jsonKey = Object.keys(json).find(k => k.toLowerCase() === sec.toLowerCase());
          const allItems: ComponentItem[] = jsonKey ? json[jsonKey] : [];

          // ⭐ фильтр: только светлые (без dark)
          data[sec] = allItems.filter(item => !item.key.toLowerCase().includes("dark"));
        } catch {
          data[sec] = [];
        }
      }

      itemsBySection.current = data;

      const now = Date.now();
      const initial = COMPONENT_SECTIONS.map(sec => {
        const arr = data[sec];
        if (!arr || arr.length === 0) return null;
        return arr[Math.floor(Math.random() * arr.length)];
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

    for (let i = 0; i < COMPONENT_SECTIONS.length; i++) {
      if (!hoveredRef.current[i] && now - lastChangeRef.current[i] >= minInterval) {
        eligible.push(i);
      }
    }

    if (!eligible.length) {
      timeoutRef.current = setTimeout(rotateOne, 1000);
      return;
    }

    const index = eligible[Math.floor(Math.random() * eligible.length)];
    const sec = COMPONENT_SECTIONS[index];
    const list = itemsBySection.current[sec] || [];

    if (list.length === 0) {
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
          key={COMPONENT_SECTIONS[index]}
          to={item ? `/components/${COMPONENT_SECTIONS[index]}` : "#"}
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
