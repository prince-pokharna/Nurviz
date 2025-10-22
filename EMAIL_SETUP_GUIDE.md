# 📧 **COMPLETE EMAIL SETUP GUIDE FOR NURVI JEWEL**

## 🎯 **OVERVIEW**

This guide will help you set up proper email functionality for OTP verification, order confirmations, and password resets. You have several options for email services.

---

## 🔧 **OPTION 1: GMAIL (RECOMMENDED FOR TESTING)**

### **Step 1: Enable 2-Factor Authentication**
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **Security** in the left sidebar
3. Under "Signing in to Google", click **2-Step Verification**
4. Follow the setup process

### **Step 2: Generate App Password**
1. Go back to **Security** → **2-Step Verification**
2. Scroll down to **App passwords**
3. Click **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Enter "Nurvi Jewel App"
6. Click **Generate**
7. **Copy the 16-character password** (you'll need this)

### **Step 3: Add Environment Variables to Vercel**
Go to Vercel Dashboard → Settings → Environment Variables and add:

**Variable 1:**
- **Name**: `EMAIL_USER`
- **Value**: `your-gmail@gmail.com`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

**Variable 2:**
- **Name**: `EMAIL_PASS`
- **Value**: `your-16-character-app-password`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

**Variable 3:**
- **Name**: `EMAIL_FROM`
- **Value**: `Nurvi Jewel <your-gmail@gmail.com>`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

---

## 🔧 **OPTION 2: OUTLOOK/HOTMAIL**

### **Step 1: Use Your Outlook Credentials**
1. Go to [outlook.live.com](https://outlook.live.com)
2. Sign in with your Microsoft account
3. No special setup needed for basic authentication

### **Step 2: Add Environment Variables to Vercel**
**Variable 1:**
- **Name**: `EMAIL_USER`
- **Value**: `your-email@outlook.com`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

**Variable 2:**
- **Name**: `EMAIL_PASS`
- **Value**: `your-outlook-password`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

**Variable 3:**
- **Name**: `EMAIL_FROM`
- **Value**: `Nurvi Jewel <your-email@outlook.com>`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

---

## 🔧 **OPTION 3: CUSTOM SMTP (FOR BUSINESS EMAILS)**

### **Step 1: Get SMTP Details from Your Provider**
Common SMTP settings:
- **Gmail**: smtp.gmail.com:587
- **Outlook**: smtp-mail.outlook.com:587
- **Yahoo**: smtp.mail.yahoo.com:587
- **Custom**: Check with your hosting provider

### **Step 2: Add Environment Variables to Vercel**
**Variable 1:**
- **Name**: `EMAIL_HOST`
- **Value**: `smtp.gmail.com`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

**Variable 2:**
- **Name**: `EMAIL_PORT`
- **Value**: `587`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

**Variable 3:**
- **Name**: `EMAIL_SECURE`
- **Value**: `false`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

**Variable 4:**
- **Name**: `EMAIL_USER`
- **Value**: `your-email@domain.com`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

**Variable 5:**
- **Name**: `EMAIL_PASS`
- **Value**: `your-email-password`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

**Variable 6:**
- **Name**: `EMAIL_FROM`
- **Value**: `Nurvi Jewel <your-email@domain.com>`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

---

## 🚀 **QUICK SETUP (GMAIL - RECOMMENDED)**

### **For Local Development (.env.local file):**
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=Nurvi Jewel <your-gmail@gmail.com>
```

### **For Vercel Production:**
Add these 3 variables to Vercel Dashboard:
1. `EMAIL_USER` = your-gmail@gmail.com
2. `EMAIL_PASS` = your-16-character-app-password  
3. `EMAIL_FROM` = Nurvi Jewel <your-gmail@gmail.com>

---

## 🧪 **TESTING YOUR EMAIL SETUP**

### **Step 1: Test Email Configuration**
1. Go to: `https://your-app-name.vercel.app/api/test-email`
2. This will show if email credentials are properly configured

### **Step 2: Test OTP Functionality**
1. Go to: `https://your-app-name.vercel.app/auth?tab=register`
2. Create a new account with a real email address
3. Check your email for the OTP code
4. Enter the OTP to verify your account

### **Step 3: Test Login OTP**
1. Try logging in with an unverified account
2. Check your email for the login OTP
3. Enter the OTP to complete login

---

## 🔍 **TROUBLESHOOTING**

### **Common Issues & Solutions:**

| Issue | Solution |
|-------|----------|
| "Email configuration missing" | Add EMAIL_USER, EMAIL_PASS, EMAIL_FROM to Vercel |
| "Authentication failed" | Check if 2FA is enabled and app password is correct |
| "Connection timeout" | Verify EMAIL_HOST and EMAIL_PORT settings |
| Emails not received | Check spam folder, verify email address |
| "Invalid credentials" | Double-check EMAIL_USER and EMAIL_PASS |

### **Gmail Specific Issues:**
- **"Less secure app access"**: Use App Password instead
- **"2-Step Verification required"**: Enable 2FA and generate app password
- **"Access blocked"**: Check Google security settings

### **Outlook Specific Issues:**
- **"Authentication failed"**: Try using your full email as username
- **"Connection refused"**: Check if SMTP is enabled in Outlook settings

---

## 📋 **VERIFICATION CHECKLIST**

### **✅ Before Testing:**
- [ ] Email credentials added to Vercel
- [ ] All variables enabled for Production
- [ ] Project redeployed after adding variables
- [ ] Using correct email format

### **✅ During Testing:**
- [ ] Test email endpoint shows "configured"
- [ ] Registration sends OTP email
- [ ] Login sends OTP email
- [ ] OTP verification works
- [ ] Emails arrive in inbox (not spam)

### **✅ After Testing:**
- [ ] OTP emails are received
- [ ] Email templates look professional
- [ ] No development mode messages
- [ ] All authentication flows work

---

## 🎯 **RECOMMENDED SETUP FOR NURVI JEWEL**

### **For Production Use:**
1. **Use Gmail with App Password** (easiest setup)
2. **Or use a business email service** (more professional)
3. **Test thoroughly** before going live
4. **Monitor email delivery** rates

### **Email Templates Include:**
- ✨ Welcome emails with OTP
- 🔐 Login verification emails
- 📧 Password reset emails
- 🛍️ Order confirmation emails
- 💎 Professional Nurvi Jewel branding

---

## 🆘 **NEED HELP?**

If you're still having issues:

1. **Check Vercel Function Logs** for email errors
2. **Verify all environment variables** are set correctly
3. **Test with a simple email** first (Gmail recommended)
4. **Check spam folder** for test emails
5. **Contact support** with specific error messages

**The most common issue is missing or incorrect EMAIL_PASS (app password for Gmail).**

---

## 🎉 **SUCCESS INDICATORS**

### **✅ Working Correctly:**
- Test email endpoint shows "configured"
- Registration sends OTP to email
- Login sends OTP to email
- OTP verification completes successfully
- Professional email templates
- No development mode messages

### **❌ Still Broken:**
- "Email configuration missing" error
- No emails received
- OTP verification fails
- Development mode messages visible

**Follow this guide step-by-step and your email system will work perfectly!**
