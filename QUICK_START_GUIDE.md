# 🚀 Quick Start Guide - Nurvi Jewels

## Get Up and Running in 5 Minutes!

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Set Up Environment Variables
Create a `.env.local` file in the root directory:

```env
# Minimum Required for Local Development
ADMIN_EMAIL=admin@nurvijewel.com
ADMIN_PASSWORD_HASH=$2a$10$YourHashHere
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx

EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password
EMAIL_FROM=noreply@nurvijewel.com

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

### 3️⃣ Generate Admin Password
```bash
# Run this in Node.js console
const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('your-password', 10));
```

Or use our script:
```bash
npm run setup-admin
```

### 4️⃣ Start Development Server
```bash
npm run dev
```

### 5️⃣ Access the Application
- **Website:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
- **Email Test:** http://localhost:3000/test-email

---

## 📦 What's Included

### User Features:
- ✅ Browse jewelry collections
- ✅ Product filtering & search
- ✅ Shopping cart
- ✅ Secure checkout with Razorpay
- ✅ User authentication with OTP
- ✅ Order tracking
- ✅ Wishlist

### Admin Features:
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ Inventory tracking
- ✅ Customer analytics
- ✅ Excel order book generation
- ✅ Email notifications

---

## 🧪 Quick Test

### Test User Flow:
1. Visit http://localhost:3000
2. Browse collections
3. Add product to cart
4. Go to checkout
5. Use test card: `4111 1111 1111 1111`

### Test Admin Flow:
1. Visit http://localhost:3000/admin
2. Login with your credentials
3. Go to "Jewelry Manager"
4. Edit or add a product
5. Check "Order Book" section

### Test Email:
1. Visit http://localhost:3000/test-email
2. Click "Check Configuration"
3. Send test email to yourself
4. Verify OTP arrives

---

## 📋 Important Scripts

```bash
# Development
npm run dev                    # Start dev server

# Database
npm run init-db                # Initialize database
npm run sync-inventory         # Sync inventory data

# Excel Reports
npm run daily-excel            # Generate order book
npm run generate-order-book    # Same as above

# Admin Setup
npm run setup-admin            # Configure admin credentials

# Production
npm run build                  # Build for production
npm start                      # Start production server
```

---

## 🔍 Troubleshooting

### Can't Login to Admin?
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` in `.env.local`
- Clear browser cookies
- Check console for errors

### Email Not Sending?
- Visit `/test-email` to check configuration
- Ensure 2FA is enabled on Gmail
- Use App Password, not regular password

### Payment Not Working?
- Verify Razorpay keys are correct
- Check if `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set
- Use test cards in test mode

### Products Not Showing?
- Check `data/inventory.json` exists
- Run `npm run sync-inventory`
- Verify API route `/api/inventory` works

---

## 🎯 Next Steps

1. **Customize Products:** Add your jewelry items via admin panel
2. **Configure Email:** Set up Gmail App Password
3. **Test Payments:** Use Razorpay test mode
4. **Deploy:** Push to Vercel with environment variables
5. **Go Live:** Switch to live Razorpay keys

---

## 📚 More Documentation

- **Full Setup:** See `ENVIRONMENT_SETUP.md`
- **Status Report:** See `PROJECT_STATUS_REPORT.md`
- **Firebase Setup:** See `FIREBASE_SETUP_GUIDE.md`
- **Email Setup:** See `EMAIL_SETUP_GUIDE.md`

---

## 🆘 Need Help?

1. Check console logs for detailed errors
2. Verify all environment variables are set
3. Test each feature individually
4. Review API routes for debugging info

---

**Happy Coding! 💎✨**

