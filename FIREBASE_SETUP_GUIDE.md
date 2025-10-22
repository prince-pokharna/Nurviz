# 🔥 **COMPLETE FIREBASE SETUP GUIDE FOR NURVI JEWEL**

## 🎯 **OVERVIEW**

This guide will help you set up Firebase for your Nurvi Jewel project, including Firestore database, Authentication, and email functionality.

---

## 🚀 **STEP 1: CREATE FIREBASE PROJECT**

### **1.1 Go to Firebase Console**
1. Visit [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Create a project"** or **"Add project"**
3. Enter project name: **"nurvi-jewel"** (or your preferred name)
4. Click **"Continue"**

### **1.2 Configure Project**
1. **Enable Google Analytics**: Choose **"Enable"** (recommended)
2. **Select Analytics account**: Create new or use existing
3. Click **"Create project"**
4. Wait for project creation to complete

---

## 🔧 **STEP 2: ENABLE FIREBASE SERVICES**

### **2.1 Enable Firestore Database**
1. In Firebase Console, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select **"us-central1"** or your preferred location
5. Click **"Done"**

### **2.2 Enable Authentication**
1. Click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Email/Password"**:
   - Click on **"Email/Password"**
   - Toggle **"Enable"**
   - Click **"Save"**

### **2.3 Enable Storage (Optional)**
1. Click **"Storage"** in the left sidebar
2. Click **"Get started"**
3. Choose **"Start in test mode"**
4. Select same location as Firestore
5. Click **"Done"**

---

## 🔑 **STEP 3: GET FIREBASE CONFIGURATION**

### **3.1 Get Web App Configuration**
1. In Firebase Console, click the **gear icon** → **"Project settings"**
2. Scroll down to **"Your apps"** section
3. Click **"Web"** icon (`</>`)
4. Enter app nickname: **"Nurvi Jewel Web"**
5. **Don't check** "Set up Firebase Hosting" (we're using Vercel)
6. Click **"Register app"**
7. **Copy the configuration object** (you'll need this)

### **3.2 Get Service Account Key**
1. In Project Settings, go to **"Service accounts"** tab
2. Click **"Generate new private key"**
3. Click **"Generate key"** in the popup
4. **Download the JSON file** (keep it secure!)

---

## 📋 **STEP 4: ADD ENVIRONMENT VARIABLES**

### **4.1 For Local Development (.env.local)**
Create/update your `.env.local` file:

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Admin Configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_private_key_here\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com

# Email Configuration (for OTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Nurvi Jewel <your-email@gmail.com>
```

### **4.2 For Vercel Deployment**
Add these **EXACT** variables to Vercel Dashboard:

1. **Go to Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. **Add these variables** (one by one):

**Client Variables:**
- `NEXT_PUBLIC_FIREBASE_API_KEY` = your_api_key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = your_project_id.firebaseapp.com
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = your_project_id
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = your_project_id.appspot.com
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = your_sender_id
- `NEXT_PUBLIC_FIREBASE_APP_ID` = your_app_id
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` = your_measurement_id

**Admin Variables:**
- `FIREBASE_PROJECT_ID` = your_project_id
- `FIREBASE_CLIENT_EMAIL` = firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
- `FIREBASE_PRIVATE_KEY` = "-----BEGIN PRIVATE KEY-----\nYour_private_key_here\n-----END PRIVATE KEY-----\n"
- `FIREBASE_STORAGE_BUCKET` = your_project_id.appspot.com

**Email Variables:**
- `EMAIL_USER` = your-email@gmail.com
- `EMAIL_PASS` = your-app-password
- `EMAIL_FROM` = Nurvi Jewel <your-email@gmail.com>

3. **Enable for all environments**: Production, Preview, Development

---

## 🗄️ **STEP 5: MIGRATE YOUR DATA**

### **5.1 Run Migration Script**
```bash
# Set up environment variables first
node scripts/migrate-to-firebase.js
```

This will:
- ✅ Migrate all your inventory data to Firestore
- ✅ Migrate all orders to Firestore
- ✅ Create default categories
- ✅ Create default admin user

---

## 🧪 **STEP 6: TEST YOUR SETUP**

### **6.1 Test Firebase Connection**
1. Go to: `https://your-app.vercel.app/api/firebase/inventory`
2. Should return your inventory data from Firestore

### **6.2 Test Authentication**
1. Go to: `https://your-app.vercel.app/auth`
2. Try creating a new account
3. Check your email for verification

### **6.3 Test OTP System**
1. Register a new account
2. Check your email for OTP
3. Verify the OTP works

---

## 🔒 **STEP 7: SECURITY RULES**

### **7.1 Firestore Security Rules**
Go to **Firestore Database** → **Rules** and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - readable by all, writable by admins only
    match /products/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.is_admin == true;
    }
    
    // Users - readable/writable by the user themselves
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Orders - readable by user who created it, writable by admins
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        (resource.data.user_id == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.is_admin == true);
      allow write: if request.auth != null;
    }
    
    // Email verifications - readable/writable by the email owner
    match /email_verifications/{verificationId} {
      allow read, write: if request.auth != null && 
        resource.data.email == request.auth.token.email;
    }
  }
}
```

### **7.2 Storage Security Rules**
Go to **Storage** → **Rules** and update:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/(default)/documents/users/$(request.auth.uid)).data.is_admin == true;
    }
  }
}
```

