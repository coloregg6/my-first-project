const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

db.initDatabase();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

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
  const { content, priority, created_by } = req.body;
  db.addTopic(content, priority, created_by);
  res.json({ success: true });
});

app.get('/api/topics', (req, res) => {
  const topics = db.getTopics();
  const enrichedTopics = topics.map(t => ({
    ...t,
    created_by_name: db.getUserName(t.created_by)
  }));
  res.json(enrichedTopics);
});

app.post('/api/topics/:id/resolve', (req, res) => {
  const { id } = req.params;
  const { resolution, resolved_by } = req.body;
  const topic = db.getTopics().find(t => t.id === parseInt(id));
  
  db.resolveTopic(parseInt(id), resolution, resolved_by);
  
  if (topic) {
    const title = resolution || '已化解的议题';
    const resolvedAt = new Date().toISOString();
    db.addAchievement(title, topic.content, resolution, resolved_by, topic.created_at, resolvedAt);
  }
  
  res.json({ success: true });
});

app.post('/api/capsules', upload.single('image'), (req, res) => {
  const { content, unlock_time, created_by } = req.body;
  const imagePath = req.file ? '/uploads/' + req.file.filename : '';
  db.addCapsule(content, imagePath, unlock_time, created_by);
  res.json({ success: true });
});

app.get('/api/capsules', (req, res) => {
  const capsules = db.getAllCapsules();
  const now = new Date();
  const enrichedCapsules = capsules.map(c => ({
    ...c,
    is_unlocked: new Date(c.unlock_time) <= now
  }));
  res.json(enrichedCapsules);
});

app.get('/api/achievements', (req, res) => {
  const achievements = db.getAchievements();
  const topics = db.getTopics();
  const enrichedAchievements = achievements.map(a => {
    const topic = topics.find(t => t.content === a.original_issue && t.status === 'resolved');
    if (topic && topic.resolved_at) {
      return { ...a, resolved_at: topic.resolved_at };
    }
    if (a.resolved_at) {
      return a;
    }
    return { ...a, resolved_at: a.created_at };
  });
  res.json(enrichedAchievements);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎀 Our Secret Zone 服务已启动: http://localhost:${PORT}`);
});
