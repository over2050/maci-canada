import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import QRCode from 'qrcode';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Créer dossier uploads
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Configuration upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${uuidv4()}-${file.originalname}`)
});
const upload = multer({ storage });

// Base de données
const db = new Database('maci.db');

// Créer tables
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    matricule TEXT UNIQUE,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    class TEXT NOT NULL,
    dateOfBirth TEXT,
    placeOfBirth TEXT,
    gender TEXT,
    photo TEXT,
    address TEXT,
    city TEXT,
    country TEXT DEFAULT 'Côte d''Ivoire',
    fatherName TEXT,
    fatherPhone TEXT,
    fatherEmail TEXT,
    fatherOccupation TEXT,
    motherName TEXT,
    motherPhone TEXT,
    motherEmail TEXT,
    motherOccupation TEXT,
    emergencyContact TEXT,
    emergencyPhone TEXT,
    bloodType TEXT,
    allergies TEXT,
    medicalNotes TEXT,
    schoolYear TEXT,
    validUntil TEXT,
    status TEXT DEFAULT 'active',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS advantages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentId TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    discount TEXT,
    FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('✅ Base de données initialisée');

// Routes

// GET tous les élèves
app.get('/api/students', (req, res) => {
  try {
    const students = db.prepare('SELECT * FROM students ORDER BY createdAt DESC').all();
    
    students.forEach(student => {
      const advantages = db.prepare('SELECT * FROM advantages WHERE studentId = ?').all(student.id);
      student.advantages = advantages;
    });
    
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET un élève
app.get('/api/students/:id', (req, res) => {
  try {
    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Élève non trouvé' });
    }
    
    const advantages = db.prepare('SELECT * FROM advantages WHERE studentId = ?').all(req.params.id);
    student.advantages = advantages;
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET QR Code d'un élève
app.get('/api/students/:id/qrcode', async (req, res) => {
  try {
    const qrCodeUrl = `http://localhost:3001/student/${req.params.id}`;
    const qrCode = await QRCode.toDataURL(qrCodeUrl, {
      width: 300,
      margin: 2,
      color: { dark: '#003d82', light: '#FFFFFF' }
    });
    res.json({ qrCode, qrCodeUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST créer un élève
app.post('/api/students', upload.single('photo'), async (req, res) => {
  try {
    const {
      firstName, lastName, class: studentClass, dateOfBirth, placeOfBirth, gender,
      address, city, country, fatherName, fatherPhone, fatherEmail, fatherOccupation,
      motherName, motherPhone, motherEmail, motherOccupation,
      emergencyContact, emergencyPhone, bloodType, allergies, medicalNotes,
      schoolYear, validUntil, advantages
    } = req.body;

    const id = uuidv4();
    const photo = req.file ? `/uploads/${req.file.filename}` : null;
    
    // Générer matricule
    const year = new Date().getFullYear().toString().substr(-2);
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const matricule = `MACI${year}${randomNum}`;

    // Insérer élève
    db.prepare(`
      INSERT INTO students (
        id, matricule, firstName, lastName, class, dateOfBirth, placeOfBirth, gender, photo,
        address, city, country, fatherName, fatherPhone, fatherEmail, fatherOccupation,
        motherName, motherPhone, motherEmail, motherOccupation,
        emergencyContact, emergencyPhone, bloodType, allergies, medicalNotes,
        schoolYear, validUntil
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, matricule, firstName, lastName, studentClass, dateOfBirth, placeOfBirth, gender, photo,
      address, city, country || 'Côte d\'Ivoire', fatherName, fatherPhone, fatherEmail, fatherOccupation,
      motherName, motherPhone, motherEmail, motherOccupation,
      emergencyContact, emergencyPhone, bloodType, allergies, medicalNotes,
      schoolYear, validUntil
    );

    // Insérer avantages
    if (advantages) {
      const advantagesList = JSON.parse(advantages);
      const insertAdv = db.prepare('INSERT INTO advantages (studentId, name, description, discount) VALUES (?, ?, ?, ?)');
      
      advantagesList.forEach(adv => {
        insertAdv.run(id, adv.name, adv.description, adv.discount);
      });
    }

    // Générer QR code
    const qrCodeUrl = `http://localhost:3001/student/${id}`;
    const qrCode = await QRCode.toDataURL(qrCodeUrl, {
      width: 300,
      margin: 2,
      color: { dark: '#003d82', light: '#FFFFFF' }
    });

    res.status(201).json({ 
      success: true,
      id, 
      matricule,
      firstName,
      lastName,
      class: studentClass,
      qrCode,
      qrCodeUrl 
    });
  } catch (error) {
    console.error('Erreur création élève:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT mettre à jour un élève
app.put('/api/students/:id', upload.single('photo'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName, lastName, class: studentClass, dateOfBirth, placeOfBirth, gender,
      address, city, country, fatherName, fatherPhone, fatherEmail, fatherOccupation,
      motherName, motherPhone, motherEmail, motherOccupation,
      emergencyContact, emergencyPhone, bloodType, allergies, medicalNotes,
      schoolYear, validUntil, advantages
    } = req.body;

    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
    if (!student) {
      return res.status(404).json({ error: 'Élève non trouvé' });
    }

    const photo = req.file ? `/uploads/${req.file.filename}` : student.photo;

    // Mettre à jour l'élève
    db.prepare(`
      UPDATE students SET
        firstName = ?, lastName = ?, class = ?, dateOfBirth = ?, placeOfBirth = ?, gender = ?,
        photo = ?, address = ?, city = ?, country = ?,
        fatherName = ?, fatherPhone = ?, fatherEmail = ?, fatherOccupation = ?,
        motherName = ?, motherPhone = ?, motherEmail = ?, motherOccupation = ?,
        emergencyContact = ?, emergencyPhone = ?, bloodType = ?, allergies = ?,
        medicalNotes = ?, schoolYear = ?, validUntil = ?
      WHERE id = ?
    `).run(
      firstName, lastName, studentClass, dateOfBirth, placeOfBirth, gender,
      photo, address, city, country || 'Côte d\'Ivoire',
      fatherName, fatherPhone, fatherEmail, fatherOccupation,
      motherName, motherPhone, motherEmail, motherOccupation,
      emergencyContact, emergencyPhone, bloodType, allergies,
      medicalNotes, schoolYear, validUntil, id
    );

    // Mettre à jour les avantages
    if (advantages) {
      db.prepare('DELETE FROM advantages WHERE studentId = ?').run(id);
      const advantagesList = JSON.parse(advantages);
      const insertAdv = db.prepare('INSERT INTO advantages (studentId, name, description, discount) VALUES (?, ?, ?, ?)');
      
      advantagesList.forEach(adv => {
        insertAdv.run(id, adv.name, adv.description, adv.discount);
      });
    }

    res.json({ 
      success: true,
      id,
      firstName,
      lastName,
      class: studentClass
    });
  } catch (error) {
    console.error('Erreur modification élève:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE élève
app.delete('/api/students/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM students WHERE id = ?').run(req.params.id);
    db.prepare('DELETE FROM advantages WHERE studentId = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET groupes
app.get('/api/groups', (req, res) => {
  try {
    const groups = db.prepare('SELECT * FROM groups ORDER BY name').all();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST créer groupe
app.post('/api/groups', (req, res) => {
  try {
    const { name, description } = req.body;
    const result = db.prepare('INSERT INTO groups (name, description) VALUES (?, ?)').run(name, description);
    res.status(201).json({ success: true, id: result.lastInsertRowid, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE groupe
app.delete('/api/groups/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM groups WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Page publique élève
app.get('/student/:id', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'student.html'));
});

app.listen(PORT, () => {
  console.log(`\n✅ Serveur MACI Canada démarré sur http://localhost:${PORT}`);
  console.log(`📱 Interface admin: http://localhost:${PORT}`);
  console.log(`🎫 Système de Gestion des Cartes Membership`);
  console.log(`\n`);
});
