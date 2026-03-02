"use client";

import { useEffect, useState, useCallback } from "react";

interface Achievement {
  id: number;
  title: string;
  original_issue: string;
  resolution: string;
  created_at: string;
}

export function AchievementsView() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [resolvedCount, setResolvedCount] = useState(0);

  const loadAchievements = useCallback(async () => {
    const [achievementsRes, settingsRes] = await Promise.all([
      fetch("/api/achievements"),
      fetch("/api/settings"),
    ]);
    const achievementsData = await achievementsRes.json();
    const settingsData = await settingsRes.json();
    setAchievements(achievementsData);
    setResolvedCount(settingsData.resolved_count);
  }, []);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  return (
    <div className="flex flex-col fade-in-up">
      <div className="glass-card rounded-3xl p-8 mb-8 flex justify-between items-center relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 text-[100px] opacity-10">
          {"\u{1F3C5}"}
        </div>
        <div>
          <h2 className="text-3xl font-light mb-2 tracking-wide">
            {"回忆与和好墙"}
          </h2>
          <p className="text-foreground/70 text-sm tracking-wide">
            {"每一次争吵后的拥抱，都让我们靠得更近。"}
          </p>
        </div>
        <div className="flex gap-8 text-center">
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-primary">
              {resolvedCount}
            </span>
            <span className="text-xs text-foreground/60 tracking-wider mt-1">
              已化解危机
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {achievements.length === 0 ? (
          <p className="text-foreground/50 text-center col-span-3">
            暂无和好记录
          </p>
        ) : (
          achievements.map((a) => (
            <div
              key={a.id}
              className="glass-card rounded-2xl p-6 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl mb-4 badge-glow">
                {"\u{1F9CB}"}
              </div>
              <h3 className="text-lg font-medium mb-2 tracking-wide text-foreground">
                {a.title}
              </h3>
              {a.original_issue && (
                <p className="text-xs text-foreground/60 line-through">
                  {"原工单："}
                  {a.original_issue}
                </p>
              )}
              {a.resolution && (
                <div className="bg-foreground/10 p-3 rounded-xl mt-4 border border-foreground/5">
                  <p className="text-xs text-foreground/90 mt-1">
                    {a.resolution}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
