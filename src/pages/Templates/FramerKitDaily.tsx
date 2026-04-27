import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Eye, Paperclip, Lock } from "lucide-react";
import SectionHeader from "../../components/SectionHeader";
import SEO from "../../components/SEO";
import { fetchJsonWithCache, readJsonCache } from "../../lib/remoteCache";

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
const DATA_URL =
  "https://raw.githubusercontent.com/alex-willow/framerkit-data/refs/heads/main/framerkitdaily";
const CACHE_KEY = `remote:${DATA_URL}`;
const DATA_KEY = "framerkitdaily" as const;

export default function FramerKitDailyPage({
  galleryScrollRef,
  isAuthenticated = false,
  setIsSignInOpen,
}: FramerKitDailyPageProps) {
  const initialItems = readJsonCache<Record<string, TemplateItem[]>>(CACHE_KEY)?.[DATA_KEY] || [];
  const [items, setItems] = useState<TemplateItem[]>(initialItems);
  const [loading, setLoading] = useState(initialItems.length === 0);
  const location = useLocation();

  // Скролл наверх при смене страницы
  useEffect(() => {
    if (galleryScrollRef?.current) {
      galleryScrollRef.current.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [location.pathname, galleryScrollRef]);

  useEffect(() => {
    const load = async () => {
      try {
        const json = await fetchJsonWithCache<Record<string, TemplateItem[]>>(
          CACHE_KEY,
          DATA_URL
        );
        const framerkitdaily: TemplateItem[] = json.framerkitdaily || [];
        setItems(framerkitdaily);
 
      } catch (e) {
        console.error("Failed to load framerkitdaily:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div id="framerkitdaily-page" >
      <SEO
        title="FramerKit Daily"
        description="FramerKit Daily template collection with ready-to-use screens and reusable building blocks."
        keywords="framer template, framerkit daily, starter template, website template"
        canonical="https://www.framerkit.site/templates/framerkitdaily"
      />

      <div className="component-page-header">
        <nav className="component-breadcrumb">
          <Link to="/templates" className="breadcrumb-link">Templates</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">FramerKit Daily</span>
        </nav>
        <h2 className="component-page-title">FramerKit Daily Template</h2>
        <p className="component-page-description">
          A ready template feed you can use as a starting point for daily content publishing and quick launch pages.
        </p>
      </div>

      <SectionHeader
        title="FramerKit Daily Templates"
        loading={loading}
        hideThemeSwitcher={true}
        hideTitle={true}
        renderMetaBelow={true}
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
  const hasPreview = Boolean(item.preview);
  const visible = true;

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

        <div className="daily-actions card-actions">
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
