# 🚨 **VERCEL AUTHENTICATION DEBUG GUIDE**

## 🔍 **ALL POSSIBLE CAUSES OF "INVALID CREDENTIALS" ERROR**

### **1. ❌ ENVIRONMENT VARIABLES NOT SET IN VERCEL**
- **Most Common Cause**: Environment variables not added to Vercel dashboard
- **Symptom**: Authentication works locally but fails on Vercel
- **Fix**: Add environment variables to Vercel dashboard

### **2. ❌ WRONG ENVIRONMENT VARIABLE NAMES**
- **Cause**: Typos in variable names (case-sensitive)
- **Symptom**: Variables exist but not being read
- **Fix**: Verify exact variable names

### **3. ❌ ENVIRONMENT VARIABLES SET FOR WRONG ENVIRONMENT**
- **Cause**: Variables set only for "Development" but not "Production"
- **Symptom**: Works in preview but not production
- **Fix**: Set variables for all environments

### **4. ❌ JWT_SECRET NOT SET**
- **Cause**: Missing JWT secret for token generation
- **Symptom**: Login fails during token creation
- **Fix**: Add JWT_SECRET to environment variables

### **5. ❌ COOKIE DOMAIN ISSUES**
- **Cause**: Cookie settings incompatible with Vercel domain
- **Symptom**: Login succeeds but session not maintained
- **Fix**: Update cookie configuration

### **6. ❌ PASSWORD HASH MISMATCH**
- **Cause**: Different hash generated locally vs production
- **Symptom**: Password verification fails
- **Fix**: Use exact same hash in both environments

### **7. ❌ CASE SENSITIVITY IN EMAIL**
- **Cause**: Email case mismatch between input and stored value
- **Symptom**: Email appears correct but fails validation
- **Fix**: Ensure consistent email casing

### **8. ❌ VERCEL DEPLOYMENT NOT UPDATED**
- **Cause**: Old code deployed without environment variables
- **Symptom**: Changes not reflected on live site
- **Fix**: Redeploy after adding environment variables

---

## 🛠️ **EXACT MANUAL STEPS TO FIX**

### **STEP 1: GENERATE YOUR CREDENTIALS**
```bash
npm run setup-admin
```
**Use these exact credentials:**
- **Email**: `jsonali0608@nurvijewel.com`
- **Password**: `jsona0608`
- **Name**: `Sonali Jain`

### **STEP 2: ADD ENVIRONMENT VARIABLES TO VERCEL**

#### **2.1 Go to Vercel Dashboard**
1. Open [vercel.com](https://vercel.com)
2. Sign in to your account
3. Click on your **NurviJewels** project

#### **2.2 Navigate to Environment Variables**
1. Click **Settings** tab
2. Click **Environment Variables** in the left sidebar

#### **2.3 Add These EXACT Variables**

**Variable 1:**
- **Name**: `ADMIN_EMAIL`
- **Value**: `jsonali0608@nurvijewel.com`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

**Variable 2:**
- **Name**: `ADMIN_PASSWORD_HASH`
- **Value**: `$2b$12$VPIeSzeCZeksedlevqnG8upCvz22RpFtlP2Bz0aJX6Yp4MbRq50Ku`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

**Variable 3:**
- **Name**: `ADMIN_NAME`
- **Value**: `Sonali Jain`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

**Variable 4:**
- **Name**: `JWT_SECRET`
- **Value**: `nurvi-jewel-super-secret-jwt-key-2024-production`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

**Variable 5:**
- **Name**: `NODE_ENV`
- **Value**: `production`
- **Environment**: ✅ Production only

#### **2.4 Save Variables**
1. Click **Save** after adding each variable
2. Verify all 5 variables are listed
3. Ensure all are enabled for Production

### **STEP 3: REDEPLOY YOUR PROJECT**

#### **3.1 Trigger New Deployment**
1. Go to **Deployments** tab in Vercel
2. Click **Redeploy** on the latest deployment
3. OR push a new commit to trigger deployment

#### **3.2 Verify Deployment**
1. Wait for deployment to complete (green checkmark)
2. Note the deployment URL
3. Test the admin login

### **STEP 4: TEST THE LOGIN**

#### **4.1 Access Admin Page**
1. Go to: `https://your-app-name.vercel.app/admin`
2. Enter credentials:
   - **Email**: `jsonali0608@nurvijewel.com`
   - **Password**: `jsona0608`

#### **4.2 Expected Results**
- ✅ Login successful
- ✅ Redirect to admin dashboard
- ✅ No "Invalid credentials" error

---

## 🔧 **ALTERNATIVE FIXES IF ABOVE DOESN'T WORK**

### **FIX A: Update Cookie Settings**
If login works but session doesn't persist:

1. **Check browser console** for cookie errors
2. **Clear browser cookies** for your domain
3. **Try incognito mode** to test

### **FIX B: Verify Environment Variables**
If variables seem correct but still failing:

1. **Add temporary logging** to see what's being read
2. **Check Vercel function logs** for errors
3. **Verify variable names** are exactly as shown above

### **FIX C: Force Environment Variable Refresh**
If variables were added but not taking effect:

1. **Delete all environment variables**
2. **Add them again** one by one
3. **Redeploy** the project
4. **Test** the login

---

## 🧪 **TESTING CHECKLIST**

### **✅ Before Testing:**
- [ ] Environment variables added to Vercel
- [ ] All variables enabled for Production
- [ ] Project redeployed after adding variables
- [ ] Using exact credentials from setup script

### **✅ During Testing:**
- [ ] Clear browser cache and cookies
- [ ] Use incognito/private browsing mode
- [ ] Check browser console for errors
- [ ] Try different browsers

### **✅ After Testing:**
- [ ] Login successful
- [ ] Redirect to admin dashboard
- [ ] Session persists on page refresh
- [ ] Can access admin features

---

## 🚨 **EMERGENCY TROUBLESHOOTING**

### **If Still Getting "Invalid Credentials":**

#### **1. Check Vercel Function Logs**
1. Go to Vercel Dashboard → Functions tab
2. Click on your latest deployment
3. Check logs for authentication errors
4. Look for environment variable issues

#### **2. Test Environment Variables**
Add this temporary code to see what's being read:

```javascript
// Add to app/api/admin/auth/login/route.ts temporarily
console.log('Environment check:', {
  hasEmail: !!process.env.ADMIN_EMAIL,
  hasPasswordHash: !!process.env.ADMIN_PASSWORD_HASH,
  hasJwtSecret: !!process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV
});
```

#### **3. Verify Exact Credentials**
Double-check you're using:
- **Email**: `jsonali0608@nurvijewel.com` (exact case)
- **Password**: `jsona0608` (exact case)

#### **4. Contact Support**
If all else fails:
1. **Screenshot** your Vercel environment variables
2. **Copy** the exact error message
3. **Note** your Vercel project URL
4. **Share** these details for further assistance

---

## 🎯 **SUCCESS INDICATORS**

### **✅ Working Correctly:**
- Login form accepts credentials
- No "Invalid credentials" error
- Redirects to admin dashboard
- Admin navigation visible
- Session persists on refresh

### **❌ Still Broken:**
- "Invalid credentials" error persists
- Login form doesn't respond
- Redirects back to login page
- No admin navigation visible

---

## 📞 **NEXT STEPS**

1. **Follow the exact steps above**
2. **Test with the provided credentials**
3. **If still failing, check Vercel function logs**
4. **Report back with specific error messages**

**The most likely issue is environment variables not being properly set in Vercel. Follow Step 2 exactly!**
