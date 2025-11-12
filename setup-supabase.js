// VetOne.AI - Supabase Setup Script
// This script creates the necessary tables in Supabase

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database for VetOne.AI Landing Page...\n');

  try {
    // Read SQL file
    const sqlPath = path.join(__dirname, 'supabase-setup.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 SQL file loaded successfully');
    console.log('\n⚠️  IMPORTANT: Please execute the SQL manually in Supabase SQL Editor');
    console.log('📍 Location: https://supabase.com/dashboard/project/' + supabaseUrl.split('//')[1].split('.')[0] + '/sql');
    console.log('\n📋 Copy and paste the contents of supabase-setup.sql\n');

    // Test connection by checking if tables exist
    console.log('🔍 Testing Supabase connection...');

    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('count', { count: 'exact', head: true });

    const { data: waitlist, error: waitlistError } = await supabase
      .from('waitlist')
      .select('count', { count: 'exact', head: true });

    if (contactsError || waitlistError) {
      console.log('\n⚠️  Tables not found. Please run the SQL in Supabase SQL Editor first.\n');
      console.log('Steps:');
      console.log('1. Go to: https://supabase.com/dashboard/project/kdeqieidgwvthfvqyedq/sql');
      console.log('2. Create a new query');
      console.log('3. Copy the contents of supabase-setup.sql');
      console.log('4. Run the query');
      console.log('5. Run this script again\n');
      return;
    }

    console.log('✅ Connection successful!');
    console.log('✅ Tables found and ready to use');
    console.log('\n📊 Database Status:');
    console.log(`   - contacts table: Ready`);
    console.log(`   - waitlist table: Ready`);
    console.log('\n🎉 Setup complete! Your backend is ready to use Supabase.\n');

  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    process.exit(1);
  }
}

setupDatabase();
