"use client";

import { useEffect, useState, useCallback } from "react";

interface Topic {
  id: number;
  content: string;
  priority: string;
  status: string;
  resolution?: string;
}

export function HubView() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("normal");

  const loadTopics = useCallback(async () => {
    const res = await fetch("/api/topics");
    const data = await res.json();
    setTopics(data);
  }, []);

  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  async function addTopic() {
    if (!content.trim()) {
      alert("请输入议题内容");
      return;
    }
    await fetch("/api/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: content.trim(), priority }),
    });
    setContent("");
    alert("工单已封存！等待周末复盘");
    loadTopics();
  }

  async function resolveTopic(id: number) {
    const resolution = prompt("请输入和好方式（如：两杯奶茶+火锅）：");
    if (!resolution) return;

    await fetch(`/api/topics/${id}/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolution }),
    });

    const title = prompt('给这个和好记录起个标题（如："消失的周末"事件）：');
    if (title) {
      await fetch("/api/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, original_issue: "", resolution }),
      });
    }

    loadTopics();
  }

  const priorityBadgeMap: Record<string, string> = {
    urgent: "急需顺毛",
    critical: "周末开庭",
    normal: "待讨论",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 fade-in-up">
      <div className="md:col-span-5 glass-card rounded-3xl p-8 h-fit">
        <h2 className="text-2xl font-light mb-2 tracking-wide">
          {"提出新议题"}
        </h2>
        <p className="text-foreground/60 text-xs mb-8">
          {"有什么不开心，先存放在这里，周末我们慢慢聊"}
        </p>
        <textarea
          rows={4}
          placeholder="比如：你昨天晚上又没回我消息..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-foreground/5 border border-foreground/20 rounded-xl p-4 text-sm text-foreground outline-none mb-6 resize-none"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full bg-foreground/5 border border-foreground/20 rounded-xl p-3 text-sm text-foreground outline-none mb-6"
        >
          <option value="normal">普通议题</option>
          <option value="urgent">急需顺毛</option>
          <option value="critical">周末开庭</option>
        </select>
        <button
          onClick={addTopic}
          className="w-full py-3 bg-foreground text-accent font-medium rounded-xl shadow-lg hover:bg-opacity-90 transition-all"
        >
          {"封存工单，等待讨论"}
        </button>
      </div>

      <div className="md:col-span-7 glass-card rounded-3xl p-8 flex flex-col h-[500px]">
        <h2 className="text-2xl font-light tracking-wide mb-6">
          {"待讨论列表"}
        </h2>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {topics.length === 0 ? (
            <p className="text-foreground/50 text-center">暂无议题</p>
          ) : (
            topics.map((t) => (
              <div
                key={t.id}
                className={`bg-foreground/5 border border-foreground/10 rounded-2xl p-5 hover:bg-foreground/10 transition-all ${
                  t.status === "resolved" ? "opacity-50" : ""
                }`}
              >
                <span className="text-xs px-2 py-1 bg-foreground/20 rounded-md">
                  {priorityBadgeMap[t.priority] || "待讨论"}
                </span>
                <p className="text-sm mt-3 text-foreground/90">{t.content}</p>
                {t.status !== "resolved" && (
                  <button
                    onClick={() => resolveTopic(t.id)}
                    className="mt-3 text-xs bg-primary px-3 py-1 rounded-lg text-primary-foreground"
                  >
                    {"已和好"}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
