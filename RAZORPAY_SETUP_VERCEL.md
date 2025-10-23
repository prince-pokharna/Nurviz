# 💳 RAZORPAY SETUP FOR VERCEL - COMPLETE GUIDE

## ⚠️ IMPORTANT: .env.local vs Vercel

**What You Did:**
- ✅ Added credentials to `.env.local`
- ✅ Works on localhost (your computer)

**What's Missing:**
- ❌ `.env.local` is NOT deployed to Vercel
- ❌ Vercel needs variables added separately

**Solution:**
- ✅ Add same credentials to Vercel Dashboard

---

## 🔑 STEP 1: GET YOUR RAZORPAY CREDENTIALS

### **1.1 Login to Razorpay**
- Go to: https://dashboard.razorpay.com
- Login with your account

### **1.2 Get API Keys**

**For Test Mode:**
1. Top navigation → Click **"Test Mode"** toggle (should be blue)
2. Left sidebar → **Settings** → **API Keys**
3. Click **"Generate Test Keys"** (if not already generated)
4. You'll see:
   ```
   Key ID: rzp_test_xxxxxxxxxxxxx
   Key Secret: xxxxxxxxxxxxxxxxxxxxxx
   ```
5. Click **"Copy"** for both

**For Live Mode:**
1. Top navigation → Click **"Live Mode"** toggle (should be green)
2. Complete KYC if required
3. Left sidebar → **Settings** → **API Keys**
4. Click **"Generate Live Keys"**
5. You'll see:
   ```
   Key ID: rzp_live_xxxxxxxxxxxxx
   Key Secret: xxxxxxxxxxxxxxxxxxxxxx
   ```
6. Click **"Copy"** for both

**Recommendation:** Use **Test Mode** first to verify everything works!

---

## 🚀 STEP 2: ADD TO VERCEL

### **2.1 Open Vercel Dashboard**
- Go to: https://vercel.com/dashboard
- Find project: **"nurvijewel"**
- Click on it

### **2.2 Go to Environment Variables**
- Click **"Settings"** tab
- Left sidebar → **"Environment Variables"**

### **2.3 Add Variable 1: RAZORPAY_KEY_ID**

Click **"Add New"**:

```
┌─────────────────────────────────────────────┐
│ Name                                        │
│ RAZORPAY_KEY_ID                            │ ⬅️ Type exactly
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Value                                       │
│ rzp_test_xxxxxxxxxxxxx                     │ ⬅️ Paste from Razorpay
│ (or rzp_live_xxxxxxxxxxxxx for live)      │
└─────────────────────────────────────────────┘

Select Environments:
☑️ Production
☑️ Preview
☑️ Development
```

Click **"Save"**

### **2.4 Add Variable 2: RAZORPAY_KEY_SECRET**

Click **"Add New"**:

```
┌─────────────────────────────────────────────┐
│ Name                                        │
│ RAZORPAY_KEY_SECRET                        │ ⬅️ Type exactly
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Value                                       │
│ (paste your Razorpay Key Secret)          │ ⬅️ From Razorpay
└─────────────────────────────────────────────┘

Select Environments:
☑️ Production
☑️ Preview
☑️ Development
```

Click **"Save"**

### **2.5 Add Variable 3: NEXT_PUBLIC_RAZORPAY_KEY_ID**

Click **"Add New"**:

```
┌─────────────────────────────────────────────┐
│ Name                                        │
│ NEXT_PUBLIC_RAZORPAY_KEY_ID                │ ⬅️ Type exactly
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Value                                       │
│ (same as RAZORPAY_KEY_ID above)           │ ⬅️ Same value!
│ rzp_test_xxxxx or rzp_live_xxxxx          │
└─────────────────────────────────────────────┘

Select Environments:
☑️ Production
☑️ Preview
☑️ Development
```

Click **"Save"**

---

## ✅ STEP 3: VERIFY VARIABLES

You should now see in Vercel:

```
Environment Variables (3 for Razorpay)

✅ RAZORPAY_KEY_ID
   Production: rzp_***************
   
✅ RAZORPAY_KEY_SECRET
   Production: ********************
   
✅ NEXT_PUBLIC_RAZORPAY_KEY_ID
   Production: rzp_***************
```

---

## 🔄 STEP 4: REDEPLOY (CRITICAL!)

**I've already triggered a redeploy for you!**

Just wait **2 minutes** for deployment to complete.

**To check:**
1. Vercel Dashboard → **"Deployments"** tab
2. Latest deployment should say: **"Building..."** → **"Ready"**
3. Wait for green checkmark ✅

---

## 🧪 STEP 5: TEST PAYMENT

After deployment is ready (2 min):

1. **Go to:** https://nurvijewel.vercel.app

2. **Browse products** and add to cart

3. **Go to checkout**

4. **Fill in details:**
   ```
   Email: test@example.com
   Phone: +91 9876543210
   Name: Test Customer
   Address: (any address)
   ```

5. **Click "Pay"** button

6. **Razorpay popup should open!** ✅

7. **Use test card:**
   ```
   Card: 4111 1111 1111 1111
   CVV: 123
   Expiry: 12/25
   ```

8. **Complete payment**

9. **Should see:** "Payment successful! 🎉"

---

## 🔍 VERIFY IN LOGS

After redeployment, Vercel logs should show:

```
✅ Environment check:
✅ - RAZORPAY_KEY_ID: ✓ Set
✅ - RAZORPAY_KEY_SECRET: ✓ Set
✅ - NODE_ENV: production
```

Instead of:
```
❌ - RAZORPAY_KEY_ID: ✗ Missing
❌ - RAZORPAY_KEY_SECRET: ✗ Missing
```

---

