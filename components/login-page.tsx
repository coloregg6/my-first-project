"use client";

import { useState } from "react";

interface UserInfo {
  role: string;
  name: string;
  avatar: string;
}

interface LoginPageProps {
  onLogin: (user: UserInfo) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function selectRole(role: string) {
    setSelectedRole(role);
    setPin("");
    setError("");
  }

  async function handleLogin() {
    if (!selectedRole || !pin) return;
    const res = await fetch(`/api/login?role=${selectedRole}&pin=${pin}`);
    const result = await res.json();
    if (result.success) {
      onLogin(result.user);
    } else {
      setError("专属暗号不对哦，再试一次吧！");
      setPin("");
    }
  }

  return (
    <div className="w-full max-w-5xl flex flex-col items-center">
      <div className="text-center mb-16 fade-in-up">
        <h1 className="text-foreground text-3xl font-light tracking-[0.2em] mb-2">
          OUR SECRET ZONE
        </h1>
        <p className="text-muted text-sm tracking-widest">
          请选择你的专属通道
        </p>
      </div>

      <div
        className="flex gap-16 mb-12 fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        <div
          className="flex flex-col items-center cursor-pointer group"
          onClick={() => selectRole("girl")}
        >
          <div
            className={`w-24 h-24 rounded-full bg-foreground/20 flex items-center justify-center shadow-lg backdrop-blur-md transition-all duration-300 border-2 hover:scale-105 ${
              selectedRole === "girl"
                ? "border-foreground scale-110 bg-foreground/30"
                : "border-transparent"
            }`}
          >
            <span className="text-4xl">{"\u{1F469}\u{1F3FB}"}</span>
          </div>
          <span className="text-foreground/80 mt-4 text-sm tracking-widest">
            Her (SN)
          </span>
        </div>

        <div
          className="flex flex-col items-center cursor-pointer group"
          onClick={() => selectRole("boy")}
        >
          <div
            className={`w-24 h-24 rounded-full bg-foreground/20 flex items-center justify-center shadow-lg backdrop-blur-md transition-all duration-300 border-2 hover:scale-105 ${
              selectedRole === "boy"
                ? "border-foreground scale-110 bg-foreground/30"
                : "border-transparent"
            }`}
          >
            <span className="text-4xl">{"\u{1F9D1}\u{1F3FB}\u200D\u{1F4BB}"}</span>
          </div>
          <span className="text-foreground/80 mt-4 text-sm tracking-widest">
            Him (Mainland)
          </span>
        </div>
      </div>

      {selectedRole && (
        <div className="flex flex-col items-center fade-in-up relative">
          <div className="absolute -top-12 bg-primary text-xs px-3 py-1 rounded-full text-primary-foreground shadow-md">
            {"默认密码是 1125 哦，快点开！"}
          </div>
          <p className="text-foreground/90 mb-6 text-lg font-light tracking-wide">
            {selectedRole === "girl"
              ? "欢迎回来，今天也超级爱你"
              : "加班结束了吗？这里有人在惦记你哦"}
          </p>
          <input
            type="password"
            maxLength={4}
            placeholder="输入4位暗号"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="glass-input text-center text-2xl tracking-[0.8em] p-4 rounded-2xl text-foreground outline-none w-64 shadow-lg focus:ring-2 focus:ring-foreground/50"
          />
          {error && (
            <p className="text-red-300 text-sm mt-3">{error}</p>
          )}
          <button
            onClick={handleLogin}
            className="mt-8 px-10 py-3 bg-foreground text-accent font-medium rounded-full shadow-lg transition-all tracking-widest text-sm hover:scale-105"
          >
            {"开启任意门"}
          </button>
        </div>
      )}
    </div>
  );
}
