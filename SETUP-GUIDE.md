# 🚀 Nurvi Jewels E-commerce Platform Setup Guide

## Overview
This guide will help you set up the complete Nurvi Jewels e-commerce platform with Excel-based inventory management, authentication, payment integration, and notification systems.

## Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager
- Git
- Gmail account (for email notifications)
- Razorpay account (for payments)
- Twilio account (optional, for SMS)

## 🔧 Quick Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd nurvi-jewels

# Install dependencies
npm install

# OR use pnpm
pnpm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Nurvi Jewel"

# 🔐 Email Configuration (REQUIRED)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@nurvijewel.com

# 💳 Payment Gateway (REQUIRED)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id

# 🔒 Security (REQUIRED)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# 📱 SMS Configuration (OPTIONAL)
TWILIO_SID=your-twilio-account-sid
TWILIO_TOKEN=your-twilio-auth-token
TWILIO_PHONE=+1234567890

# 🗄️ Database
DATABASE_URL=data/nurvi_jewels.db

# 👤 Default Admin
DEFAULT_ADMIN_EMAIL=admin@nurvijewel.com
DEFAULT_ADMIN_PASSWORD=admin123
```

### 3. Database Setup

```bash
# Initialize database and create tables
npm run init-db

# This will create:
# - SQLite database at data/nurvi_jewels.db
# - All required tables
# - Default admin user
# - Sample categories
```

### 4. Excel Inventory Setup

Ensure your Excel file `Stock-Management-Inventory.xlsx` is in the root directory, then:

```bash
# Sync inventory from Excel to database
npm run sync-inventory

# OR migrate existing JSON data
npm run migrate-data
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to access the platform.

## 📧 Email Setup (Gmail)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Security > 2-Step Verification
3. Follow the setup process

### Step 2: Generate App Password
1. In Google Account settings
2. Security > 2-Step Verification > App passwords
3. Select "Mail" and generate password
4. Use this password in `EMAIL_PASS`

### Step 3: Test Email
```bash
# Test email configuration
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","subject":"Test","message":"Hello World"}'
```

## 💳 Payment Setup (Razorpay)

### Step 1: Create Razorpay Account
1. Sign up at https://razorpay.com
2. Complete business verification
3. Go to Settings > API Keys

### Step 2: Generate API Keys
1. Click "Generate Key" 
2. Copy Key ID and Key Secret
3. Add to `.env.local`

### Step 3: Test Payment
```bash
# Test payment creation
curl -X POST http://localhost:3000/api/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount":1000,"currency":"INR"}'
```

## 📱 SMS Setup (Twilio - Optional)

### Step 1: Create Twilio Account
1. Sign up at https://twilio.com
2. Get Account SID and Auth Token from Console
3. Purchase a phone number

### Step 2: Configure Environment
```env
TWILIO_SID=your-account-sid
TWILIO_TOKEN=your-auth-token
TWILIO_PHONE=+1234567890
```

### Step 3: Test SMS
```bash
# Test SMS sending
curl -X POST http://localhost:3000/api/twilio/send-sms \
  -H "Content-Type: application/json" \
  -d '{"to":"+1234567890","message":"Test SMS"}'
```

## 🗂️ Excel Inventory Management

### Excel File Structure
Your Excel file should have these columns:
- Product_ID
- Product_Name
- Category
- Website_Section
- Price
- Original_Price
- Main_Image
- Description
- Material
- In_Stock
- Is_New
- Is_Sale
- And 30+ more fields...

### Sync Process
```bash
# Full sync from Excel to database
npm run sync-inventory

# View sync logs
npm run sync-inventory --verbose

# Reset database and resync
npm run reset-db
```

## 🔐 Authentication System

### Features
- Email OTP verification
- Password reset via email
- JWT-based sessions
- Admin role management

### Default Admin Login
- Email: `admin@nurvijewel.com`
- Password: `admin123`

**⚠️ IMPORTANT:** Change the admin password after first login!

## 📊 Admin Dashboard

