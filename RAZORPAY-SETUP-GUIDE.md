# 🔥 **RAZORPAY SETUP GUIDE - Activated Account**

Congratulations! Your Razorpay account is now activated. Here's how to complete the integration:

## 🔑 **Step 1: Get Your Razorpay API Keys**

1. **Login to Razorpay Dashboard:**
   - Go to: https://dashboard.razorpay.com/
   - Login with your activated account

2. **Navigate to API Keys:**
   - Click on "Settings" in the left sidebar
   - Click on "API Keys"
   - Click "Generate Test Keys" (for testing) or "Generate Live Keys" (for production)

3. **Copy Your Keys:**
   ```
   Key ID: rzp_test_XXXXXXXXXXXXXXXXXX  (Public key)
   Key Secret: XXXXXXXXXXXXXXXXXXXXXXXX  (Private key - keep secret!)
   ```

## 🔧 **Step 2: Update Environment Variables**

1. **Open your `.env.local` file** in your project root
2. **Replace the placeholder values:**

```env
# Replace these with your actual Razorpay keys:
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_SECRET_KEY

# Other settings (keep as-is):
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
NODE_ENV=development
```

## 🧪 **Step 3: Test the Integration**

### **Test Mode (Safe Testing):**
1. Keep `rzp_test_` keys for testing
2. Use test cards (no real money charged):
   - **Card Number:** 4111 1111 1111 1111
   - **CVV:** 123
   - **Expiry:** 12/25
   - **Name:** Any name

### **Test Flow:**
1. Go to your website
2. Add products to cart  
3. Go to checkout
4. Fill customer details
5. Click "Pay ₹X" button
6. Use test card details
7. Complete payment
8. Check order confirmation

## 🚀 **Step 4: Go Live (Production)**

### **When Ready for Real Customers:**
1. **Activate your Razorpay account fully** (if not already done)
2. **Get Live API Keys:**
   - Go to Dashboard → Settings → API Keys
   - Generate Live Keys (`rzp_live_` prefix)
3. **Update `.env.local`:**
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
   RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET_KEY
   NODE_ENV=production
   ```

## 🔒 **Security Checklist**

- ✅ **Never share your secret key**
- ✅ **Use HTTPS in production**
- ✅ **Keep `.env.local` out of git** (already in .gitignore)
- ✅ **Test thoroughly before going live**

## 💰 **Razorpay Fees (Reference)**

- **Domestic Cards:** 2% + GST
- **UPI:** 2% + GST  
- **Net Banking:** 2% + GST
- **Wallets:** 2% + GST

*Check Razorpay dashboard for current rates*

## 🎯 **Features Enabled**

✅ **Automatic order saving** after successful payment  
✅ **SMS confirmations** to customers  
✅ **Admin order management** system  
✅ **Excel/CSV export** of orders  
✅ **Real-time order tracking**  
✅ **Payment verification** for security  
✅ **Error handling** and logging  

## 🔧 **Troubleshooting**

### **Payment Not Working?**
1. Check browser console for errors
2. Verify API keys are correct
3. Check server logs in terminal
4. Ensure `.env.local` file exists
5. Try with test cards first

### **Orders Not Saving?**
1. Check `/data/orders.json` file exists
2. Check server has write permissions
3. Look for errors in browser console

### **SMS Not Working?**
1. Twilio configuration in `.env.local`
2. SMS is optional - orders still save without it
3. Check Twilio logs in dashboard

## 📞 **Support**

- **Razorpay Support:** https://razorpay.com/support/
- **Documentation:** https://razorpay.com/docs/

## 🎊 **You're Ready!**

Your Nurvi Jewels website now has:
- ✅ **Professional payment gateway**
- ✅ **Complete order management** 
- ✅ **Customer notifications**
- ✅ **Admin dashboard**
- ✅ **Business reporting**

**Start accepting real orders from customers!** 💎 