## 📋 WHERE TO FIND RAZORPAY CREDENTIALS

### **Razorpay Dashboard:**

**Test Mode:**
```
https://dashboard.razorpay.com/app/website-app-settings/api-keys

Key ID: rzp_test_xxxxxxxxxxxxx
Key Secret: Click "Show" to reveal
```

**Live Mode (after KYC):**
```
Toggle to "Live Mode" (green)
Settings → API Keys

Key ID: rzp_live_xxxxxxxxxxxxx
Key Secret: Click "Show" to reveal
```

---

## ⚠️ TEST MODE vs LIVE MODE

### **Test Mode (Use First):**
- ✅ Free to test
- ✅ No real money
- ✅ Test cards work
- ✅ Perfect for development

**Credentials start with:** `rzp_test_`

### **Live Mode (Production):**
- ⚠️ Real money transactions
- ⚠️ Requires KYC completion
- ⚠️ Real cards only
- ⚠️ Razorpay charges fees

**Credentials start with:** `rzp_live_`

---

## 🎯 RECOMMENDED SETUP

### **For Now (Testing):**
Use **Test Mode** credentials:
```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

### **For Launch (Production):**
Switch to **Live Mode** credentials:
```
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
```

---

## 🔐 SECURITY NOTES

### **Why 3 Variables?**

1. **RAZORPAY_KEY_ID** - Server-side only (creating orders)
2. **RAZORPAY_KEY_SECRET** - Server-side only (verification)
3. **NEXT_PUBLIC_RAZORPAY_KEY_ID** - Client-side (Razorpay popup)

### **NEXT_PUBLIC_ prefix:**
- Makes variable available to browser
- Needed for Razorpay checkout UI
- Safe to expose (it's a public key)

---

## 📊 CURRENT STATUS

### **What I've Done:**
- ✅ Triggered Vercel redeployment
- ✅ Waiting for your env vars to be added
- ✅ Code is ready to use Razorpay

### **What You Need to Do:**
1. ⏳ Add 3 Razorpay variables to Vercel (steps above)
2. ⏳ Wait 2 minutes for deployment
3. ⏳ Test payment flow

---

## ✅ VERIFICATION CHECKLIST

After adding variables and redeployment:

- [ ] Vercel shows 3 Razorpay variables
- [ ] Deployment status: Ready ✅
- [ ] Go to website
- [ ] Add product to cart
- [ ] Go to checkout
- [ ] Click "Pay" button
- [ ] Razorpay popup opens ✅
- [ ] Can complete test payment
- [ ] See success message

---

## 🆘 TROUBLESHOOTING

### **Issue: "Payment gateway configuration error"**

**Check:**
1. All 3 variables added to Vercel? ✅
2. All 3 checked for Production environment? ✅
3. Deployment completed after adding? ✅
4. Correct values (no typos)? ✅

**Solution:**
- Verify in Vercel → Settings → Environment Variables
- Click on each variable to check value
- Must have all 3!

### **Issue: Razorpay popup doesn't open**

**Check:**
1. `NEXT_PUBLIC_RAZORPAY_KEY_ID` set? (with NEXT_PUBLIC_ prefix)
2. Value matches RAZORPAY_KEY_ID?
3. Browser console for errors (F12)?

**Solution:**
- The public variable is essential for frontend
- Must start with `NEXT_PUBLIC_`

---

## 📝 COMPLETE ENV VARS NEEDED

### **Your Full Vercel Environment Variables:**

```
Admin:
✅ ADMIN_EMAIL
✅ ADMIN_PASSWORD_HASH
✅ JWT_SECRET

Cloudinary:
✅ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
✅ NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

Firebase:
✅ NEXT_PUBLIC_FIREBASE_API_KEY
✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID
✅ (other Firebase vars...)

Razorpay: ⬅️ ADD THESE NOW!
⏳ RAZORPAY_KEY_ID
⏳ RAZORPAY_KEY_SECRET
⏳ NEXT_PUBLIC_RAZORPAY_KEY_ID

Email (optional):
○ EMAIL_USER
○ EMAIL_PASS
○ EMAIL_FROM
```

---

## 🎯 AFTER ADDING VARIABLES

### **Wait 2 Minutes**

Vercel will:
1. Detect new environment variables
2. My triggered redeployment will pick them up
3. Build with new credentials
4. Deploy updated version
5. Payment will work! ✅

### **Check Logs Again:**

After deployment:
1. Try checkout again
2. Check Vercel logs
3. Should see:
   ```
   ✅ - RAZORPAY_KEY_ID: ✓ Set
   ✅ - RAZORPAY_KEY_SECRET: ✓ Set
   ```

---

## 🎉 SUMMARY

### **The Issue:**
- ❌ Added to `.env.local` (local only)
- ❌ Not in Vercel Dashboard (production)

### **The Solution:**
- ✅ Add to Vercel Environment Variables
- ✅ Redeploy (I triggered it)
- ✅ Test payment flow

### **Timeline:**
- Now: Add variables to Vercel (2 min)
- +2 min: Deployment ready
- +3 min: Test payment
- Result: Working! ✅

---

## 📞 QUICK REFERENCE

**Vercel Environment Variables:**
- URL: https://vercel.com/[your-account]/nurvijewel/settings/environment-variables

**What to Add:**
1. RAZORPAY_KEY_ID = rzp_test_xxxxx (from Razorpay)
2. RAZORPAY_KEY_SECRET = your_secret (from Razorpay)
3. NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_test_xxxxx (same as #1)

**Check All 3 Boxes:**
- Production ✅
- Preview ✅
- Development ✅

---

**Add these 3 variables now, wait 2 minutes, then test!** 🚀

The deployment is already queued - just add the variables and it will work!

