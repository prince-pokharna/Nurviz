# 🚀 Vercel Deployment Guide for Nurvi Jewel Admin Authentication

## 🔧 **Step 1: Set Up Custom Admin Credentials**

### **Run the Setup Script:**
```bash
node scripts/setup-admin-credentials.js
```

This will generate secure environment variables for your admin credentials.

### **Example Output:**
```
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD_HASH=$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2u
ADMIN_NAME=Your Name
```

---

## 🌐 **Step 2: Configure Vercel Environment Variables**

### **In Vercel Dashboard:**

1. **Go to your project** → **Settings** → **Environment Variables**

2. **Add these variables:**

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `ADMIN_EMAIL` | `your-email@example.com` | Production, Preview, Development |
| `ADMIN_PASSWORD_HASH` | `$2a$12$...` (from setup script) | Production, Preview, Development |
| `ADMIN_NAME` | `Your Name` | Production, Preview, Development |
| `JWT_SECRET` | `your-super-secret-jwt-key-here` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

### **Generate JWT Secret:**
```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🔒 **Step 3: Vercel-Specific Fixes Applied**

### **Cookie Configuration:**
- ✅ **SameSite**: Set to `'none'` for production (Vercel requirement)
- ✅ **Secure**: Enabled for production
- ✅ **Path**: Set to `/` for global access
- ✅ **Domain**: Auto-detected by Vercel

### **Environment Detection:**
- ✅ **Development**: Uses local configuration
- ✅ **Production**: Uses environment variables
- ✅ **Fallback**: Secure default configuration

---

## 🧪 **Step 4: Test Your Deployment**

### **After Deployment:**

1. **Visit your Vercel URL**: `https://your-app.vercel.app/admin`

2. **Login with your custom credentials:**
   - Email: (from your setup)
   - Password: (from your setup)

3. **Expected Results:**
   - ✅ Login successful
   - ✅ Redirect to admin dashboard
   - ✅ Session persists on refresh
   - ✅ No "Invalid credentials" errors

---

## 🔍 **Troubleshooting Vercel Issues**

### **Common Problems & Solutions:**

#### **1. "Invalid Credentials" Error:**
```bash
# Check if environment variables are set
vercel env ls
```

**Solution:** Ensure all environment variables are properly set in Vercel dashboard.

#### **2. Cookie Not Working:**
**Solution:** The cookie settings have been optimized for Vercel:
- `sameSite: 'none'` for production
- `secure: true` for HTTPS
- `path: '/'` for global access

#### **3. JWT Token Issues:**
**Solution:** Ensure `JWT_SECRET` is set in Vercel environment variables.

#### **4. Environment Variables Not Loading:**
**Solution:** 
1. Check variable names (case-sensitive)
2. Redeploy after adding variables
3. Verify variables are set for correct environment

---

## 📋 **Complete Environment Variables Checklist**

### **Required for Production:**
- [ ] `ADMIN_EMAIL` - Your admin email
- [ ] `ADMIN_PASSWORD_HASH` - Hashed password from setup script
- [ ] `ADMIN_NAME` - Your display name
- [ ] `JWT_SECRET` - Secure random string
- [ ] `NODE_ENV` - Set to `production`

### **Optional:**
- [ ] `EMAIL_HOST` - For email functionality
- [ ] `EMAIL_PORT` - For email functionality
- [ ] `EMAIL_USER` - For email functionality
- [ ] `EMAIL_PASS` - For email functionality

---

## 🚀 **Deployment Commands**

### **Deploy to Vercel:**
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy
vercel --prod

# Or push to GitHub (if connected)
git push origin main
```

### **Check Deployment Status:**
```bash
vercel ls
vercel logs
```

---

## 🔐 **Security Best Practices**

### **✅ Implemented:**
- ✅ **Password Hashing**: bcrypt with 12 salt rounds
- ✅ **JWT Tokens**: Secure token generation
- ✅ **HTTP-Only Cookies**: Prevents XSS attacks
- ✅ **Rate Limiting**: Prevents brute force attacks
- ✅ **Environment Variables**: No hardcoded credentials
- ✅ **Secure Headers**: CORS and security headers

### **🔒 Additional Security:**
- Use strong, unique passwords
- Regularly rotate JWT secrets
- Monitor login attempts
- Use HTTPS in production (automatic with Vercel)

---

## 📞 **Support**

### **If Issues Persist:**

1. **Check Vercel Logs:**
   ```bash
   vercel logs --follow
   ```

2. **Verify Environment Variables:**
   ```bash
   vercel env ls
   ```

3. **Test Locally with Production Settings:**
   ```bash
   NODE_ENV=production npm run dev
   ```

4. **Check Browser Console** for detailed error messages

---

## 🎉 **Success Indicators**

### **✅ Working Deployment:**
- Admin login works on Vercel URL
- No "Invalid credentials" errors
- Session persists across page refreshes
- Admin dashboard loads properly
- All admin features accessible

### **🎊 Final Result:**
**Your Nurvi Jewel admin authentication system is now fully deployed and secure on Vercel!**

---

## 📝 **Quick Setup Summary**

1. **Run**: `node scripts/setup-admin-credentials.js`
2. **Copy** generated environment variables
3. **Add** to Vercel dashboard environment variables
4. **Deploy** to Vercel
5. **Test** admin login on your Vercel URL

**That's it! Your admin system is ready for production! 🚀**
