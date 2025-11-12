// VetOne.AI Landing Page Backend Server
// Handles form submissions for contact and waitlist forms

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Data storage paths
const DATA_DIR = path.join(__dirname, 'data');
const CONTACT_FILE = path.join(DATA_DIR, 'contacts.json');
const WAITLIST_FILE = path.join(DATA_DIR, 'waitlist.json');

// Ensure data directory exists
async function initDataDirectory() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  // Initialize files if they don't exist
  try {
    await fs.access(CONTACT_FILE);
  } catch {
    await fs.writeFile(CONTACT_FILE, JSON.stringify([], null, 2));
  }

  try {
    await fs.access(WAITLIST_FILE);
  } catch {
    await fs.writeFile(WAITLIST_FILE, JSON.stringify([], null, 2));
  }
}

// Helper function to read JSON file
async function readJSONFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

// Helper function to write JSON file
async function writeJSONFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
}

// Validation middleware for contact form
function validateContactForm(req, res, next) {
  const { name, email, subject, message } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Nome deve ter pelo menos 2 caracteres'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Email inválido'
    });
  }

  if (!subject || subject.trim().length < 3) {
    return res.status(400).json({
      success: false,
      error: 'Assunto deve ter pelo menos 3 caracteres'
    });
  }

  if (!message || message.trim().length < 10) {
    return res.status(400).json({
      success: false,
      error: 'Mensagem deve ter pelo menos 10 caracteres'
    });
  }

  next();
}

// Validation middleware for waitlist form
function validateWaitlistForm(req, res, next) {
  const { name, email, phone, specialty } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Nome deve ter pelo menos 2 caracteres'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Email inválido'
    });
  }

  if (!phone || phone.trim().length < 10) {
    return res.status(400).json({
      success: false,
      error: 'Telefone inválido'
    });
  }

  if (!specialty || specialty.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Especialidade inválida'
    });
  }

  next();
}

// API Routes

// POST /api/contact - Handle contact form submissions
app.post('/api/contact', validateContactForm, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Read existing contacts
    const contacts = await readJSONFile(CONTACT_FILE);

    // Create new contact entry
    const newContact = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      submittedAt: new Date().toISOString(),
      status: 'new'
    };

    // Add to contacts array
    contacts.push(newContact);

    // Save to file
    const success = await writeJSONFile(CONTACT_FILE, contacts);

    if (success) {
      res.json({
        success: true,
        message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
        contactId: newContact.id
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Erro ao salvar mensagem. Tente novamente.'
      });
    }
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor. Tente novamente mais tarde.'
    });
  }
});

// POST /api/waitlist - Handle waitlist form submissions
app.post('/api/waitlist', validateWaitlistForm, async (req, res) => {
  try {
    const { name, email, phone, specialty } = req.body;

    // Read existing waitlist
    const waitlist = await readJSONFile(WAITLIST_FILE);

    // Check for duplicate email
    const existingEntry = waitlist.find(
      entry => entry.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (existingEntry) {
      return res.status(409).json({
        success: false,
        error: 'Este email já está cadastrado na lista de espera!'
      });
    }

    // Create new waitlist entry
    const newEntry = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      specialty: specialty.trim(),
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    // Add to waitlist array
    waitlist.push(newEntry);

    // Save to file
    const success = await writeJSONFile(WAITLIST_FILE, waitlist);

    if (success) {
      res.json({
        success: true,
        message: 'Cadastro realizado com sucesso! Você está na lista de espera.',
        waitlistId: newEntry.id,
        position: waitlist.length
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Erro ao salvar cadastro. Tente novamente.'
      });
    }
  } catch (error) {
    console.error('Error processing waitlist form:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor. Tente novamente mais tarde.'
    });
  }
});

// GET /api/health - Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// GET /api/stats - Get submission statistics (optional admin endpoint)
app.get('/api/stats', async (req, res) => {
  try {
    const contacts = await readJSONFile(CONTACT_FILE);
    const waitlist = await readJSONFile(WAITLIST_FILE);

    res.json({
      contacts: {
        total: contacts.length,
        new: contacts.filter(c => c.status === 'new').length
      },
      waitlist: {
        total: waitlist.length,
        pending: waitlist.filter(w => w.status === 'pending').length
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Error fetching statistics' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor'
  });
});

// Start server
async function startServer() {
  await initDataDirectory();
  app.listen(PORT, () => {
    console.log(`✅ VetOne.AI Backend Server running on port ${PORT}`);
    console.log(`📁 Data directory: ${DATA_DIR}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer();