Access the admin dashboard at `/admin` with admin credentials.

### Features
- Product management
- Order tracking
- Customer management
- Inventory sync
- System monitoring

## 🛒 Order Management

### Order Flow
1. Customer places order
2. Payment processed via Razorpay
3. Order confirmation email sent
4. SMS notification sent (if configured)
5. Order status updates
6. Delivery tracking

### Order Status Updates
```bash
# Update order status
curl -X POST http://localhost:3000/api/orders/update-status \
  -H "Content-Type: application/json" \
  -d '{"orderId":"ORDER123","status":"shipped"}'
```

## 📱 Notification System

### Email Notifications
- Order confirmations
- Order status updates
- OTP verification
- Password reset

### SMS Notifications
- Order confirmations
- OTP verification
- Delivery updates

## 🔍 Testing

### Run Tests
```bash
# Test database connection
npm run test-db

# Test email service
npm run test-email

# Test payment integration
npm run test-payment

# Test full system
npm run test-all
```

### Manual Testing Checklist
- [ ] User registration with OTP
- [ ] Login/logout functionality
- [ ] Password reset flow
- [ ] Product browsing
- [ ] Add to cart
- [ ] Checkout process
- [ ] Payment integration
- [ ] Order confirmation
- [ ] Admin dashboard access
- [ ] Excel inventory sync

## 🚀 Production Deployment

### Environment Variables
```env
# Production settings
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production
JWT_SECRET=super-strong-production-secret

# Database (consider PostgreSQL for production)
DATABASE_URL=postgresql://username:password@host:5432/database

# SSL Configuration
SSL_CERT_PATH=/path/to/cert.pem
SSL_KEY_PATH=/path/to/key.pem
```

### Deployment Steps
1. Set up production server
2. Configure environment variables
3. Set up SSL certificates
4. Configure database backups
5. Set up monitoring
6. Deploy application

### Database Migration
```bash
# For production database
npm run migrate-production

# Backup existing data
npm run backup-db

# Restore from backup
npm run restore-db backup-file.sql
```

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Error
```bash
# Check database file permissions
ls -la data/nurvi_jewels.db

# Recreate database
npm run reset-db
```

#### Email Not Sending
- Check Gmail app password
- Verify 2FA is enabled
- Check firewall settings
- Test SMTP connection

#### Excel Sync Issues
- Ensure Excel file exists
- Check column names match mapping
- Verify file permissions
- Check for special characters

#### Payment Failures
- Verify Razorpay API keys
- Check webhook URLs
- Review payment logs
- Test with Razorpay dashboard

### Debug Mode
```bash
# Enable debug logging
DEBUG=true npm run dev

# Check logs
tail -f logs/application.log
```

### Support
For issues and support:
- Check troubleshooting section
- Review error logs
- Test individual components
- Contact support team

## 📈 Performance Optimization

### Database Indexing
```sql
-- Add indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

### Caching
```bash
# Enable Redis caching (optional)
npm install redis
```

### Image Optimization
```bash
# Optimize product images
npm run optimize-images

# Generate thumbnails
npm run generate-thumbnails
```

## 🔄 Backup & Recovery

### Database Backup
```bash
# Create backup
npm run backup-db

# Scheduled backup
npm run schedule-backup
```

### File Backup
```bash
# Backup uploads and data
npm run backup-files

# Restore from backup
npm run restore-files backup-date
```

## 🎯 Next Steps

After successful setup:
1. Customize branding and colors
2. Add product images
3. Configure shipping rates
4. Set up analytics
5. Add social media integration
6. Configure SEO settings
7. Set up monitoring
8. Plan marketing campaigns

## 📚 Documentation

- [API Documentation](./API-DOCS.md)
- [Database Schema](./DATABASE-SCHEMA.md)
- [Excel Template Guide](./EXCEL-TEMPLATE.md)
- [Deployment Guide](./DEPLOYMENT-GUIDE.md)

---

🎉 **Congratulations!** Your Nurvi Jewels e-commerce platform is now ready to use! 