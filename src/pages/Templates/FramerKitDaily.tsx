import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Eye, Paperclip, Lock } from "lucide-react";
import SectionHeader from "../../components/SectionHeader";

interface TemplateItem {
  key: string;
  image: string;
  url: string;
  preview: string;
  type?: "free" | "paid"; // добавляем тип
}

interface FramerKitDailyPageProps {
  galleryScrollRef?: React.RefObject<HTMLDivElement>;
  isAuthenticated?: boolean;
  setIsSignInOpen?: (open: boolean) => void;
}

const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";

export default function FramerKitDailyPage({
  galleryScrollRef,
  isAuthenticated = false,
  setIsSignInOpen,
}: FramerKitDailyPageProps) {
  const [items, setItems] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Скролл наверх при смене страницы
  useEffect(() => {
    if (galleryScrollRef?.current) {
      galleryScrollRef.current.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [location.pathname, galleryScrollRef]);

  // Загрузка JSON и добавление типов
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/alex-willow/framerkit-data/refs/heads/main/framerkitdaily"
        );
        if (!res.ok) throw new Error("Failed to load");
        const json = await res.json();
        const framerkitdaily: TemplateItem[] = json.framerkitdaily.map(
          (item: TemplateItem, index: number) => ({
            ...item,
            type: index === 0 ? "free" : "paid", // первый бесплатный, остальные платные
          })
        );
        setItems(framerkitdaily);
      } catch (e) {
 
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div id="framerkitdaily-page" >
      <SectionHeader
        title="FramerKit Daily Templates"
        count={items.length}
        loading={loading}
        hideThemeSwitcher={true}
        templateLabel="templates"
      />

      {loading ? (
        <div className="template-skeleton-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div className="template-skeleton-card" key={i}>
              <div className="template-skeleton-card-image" />
              <div className="template-skeleton-card-info" />
            </div>
          ))}
        </div>
    
       
      ) : (
        <div className="daily-grid">
          {items.map((item, index) => (
            <DailyCard
              key={item.key}
              item={item}
              dayNumber={index + 1}
              isAuthenticated={isAuthenticated}
              setIsSignInOpen={setIsSignInOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface DailyCardProps {
  item: TemplateItem;
  dayNumber: number;
  isAuthenticated?: boolean;
  setIsSignInOpen?: (open: boolean) => void;
}

function DailyCard({
  item,
  dayNumber,
  isAuthenticated = false,
  setIsSignInOpen,
}: DailyCardProps) {
  const [visible, setVisible] = useState(false);
  const hasPreview = Boolean(item.preview);

  // показываем карточку после монтирования
  useEffect(() => {
    setVisible(true);
  }, []);

  const canAccess = isAuthenticated || item.type === "free";

  const handleClick = () => {
    if (!canAccess && setIsSignInOpen) {
      setIsSignInOpen(true);
    }
    if (canAccess) {
      window.open(`https://${item.url}`, "_blank");
    }
  };

  return (
    <div className={`daily-card ${visible ? "visible" : ""}`}>
      <div className="daily-img-wrapper">
        <img
          src={item.image || PLACEHOLDER}
          alt=""
          draggable={false}
          className="daily-img"
        />
      </div>

      <div className="daily-title-row">
        <span className="daily-day">{`Day ${dayNumber}`}</span>

        <div className="daily-actions">
          {/* Preview */}
          <div className={`iconButton ${!hasPreview ? "disabled" : ""}`}>
            <a
              href={item.preview}
              target="_blank"
              rel="noopener noreferrer"
              style={{ pointerEvents: hasPreview ? "auto" : "none" }}
            >
              <Eye size={18} />
            </a>
            <div className="tooltip">
              {hasPreview ? "Preview" : "Preview not available"}
            </div>
          </div>

          {/* Remix / Lock */}
          <div
            className={`iconButton ${!canAccess ? "locked" : ""}`}
            onClick={handleClick}
          >
            {canAccess ? <Paperclip size={18} /> : <Lock size={18} />}
            <div className="tooltip">{canAccess ? "Remix" : "Sign in to view"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
