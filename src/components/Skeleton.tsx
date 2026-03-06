import React from 'react';

export function ProductSkeleton() {
  return (
    <div className="card" style={{ height: 380, background: 'var(--color-surface)' }}>
      <div style={{ 
        height: 200, 
        background: 'linear-gradient(90deg, var(--color-surface2) 25%, var(--color-border) 50%, var(--color-surface2) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite linear'
      }}></div>
      <div style={{ padding: 20 }}>
        <div style={{ 
          height: 20, 
          width: '70%', 
          background: 'var(--color-surface2)', 
          marginBottom: 12,
          borderRadius: 4,
          animation: 'shimmer 1.5s infinite linear'
        }}></div>
        <div style={{ 
          height: 14, 
          width: '40%', 
          background: 'var(--color-surface2)', 
          marginBottom: 24,
          borderRadius: 4
        }}></div>
        <div style={{ height: 40, width: '100%', background: 'var(--color-surface2)', borderRadius: 8 }}></div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', 
      gap: 24 
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
