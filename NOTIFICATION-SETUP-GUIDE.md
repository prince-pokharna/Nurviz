# 🔔 Notification Setup Guide - Nurvi Jewels

This guide will help you set up email and SMS notifications for your Nurvi Jewels website.

## 🚀 Quick Setup Summary

Your notification system is now ready! You just need to configure the credentials in your `.env.local` file.

### ✅ What's Already Implemented:
- ✅ Email OTP verification for registration/login
- ✅ Order confirmation emails with beautiful HTML templates
- ✅ Order confirmation SMS notifications
- ✅ Password reset emails
- ✅ Test notification endpoint
- ✅ Comprehensive error handling

## 📧 Email Setup (Gmail - Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings: https://myaccount.google.com
2. Navigate to "Security"
3. Enable "2-Step Verification"
4. Follow the setup process

### Step 2: Generate App Password
1. In Google Account settings, go to Security > 2-Step Verification
2. Scroll down to "App passwords"
3. Click "Select app" and choose "Mail"
4. Click "Select device" and choose "Other (custom name)"
5. Type "Nurvi Jewel Website"
6. Click "Generate"
7. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Update Environment Variables
Open your `.env.local` file and update these lines:
```env
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=your-actual-email@gmail.com
```

### Step 4: Test Email Configuration
```bash
# Test using the API endpoint
curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","testType":"Email Setup Test"}'
```

## 📱 SMS Setup (Twilio)

### Step 1: Create Twilio Account
1. Sign up at https://www.twilio.com/try-twilio
2. Complete phone number verification
3. Get free trial credits ($15 USD)

### Step 2: Get Credentials
1. Go to Twilio Console: https://console.twilio.com/
2. Find your Account SID and Auth Token on the dashboard
3. Go to Phone Numbers > Manage > Active numbers
4. Copy your Twilio phone number

### Step 3: Update Environment Variables
Open your `.env.local` file and update these lines:
```env
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 4: Test SMS Configuration
```bash
# Test using the API endpoint
curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890","testType":"SMS Setup Test"}'
```

## 🧪 Testing Your Setup

### Method 1: Using the Test API
```bash
# Test both email and SMS
curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","phone":"+1234567890","testType":"Full Test"}'
```

### Method 2: Test Registration Flow
1. Go to your website's registration page
2. Register a new account
3. Check your email for the OTP verification
4. Enter the OTP to complete registration

### Method 3: Test Order Flow
1. Add items to cart
2. Proceed to checkout
3. Complete payment
4. Check your email and SMS for order confirmation

## 🎯 Expected Notifications

### 📧 Email Notifications:
1. **Registration OTP**: Welcome email with verification code
2. **Login OTP**: Security verification for unverified accounts
3. **Order Confirmation**: Detailed order summary with tracking link
4. **Password Reset**: Secure reset link with expiration

### 📱 SMS Notifications:
1. **Order Confirmation**: Order details and tracking information
2. **OTP Verification**: Login verification codes (if implemented)

## 🔧 Troubleshooting

### Email Issues:

#### "Missing email credentials" Error
- Ensure all environment variables are set in `.env.local`
- Restart your development server after making changes
- Check that variable names match exactly

#### "Invalid credentials" Error
- Verify your Gmail app password is correct
- Ensure 2-factor authentication is enabled
- Try generating a new app password

#### Emails not being received
- Check spam/junk folder
- Verify the email address is correct
- Test with different email providers
- Check Gmail daily sending limits (500 emails/day)

### SMS Issues:

#### "Missing SMS credentials" Error
- Ensure Twilio credentials are set in `.env.local`
- Verify Account SID and Auth Token are correct

#### "Phone number not verified" Error
- In Twilio trial mode, you can only send SMS to verified numbers
- Add phone numbers to your Twilio verified list
- Upgrade to paid plan for unrestricted sending

#### SMS not being received
- Check if the phone number format is correct (+1234567890)
- Verify the number is verified in Twilio console
- Check Twilio logs for delivery status

## 🎨 Customization

### Email Templates
Email templates are defined in:
- `app/api/send-email/route.ts` - OTP emails
- `app/api/orders/save/route.ts` - Order confirmation emails
- `app/api/auth/forgot-password/route.ts` - Password reset emails

### SMS Templates
SMS templates are defined in:
- `app/api/orders/save/route.ts` - Order confirmation SMS
- `lib/twilio.ts` - SMS utility functions

## 📊 Monitoring

### Email Logs
Check your server logs for:
- ✅ Email sent successfully: [messageId]
- ❌ Email sending failed: [error details]

### SMS Logs
Check your server logs for:
- ✅ SMS sent successfully: [messageId]
- ❌ SMS sending failed: [error details]

### Twilio Console
Monitor SMS delivery in Twilio Console:
- Go to Monitor > Logs > Messaging
- Check delivery status and error codes

## 🌟 Advanced Features

### Email Analytics
- Message IDs for tracking
- Bounce and complaint handling
- Open rate tracking (future enhancement)

### SMS Analytics
- Delivery receipts
- Error code handling
- International SMS support

### Notification Queue (Future Enhancement)
Consider implementing:
- Redis-based queue for high volume
- Retry logic for failed notifications
- Rate limiting for API calls

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env.local` to version control
2. **API Keys**: Rotate credentials regularly
3. **Rate Limiting**: Implement notification rate limiting
4. **Email Validation**: Validate email addresses before sending
5. **Phone Validation**: Validate phone numbers before sending SMS

## 📞 Support

If you encounter issues:
1. Check the server logs for error messages
2. Use the test endpoint to verify configuration
3. Verify credentials in their respective consoles
4. Check spam/junk folders for emails
5. Verify phone numbers in Twilio console

---

## ✅ Quick Verification Checklist

- [ ] Gmail 2-Factor Authentication enabled
- [ ] Gmail App Password generated
- [ ] Email credentials added to `.env.local`
- [ ] Twilio account created
- [ ] Twilio credentials added to `.env.local`
- [ ] Development server restarted
- [ ] Test email sent and received
- [ ] Test SMS sent and received
- [ ] Registration OTP working
- [ ] Order confirmation emails working
- [ ] Order confirmation SMS working

**Your notification system is now ready for production! 🎉** 