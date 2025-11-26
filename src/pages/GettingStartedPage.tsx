// src/pages/GettingStartedPage.tsx
import { useState } from "react";

export default function GettingStartedPage() {
  const [activeSubpage, setActiveSubpage] = useState("overview");

  const subpages = {
    overview: {
      title: "Overview",
      content: (
        <>
          <h3>Добро пожаловать в FramerKit</h3>
          <p>Это плагин для Framer, который позволяет быстро вставлять готовые секции и компоненты в твой проект.</p>
          <p>Выберите нужный раздел слева.</p>
        </>
      ),
    },
    installation: {
      title: "Installation",
      content: (
        <>
          <h3>Как установить FramerKit</h3>
          <ol>
            <li>Откройте Framer</li>
            <li>Перейдите в раздел «Plugins»</li>
            <li>Найдите «FramerKit» и нажмите «Install»</li>
            <li>Готово!</li>
          </ol>
        </>
      ),
    },
    "how-it-works": {
      title: "How It Works",
      content: (
        <>
          <h3>Как использовать FramerKit</h3>
          <p>1. Выберите нужный компонент или секцию.</p>
          <p>2. Нажмите на него — он появится в вашем проекте.</p>
          <p>3. Меняйте тему (Light/Dark) в реальном времени.</p>
          <p>4. Используйте в работе!</p>
        </>
      ),
    },
    "demo-mode": {
      title: "Demo Mode",
      content: (
        <>
          <h3>Демо-режим</h3>
          <p>В демо-режиме вы можете использовать все компоненты, кроме PRO-секций.</p>
          <p>Чтобы получить доступ ко всему функционалу, купите лицензию.</p>
          <button
            className="authButton"
            onClick={() => window.open("https://gum.co/framerkit", "_blank")}
            style={{ marginTop: 16 }}
          >
            Get Full Access
          </button>
        </>
      ),
    },
    faq: {
      title: "FAQ",
      content: (
        <>
          <h3>Частые вопросы</h3>
          <p><strong>Q: Можно ли использовать FramerKit в коммерческих проектах?</strong><br />A: Да, после покупки лицензии.</p>
          <p><strong>Q: Как обновляется плагин?</strong><br />A: Обновления происходят автоматически через Framer.</p>
          <p><strong>Q: Поддерживаете ли вы темы?</strong><br />A: Да, Light и Dark.</p>
        </>
      ),
    },
  };

  return (
    <div style={{ padding: 20 }}>
      <div className="section-header-sticky">
        <h2 className="title">Getting Started</h2>
        <div className="subtitleRow">
          <p className="subtitle">Руководство по началу работы</p>
        </div>
        <div className="title-divider" />
      </div>

      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div style={{ minWidth: 200 }}>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {Object.entries(subpages).map(([key, page]) => (
              <li key={key}>
                <button
                  className={`sidebar-item ${activeSubpage === key ? "active" : ""}`}
                  onClick={() => setActiveSubpage(key)}
                >
                  {page.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1 }}>
          <h2>{subpages[activeSubpage].title}</h2>
          <div>{subpages[activeSubpage].content}</div>
        </div>
      </div>
    </div>
  );
}