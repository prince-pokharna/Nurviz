const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { initializeDatabase, executeQuery, closeDatabase } = require('./database');

class NotificationService {
  constructor() {
    this.emailTransporter = null;
    this.twilioClient = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize email transporter
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        this.emailTransporter = nodemailer.createTransporter({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
        console.log('✅ Email service initialized');
      }

      // Initialize Twilio client
      if (process.env.TWILIO_SID && process.env.TWILIO_TOKEN) {
        this.twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
        console.log('✅ SMS service initialized');
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Notification service initialization failed:', error);
      throw error;
    }
  }

  async sendOrderConfirmation(orderData) {
    if (!this.emailTransporter) return false;

    try {
      const emailTemplate = this.generateOrderConfirmationTemplate(orderData);
      
      const result = await this.emailTransporter.sendMail({
        from: `"Nurvi Jewel" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: orderData.customerEmail,
        subject: `🛍️ Order Confirmation #${orderData.orderId} - Nurvi Jewel`,
        html: emailTemplate,
      });

      console.log('✅ Order confirmation email sent:', result.messageId);
      return true;
    } catch (error) {
      console.error('❌ Failed to send order confirmation email:', error);
      return false;
    }
  }

  generateOrderConfirmationTemplate(orderData) {
    const itemsHtml = orderData.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
          <strong>${item.productName}</strong><br>
          <small>SKU: ${item.sku || 'N/A'}</small>
        </td>
        <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">₹${item.unitPrice}</td>
        <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">₹${item.totalPrice}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - Nurvi Jewel</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d97706, #f59e0b); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-summary { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
          .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .items-table th { background: #f3f4f6; padding: 12px; text-align: left; }
          .button { display: inline-block; background: #d97706; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛍️ Order Confirmation</h1>
            <p>Thank you for choosing Nurvi Jewel!</p>
          </div>
          <div class="content">
            <h2>Hello ${orderData.customerName},</h2>
            <p>Your order has been successfully placed!</p>
            
            <div class="order-summary">
              <h3>Order #${orderData.orderId}</h3>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> ₹${orderData.totalAmount}</p>
            </div>

            <h3>Items Ordered:</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/orders/${orderData.orderId}" class="button">Track Your Order</a>
            </div>

            <p>Thank you for choosing Nurvi Jewel!</p>
          </div>
          <div class="footer">
            <p>© 2024 Nurvi Jewel. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

const notificationService = new NotificationService();
module.exports = notificationService; 