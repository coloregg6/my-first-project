"use client";

import { useEffect, useState } from "react";

interface Heart {
  id: number;
  emoji: string;
  left: string;
  duration: string;
  opacity: number;
}

export function HeartRain({ active }: { active: boolean }) {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    if (!active) return;

    const emojis = ["\u{1F9E1}", "\u2764\uFE0F", "\u{1F496}"];
    const newHearts: Heart[] = [];

    for (let i = 0; i < 60; i++) {
      newHearts.push({
        id: Date.now() + i,
        emoji: emojis[Math.floor(Math.random() * 3)],
        left: `${Math.random() * 100}vw`,
        duration: `${Math.random() * 1.5 + 2}s`,
        opacity: Math.random() * 0.5 + 0.5,
      });
    }

    setHearts(newHearts);

    const timer = setTimeout(() => {
      setHearts([]);
    }, 4000);

    return () => clearTimeout(timer);
  }, [active]);

  if (hearts.length === 0) return null;

  return (
    <>
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="heart-rain text-4xl"
          style={{
            left: heart.left,
            animationDuration: heart.duration,
            opacity: heart.opacity,
          }}
        >
          {heart.emoji}
        </div>
      ))}
    </>
  );
}
