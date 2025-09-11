# 🚨 **MANUAL STEPS TO FIX VERCEL AUTHENTICATION**

## 🎯 **YOUR EXACT CREDENTIALS**
- **Email**: `jsonali0608@nurvijewel.com`
- **Password**: `jsona0608`
- **Name**: `Sonali Jain`

---

## 📋 **STEP-BY-STEP MANUAL FIX**

### **STEP 1: GO TO VERCEL DASHBOARD**
1. Open [vercel.com](https://vercel.com) in your browser
2. Sign in with your account
3. Find and click on your **NurviJewels** project

### **STEP 2: ADD ENVIRONMENT VARIABLES**
1. Click the **Settings** tab
2. Click **Environment Variables** in the left sidebar
3. Click **Add New** button

### **STEP 3: ADD THESE 5 VARIABLES EXACTLY**

#### **Variable 1:**
- **Name**: `ADMIN_EMAIL`
- **Value**: `jsonali0608@nurvijewel.com`
- **Environment**: Check ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

#### **Variable 2:**
- **Name**: `ADMIN_PASSWORD_HASH`
- **Value**: `$2b$12$VPIeSzeCZeksedlevqnG8upCvz22RpFtlP2Bz0aJX6Yp4MbRq50Ku`
- **Environment**: Check ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

#### **Variable 3:**
- **Name**: `ADMIN_NAME`
- **Value**: `Sonali Jain`
- **Environment**: Check ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

#### **Variable 4:**
- **Name**: `JWT_SECRET`
- **Value**: `nurvi-jewel-super-secret-jwt-key-2024-production`
- **Environment**: Check ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

#### **Variable 5:**
- **Name**: `NODE_ENV`
- **Value**: `production`
- **Environment**: Check ✅ Production only
- Click **Save**

### **STEP 4: VERIFY ALL VARIABLES**
You should see 5 variables listed:
1. ✅ ADMIN_EMAIL
2. ✅ ADMIN_PASSWORD_HASH
3. ✅ ADMIN_NAME
4. ✅ JWT_SECRET
5. ✅ NODE_ENV

### **STEP 5: REDEPLOY YOUR PROJECT**
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Wait for deployment to complete (green checkmark)

### **STEP 6: TEST THE LOGIN**
1. Go to your Vercel URL: `https://your-app-name.vercel.app/admin`
2. Enter:
   - **Email**: `jsonali0608@nurvijewel.com`
   - **Password**: `jsona0608`
3. Click **Sign In**

---

## 🔍 **IF STILL NOT WORKING**

### **Check Environment Variables:**
1. Go to: `https://your-app-name.vercel.app/api/debug/admin-env`
2. This will show if environment variables are loaded
3. Look for any "NOT_SET" values

### **Check Vercel Logs:**
1. Go to Vercel Dashboard → Functions tab
2. Click on your latest deployment
3. Check logs for any errors

### **Common Issues:**
- ❌ Variables not set for Production environment
- ❌ Typos in variable names (case-sensitive)
- ❌ Project not redeployed after adding variables
- ❌ Using wrong credentials

---

## ✅ **SUCCESS CHECKLIST**

- [ ] All 5 environment variables added to Vercel
- [ ] All variables enabled for Production
- [ ] Project redeployed after adding variables
- [ ] Using exact credentials: `jsonali0608@nurvijewel.com` / `jsona0608`
- [ ] Login successful on Vercel URL
- [ ] Redirects to admin dashboard
- [ ] No "Invalid credentials" error

---

## 🆘 **EMERGENCY CONTACT**

If you're still having issues after following these exact steps:

1. **Screenshot** your Vercel environment variables page
2. **Copy** the exact error message
3. **Note** your Vercel project URL
4. **Share** these details for further assistance

**The most common issue is environment variables not being properly set in Vercel. Follow these steps exactly!**
