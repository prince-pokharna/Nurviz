#!/usr/bin/env node

// Test script to verify environment variables are working
const testEnvironmentVariables = () => {
  console.log('🧪 Testing Environment Variables');
  console.log('================================\n');
  
  // Check if we're in production mode
  const isProduction = process.env.NODE_ENV === 'production';
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏭 Production Mode: ${isProduction}\n`);
  
  // Check admin credentials
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const adminName = process.env.ADMIN_NAME;
  const jwtSecret = process.env.JWT_SECRET;
  
  console.log('🔐 Admin Credentials Check:');
  console.log('==========================');
  console.log(`✅ ADMIN_EMAIL: ${adminEmail ? 'SET' : '❌ MISSING'}`);
  console.log(`✅ ADMIN_PASSWORD_HASH: ${adminPasswordHash ? 'SET' : '❌ MISSING'}`);
  console.log(`✅ ADMIN_NAME: ${adminName ? 'SET' : '❌ MISSING'}`);
  console.log(`✅ JWT_SECRET: ${jwtSecret ? 'SET' : '❌ MISSING'}\n`);
  
  // Show actual values (for debugging)
  if (adminEmail) {
    console.log(`📧 Email: ${adminEmail}`);
  }
  if (adminName) {
    console.log(`👤 Name: ${adminName}`);
  }
  if (adminPasswordHash) {
    console.log(`🔒 Password Hash: ${adminPasswordHash.substring(0, 20)}...`);
  }
  if (jwtSecret) {
    console.log(`🎫 JWT Secret: ${jwtSecret.substring(0, 20)}...`);
  }
  
  console.log('\n📋 Summary:');
  console.log('===========');
  
  const allSet = adminEmail && adminPasswordHash && adminName && jwtSecret;
  
  if (allSet) {
    console.log('✅ All environment variables are properly set!');
    console.log('🚀 Your admin authentication should work correctly.');
  } else {
    console.log('❌ Some environment variables are missing!');
    console.log('🔧 Please add the missing variables to your Vercel dashboard.');
    
    if (!adminEmail) console.log('   - Missing: ADMIN_EMAIL');
    if (!adminPasswordHash) console.log('   - Missing: ADMIN_PASSWORD_HASH');
    if (!adminName) console.log('   - Missing: ADMIN_NAME');
    if (!jwtSecret) console.log('   - Missing: JWT_SECRET');
  }
  
  console.log('\n🔗 Next Steps:');
  console.log('==============');
  if (allSet) {
    console.log('1. Test your admin login at: https://your-app.vercel.app/admin');
    console.log('2. Use credentials: jsonali0608@nurvijewel.com / jsona0608');
  } else {
    console.log('1. Go to Vercel Dashboard → Settings → Environment Variables');
    console.log('2. Add the missing variables');
    console.log('3. Redeploy your project');
    console.log('4. Test the admin login');
  }
};

// Run the test
testEnvironmentVariables();
