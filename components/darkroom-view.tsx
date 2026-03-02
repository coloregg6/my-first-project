"use client";

import { useEffect, useState, useCallback } from "react";

interface Capsule {
  id: number;
  content: string;
  image_url: string;
  created_at: string;
}

export function DarkroomView() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [content, setContent] = useState("");
  const [unlockTime, setUnlockTime] = useState("");

  const loadCapsules = useCallback(async () => {
    const res = await fetch("/api/capsules");
    const data = await res.json();
    setCapsules(data);
  }, []);

  useEffect(() => {
    loadCapsules();
  }, [loadCapsules]);

  async function addCapsule() {
    if (!content.trim() || !unlockTime) {
      alert("请填写完整内容和解锁时间");
      return;
    }
    await fetch("/api/capsules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: content.trim(), unlock_time: unlockTime }),
    });
    alert("惊喜已存入！将在指定时间解锁");
    setContent("");
    setUnlockTime("");
    loadCapsules();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 fade-in-up">
      <div className="md:col-span-5 glass-card rounded-3xl p-8 h-fit">
        <h2 className="text-2xl font-light mb-2 tracking-wide">
          {"存入时光胶囊"}
        </h2>
        <textarea
          rows={3}
          placeholder="留给他的情话..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-foreground/5 border border-foreground/20 rounded-xl p-4 text-sm text-foreground outline-none mb-6 resize-none"
        />
        <div className="mb-6">
          <label className="text-xs text-foreground/70 mb-2 block">
            解锁时间
          </label>
          <input
            type="datetime-local"
            value={unlockTime}
            onChange={(e) => setUnlockTime(e.target.value)}
            className="w-full bg-foreground/5 border border-foreground/20 rounded-xl p-3 text-sm text-foreground outline-none"
          />
        </div>
        <button
          onClick={addCapsule}
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl shadow-lg hover:opacity-90 transition-all"
        >
          {"封存惊喜"}
        </button>
      </div>

      <div className="md:col-span-7 glass-card rounded-3xl p-8 h-[500px] flex flex-col">
        <h2 className="text-2xl font-light tracking-wide mb-6">
          {"已存入的浪漫"}
        </h2>
        <div className="grid grid-cols-2 gap-6 overflow-y-auto">
          {capsules.length === 0 ? (
            <p className="text-foreground/50 text-center col-span-2">
              暂无已解锁的胶囊
            </p>
          ) : (
            capsules.map((c) => (
              <div
                key={c.id}
                className="polaroid transition-transform hover:scale-105 hover:rotate-1 duration-300"
              >
                <div className="w-full aspect-video bg-gradient-to-tr from-pink-300 to-orange-200 mb-3 flex items-center justify-center">
                  {c.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.image_url}
                      alt="胶囊照片"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">{"\u{1F305}"}</span>
                  )}
                </div>
                <p className="text-accent text-xs font-medium text-center italic">
                  {`"${c.content}"`}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