---

## 🎯 **STEP 8: UPDATE YOUR APPLICATION**

### **8.1 Update API Routes**
Your API routes are now updated to use Firebase:
- `/api/firebase/inventory` - Get/save inventory
- `/api/firebase/orders` - Get/save orders
- `/api/firebase/auth/register` - User registration
- `/api/firebase/auth/login` - User login
- `/api/firebase/auth/verify-otp` - OTP verification
- `/api/firebase/auth/resend-otp` - Resend OTP

### **8.2 Update Frontend**
The authentication context will automatically use Firebase Auth.

---

## 🚀 **STEP 9: DEPLOY TO VERCEL**

### **9.1 Deploy with Firebase**
1. **Add all environment variables** to Vercel
2. **Redeploy your project**
3. **Test all functionality**

### **9.2 Verify Deployment**
1. Check Firebase Console for data
2. Test user registration/login
3. Test OTP email functionality
4. Verify inventory loads correctly

---

## 🔍 **TROUBLESHOOTING**

### **Common Issues:**

| Issue | Solution |
|-------|----------|
| "Firebase not initialized" | Check environment variables are set correctly |
| "Permission denied" | Update Firestore security rules |
| "Email not sending" | Verify EMAIL_USER and EMAIL_PASS are correct |
| "OTP not working" | Check email configuration and Firebase Auth |
| "Data not loading" | Verify Firestore has data and rules allow access |

### **Debug Steps:**
1. Check Vercel function logs
2. Verify environment variables in Vercel
3. Check Firebase Console for errors
4. Test API endpoints directly

---

## ✅ **SUCCESS CHECKLIST**

- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Authentication enabled
- [ ] Environment variables added to Vercel
- [ ] Data migrated to Firebase
- [ ] Security rules configured
- [ ] Project deployed to Vercel
- [ ] User registration works
- [ ] OTP emails are sent
- [ ] Inventory loads from Firebase
- [ ] Orders save to Firebase

---

## 🎉 **BENEFITS OF FIREBASE**

### **✅ Advantages:**
- **Real-time updates** - Data syncs instantly
- **Scalable** - Handles millions of users
- **Secure** - Built-in security rules
- **Reliable** - Google's infrastructure
- **Email verification** - Built-in auth system
- **No server management** - Fully managed service

### **📊 Performance:**
- **Faster loading** - CDN distribution
- **Better caching** - Automatic optimization
- **Real-time sync** - Instant updates
- **Offline support** - Works without internet

**Your Nurvi Jewel project is now powered by Firebase! 🚀**
