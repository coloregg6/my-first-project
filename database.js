const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

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

function initDatabase() {
  loadDB();
  
  if (db.users.length === 0) {
    db.users = [
      { id: 1, role: 'girl', pin: '1125', name: 'SN', avatar: '👩🏻' },
      { id: 2, role: 'boy', pin: '1125', name: 'Mainland', avatar: '🧑🏻‍💻' }
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

function addTopic(content, priority = 'normal') {
  const topic = {
    id: Date.now(),
    content,
    priority,
    status: 'pending',
    created_at: new Date().toISOString(),
    resolved_at: null
  };
  db.topics.push(topic);
  saveDB();
  return topic;
}

function getTopics() {
  return [...db.topics].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function resolveTopic(id, resolution) {
  const topic = db.topics.find(t => t.id === id);
  if (topic) {
    topic.status = 'resolved';
    topic.resolution = resolution;
    topic.resolved_at = new Date().toISOString();
    db.settings.resolved_count = (parseInt(db.settings.resolved_count || '0') + 1).toString();
    saveDB();
  }
}

function addCapsule(content, imageUrl, unlockTime) {
  const capsule = {
    id: Date.now(),
    content,
    image_url: imageUrl || '',
    unlock_time: unlockTime,
    created_at: new Date().toISOString(),
    read: 0
  };
  db.capsules.push(capsule);
  saveDB();
  return capsule;
}

function getCapsules() {
  return [...db.capsules];
}

function getUnlockedCapsules() {
  const now = new Date();
  return db.capsules
    .filter(c => new Date(c.unlock_time) <= now)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function addAchievement(title, originalIssue, resolution) {
  const achievement = {
    id: Date.now(),
    title,
    original_issue: originalIssue,
    resolution,
    created_at: new Date().toISOString()
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
  getCapsules,
  getUnlockedCapsules,
  addAchievement,
  getAchievements,
  verifyUser
};
