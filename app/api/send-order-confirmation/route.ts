import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const {
      to,
      customerName,
      orderId,
      totalAmount,
      items,
      shippingAddress,
      estimatedDelivery,
      orderDate
    } = await request.json();

    console.log('📧 Sending order confirmation email to:', to);

    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ Email not configured - skipping');
      return NextResponse.json({
        success: false,
        error: 'Email service not configured'
      }, { status: 500 });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Generate items HTML
    const itemsHtml = items.map((item: any) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <strong>${item.name}</strong>
        </td>
        <td style="padding: 12px; text-align: center; border-bottom: 1px solid #e5e7eb;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">₹${item.price.toLocaleString()}</td>
        <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; font-weight: bold;">₹${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Nurvi Jewel</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">✨ Nurvi Jewel</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Order Confirmation</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hello ${customerName}! 🎉</h2>
            <p style="color: #4b5563; line-height: 1.6; margin: 0 0 25px 0;">
              Thank you for your order at Nurvi Jewel! Your order has been successfully confirmed and is being processed.
            </p>

            <!-- Order Summary Box -->
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px;">Order #${orderId}</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 5px 0; color: #78350f;"><strong>Order Date:</strong></td>
                  <td style="padding: 5px 0; text-align: right; color: #78350f;">${orderDate}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #78350f;"><strong>Total Amount:</strong></td>
                  <td style="padding: 5px 0; text-align: right; color: #92400e; font-size: 20px; font-weight: bold;">₹${totalAmount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #78350f;"><strong>Expected Delivery:</strong></td>
                  <td style="padding: 5px 0; text-align: right; color: #78350f;">${estimatedDelivery}</td>
                </tr>
              </table>
            </div>

            <!-- Items Table -->
            <h3 style="color: #1f2937; margin: 30px 0 15px 0;">Items Ordered:</h3>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="padding: 12px; text-align: left; color: #374151; font-weight: 600;">Product</th>
                  <th style="padding: 12px; text-align: center; color: #374151; font-weight: 600;">Qty</th>
                  <th style="padding: 12px; text-align: right; color: #374151; font-weight: 600;">Price</th>
                  <th style="padding: 12px; text-align: right; color: #374151; font-weight: 600;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Shipping Address -->
            <h3 style="color: #1f2937; margin: 30px 0 15px 0;">Shipping Address:</h3>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #4b5563; line-height: 1.6;">
                ${shippingAddress.address || 'N/A'}<br>
                ${shippingAddress.city || 'N/A'}, ${shippingAddress.state || 'N/A'}<br>
                PIN: ${shippingAddress.pincode || 'N/A'}
              </p>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 35px 0;">
              <a href="https://nurvijewel.vercel.app/contact" 
                 style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; text-decoration: none; padding: 15px 35px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                📞 Contact Support
              </a>
            </div>

            <!-- Important Info -->
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="margin: 0 0 10px 0; color: #1e40af; font-weight: 600;">📦 What's Next?</p>
              <ul style="margin: 0; padding-left: 20px; color: #1e3a8a;">
                <li style="margin: 8px 0;">Your order will be processed within 1-2 business days</li>
                <li style="margin: 8px 0;">You'll receive shipping confirmation once dispatched</li>
                <li style="margin: 8px 0;">Expected delivery: 5-9 business days</li>
                <li style="margin: 8px 0;">Track your order anytime by contacting support</li>
              </ul>
            </div>

            <!-- Cancellation Policy -->
            <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 25px 0;">
              <p style="margin: 0; color: #991b1b; font-size: 14px;">
                <strong>⏰ Cancellation Policy:</strong> Orders can be cancelled within 48 hours (2 days) of placement. Contact support immediately if you need to cancel.
              </p>
            </div>

            <p style="color: #6b7280; line-height: 1.6; margin: 25px 0 0 0;">
              If you have any questions about your order, please don't hesitate to contact our support team.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
              © 2025 Nurvi Jewel. All rights reserved.
            </p>
            <p style="margin: 0; color: #9ca3af; font-size: 13px;">
              Premium Anti-Tarnish Jewelry | Made with Love ❤️
            </p>
            <div style="margin-top: 15px;">
              <p style="margin: 0; color: #6b7280; font-size: 13px;">
                📧 support@nurvijewel.com | 📞 +91 98765 43210
              </p>
            </div>
          </div>

        </div>
      </body>
      </html>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"Nurvi Jewel" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: to,
      subject: `🛍️ Order Confirmation #${orderId} - Nurvi Jewel`,
      html: htmlContent,
    });

    console.log('✅ Order confirmation email sent:', info.messageId);

    return NextResponse.json({
      success: true,
      messageId: info.messageId
    });

  } catch (error) {
    console.error('❌ Error sending order confirmation:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

