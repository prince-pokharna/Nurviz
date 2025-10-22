#!/usr/bin/env node

const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function generateVercelAdminCredentials() {
  console.log('🚀 Nurvi Jewel Vercel Admin Setup');
  console.log('==================================\n');
  
  try {
    // Generate secure credentials
    const email = 'admin@nurvijewel.com';
    const password = 'NurviAdmin2024!';
    const name = 'Nurvi Jewel Admin';
    
    // Generate secure JWT secret
    const jwtSecret = crypto.randomBytes(64).toString('hex');
    
    // Hash the password
    console.log('🔄 Generating secure password hash...');
    const passwordHash = await bcrypt.hash(password, 12);
    
    console.log('✅ Admin credentials generated successfully!\n');
    
    console.log('📋 VERCEL ENVIRONMENT VARIABLES');
    console.log('================================');
    console.log('Copy these EXACT values to your Vercel dashboard:\n');
    
    console.log('Variable 1:');
    console.log('Name: ADMIN_EMAIL');
    console.log(`Value: ${email}`);
    console.log('Environment: ✅ Production, ✅ Preview, ✅ Development\n');
    
    console.log('Variable 2:');
    console.log('Name: ADMIN_PASSWORD_HASH');
    console.log(`Value: ${passwordHash}`);
    console.log('Environment: ✅ Production, ✅ Preview, ✅ Development\n');
    
    console.log('Variable 3:');
    console.log('Name: ADMIN_NAME');
    console.log(`Value: ${name}`);
    console.log('Environment: ✅ Production, ✅ Preview, ✅ Development\n');
    
    console.log('Variable 4:');
    console.log('Name: JWT_SECRET');
    console.log(`Value: ${jwtSecret}`);
    console.log('Environment: ✅ Production, ✅ Preview, ✅ Development\n');
    
    console.log('Variable 5:');
    console.log('Name: NODE_ENV');
    console.log('Value: production');
    console.log('Environment: ✅ Production only\n');
    
    console.log('🔐 LOGIN CREDENTIALS');
    console.log('===================');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}\n`);
    
    console.log('📝 STEP-BY-STEP INSTRUCTIONS');
    console.log('============================');
    console.log('1. Go to https://vercel.com and sign in');
    console.log('2. Click on your NurviJewels project');
    console.log('3. Go to Settings → Environment Variables');
    console.log('4. Add each variable above (click "Add New" for each)');
    console.log('5. Make sure ALL variables are enabled for Production');
    console.log('6. Go to Deployments tab and click "Redeploy"');
    console.log('7. Wait for deployment to complete');
    console.log('8. Test login with the credentials above\n');
    
    console.log('🔍 TESTING YOUR SETUP');
    console.log('=====================');
    console.log('1. Go to: https://your-app-name.vercel.app/admin');
    console.log('2. Enter the email and password above');
    console.log('3. You should be redirected to the admin dashboard\n');
    
    console.log('🆘 TROUBLESHOOTING');
    console.log('==================');
    console.log('If login still fails:');
    console.log('1. Check: https://your-app-name.vercel.app/api/debug/admin-env');
    console.log('2. Verify all environment variables show as "SET"');
    console.log('3. Check Vercel function logs for errors');
    console.log('4. Make sure you redeployed after adding variables\n');
    
    console.log('✅ SUCCESS INDICATORS');
    console.log('=====================');
    console.log('- Login form accepts credentials');
    console.log('- No "Invalid credentials" error');
    console.log('- Redirects to admin dashboard');
    console.log('- Admin navigation is visible');
    console.log('- Session persists on page refresh\n');
    
  } catch (error) {
    console.error('❌ Error generating admin credentials:', error);
    process.exit(1);
  }
}

// Run the setup
generateVercelAdminCredentials();
