import { Link } from 'react-router-dom';

export default function LearnPage() {
  return (
    <div style={{ width: '100%', paddingRight: '220px', boxSizing: 'border-box' }}>
      <div className="learn-page" style={{ padding: '36px 20px', maxWidth: '700px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <header className="learn-header" style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '40px', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '10px', color: '#14161b' }}>
          Learn
        </h1>
        <p style={{ fontSize: '18px', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
          Tutorials and practical guides for building faster with FramerKit.
        </p>
      </header>

      <div className="learn-placeholder" style={{ 
        minHeight: '240px',
        padding: '32px',
        border: '1px solid var(--framer-color-border)',
        borderRadius: '12px',
        textAlign: 'left',
        background: '#fff',
        boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1.25, marginBottom: '12px', color: '#14161b' }}>
          Coming soon
        </h2>
        <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '20px', lineHeight: 1.6 }}>
          We are preparing step-by-step lessons for FramerKit workflows.
        </p>
        <Link to="/blog" className="btn btn-primary" style={{ 
          display: 'inline-block',
          padding: '10px 18px',
          background: '#3B2489',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '14px'
        }}>
          Read the blog
        </Link>
      </div>
      </div>
    </div>
  );
}