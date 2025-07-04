# 🚀 Vercel Deployment & Inventory Management Guide

## 📋 **Pre-Deployment Setup**

### 1. **Environment Variables Setup**
Before deploying to Vercel, make sure you have these environment variables configured:

**Required Variables:**
```bash
# Database (Use PostgreSQL for production)
DATABASE_URL=your_postgresql_connection_string

# Authentication
NEXTAUTH_SECRET=your_secret_key_here
ADMIN_SECRET_KEY=your_admin_secret_key

# Email Configuration
EMAIL_USER=jewel.nurvi@gmail.com
EMAIL_PASSWORD=your_app_password

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+18787866476

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Client-side Variables
NEXT_PUBLIC_ADMIN_SECRET_KEY=your_admin_secret_key
```

### 2. **Database Migration (PostgreSQL Recommended)**
For production deployment, migrate from SQLite to PostgreSQL:

```bash
# Install PostgreSQL adapter
npm install pg @types/pg

# Update your database configuration in lib/database.js
# Replace SQLite with PostgreSQL connection
```

---

## 🚀 **Deployment to Vercel**

### 1. **Connect to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 2. **Set Environment Variables in Vercel**
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all the environment variables listed above

### 3. **Configure Build Settings**
In your Vercel project settings:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node.js Version**: `18.x`

---

## 📦 **Stock Management After Deployment**

### **Method 1: Web-Based Admin Interface (Recommended)**

After deployment, you can manage inventory through your website:

1. **Access Admin Panel**:
   ```
   https://your-domain.vercel.app/admin
   ```

2. **Login Credentials**:
   - Email: `admin@nurvijewel.com`
   - Password: `admin123`

3. **Upload Excel File**:
   - Go to Admin Dashboard → Inventory Tab
   - Click "Go to Inventory Sync"
   - Upload your `Stock-Management-Inventory.xlsx`
   - Click "Sync Inventory"

### **Method 2: API Integration**

You can also update inventory programmatically:

```javascript
// Update inventory via API
const updateInventory = async (excelFile) => {
  const formData = new FormData()
  formData.append('excel-file', excelFile)
  
  const response = await fetch('/api/admin/sync-inventory', {
    method: 'POST',
    headers: {
      'x-admin-auth': 'your_admin_secret_key'
    },
    body: formData
  })
  
  return response.json()
}
```

---

## 📊 **Stock Update Workflow**

### **Step-by-Step Process:**

1. **Edit Excel File**: Update `Stock-Management-Inventory.xlsx`
   - Stock Quantity
   - Prices
   - Product Details
   - Availability Status

2. **Access Admin Panel**:
   ```
   https://your-domain.vercel.app/admin/inventory-sync
   ```

3. **Upload & Sync**:
   - Drop Excel file or click to browse
   - Review validation results
   - Confirm sync operation

4. **Verify Changes**:
   - Check your website for updated products
   - Verify stock levels and prices

---

## 🔧 **Advanced Features**

### **Automated Stock Updates**
For automated inventory management, you can:

1. **Use Webhooks**: Set up webhooks to trigger inventory updates
2. **Schedule Updates**: Use Vercel cron jobs for periodic syncs
3. **API Integration**: Connect with your inventory management system

### **Backup & Recovery**
- Automatic backups are created before each sync
- Download backups from admin panel
- Restore previous inventory state if needed

---

## 🛠 **Troubleshooting**

### **Common Issues:**

1. **File Upload Fails**:
   - Check file format (.xlsx only)
   - Verify admin authentication
   - Ensure correct column headers

2. **Sync Errors**:
   - Review error messages in sync results
   - Check data format in Excel file
   - Verify required fields are populated

3. **Changes Not Reflecting**:
   - Clear browser cache
   - Check Vercel deployment logs
   - Verify database connection

### **Support:**
- Check sync logs in admin panel
- Download error reports
- Contact support with specific error messages

---

## 📱 **Mobile Management**

The admin interface is fully responsive and works on mobile devices:
- Upload files from mobile browser
- Review sync results on phone/tablet
- Manage inventory on the go

---

## 🔒 **Security Features**

- **Secure Authentication**: Admin panel requires login
- **File Validation**: Only Excel files accepted
- **Data Encryption**: All data transmitted securely
- **Access Control**: Role-based permissions

---

## 🎯 **Best Practices**

1. **Regular Backups**: Download backups before major updates
2. **Test Updates**: Verify changes in small batches first
3. **Monitor Logs**: Check sync logs for any issues
4. **Keep Records**: Maintain version history of Excel files
5. **Schedule Updates**: Update inventory during low-traffic hours

---

## 📞 **Need Help?**

If you encounter any issues:
1. Check the troubleshooting section above
2. Review sync logs in admin panel
3. Verify all environment variables are set
4. Contact support with specific error messages

Your Nurvi Jewel website is now ready for production with full inventory management capabilities! 🎉 