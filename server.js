const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

db.initDatabase();

function calculateDaysTogether(startDate) {
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

app.get('/api/login', (req, res) => {
  const { role, pin } = req.query;
  const user = db.verifyUser(role, pin);
  
  if (user) {
    res.json({ success: true, user: { role: user.role, name: user.name, avatar: user.avatar } });
  } else {
    res.json({ success: false, message: '暗号错误' });
  }
});

app.get('/api/settings', (req, res) => {
  const startDate = db.getSetting('start_date');
  const resolvedCount = db.getSetting('resolved_count');
  const daysTogether = calculateDaysTogether(startDate);
  res.json({ start_date: startDate, days_together: daysTogether, resolved_count: resolvedCount || 0 });
});

app.post('/api/poke', (req, res) => {
  const { from_role, poke_type } = req.body;
  db.addPoke(from_role, poke_type);
  res.json({ success: true });
});

app.get('/api/pokes/:role', (req, res) => {
  const { role } = req.params;
  const pokes = db.getUnreadPokes(role);
  res.json(pokes);
});

app.post('/api/topics', (req, res) => {
  const { content, priority } = req.body;
  db.addTopic(content, priority);
  res.json({ success: true });
});

app.get('/api/topics', (req, res) => {
  const topics = db.getTopics();
  res.json(topics);
});

app.post('/api/topics/:id/resolve', (req, res) => {
  const { id } = req.params;
  const { resolution } = req.body;
  db.resolveTopic(parseInt(id), resolution);
  res.json({ success: true });
});

app.post('/api/capsules', (req, res) => {
  const { content, image_url, unlock_time } = req.body;
  db.addCapsule(content, image_url, unlock_time);
  res.json({ success: true });
});

app.get('/api/capsules', (req, res) => {
  const capsules = db.getUnlockedCapsules();
  res.json(capsules);
});

app.get('/api/achievements', (req, res) => {
  const achievements = db.getAchievements();
  res.json(achievements);
});

app.post('/api/achievements', (req, res) => {
  const { title, original_issue, resolution } = req.body;
  db.addAchievement(title, original_issue, resolution);
  res.json({ success: true });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎀 Our Secret Zone 服务已启动: http://0.0.0.0:${PORT}`);
});
