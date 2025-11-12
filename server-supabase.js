// VetOne.AI Landing Page Backend Server with Supabase
// Handles form submissions for contact and waitlist forms

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

    // Insert into Supabase
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          subject: subject.trim(),
          message: message.trim(),
          status: 'new'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro ao salvar mensagem. Tente novamente.'
      });
    }

    res.json({
      success: true,
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
      contactId: data.id
    });
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

    // Check for duplicate email
    const { data: existing, error: checkError } = await supabase
      .from('waitlist')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Este email já está cadastrado na lista de espera!'
      });
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          specialty: specialty.trim(),
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro ao salvar cadastro. Tente novamente.'
      });
    }

    // Get total count for position
    const { count } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    res.json({
      success: true,
      message: 'Cadastro realizado com sucesso! Você está na lista de espera.',
      waitlistId: data.id,
      position: count || 1
    });
  } catch (error) {
    console.error('Error processing waitlist form:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor. Tente novamente mais tarde.'
    });
  }
});

// GET /api/health - Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test Supabase connection
    const { error } = await supabase
      .from('contacts')
      .select('count', { count: 'exact', head: true });

    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Database connection failed',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/stats - Get submission statistics
app.get('/api/stats', async (req, res) => {
  try {
    // Get contacts count
    const { count: contactsTotal, error: contactsError } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true });

    const { count: contactsNew, error: contactsNewError } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');

    // Get waitlist count
    const { count: waitlistTotal, error: waitlistError } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    const { count: waitlistPending, error: waitlistPendingError } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (contactsError || contactsNewError || waitlistError || waitlistPendingError) {
      throw new Error('Error fetching statistics');
    }

    res.json({
      contacts: {
        total: contactsTotal || 0,
        new: contactsNew || 0
      },
      waitlist: {
        total: waitlistTotal || 0,
        pending: waitlistPending || 0
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
app.listen(PORT, () => {
  console.log(`✅ VetOne.AI Backend Server (Supabase) running on port ${PORT}`);
  console.log(`🗄️  Database: Supabase (${supabaseUrl})`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
