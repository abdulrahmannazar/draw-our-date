import React, { useMemo } from 'react';

export default function HeartBackground() {
  const hearts = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: `${(i * 7.5 + Math.random() * 4)}%`,
      size: 14 + (i % 4) * 8,
      duration: 14 + (i % 5) * 4,
      delay: (i * 1.8) % 12,
      color: i % 2 === 0 ? '#ff80a0' : '#70b6ff'
    }));
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {hearts.map((h) => (
        <svg
          key={h.id}
          className="floating-heart"
          style={{
            left: h.left,
            width: h.size,
            height: h.size,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            fill: h.color
          }}
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ))}
    </div>
  );
}