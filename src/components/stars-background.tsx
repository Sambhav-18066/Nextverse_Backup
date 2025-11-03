"use client";

import { useState, useEffect } from 'react';

export function StarsBackground() {
  const [stars, setStars] = useState<JSX.Element[]>([]);
  const [shootingStars, setShootingStars] = useState<JSX.Element[]>([]);
  const numStars = 300;
  const numShootingStars = 5;

  useEffect(() => {
    const generateStars = () => {
      return Array.from({ length: numStars }).map((_, i) => (
        <div
          key={`star-${i}`}
          className="star absolute rounded-full bg-white"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            animationDuration: `${Math.random() * 5 + 3}s`,
            animationDelay: `${Math.random() * 3}s`,
            opacity: Math.random() * 0.5 + 0.2,
          }}
        ></div>
      ));
    };

    const generateShootingStars = () => {
      return Array.from({ length: numShootingStars }).map((_, i) => (
        <div
          key={`shooting-star-${i}`}
          className="shooting-star"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 80}px`,
            height: '1px',
            animationDuration: `${Math.random() * 2 + 2}s`,
            animationDelay: `${Math.random() * 5 + 2}s`,
          }}
        />
      ));
    };

    setStars(generateStars());
    setShootingStars(generateShootingStars());
  }, []);

  return (
    <div className="absolute inset-0 opacity-60 overflow-hidden">
      {stars}
      {shootingStars}
    </div>
  );
}
