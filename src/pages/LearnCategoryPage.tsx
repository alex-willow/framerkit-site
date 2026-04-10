import { useParams } from 'react-router-dom';

export default function LearnCategoryPage() {
  const { category } = useParams();

  return (
    <div style={{ width: '100%', paddingRight: '220px', boxSizing: 'border-box' }}>
      <div className="category-page" style={{ padding: '36px 20px', maxWidth: '700px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '20px', color: '#14161b', textTransform: 'capitalize' }}>
        {category?.replace('-', ' ')}
      </h1>
      
      <div style={{ 
        minHeight: '200px',
        padding: '28px',
        border: '1px solid var(--framer-color-border)',
        borderRadius: '12px',
        textAlign: 'left',
        background: '#fff',
        boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <p style={{ fontSize: '16px', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
          Coming soon
        </p>
      </div>
      </div>
    </div>
  );
}