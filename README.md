# 💎 Nurvi Jewels - E-Commerce Platform

Modern, full-featured jewelry e-commerce platform built with Next.js 15, Firebase, and Cloudinary.

## ✨ Features

### **Customer Features:**
- 🛍️ Browse jewelry collections (Rings, Necklaces, Earrings, Bracelets, Anklets)
- 🔍 Advanced search and filtering
- 🛒 Shopping cart with persistent storage
- 💳 Secure checkout with Razorpay payment gateway
- 📧 Email OTP authentication
- 📦 Order tracking and history
- ❤️ Wishlist functionality
- 📱 Fully responsive (mobile, tablet, desktop)

### **Admin Features:**
- 🔐 Secure admin authentication
- 📊 Complete product management (CRUD)
- 📸 Image upload with Cloudinary CDN
- 📈 Analytics dashboard
- 📦 Order management and tracking
- 👥 Customer management
- 📄 Automated Excel order book generation
- 📧 Email notification system
- 💾 Real-time Firebase database

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Git installed
- Cloudinary account (free)
- Firebase project (free)
- Razorpay account (for payments)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/prince-pokharna/Nurviz.git
cd NurviJewels

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create .env.local file (see Environment Setup below)

# 4. Run development server
npm run dev

# 5. Open browser
http://localhost:3000
```

---

## 🔧 Environment Setup

### Required Environment Variables

Create `.env.local` in root directory:

```env
# ===========================
# ADMIN CREDENTIALS
# ===========================
ADMIN_EMAIL=admin@nurvijewel.com
ADMIN_PASSWORD_HASH=$2a$10$... (generate with bcrypt)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# ===========================
# CLOUDINARY (Image Storage)
# ===========================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=nurvi-jewels

# ===========================
# FIREBASE (Database)
# ===========================
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# ===========================
# PAYMENT GATEWAY (Razorpay)
# ===========================
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx

# ===========================
# EMAIL SERVICE
# ===========================
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=Nurvi Jewel <noreply@nurvijewel.com>

# ===========================
# SMS SERVICE (Optional)
# ===========================
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# ===========================
# APPLICATION
# ===========================
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

---

## 📸 Cloudinary Setup

### 1. Create Account
- Sign up: https://cloudinary.com/users/register/free
- Free tier: 25GB storage + 25GB bandwidth

### 2. Get Cloud Name
- Dashboard → Copy your Cloud Name

### 3. Create Upload Preset
- Settings → Upload → Add upload preset
- **Name:** `nurvi-jewels`
- **Signing Mode:** "Unsigned" (Important!)
- **Folder:** `nurvi-jewels`
- Save

### 4. Add to Environment
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=nurvi-jewels
```

---

## 🔥 Firebase Setup

### 1. Create Project
- Go to: https://console.firebase.google.com
- Create new project: "nurvi-jewel"

### 2. Enable Firestore
- Build → Firestore Database → Create database
- Start in production mode

### 3. Update Security Rules
Firestore → Rules → Paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read, write: if true;
    }
    match /{document=**} {
      allow read: if true;
    }
  }
}
```

### 4. Get Configuration
- Project Settings → General
- Copy Firebase config values to `.env.local`

---

## 💳 Razorpay Setup

1. Sign up: https://dashboard.razorpay.com
2. Get API keys: Settings → API Keys
3. Add to `.env.local`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=your_secret
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
   ```

---

## 📧 Email Setup (Gmail)

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to `.env.local`:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   EMAIL_FROM=Nurvi Jewel <noreply@nurvijewel.com>
   ```

---

## 🎯 Usage

### Development
```bash
npm run dev                 # Start development server
npm run build              # Build for production
npm run start              # Start production server
```

### Admin Panel
- URL: `/admin`
- Features: Product management, orders, analytics

### Useful Scripts
```bash
npm run daily-excel        # Generate order book Excel
npm run sync-inventory     # Sync inventory data
npm run setup-admin        # Configure admin credentials
```

---

## 📁 Project Structure

```
nurvi-jewels/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── collections/       # Product collections
│   ├── checkout/          # Checkout flow
│   └── ...
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── ui/               # UI components (shadcn)
│   └── ...
├── contexts/              # React contexts
├── lib/                   # Utility functions
├── public/                # Static assets
├── data/                  # JSON data storage
│   ├── inventory.json    # Product data
│   └── orders.json       # Order data
└── scripts/               # Utility scripts
```

