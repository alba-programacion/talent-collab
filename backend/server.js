require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const User = require('./models/User');
const Institution = require('./models/Institution');
const Vacancy = require('./models/Vacancy');
const CV = require('./models/CV');
const Task = require('./models/Task');

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage: storage });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/talent-collab')
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    // Seed Institutions
    if ((await Institution.countDocuments()) === 0) {
      await Institution.create([
        { _id: 'A', name: 'Institución A', profile: 'Desarrollo' },
        { _id: 'B', name: 'Institución B', profile: 'Salud' }
      ]);
      console.log('🌱 Seeded Institutions');
    }
  })
  .catch((err) => console.error('❌ Failed to connect to MongoDB:', err));

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const MOCK_USERS = [
  { id: 1, email: 'admin@system.com', password: 'password', role: 'admin', institutionId: null },
  { id: 2, email: 'manager@inst-a.com', password: 'password', role: 'management', institutionId: 'A' },
  { id: 3, email: 'user@inst-a.com', password: 'password', role: 'user', institutionId: 'A' },
  { id: 4, email: 'manager@inst-b.com', password: 'password', role: 'management', institutionId: 'B' },
];

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, institutionId, newInstitutionName, newInstitutionProfile } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Faltan datos requeridos (Nombre, correo, contraseña)' });
    
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Este correo ya se encuentra registrado.' });
    
    const finalRole = role && ['user', 'management', 'admin'].includes(role) ? role : 'user';
    let finalInstId = institutionId;

    if (!institutionId && newInstitutionName && ['admin', 'management'].includes(finalRole)) {
      if (!newInstitutionProfile) return res.status(400).json({error: 'Faltan datos de la nueva institución (giro).'});
      const instExists = await Institution.findOne({ name: { $regex: new RegExp(`^${newInstitutionName.trim()}$`, 'i') } });
      if (instExists) return res.status(400).json({ error: `La institución "${instExists.name}" ya existe. Por favor selecciónala de la lista.` });
      
      const newId = newInstitutionName.replace(/\s+/g, '').substring(0, 4).toUpperCase() + Math.floor(Math.random() * 1000);
      const newInst = await Institution.create({ _id: newId, name: newInstitutionName.trim(), profile: newInstitutionProfile });
      finalInstId = newInst._id;
    }

    if (!finalInstId) return res.status(400).json({ error: 'Debes seleccionar o crear una institución aportadora válida.' });

    const newUser = new User({ 
      name, 
      email, 
      password, 
      role: finalRole,
      institutionId: finalInstId
    });
    
    await newUser.save();
    res.status(201).json({ message: 'Registro exitoso', user: { id: newUser._id, name, email, role: newUser.role, institutionId: newUser.institutionId } });
  } catch (err) { res.status(500).json({ error: 'Error interno del servidor al registrar.' }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const dbUser = await User.findOne({ email }).populate('institutionId');
    if (dbUser) {
      if (await dbUser.comparePassword(password)) {
        return res.json({ 
          token: 'jwt-' + dbUser._id, 
          user: { 
            id: dbUser._id, 
            name: dbUser.name, 
            email: dbUser.email, 
            role: dbUser.role, 
            institutionId: dbUser.institutionId?._id || dbUser.institutionId,
            institutionName: dbUser.institutionId?.name || 'Administración Central'
          } 
        });
      }
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...safeUser } = user;
      return res.json({ token: 'mock-token', user: safeUser });
    }
    res.status(401).json({ error: 'Credenciales inválidas' });
  } catch (err) { res.status(500).json({ error: 'Error de servidor' }); }
});

app.get('/api/metrics', async (req, res) => {
  const [totalVacancies, totalInstitutions, totalCvs, cvsInProcess] = await Promise.all([
    Vacancy.countDocuments(), Institution.countDocuments(), CV.countDocuments(), CV.countDocuments({ status: 'En Proceso' })
  ]);
  res.json({ totalVacancies, totalInstitutions, totalCvs, cvsInProcess });
});

app.get('/api/institutions', async (req, res) => {
  const insts = await Institution.find();
  res.json(insts.map(i => ({ id: i._id, name: i.name, profile: i.profile })));
});

app.get('/api/vacancies', async (req, res) => {
  const vacs = await Vacancy.find().populate('institutionId');
  const results = [];
  for (let v of vacs) {
    const cvCount = await CV.countDocuments({ targetVacancyId: v._id });
    results.push({
      id: v._id,
      institutionId: v.institutionId?._id || v.institutionId,
      institutionName: v.institutionId?.name || 'Desconocida',
      role: v.role, salary: v.salary, description: v.description,
      status: v.status, cvCount, date: v.createdAt
    });
  }
  res.json(results);
});

app.post('/api/vacancies', async (req, res) => {
  try {
    const v = await Vacancy.create(req.body);
    res.json(v);
  } catch(e) { res.status(400).json({error: e.message}); }
});

