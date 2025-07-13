# 📧 Email Setup Guide for Nurvi Jewels

This guide will help you set up email functionality for OTP verification in your Nurvi Jewels website.

## 🔧 Gmail Setup (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Gmail account settings
2. Navigate to "Security" 
3. Enable "2-Step Verification"

### S
1. In Gmail Security settings, find "App passwords"
2. Generate a new app password for "Mail"
3. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Add Environment Variables
Add these to your `.env.local` file:

```bash
# Email Configuration for OTP
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=your-email@gmail.com
```

## 🔧 Alternative Email Services

### Microsoft Outlook/Hotmail
```bash
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
EMAIL_FROM=your-email@outlook.com
```

### Custom SMTP (For Business Emails)
Update `app/api/send-email/route.ts` and replace the service configuration:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.your-domain.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

## 🧪 Testing Email Functionality

### Test Registration Email
1. Register a new account on your website
2. Check your email for the OTP verification
3. Enter the 6-digit code to verify

### Test Login Email  
1. Try logging in with an unverified account
2. You should receive a login verification email
3. Enter the OTP to complete login

## 📧 Email Templates

The system sends two types of emails:

### 1. Registration Welcome Email
- **Subject:** "Welcome to Nurvi Jewel - Verify Your Email"
- **Content:** Welcome message with OTP and benefits list
- **Design:** Branded HTML template with Nurvi Jewel styling

### 2. Login Verification Email
- **Subject:** "Login Verification - Nurvi Jewel" 
- **Content:** Security-focused OTP verification
- **Design:** Clean, professional template

## 🔒 Security Features

- ✅ **OTP Expiration:** All OTPs expire in 10 minutes
- ✅ **One-time Use:** OTPs are deleted after verification
- ✅ **Secure Storage:** OTPs stored with expiration timestamps
- ✅ **Email Validation:** Proper email format validation
- ✅ **Rate Limiting:** Users can resend OTP with proper delay

## 🚨 Troubleshooting

### "Missing email credentials" Error
- Ensure all environment variables are set in `.env.local`
- Restart your development server after adding variables

### "Invalid credentials" Error  
- Check your Gmail app password is correct
- Ensure 2-factor authentication is enabled
- Try generating a new app password

### Emails not being received
- Check spam/junk folder
- Verify the email address is correct
- Test with different email providers
- Check Gmail daily sending limits (500 emails/day)

### "Connection refused" Error
- Check your internet connection
- Verify SMTP settings are correct
- Some networks block SMTP ports - try different network

## 📊 Email Analytics

The system logs:
- ✅ Successful email sends with message IDs
- ❌ Failed attempts with error details  
- 📧 Email delivery status
- ⏰ OTP generation and verification times

## 🔄 Email Queue (Future Enhancement)

For production, consider:
- **Queue System:** Redis/Bull for handling email queues
- **Retry Logic:** Automatic retry for failed emails
- **Email Provider Backup:** Multiple SMTP providers
- **Analytics:** Open rates, click tracking
- **Templates:** Advanced email template system

## 🌟 Email Best Practices

1. **Professional Sender Name:** "Nurvi Jewel" appears as sender
2. **Clear Subject Lines:** Descriptive and action-oriented
3. **Mobile-Responsive:** HTML templates work on all devices  
4. **Backup Text Version:** Plain text fallback included
5. **Security Messaging:** Clear instructions and warnings
6. **Brand Consistency:** Matches website design and colors

## 🚀 Production Deployment

For production deployment:

1. **Use Professional Email:** Consider `noreply@nurvijewels.com`
2. **Email Service Provider:** Consider SendGrid, Mailgun, or Amazon SES for better deliverability
3. **Domain Authentication:** Set up SPF, DKIM, and DMARC records
4. **Monitor Bounce Rates:** Track email delivery success
5. **Compliance:** Ensure GDPR/CAN-SPAM compliance

---

## ✅ Quick Setup Checklist

- [ ] Enable Gmail 2-Factor Authentication
- [ ] Generate Gmail App Password  
- [ ] Add environment variables to `.env.local`
- [ ] Restart development server
- [ ] Test registration email
- [ ] Test login verification email
- [ ] Check email templates display correctly
- [ ] Verify OTP expiration works
- [ ] Test resend OTP functionality

Your email system is now ready for production use! 🎉 

# Test email
curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test-email@gmail.com","testType":"Setup Test"}'

# Test SMS  
curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890","testType":"Setup Test"}' 