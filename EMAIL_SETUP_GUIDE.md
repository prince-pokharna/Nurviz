# 📧 Email Verification Setup Guide

## 🚀 Quick Setup for Nurvi Jewel Email System

### **Step 1: Create .env.local File**

Create a `.env.local` file in your project root with the following content:

```env
# Email Configuration for Nurvi Jewel
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# Admin Configuration
ADMIN_EMAIL=owner@nurvijewel.com
ADMIN_PASSWORD_HASH=$2b$10$8K8vJdXsLzqGQJ9zNxX0V.5yQZqG8qZvGqKqG8qZvGqKqG8qZvGq

# Development Mode
NODE_ENV=development
```

---

## 🔧 **Gmail Setup (Recommended)**

### **Option 1: Gmail with App Password (Most Secure)**

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Copy the 16-character password

3. **Update .env.local**:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

### **Option 2: Gmail with Less Secure Apps (Not Recommended)**
- Enable "Less secure app access" in Gmail settings
- Use your regular Gmail password

---

## 📮 **Outlook/Hotmail Setup**

```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-outlook-password
EMAIL_FROM=your-email@outlook.com
```

---

## 🏢 **Custom SMTP Setup**

For custom email providers (like your business email):

```env
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-password
EMAIL_FROM=your-email@yourdomain.com
```

---

## 🧪 **Development Mode (No Email Setup Required)**

If you don't want to set up email immediately, the system will work in development mode:

1. **No .env.local file needed**
2. **OTP will be displayed in browser console**
3. **Use the console OTP for testing**

### **How to Test:**
1. Register a new account
2. Open browser console (F12)
3. Look for: `🧪 DEVELOPMENT MODE - OTP for testing: 123456`
4. Use that OTP to verify your account

---

## 🔍 **Testing Email Verification**

### **1. Register New Account**
- Go to `/auth` page
- Fill registration form
- Check console for OTP (development mode)

### **2. Verify Account**
- Enter the OTP from console
- Account will be verified

### **3. Login**
- Use verified email and password
- Should work normally

---

## 🚨 **Troubleshooting**

### **"Email configuration missing" Error**
- Check if `.env.local` file exists
- Verify all required variables are set
- Restart development server after changes

### **"Authentication failed" Error**
- For Gmail: Use App Password, not regular password
- For Outlook: Check if 2FA is enabled
- Verify email credentials are correct

### **"Connection timeout" Error**
- Check internet connection
- Verify SMTP settings
- Try different email provider

### **OTP Not Received**
- Check spam folder
- Verify email address is correct
- In development mode, check browser console

---

## 📋 **Email Templates**

The system sends beautiful HTML emails with:
- ✨ Nurvi Jewel branding
- 🔐 Security verification codes
- 📱 Mobile-friendly design
- ⏰ 10-minute expiration

---

## 🎯 **Production Deployment**

For Vercel deployment:

1. **Add environment variables in Vercel dashboard**:
   - `EMAIL_USER`
   - `EMAIL_PASS` 
   - `EMAIL_FROM`
   - `NODE_ENV=production`

2. **Test email sending** in production
3. **Monitor email delivery** in Vercel logs

---

## ✅ **Verification Checklist**

- [ ] `.env.local` file created
- [ ] Email credentials configured
- [ ] Development server restarted
- [ ] Test registration works
- [ ] OTP verification works
- [ ] Login with verified account works

---

## 🆘 **Need Help?**

If you're still having issues:

1. **Check browser console** for error messages
2. **Verify .env.local** file format
3. **Test with different email provider**
4. **Use development mode** for initial testing

**Your email verification system is now ready! 🎉**
