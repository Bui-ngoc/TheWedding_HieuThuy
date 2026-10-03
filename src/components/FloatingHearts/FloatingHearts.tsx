import React, { useState, useEffect } from 'react';
import './FloatingHearts.css';

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
}

const HEART_COLORS = ['#8C290D', '#D4AF37', '#E8B4B8', '#C44536', '#E56B6F'];

export const FloatingHearts: React.FC = () => {
  const [hearts, setHearts] = useState<HeartParticle[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      if (!clientX || !clientY) return;

      const newHeart: HeartParticle = {
        id: Date.now() + Math.random(),
        x: clientX,
        y: clientY,
        size: Math.floor(Math.random() * 10) + 16, // 16px to 26px
        color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
        rotation: Math.floor(Math.random() * 40) - 20 // -20deg to 20deg
      };

      setHearts((prev) => [...prev.slice(-15), newHeart]);
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const handleAnimationEnd = (id: number) => {
    setHearts((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <div className="floating-hearts-container">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="floating-heart-particle"
          style={{
            left: `${heart.x}px`,
            top: `${heart.y}px`,
            fontSize: `${heart.size}px`,
            color: heart.color,
            transform: `translate(-50%, -50%) rotate(${heart.rotation}deg)`
          }}
          onAnimationEnd={() => handleAnimationEnd(heart.id)}
        >
          ♥
        </span>
      ))}
    </div>
  );
};
