const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

let db = {
  users: [],
  settings: {},
  pokes: [],
  topics: [],
  capsules: [],
  achievements: []
};

function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
  } catch (e) {
    console.log('Creating new database...');
  }
}

function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

function initDatabase() {
  loadDB();
  ensureUploadsDir();
  
  if (db.users.length === 0) {
    db.users = [
      { id: 1, role: 'girl', pin: '1125', name: '彩彩', avatar: '👩🏻' },
      { id: 2, role: 'boy', pin: '1125', name: '彭彭', avatar: '🧑🏻‍💻' }
    ];
  }
  
  if (!db.settings.start_date) {
    db.settings.start_date = '2022-03-01';
  }
  if (!db.settings.resolved_count) {
    db.settings.resolved_count = '0';
  }
  
  saveDB();
}

function getSetting(key) {
  return db.settings[key] || null;
}

function updateSetting(key, value) {
  db.settings[key] = value;
  saveDB();
}

function addPoke(fromRole, pokeType) {
  const poke = {
    id: Date.now(),
    from_role: fromRole,
    poke_type: pokeType,
    created_at: new Date().toISOString(),
    read: 0
  };
  db.pokes.push(poke);
  saveDB();
  return poke;
}

function getUnreadPokes(role) {
  const pokes = db.pokes.filter(p => p.from_role !== role && p.read === 0);
  pokes.forEach(p => p.read = 1);
  saveDB();
  return pokes;
}

function addTopic(content, priority, createdBy) {
  const topic = {
    id: Date.now(),
    content,
    priority,
    status: 'pending',
    created_by: createdBy,
    created_at: new Date().toISOString(),
    resolved_at: null,
    resolution: null
  };
  db.topics.push(topic);
  saveDB();
  return topic;
}

function getTopics() {
  return [...db.topics].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function resolveTopic(id, resolution, resolvedBy) {
  const topic = db.topics.find(t => t.id === id);
  if (topic) {
    topic.status = 'resolved';
    topic.resolution = resolution;
    topic.resolved_by = resolvedBy;
    topic.resolved_at = new Date().toISOString();
    db.settings.resolved_count = (parseInt(db.settings.resolved_count || '0') + 1).toString();
    saveDB();
  }
}

function addCapsule(content, imagePath, unlockTime, createdBy) {
  const capsule = {
    id: Date.now(),
    content,
    image_path: imagePath || '',
    unlock_time: unlockTime,
    created_by: createdBy,
    created_at: new Date().toISOString(),
    read: 0
  };
  db.capsules.push(capsule);
  saveDB();
  return capsule;
}

function getAllCapsules() {
  return [...db.capsules].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function getUnlockedCapsules() {
  const now = new Date();
  return db.capsules
    .filter(c => new Date(c.unlock_time) <= now)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function addAchievement(title, originalIssue, resolution, resolvedBy, topicCreatedAt, resolvedAt) {
  const achievement = {
    id: Date.now(),
    title,
    original_issue: originalIssue,
    resolution,
    resolved_by: resolvedBy,
    created_at: topicCreatedAt || new Date().toISOString(),
    resolved_at: resolvedAt || new Date().toISOString()
  };
  db.achievements.push(achievement);
  saveDB();
  return achievement;
}

function getAchievements() {
  return [...db.achievements].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function verifyUser(role, pin) {
  return db.users.find(u => u.role === role && u.pin === pin);
}

function getUserName(role) {
  const user = db.users.find(u => u.role === role);
  return user ? user.name : role;
}

module.exports = {
  initDatabase,
  getSetting,
  updateSetting,
  addPoke,
  getUnreadPokes,
  addTopic,
  getTopics,
  resolveTopic,
  addCapsule,
  getAllCapsules,
  getUnlockedCapsules,
  addAchievement,
  getAchievements,
  verifyUser,
  getUserName,
  UPLOADS_DIR
};
