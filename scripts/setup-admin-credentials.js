#!/usr/bin/env node

const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

async function setupAdminCredentials() {
  console.log('🔐 Nurvi Jewel Admin Credentials Setup');
  console.log('=====================================\n');
  
  try {
    // Get admin email
    const email = await question('Enter admin email: ');
    if (!email || !email.includes('@')) {
      console.log('❌ Please enter a valid email address');
      process.exit(1);
    }
    
    // Get admin password
    const password = await question('Enter admin password (min 8 characters): ');
    if (!password || password.length < 8) {
      console.log('❌ Password must be at least 8 characters long');
      process.exit(1);
    }
    
    // Get admin name
    const name = await question('Enter admin name (optional): ') || 'Admin';
    
    // Hash the password
    console.log('\n🔄 Hashing password...');
    const passwordHash = await hashPassword(password);
    
    // Generate environment variables
    console.log('\n✅ Admin credentials generated successfully!\n');
    console.log('📋 Add these environment variables to your .env.local file:');
    console.log('==========================================================');
    console.log(`ADMIN_EMAIL=${email}`);
    console.log(`ADMIN_PASSWORD_HASH=${passwordHash}`);
    console.log(`ADMIN_NAME=${name}`);
    console.log('==========================================================\n');
    
    console.log('📋 For Vercel deployment, add these to your Vercel environment variables:');
    console.log('=======================================================================');
    console.log(`ADMIN_EMAIL = ${email}`);
    console.log(`ADMIN_PASSWORD_HASH = ${passwordHash}`);
    console.log(`ADMIN_NAME = ${name}`);
    console.log('=======================================================================\n');
    
    console.log('🔒 Security Notes:');
    console.log('- Never share these credentials');
    console.log('- The password hash is secure and cannot be reversed');
    console.log('- Keep your .env.local file private');
    console.log('- Use strong, unique passwords');
    
  } catch (error) {
    console.error('❌ Error setting up admin credentials:', error);
  } finally {
    rl.close();
  }
}

// Run the setup
setupAdminCredentials();
