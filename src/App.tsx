import { useState, useEffect } from "react";
import styles from "./App.module.css";

type ComponentItem = {
  key: string;
  title: string;
  image: string;
  url: string;
  type: "free" | "paid";
  section: string;
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
  "footer",
];

const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";

export default function FramerKitGallery() {
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>("navbar");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Проверка ширины экрана
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 767);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Загрузка компонентов
  useEffect(() => {
    let cancelled = false;

    const loadComponents = async () => {
      try {
        const requests = STATIC_SECTIONS.map((sec) =>
          fetch(
            `https://raw.githubusercontent.com/alex-willow/framerkit-data/main/${sec}.json`
          )
            .then((res) => (res.ok ? res.json() : null))
            .then((json) => {
              if (!json) return [];
              return (json[sec] || []).map((item: any) => ({
                ...item,
                section: sec,
              }));
            })
            .catch(() => [])
        );

        const result = await Promise.all(requests);
        if (!cancelled) setComponents(result.flat());
      } catch {
        if (!cancelled) setError("Не удалось загрузить компоненты");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadComponents();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, });
  }, [activeSection]);

  // Список секций для отображения
  const displaySections =
    components.length > 0
      ? Array.from(new Set(components.map((c) => c.section)))
      : STATIC_SECTIONS;

  const sectionCounts = displaySections.reduce((acc, sec) => {
    acc[sec] = components.filter((c) => c.section === sec).length;
    return acc;
  }, {} as Record<string, number>);

  // Фильтр по активной секции и теме
  const filtered = components.filter(
    (item) =>
      item.section === activeSection &&
      (theme === "dark" ? item.key.includes("dark") : !item.key.includes("dark"))
  );

  // Контент галереи
  let galleryContent;
  if (loading) {
    galleryContent = Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className={styles.skeleton} aria-hidden />
    ));
  } else if (filtered.length === 0) {
    galleryContent = (
      <div
        style={{ gridColumn: "1 / -1", color: "var(--framer-color-text-secondary)" }}
      >
        Пусто — в этой секции нет компонентов для выбранной темы.
      </div>
    );
  } else {
    galleryContent = filtered.map((item) => (
      <article
        key={item.key}
        className={styles.card}
        role="listitem"
        aria-labelledby={`title-${item.key}`}
      >
        <div className={styles.cardImage}>
          <img src={item.image || PLACEHOLDER} alt={item.title} loading="lazy" />
        </div>
        <div className={styles.cardInfo}>
          <h3 id={`title-${item.key}`}>{item.title}</h3>
        </div>
      </article>
    ));
  }

  return (
    <div className={styles.container} data-theme={theme}>
      {/* HEADER */}
<header className={styles.header}>
  <div className={styles.headerLeft}>
    <img src="/Logo.png" alt="FramerKit" className={styles.logo} />
    <h1>FramerKit</h1>
  </div>
  <div className={styles.headerActions}>
    <button
      className={styles.authButton}
      onClick={() => {
        // Сюда можно добавить логику: открыть модалку, перейти на страницу оплаты и т.д.
        window.open("https://framer.com/marketplace", "_blank");
      }}
      aria-label="Get Full Access"
    >
      Get Full Access
    </button>
  </div>
</header>

      {/* MAIN */}
      <main className={styles.main}>
        {/* SIDEBAR */}
        {!isMobile && (
          <nav className={styles.sidebar} aria-label="Секции">
            {displaySections.map((sec) => (
              <button
                key={sec}
                onClick={() => setActiveSection(sec)}
                className={activeSection === sec ? styles.active : ""}
                aria-current={activeSection === sec ? "true" : undefined}
              >
                {sec.charAt(0).toUpperCase() + sec.slice(1)} · {sectionCounts[sec] ?? 0}
              </button>
            ))}
          </nav>
        )}

        {/* CONTENT */}
        <section className={styles.content} aria-labelledby="gallery-title">
          {/* Mobile select */}
          {isMobile && (
            <select
              className={styles.mobileSelect}
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              aria-label="Выбор секции"
            >
              {displaySections.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)} ({sectionCounts[s] ?? 0})
                </option>
              ))}
            </select>
          )}

          <h2 id="gallery-title" className={styles.title}>
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} · Components
          </h2>

          <p className={styles.subtitle}>
            {loading ? "Загрузка..." : `${filtered.length} компонентов`} в теме «
            {theme === "light" ? "Светлая" : "Темная"}»
          </p>

          {error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <div className={styles.gallery} role="list">
              {galleryContent}
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        © {new Date().getFullYear()} FramerKit · Собрано с ❤️ для дизайнеров
      </footer>
    </div>
  );
}
