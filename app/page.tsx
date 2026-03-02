"use client";

import { useState, useEffect, useCallback } from "react";
import { LoginPage } from "@/components/login-page";
import { HomeView } from "@/components/home-view";
import { HubView } from "@/components/hub-view";
import { DarkroomView } from "@/components/darkroom-view";
import { AchievementsView } from "@/components/achievements-view";
import { HeartRain } from "@/components/heart-rain";

interface UserInfo {
  role: string;
  name: string;
  avatar: string;
}

type TabId = "home" | "hub" | "darkroom" | "achievements";

const NAV_ITEMS: { id: TabId; label: string }[] = [
  { id: "home", label: "首页" },
  { id: "hub", label: "中转站" },
  { id: "darkroom", label: "暗房" },
  { id: "achievements", label: "成就" },
];

export default function Page() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [heartRainKey, setHeartRainKey] = useState(0);
  const [showHeartRain, setShowHeartRain] = useState(false);

  const triggerHeartRain = useCallback(() => {
    setHeartRainKey((k) => k + 1);
    setShowHeartRain(true);
    setTimeout(() => setShowHeartRain(false), 4500);
  }, []);

  const checkPokes = useCallback(async () => {
    if (!user) return;
    const res = await fetch(`/api/pokes/${user.role}`);
    const pokes = await res.json();
    if (pokes.length > 0) {
      triggerHeartRain();
    }
  }, [user, triggerHeartRain]);

  useEffect(() => {
    if (!user) return;
    checkPokes();
    const interval = setInterval(checkPokes, 5000);
    return () => clearInterval(interval);
  }, [user, checkPokes]);

  function handleLogin(userInfo: UserInfo) {
    setUser(userInfo);
    setActiveTab("home");
  }

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <LoginPage onLogin={handleLogin} />
      </main>
    );
  }

  return (
    <main className="w-full max-w-5xl mx-auto p-4 md:p-8 flex flex-col min-h-screen fade-in-up">
      <HeartRain key={heartRainKey} active={showHeartRain} />

      <nav className="w-full flex justify-between items-center mb-12">
        <div className="text-xl font-light tracking-[0.2em] text-foreground">
          OUR ZONE
        </div>
        <div className="flex gap-6 text-sm tracking-wider">
          {NAV_ITEMS.map((item) => (
            <span
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`cursor-pointer transition-all ${
                activeTab === item.id
                  ? "text-foreground border-b-2 border-foreground pb-1"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {item.label}
            </span>
          ))}
        </div>
        <div className="w-10 h-10 rounded-full bg-foreground/20 flex items-center justify-center text-xl shadow-lg">
          {user.avatar}
        </div>
      </nav>

      <div className="flex-1 w-full">
        {activeTab === "home" && (
          <HomeView
            currentRole={user.role}
            onHeartRain={triggerHeartRain}
          />
        )}
        {activeTab === "hub" && <HubView />}
        {activeTab === "darkroom" && <DarkroomView />}
        {activeTab === "achievements" && <AchievementsView />}
      </div>
    </main>
  );
}
