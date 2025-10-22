#!/usr/bin/env node

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

async function setupEmailCredentials() {
  console.log('📧 Nurvi Jewel Email Setup');
  console.log('==========================\n');
  
  try {
    console.log('Choose your email provider:');
    console.log('1. Gmail (Recommended)');
    console.log('2. Outlook/Hotmail');
    console.log('3. Custom SMTP');
    console.log('4. Show setup instructions only\n');
    
    const choice = await question('Enter your choice (1-4): ');
    
    switch (choice) {
      case '1':
        await setupGmail();
        break;
      case '2':
        await setupOutlook();
        break;
      case '3':
        await setupCustomSMTP();
        break;
      case '4':
        showInstructions();
        break;
      default:
        console.log('❌ Invalid choice. Please run the script again.');
    }
    
  } catch (error) {
    console.error('❌ Error during setup:', error);
  } finally {
    rl.close();
  }
}

async function setupGmail() {
  console.log('\n🔧 Gmail Setup');
  console.log('==============\n');
  
  console.log('📋 Gmail Setup Steps:');
  console.log('1. Go to https://myaccount.google.com');
  console.log('2. Click "Security" → "2-Step Verification"');
  console.log('3. Enable 2-Factor Authentication');
  console.log('4. Go to "App passwords"');
  console.log('5. Generate password for "Mail"');
  console.log('6. Copy the 16-character password\n');
  
  const email = await question('Enter your Gmail address: ');
  const appPassword = await question('Enter your 16-character app password: ');
  
  if (!email.includes('@gmail.com')) {
    console.log('⚠️  Warning: This doesn\'t look like a Gmail address');
  }
  
  if (appPassword.length !== 16) {
    console.log('⚠️  Warning: App password should be 16 characters long');
  }
  
  console.log('\n✅ Gmail Configuration Generated!\n');
  console.log('📋 Add these to your Vercel Environment Variables:');
  console.log('==================================================');
  console.log(`EMAIL_USER = ${email}`);
  console.log(`EMAIL_PASS = ${appPassword}`);
  console.log(`EMAIL_FROM = Nurvi Jewel <${email}>`);
  console.log('==================================================\n');
  
  console.log('📋 For local development (.env.local file):');
  console.log('===========================================');
  console.log(`EMAIL_USER=${email}`);
  console.log(`EMAIL_PASS=${appPassword}`);
  console.log(`EMAIL_FROM=Nurvi Jewel <${email}>`);
  console.log('===========================================\n');
  
  console.log('🚀 Next Steps:');
  console.log('1. Add the variables to Vercel Dashboard');
  console.log('2. Redeploy your project');
  console.log('3. Test at: https://your-app.vercel.app/test-email');
}

async function setupOutlook() {
  console.log('\n🔧 Outlook Setup');
  console.log('================\n');
  
  const email = await question('Enter your Outlook/Hotmail address: ');
  const password = await question('Enter your Outlook password: ');
  
  console.log('\n✅ Outlook Configuration Generated!\n');
  console.log('📋 Add these to your Vercel Environment Variables:');
  console.log('==================================================');
  console.log(`EMAIL_USER = ${email}`);
  console.log(`EMAIL_PASS = ${password}`);
  console.log(`EMAIL_FROM = Nurvi Jewel <${email}>`);
  console.log('==================================================\n');
  
  console.log('📋 For local development (.env.local file):');
  console.log('===========================================');
  console.log(`EMAIL_USER=${email}`);
  console.log(`EMAIL_PASS=${password}`);
  console.log(`EMAIL_FROM=Nurvi Jewel <${email}>`);
  console.log('===========================================\n');
  
  console.log('🚀 Next Steps:');
  console.log('1. Add the variables to Vercel Dashboard');
  console.log('2. Redeploy your project');
  console.log('3. Test at: https://your-app.vercel.app/test-email');
}

async function setupCustomSMTP() {
  console.log('\n🔧 Custom SMTP Setup');
  console.log('====================\n');
  
  const email = await question('Enter your email address: ');
  const password = await question('Enter your email password: ');
  const host = await question('Enter SMTP host (e.g., smtp.gmail.com): ');
  const port = await question('Enter SMTP port (e.g., 587): ') || '587';
  const secureAnswer = await question('Use SSL? (y/n): ');
  const secure = secureAnswer.toLowerCase() === 'y';
  
  console.log('\n✅ Custom SMTP Configuration Generated!\n');
  console.log('📋 Add these to your Vercel Environment Variables:');
  console.log('==================================================');
  console.log(`EMAIL_USER = ${email}`);
  console.log(`EMAIL_PASS = ${password}`);
  console.log(`EMAIL_FROM = Nurvi Jewel <${email}>`);
  console.log(`EMAIL_HOST = ${host}`);
  console.log(`EMAIL_PORT = ${port}`);
  console.log(`EMAIL_SECURE = ${secure}`);
  console.log('==================================================\n');
  
  console.log('📋 For local development (.env.local file):');
  console.log('===========================================');
  console.log(`EMAIL_USER=${email}`);
  console.log(`EMAIL_PASS=${password}`);
  console.log(`EMAIL_FROM=Nurvi Jewel <${email}>`);
  console.log(`EMAIL_HOST=${host}`);
  console.log(`EMAIL_PORT=${port}`);
  console.log(`EMAIL_SECURE=${secure}`);
  console.log('===========================================\n');
  
  console.log('🚀 Next Steps:');
  console.log('1. Add the variables to Vercel Dashboard');
  console.log('2. Redeploy your project');
  console.log('3. Test at: https://your-app.vercel.app/test-email');
}

function showInstructions() {
  console.log('\n📖 Email Setup Instructions');
  console.log('============================\n');
  
  console.log('🔧 Gmail Setup (Recommended):');
  console.log('1. Enable 2-Factor Authentication');
  console.log('2. Generate App Password (16 characters)');
  console.log('3. Use your Gmail address and app password\n');
  
  console.log('🔧 Outlook Setup:');
  console.log('1. Use your Outlook email and password');
  console.log('2. No special setup required\n');
  
  console.log('🔧 Custom SMTP:');
  console.log('1. Get SMTP details from your email provider');
  console.log('2. Use host, port, and security settings\n');
  
  console.log('📋 Required Environment Variables:');
  console.log('• EMAIL_USER - Your email address');
  console.log('• EMAIL_PASS - Your email password or app password');
  console.log('• EMAIL_FROM - Display name and email (e.g., "Nurvi Jewel <email@domain.com>")');
  console.log('• EMAIL_HOST - SMTP host (for custom SMTP)');
  console.log('• EMAIL_PORT - SMTP port (for custom SMTP)');
  console.log('• EMAIL_SECURE - SSL setting (for custom SMTP)\n');
  
  console.log('🚀 After Setup:');
  console.log('1. Add variables to Vercel Dashboard');
  console.log('2. Redeploy your project');
  console.log('3. Test at: https://your-app.vercel.app/test-email');
  console.log('4. Create a test account to verify OTP emails');
}

// Run the setup
setupEmailCredentials();
