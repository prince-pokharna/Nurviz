import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { OrderData, calculateEstimatedDelivery } from '@/lib/order-management';
import nodemailer from 'nodemailer';
import { saveOrder } from '@/lib/database';

const ORDER_DATA_FILE = join(process.cwd(), 'data', 'orders.json');

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    const fs = require('fs');
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Read existing orders
const readOrders = (): OrderData[] => {
  ensureDataDirectory();
  if (!existsSync(ORDER_DATA_FILE)) {
    return [];
  }
  try {
    const data = readFileSync(ORDER_DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading orders file:', error);
    return [];
  }
};

// Save orders to file
const saveOrders = (orders: OrderData[]) => {
  ensureDataDirectory();
  try {
    writeFileSync(ORDER_DATA_FILE, JSON.stringify(orders, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving orders file:', error);
    throw error;
  }
};

// Send order confirmation email
async function sendOrderConfirmationEmail(orderData: OrderData): Promise<boolean> {
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ Email credentials not configured - skipping email notification')
      return false
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Generate items HTML
    const itemsHtml = orderData.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
          <strong>${item.name}</strong>
        </td>
        <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">₹${item.price.toLocaleString()}</td>
        <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">₹${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('')

    const htmlTemplate = `
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
            <h2>Hello ${orderData.customerName}!</h2>
            <p>Your order has been successfully placed and confirmed!</p>
            
            <div class="order-summary">
              <h3>Order #${orderData.orderId}</h3>
              <p><strong>Order Date:</strong> ${orderData.orderDate}</p>
              <p><strong>Total Amount:</strong> ₹${orderData.totalAmount.toLocaleString()}</p>
              <p><strong>Payment Status:</strong> ${orderData.paymentStatus}</p>
              <p><strong>Expected Delivery:</strong> ${orderData.estimatedDelivery}</p>
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

            <h3>Shipping Address:</h3>
            <p>
              ${orderData.shippingAddress.address}<br>
              ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state}<br>
              ${orderData.shippingAddress.pincode}
            </p>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/orders" class="button">Track Your Order</a>
            </div>

            <p>We'll send you another email when your order ships. Thank you for choosing Nurvi Jewel!</p>
          </div>
          <div class="footer">
            <p>© 2024 Nurvi Jewel. All rights reserved.</p>
            <p>Questions? Contact us at support@nurvijewel.com</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send email
    const result = await transporter.sendMail({
      from: `"Nurvi Jewel" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: orderData.customerEmail,
      subject: `🛍️ Order Confirmation #${orderData.orderId} - Nurvi Jewel`,
      html: htmlTemplate,
    })

    console.log('✅ Order confirmation email sent:', result.messageId)
    return true

  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error)
    return false
  }
}

// Send order confirmation SMS
async function sendOrderConfirmationSMS(orderData: OrderData): Promise<boolean> {
  try {
    // Check if SMS credentials are configured
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.warn('⚠️ SMS credentials not configured - skipping SMS notification')
      return false
    }

    const message = `Hi ${orderData.customerName}! 🎉

Your Nurvi Jewel order #${orderData.orderId} has been confirmed!

Order Details:
${orderData.items.map(item => `• ${item.name} (Qty: ${item.quantity})`).join('\n')}

Total: ₹${orderData.totalAmount.toLocaleString()}
Expected Delivery: ${orderData.estimatedDelivery}

Track your order: ${process.env.NEXT_PUBLIC_SITE_URL}/orders

Thank you for choosing Nurvi Jewel! ✨`

    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/twilio/send-sms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: orderData.customerPhone,
        message: message,
      }),
    })

    const data = await response.json()
    
    if (data.success) {
      console.log('✅ Order confirmation SMS sent:', data.messageId)
      return true
    } else {
      console.error('❌ SMS sending failed:', data.error)
      return false
    }

  } catch (error) {
    console.error('❌ Error sending order confirmation SMS:', error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    
    console.log('🔄 Saving order data...');
    
    // Use the fallback database system
    const savedOrder = await saveOrder(orderData);
    
    console.log('✅ Order saved successfully:', savedOrder.id);
    return NextResponse.json({ 
      success: true, 
      order: savedOrder 
    });
    
  } catch (error) {
    console.error('❌ Error saving order:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 