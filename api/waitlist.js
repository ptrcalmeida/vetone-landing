// VetOne.AI Waitlist Form API Endpoint
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { name, email, phone, specialty } = req.body;

  // Validation
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

  if (!phone || phone.trim().length < 8) {
    return res.status(400).json({
      success: false,
      error: 'Telefone inválido'
    });
  }

  if (!specialty || specialty.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Especialidade deve ser selecionada'
    });
  }

  try {
    // Insert into Supabase
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        specialty: specialty.trim(),
        status: 'pending'
      }])
      .select()
      .single();

    if (error) {
      // Handle unique constraint violation (duplicate email)
      if (error.code === '23505') {
        return res.status(409).json({
          success: false,
          error: 'Este email já está cadastrado na lista de espera'
        });
      }

      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro ao adicionar à lista de espera'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Adicionado à lista de espera com sucesso',
      data: {
        id: data.id,
        submitted_at: data.submitted_at
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};
