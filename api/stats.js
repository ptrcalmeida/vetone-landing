// VetOne.AI Stats API Endpoint
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Get counts from both tables
    const { count: contactsCount, error: contactsError } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true });

    const { count: waitlistCount, error: waitlistError } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    if (contactsError || waitlistError) {
      return res.status(500).json({
        success: false,
        error: 'Erro ao buscar estatísticas'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        contacts: contactsCount || 0,
        waitlist: waitlistCount || 0,
        total: (contactsCount || 0) + (waitlistCount || 0)
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
