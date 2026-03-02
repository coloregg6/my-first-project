import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "database.json");

interface User {
  id: number;
  role: string;
  pin: string;
  name: string;
  avatar: string;
}

interface Poke {
  id: number;
  from_role: string;
  poke_type: string;
  created_at: string;
  read: number;
}

interface Topic {
  id: number;
  content: string;
  priority: string;
  status: string;
  created_at: string;
  resolved_at: string | null;
  resolution?: string;
}

interface Capsule {
  id: number;
  content: string;
  image_url: string;
  unlock_time: string;
  created_at: string;
  read: number;
}

interface Achievement {
  id: number;
  title: string;
  original_issue: string;
  resolution: string;
  created_at: string;
}

interface Database {
  users: User[];
  settings: Record<string, string>;
  pokes: Poke[];
  topics: Topic[];
  capsules: Capsule[];
  achievements: Achievement[];
}

let db: Database = {
  users: [],
  settings: {},
  pokes: [],
  topics: [],
  capsules: [],
  achievements: [],
};

function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      db = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    }
  } catch {
    console.log("Creating new database...");
  }
}

function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export function initDatabase() {
  loadDB();

  if (db.users.length === 0) {
    db.users = [
      { id: 1, role: "girl", pin: "1125", name: "SN", avatar: "\u{1F469}\u{1F3FB}" },
      { id: 2, role: "boy", pin: "1125", name: "Mainland", avatar: "\u{1F9D1}\u{1F3FB}\u200D\u{1F4BB}" },
    ];
  }

  if (!db.settings.start_date) {
    db.settings.start_date = "2022-03-01";
  }
  if (!db.settings.resolved_count) {
    db.settings.resolved_count = "0";
  }

  saveDB();
}

export function verifyUser(role: string, pin: string) {
  loadDB();
  return db.users.find((u) => u.role === role && u.pin === pin) || null;
}

export function getSetting(key: string) {
  loadDB();
  return db.settings[key] || null;
}

export function updateSetting(key: string, value: string) {
  loadDB();
  db.settings[key] = value;
  saveDB();
}

export function addPoke(fromRole: string, pokeType: string) {
  loadDB();
  const poke: Poke = {
    id: Date.now(),
    from_role: fromRole,
    poke_type: pokeType,
    created_at: new Date().toISOString(),
    read: 0,
  };
  db.pokes.push(poke);
  saveDB();
  return poke;
}

export function getUnreadPokes(role: string) {
  loadDB();
  const pokes = db.pokes.filter((p) => p.from_role !== role && p.read === 0);
  pokes.forEach((p) => (p.read = 1));
  saveDB();
  return pokes;
}

export function addTopic(content: string, priority: string = "normal") {
  loadDB();
  const topic: Topic = {
    id: Date.now(),
    content,
    priority,
    status: "pending",
    created_at: new Date().toISOString(),
    resolved_at: null,
  };
  db.topics.push(topic);
  saveDB();
  return topic;
}

export function getTopics() {
  loadDB();
  return [...db.topics].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function resolveTopic(id: number, resolution: string) {
  loadDB();
  const topic = db.topics.find((t) => t.id === id);
  if (topic) {
    topic.status = "resolved";
    topic.resolution = resolution;
    topic.resolved_at = new Date().toISOString();
    db.settings.resolved_count = (
      parseInt(db.settings.resolved_count || "0") + 1
    ).toString();
    saveDB();
  }
}

export function addCapsule(content: string, imageUrl: string, unlockTime: string) {
  loadDB();
  const capsule: Capsule = {
    id: Date.now(),
    content,
    image_url: imageUrl || "",
    unlock_time: unlockTime,
    created_at: new Date().toISOString(),
    read: 0,
  };
  db.capsules.push(capsule);
  saveDB();
  return capsule;
}

export function getUnlockedCapsules() {
  loadDB();
  const now = new Date();
  return db.capsules
    .filter((c) => new Date(c.unlock_time) <= now)
    .sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

export function addAchievement(title: string, originalIssue: string, resolution: string) {
  loadDB();
  const achievement: Achievement = {
    id: Date.now(),
    title,
    original_issue: originalIssue,
    resolution,
    created_at: new Date().toISOString(),
  };
  db.achievements.push(achievement);
  saveDB();
  return achievement;
}

export function getAchievements() {
  loadDB();
  return [...db.achievements].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
