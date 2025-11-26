// src/pages/ComponentsPage.tsx
import { useState, useEffect } from "react";
import { Copy } from "lucide-react";

const COMPONENT_SECTIONS = [
  "button", "card", "form", "input", "pricingcard", "rating", "testimonialcard", // ✅ без дефиса
  "accordion", "avatar", "badge", "icon" // ← удали, если дублируется
];

type ComponentItem = {
  key: string;
  title: string;
  image: string;
  url: string;
  type: "free" | "paid";
};

export default function ComponentsPage() {
  const [sections, setSections] = useState<Record<string, ComponentItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const all: Record<string, ComponentItem[]> = {};

      for (const sec of COMPONENT_SECTIONS) {
        try {
          const res = await fetch(
            `https://raw.githubusercontent.com/alex-willow/framerkit-data/components/${sec}.json` // ✅ без дефиса
          );
          if (!res.ok) continue;
          const json = await res.json();
          const sectionKey = Object.keys(json)[0]; // ← "pricingCard", "avatarGroup", и т.д.
          all[sec] = json[sectionKey] || [];
        } catch (e) {
          console.warn(`Failed to load components/${sec}`, e);
        }
      }

      setSections(all);
      setLoading(false);
    };

    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <div className="section-header-sticky">
        <h2 className="title">Components</h2>
        <div className="subtitleRow">
          <p className="subtitle">Готовые компоненты</p>
        </div>
        <div className="title-divider" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginTop: 20 }}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton" />)
        ) : (
          COMPONENT_SECTIONS.flatMap(sec => sections[sec] || []).map(item => (
            <div key={item.key} className="card">
              <div className="cardImage">
                <img src={item.image || "https://via.placeholder.com/280x160?text=No+Image"} alt={item.title} />
              </div>
              <div className="cardInfo">
                <h3>{item.title}</h3>
                <div className="iconButton" onClick={() => navigator.clipboard.writeText(item.url)}>
                  <Copy size={16} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}