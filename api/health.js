// VetOne.AI Health Check API Endpoint
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
    // Test database connection
    const { error } = await supabase.from('contacts').select('count').limit(1);

    if (error) {
      return res.status(500).json({
        status: 'error',
        database: 'disconnected',
        error: error.message
      });
    }

    return res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message
    });
  }
};
