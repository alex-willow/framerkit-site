import { Link } from 'react-router-dom';

export default function TemplatesPage() {
  return (
    <div className="templates-overview" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>
          📦 Templates
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--framer-color-text-secondary)' }}>
          Полные шаблоны сайтов на основе FramerKit
        </p>
      </header>

      <div className="templates-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '24px' 
      }}>
        {/* Пример шаблона */}
        <Link 
          to="/templates/framerkitdaily"
          className="template-card"
          style={{
            padding: '24px',
            border: '1px solid var(--framer-color-border)',
            borderRadius: '12px',
            textDecoration: 'none',
            color: 'inherit',
            display: 'block'
          }}
        >
          <div style={{ 
            width: '100%', 
            height: '160px', 
            background: 'linear-gradient(135deg, #6E3FF3 0%, #9B7FEB 100%)',
            borderRadius: '8px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 600
          }}>
            Framer Kit Daily
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
            Framer Kit Daily
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--framer-color-text-secondary)' }}>
            Шаблон для ежедневного контент-плана и блога
          </p>
        </Link>

        {/* Заглушка для будущих шаблонов */}
        <div className="template-card placeholder" style={{
          padding: '24px',
          border: '2px dashed var(--framer-color-border)',
          borderRadius: '12px',
          textAlign: 'center',
          color: 'var(--framer-color-text-secondary)'
        }}>
          <p>🚧 Скоро новые шаблоны</p>
        </div>
      </div>
    </div>
  );
}