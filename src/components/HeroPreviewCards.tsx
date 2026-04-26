import { useState, useEffect } from "react";
import { Copy, CircleCheck, Eye } from "lucide-react";
import { motion } from "framer-motion";

type HeroPreviewCardsProps = {
  theme?: "light" | "dark";
};

type ComponentItem = {
  key: string;
  title: string;
  image: string;
  url: string;
  type: "free" | "paid";
  previewUrl?: string;
  wireframe?: {
    image: string;
    url: string;
    previewUrl?: string;
  };
};

// ==========================================
// ЗДЕСЬ УКАЗЫВАЙТЕ КАКИЕ КОМПОНЕНТЫ ПОКАЗЫВАТЬ
// Формат: { section: "hero", index: 14 } = hero[14] (15-й элемент)
// ==========================================
const HERO_CARD_CONFIGS = [
  // Левая колонка
  { section: "hero", index: 14, collectionUrl: "/layout/hero" },      // Hero 15
  { section: "feature", index: 7, collectionUrl: "/layout/feature" }, // Feature 8
  { section: "pricing", index: 13, collectionUrl: "/layout/pricing" }, // Pricing 14
  // Правая колонка
  { section: "cta", index: 4, collectionUrl: "/layout/cta" },        // CTA 5
  { section: "gallery", index: 3, collectionUrl: "/layout/gallery" }, // Gallery 4
  { section: "faq", index: 3, collectionUrl: "/layout/faq" },        // FAQ 4
];

// URL для данных
const DATA_URL = "https://raw.githubusercontent.com/alex-willow/framerkit-data/main";

function HeroCard({ 
  item, 
  theme, 
  index
}: { 
  item: ComponentItem | null; 
  theme: "light" | "dark"; 
  index: number;
}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [hoveredPreviewKey, setHoveredPreviewKey] = useState<string | null>(null);

  const isLeft = index < 3;
  const delay = 0.8 + (index % 3) * 0.15;

  if (!item) {
    return (
      <div className="card skeleton-card">
        <div className="skeleton-card-image" />
        <div className="skeleton-card-info" />
      </div>
    );
  }

  // Всегда показываем дизайн (не wireframe) — тема определяется фильтрацией JSON
  const displayImage = item.image;
  const displayUrl = item.url;
  const displayPreviewUrl = item.previewUrl;

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(displayUrl);
    setCopiedKey(item.key);
    setTimeout(() => setCopiedKey(null), 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`card ${theme === "dark" ? "card-dark" : "card-light"}`}
    >
      <div style={{ textDecoration: "none", color: "inherit", display: "block" }}>
        <div className="cardImage">
          <img
            src={displayImage}
            alt={`${item.title} - ${theme === "dark" ? "Dark" : "Light"} theme`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/280x160?text=Preview";
            }}
          />
        </div>
        <div className="cardInfo">
          <h3>{item.title}</h3>
          <div className="card-actions">
            {displayPreviewUrl ? (
              <div
                className="iconButton"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  try {
                    const path = displayPreviewUrl.trim();
                    let cleanPath = "";

                    if (path.startsWith("/")) {
                      cleanPath = path.replace("/preview/", "").replace(/\/$/, "");
                    } else if (path.startsWith("http")) {
                      const url = new URL(path);
                      cleanPath = url.pathname.replace("/preview/", "").replace(/\/$/, "");
                    }

                    const viewerUrl = `/p/${cleanPath}`;
                    window.open(viewerUrl, "_blank", "noopener,noreferrer");
                  } catch {
                    window.open(displayPreviewUrl, "_blank", "noopener,noreferrer");
                  }
                }}
                onMouseEnter={() => setHoveredPreviewKey(item.key)}
                onMouseLeave={() => setHoveredPreviewKey(null)}
              >
                <Eye size={16} />
                {hoveredPreviewKey === item.key && <div className="tooltip">Preview</div>}
              </div>
            ) : null}
            <div
              className={`iconButton ${copiedKey === item.key ? "copied" : ""}`}
              onClick={handleCopy}
              onMouseEnter={() => setHoveredKey(item.key)}
              onMouseLeave={() => setHoveredKey(null)}
            >
              {copiedKey === item.key ? (
                <CircleCheck size={20} color="#22c55e" strokeWidth={2.5} />
              ) : (
                <Copy size={16} />
              )}
              {(copiedKey === item.key || hoveredKey === item.key) && (
                <div className="tooltip">{copiedKey === item.key ? "Copied" : "Copy"}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroPreviewCards({ theme = "light" }: HeroPreviewCardsProps) {
  const [cards, setCards] = useState<(ComponentItem | null)[]>(Array(6).fill(null));

  useEffect(() => {
    const loadCards = async () => {
      const loadedCards: (ComponentItem | null)[] = [];

      for (const config of HERO_CARD_CONFIGS) {
        try {
          // Загружаем JSON секции
          const res = await fetch(`${DATA_URL}/${config.section}.json`, {
            cache: "force-cache"
          });
          
          if (!res.ok) {
            loadedCards.push(null);
            continue;
          }

          const json = await res.json();
          const sectionData = json[config.section] || json[Object.keys(json)[0]] || [];
          
          // Фильтруем по теме как в Gallery
          const isDarkVariant = (item: ComponentItem): boolean => {
            const haystack = [
              item.key, item.title, item.image, item.url,
              item.previewUrl, item.wireframe?.image, item.wireframe?.url
            ].filter(Boolean).join(" ").toLowerCase();
            return haystack.includes("dark");
          };

          const darkItems = sectionData.filter(isDarkVariant);
          const lightItems = sectionData.filter((item: ComponentItem) => !isDarkVariant(item));
          
          const itemsForTheme = theme === "dark" 
            ? (darkItems.length ? darkItems : sectionData)
            : (lightItems.length ? lightItems : sectionData);

          // Берем компонент по индексу
          const item = itemsForTheme[config.index] || null;
          loadedCards.push(item);
        } catch {
          loadedCards.push(null);
        }
      }

      setCards(loadedCards);
    };

    loadCards();
  }, [theme]);

  const leftCards = cards.slice(0, 3);
  const rightCards = cards.slice(3, 6);
  const leftConfigs = HERO_CARD_CONFIGS.slice(0, 3);
  const rightConfigs = HERO_CARD_CONFIGS.slice(3, 6);

  return (
    <>
      <div className="hero-cards-left">
        {leftCards.map((item, index) => (
          <HeroCard 
            key={leftConfigs[index].section + leftConfigs[index].index} 
            item={item} 
            theme={theme} 
            index={index}
          />
        ))}
      </div>
      <div className="hero-cards-right">
        {rightCards.map((item, index) => (
          <HeroCard 
            key={rightConfigs[index].section + rightConfigs[index].index} 
            item={item} 
            theme={theme} 
            index={index + 3}
          />
        ))}
      </div>
    </>
  );
}