app.get('/api/cvs', async (req, res) => {
  const cvs = await CV.find().populate('sourceInstitutionId').populate('targetVacancyId');
  res.json(cvs.map(c => ({
    ...c.toObject(), id: c._id, 
    sourceInstitutionName: c.sourceInstitutionId?.name || '',
  })));
});

// CREATE CV (Local available pool)
app.post('/api/cvs', upload.single('document'), async (req, res) => {
  try {
    const { name, email, sourceInstitutionId } = req.body;
    if (!req.file) return res.status(400).json({error: 'Documento PDF obligatorio'});
    if (!sourceInstitutionId || sourceInstitutionId === 'null') return res.status(403).json({error: 'Propiedad de CV requerida por los estatutos de colaboración.'});

    const newCv = new CV({
      name, email, document: req.file.filename,
      sourceInstitutionId
    });
    await newCv.save();
    res.status(201).json(newCv);
  } catch(e) { res.status(400).json({error: e.message}); }
});

// Phase 6: Simple Vacancy Submit (No SLA Task)
app.post('/api/cvs/vacancy', upload.single('document'), async (req, res) => {
  try {
    const { name, email, targetVacancyId, sourceInstitutionId } = req.body;
    if (!req.file) return res.status(400).json({error: 'Documento PDF obligatorio'});
    if (!sourceInstitutionId || sourceInstitutionId === 'null') return res.status(403).json({error: 'Propiedad de CV requerida por los estatutos de colaboración.'});
    
    const cv = await CV.create({
      name, email, document: req.file.filename,
      sourceInstitutionId,
      targetVacancyId, status: 'Disponible'
    });
    res.status(201).json({ cv });
  } catch(e) { res.status(400).json({error: e.message}); }
});

// Phase 6: Inter-Institutional Collaboration (SLA Task generation)
app.post('/api/cvs/collab', upload.single('document'), async (req, res) => {
  try {
    const { name, email, senderEmail, description, targetEmail, sourceInstitutionId, dueDate } = req.body;
    if (!req.file) return res.status(400).json({error: 'Documento PDF obligatorio'});
    if (!sourceInstitutionId || sourceInstitutionId === 'null') return res.status(403).json({error: 'Propiedad de CV requerida por los estatutos de colaboración.'});
    
    const cv = await CV.create({
      name, email, document: req.file.filename,
      sourceInstitutionId,
      targetInstitutionId: targetEmail, // Save destination email for tracking rendering
      status: 'En Proceso'
    });
    
    // SLA Date processing
    const finalDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    // Create an automatically tracked task
    const task = await Task.create({
      type: 'REVIEW_CV',
      senderEmail,
      targetEmail,
      cvId: cv._id,
      description: description || 'Por favor revisa este CV.',
      dueDate: finalDueDate
    });
    res.status(201).json({ cv, task });
  } catch(e) { res.status(400).json({error: e.message}); }
});

// Legacy Bilateral Collaboration Share CV
app.post('/api/cvs/:id/share', async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv || cv.status === 'En Proceso') return res.status(400).json({error:'No disponible'});
    cv.status = 'En Proceso';
    cv.targetVacancyId = req.body.targetVacancyId || null;
    await cv.save();
    res.json(cv);
  } catch(e) { res.status(400).json({error:e.message}); }
});

app.patch('/api/cvs/:id/status', async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);
    const { status, rejectedReason } = req.body;
    cv.status = status;
    if (status === 'Rechazado') { cv.rejectedReason = rejectedReason; cv.targetVacancyId = null; }
    await cv.save();
    res.json(cv);
  } catch(e) { res.status(400).json({error: e.message}) }
});

// --- TASKS API ---
app.get('/api/tasks', async (req, res) => {
  const { email } = req.query;
  const q = email ? { targetEmail: email } : {};
  const tasks = await Task.find(q).populate('cvId').populate('targetVacancyId').sort({ createdAt: -1 });
  res.json(tasks.map(t => ({...t.toObject(), id: t._id, fine: t.fine})));
});

app.patch('/api/tasks/:id/complete', async (req, res) => {
  try {
    const t = await Task.findById(req.params.id);
    t.status = 'COMPLETED';
    await t.save();
    res.json(t);
  } catch(e) { res.status(400).json({error: e.message}); }
});

// --- USERS API (for Institutions Admin) ---
app.get('/api/users', async (req, res) => {
  const users = await User.find({}, '-password').populate('institutionId');
  res.json(users);
});
app.patch('/api/users/:id', async (req, res) => {
  try {
    const u = await User.findById(req.params.id);
    if(req.body.role) u.role = req.body.role;
    if(req.body.institutionId !== undefined) {
      u.institutionId = req.body.institutionId === '' ? null : req.body.institutionId;
    }
    await u.save();
    res.json(u);
  } catch(e) { res.status(400).json({error:e.message}); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log(`Backend de Colaboración de Talento (MVP) corriendo en http://localhost:${PORT}`); });
