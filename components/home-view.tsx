"use client";

import { useEffect, useState, useCallback } from "react";

interface HomeViewProps {
  currentRole: string;
  onHeartRain: () => void;
}

export function HomeView({ currentRole, onHeartRain }: HomeViewProps) {
  const [daysTogether, setDaysTogether] = useState(0);

  const loadHome = useCallback(async () => {
    const res = await fetch("/api/settings");
    const settings = await res.json();
    setDaysTogether(settings.days_together);
  }, []);

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  async function sendMissYou() {
    await fetch("/api/poke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from_role: currentRole, poke_type: "miss_you" }),
    });
    onHeartRain();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 fade-in-up">
      <div className="md:col-span-5 home-time-card rounded-3xl p-8 h-fit text-center flex flex-col items-center justify-center shadow-xl">
        <span className="text-xs text-foreground/70 tracking-widest">
          我们在一起的第
        </span>
        <p className="text-6xl font-extrabold text-foreground mt-3 mb-2 tracking-tighter">
          {daysTogether}
        </p>
        <span className="text-sm text-foreground/80 tracking-widest">天</span>
      </div>

      <div className="md:col-span-7 glass-card rounded-3xl p-12 flex flex-col items-center justify-center h-[320px] shadow-lg relative overflow-hidden group">
        <div className="absolute -top-10 -left-10 text-[100px] opacity-10 group-hover:rotate-12 transition-transform duration-300">
          {"\u{1F496}"}
        </div>

        <button
          onClick={sendMissYou}
          className="w-28 h-28 rounded-full bg-foreground/10 flex items-center justify-center text-5xl shadow-lg border-2 border-foreground/30 hover:bg-foreground/30 hover:scale-110 transition-all badge-glow relative z-10"
        >
          {"\u{1F446}"}
        </button>

        <p className="text-base mt-8 text-foreground tracking-widest font-light relative z-10">
          {"我想你了，戳一戳 \u{1F449} 发射信号"}
        </p>
        <p className="text-xs text-foreground/50 mt-2 relative z-10">
          {currentRole === "girl"
            ? "(他会收到满屏爱心惊喜!)"
            : "(如果她戳了你，会收到爱心雨)"}
        </p>
      </div>
    </div>
  );
}