---

## 🔐 Security

- ✅ JWT-based admin authentication
- ✅ HTTP-only cookies
- ✅ Rate limiting on sensitive routes
- ✅ Input validation
- ✅ Razorpay payment signature verification
- ✅ Firebase security rules
- ✅ Environment variables for secrets

---

## 🚀 Deployment (Vercel)

### 1. Connect GitHub
- Push code to GitHub
- Connect to Vercel

### 2. Add Environment Variables
- Vercel Dashboard → Settings → Environment Variables
- Add all variables from `.env.local`

### 3. Deploy
```bash
git push origin main
```

Vercel auto-deploys on push.

### 4. Verify
- Test admin panel
- Upload products with images
- Place test order
- Check email notifications

---

## 📸 Image Upload Guidelines

### Recommended Specifications:
- **Format:** JPG, PNG, WebP
- **Size:** 1200 x 1200 px (square)
- **File Size:** Under 2MB
- **Number:** 4-5 images per product
- **Background:** White or transparent

### Upload Process:
1. Admin panel → Jewelry Manager
2. Add/Edit product
3. Upload images via Cloudinary
4. Images stored on CDN
5. Fast delivery worldwide

---

## 📦 Order Management

### Features:
- Real-time order tracking
- Automated Excel order book (Book1.xlsx)
- Email confirmations
- SMS notifications (optional)
- Customer analytics

### Order Book:
- Location: `/Book1.xlsx` and `/order-books/`
- Auto-generated with daily script
- Multiple worksheets (Summary, Details, Analytics, Customers)

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15.2.4
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **Database:** Firebase Firestore
- **Image Storage:** Cloudinary
- **Payment:** Razorpay
- **Email:** Nodemailer
- **SMS:** Twilio (optional)
- **Authentication:** JWT + Firebase Auth
- **Deployment:** Vercel

---

## 📊 Performance

- ✅ Server-side rendering
- ✅ Image optimization (Cloudinary CDN)
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Caching strategies
- ✅ Optimized for mobile

---

## 🐛 Troubleshooting

### Common Issues:

**Image Upload Fails:**
- Check Cloudinary credentials in Vercel
- Verify upload preset is "Unsigned"
- Ensure file size under 10MB

**Product Save Fails:**
- Update Firebase security rules
- Check Firebase credentials
- Verify Firestore database is created

**Payment Issues:**
- Verify Razorpay keys (test/live)
- Check NEXT_PUBLIC_RAZORPAY_KEY_ID is set
- Test with Razorpay test cards

**Email Not Sending:**
- Use Gmail App Password (not regular password)
- Enable 2FA on Gmail account
- Check EMAIL_USER, EMAIL_PASS, EMAIL_FROM

---

## 📞 Support

### Testing Pages:
- `/test-email` - Test email configuration
- `/admin` - Admin panel login

### Useful Commands:
```bash
npm run dev              # Start development
npm run build            # Test production build
npm run daily-excel      # Generate order book
npm run setup-admin      # Setup admin credentials
```

---

## 📄 License

Private - Nurvi Jewels © 2025

---

## 🎯 Quick Links

- **Live Site:** https://nurvijewel.vercel.app
- **Admin Panel:** https://nurvijewel.vercel.app/admin
- **Cloudinary:** https://console.cloudinary.com
- **Firebase:** https://console.firebase.google.com
- **Vercel:** https://vercel.com/dashboard

---

## ✅ Production Checklist

Before going live:
- [ ] All environment variables set in Vercel
- [ ] Firebase security rules updated
- [ ] Cloudinary configured
- [ ] Razorpay keys (switch to live mode)
- [ ] Gmail App Password set
- [ ] Test complete order flow
- [ ] Test admin product upload
- [ ] Verify email notifications
- [ ] Check mobile responsiveness
- [ ] Custom domain configured (optional)

---

**For detailed setup guides, see:**
- `CLOUDINARY_SETUP_GUIDE.md` - Cloudinary configuration
- `ADMIN_IMAGE_UPLOAD_GUIDE.md` - Image upload instructions
- `FIREBASE_SETUP_GUIDE.md` - Firebase setup
- `EMAIL_SETUP_GUIDE.md` - Email configuration

**Built with ❤️ for Nurvi Jewels**
