# 🔧 Environment Setup Guide - Nurvi Jewels

## Quick Start

1. **Copy the environment template:**
```bash
# Create your local environment file
# Copy all variables from the template below
```

2. **Required Environment Variables:**

```env
# ======================
# ADMIN CREDENTIALS
# ======================
ADMIN_EMAIL=admin@nurvijewel.com
ADMIN_PASSWORD_HASH=$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# ======================
# PAYMENT - RAZORPAY
# ======================
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx

# ======================
# EMAIL SERVICE
# ======================
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password
EMAIL_FROM=noreply@nurvijewel.com

# ======================
# SMS - TWILIO (Optional)
# ======================
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# ======================
# APPLICATION
# ======================
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

## 📋 Detailed Setup Instructions

### 1. Admin Credentials Setup

**Generate Admin Password Hash:**

```javascript
// Run this in Node.js console or create a script
const bcrypt = require('bcryptjs');
const password = 'your-secure-password';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

Or use our setup script:
```bash
npm run setup-admin
```

### 2. Payment Gateway (Razorpay)

**Steps:**
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to: Settings → API Keys
3. Generate Test/Live keys
4. Add to `.env.local`:
   - `RAZORPAY_KEY_ID` - Your Key ID (starts with rzp_test_ or rzp_live_)
   - `RAZORPAY_KEY_SECRET` - Your Key Secret
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Same as RAZORPAY_KEY_ID

**Testing:**
- Test mode works without real payments
- Use Razorpay test cards for testing

### 3. Email Service (Gmail)

**Option A: Gmail with App Password (Recommended)**

1. Enable 2-Factor Authentication on your Google Account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new App Password for "Mail"
4. Use the 16-character password in `EMAIL_PASS`

```env
EMAIL_USER=yourname@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop  # Remove spaces
EMAIL_FROM=noreply@nurvijewel.com
```

**Option B: Custom SMTP**

```env
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email
EMAIL_PASS=your-password
```

### 4. SMS Service (Twilio) - Optional

**Steps:**
1. Sign up at [Twilio](https://www.twilio.com/try-twilio)
2. Get a phone number
3. Find credentials in Console Dashboard

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

## 🚀 Deployment to Vercel

### Environment Variables Setup

1. Go to your Vercel project
2. Navigate to: Settings → Environment Variables
3. Add all variables from your `.env.local`
4. Make sure to select the appropriate environment (Production/Preview/Development)

### Important for Vercel:

```env
# These MUST be set in Vercel
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
JWT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### After Adding Variables:

1. Redeploy your application
2. Test admin login at `/admin`
3. Test email functionality
4. Place a test order to verify payment

## 🧪 Testing Your Setup

### Test Admin Access:
```bash
# Visit: http://localhost:3000/admin
# Login with your ADMIN_EMAIL and password
```

### Test Email:
```bash
# Visit: http://localhost:3000/test-email
# Or use the auth page to trigger registration email
```

### Test Payment:
```bash
# Add products to cart
# Go to checkout
# Use Razorpay test cards:
# Card: 4111 1111 1111 1111
# CVV: Any 3 digits
# Expiry: Any future date
```

## ⚠️ Common Issues & Solutions

### Issue: Admin Login Fails
**Solution:**
- Verify `ADMIN_PASSWORD_HASH` is correctly set
- Check `JWT_SECRET` is at least 32 characters
- Clear browser cookies and try again

### Issue: Email Not Sending
**Solution:**
- Ensure 2FA is enabled on Gmail
- Use App Password, not regular password
- Check if "Less secure apps" is enabled (not recommended)
- Verify `EMAIL_PASS` has no spaces

### Issue: Payment Gateway Error
**Solution:**
- Verify both `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set
- Check if keys match (test/live mode)
- Ensure `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set for frontend

### Issue: Excel Order Book Not Generating
**Solution:**
```bash
# Manually trigger generation
npm run daily-excel

# Check if orders exist in data/orders.json
# Verify Book1.xlsx is created in project root
```

## 📁 File Structure

```
nurvi-jewels/
├── .env.local              # Your local environment file (DO NOT COMMIT)
├── data/
│   ├── inventory.json      # Product inventory
│   └── orders.json         # Customer orders
├── order-books/            # Generated Excel files
└── Book1.xlsx             # Master order book
```

## 🔒 Security Best Practices

1. **Never commit `.env.local` to Git**
2. Use strong, unique passwords
3. Rotate JWT_SECRET periodically
4. Use environment-specific keys (test/production)
5. Enable HTTPS in production
6. Keep dependencies updated

## 🆘 Need Help?

1. Check console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test each service individually
4. Check the API routes in `/app/api/` for detailed logging

---

**Last Updated:** October 2025
**Version:** 1.0.0

