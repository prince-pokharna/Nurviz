import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  console.log('=== Email API Called ===');
  
  try {
    // Log environment variables for debugging
    console.log('Environment check:');
    console.log('- EMAIL_USER:', process.env.EMAIL_USER ? '✓ Set' : '✗ Missing');
    console.log('- EMAIL_PASS:', process.env.EMAIL_PASS ? '✓ Set' : '✗ Missing');
    console.log('- EMAIL_FROM:', process.env.EMAIL_FROM ? '✓ Set' : '✗ Missing');

    const { to, subject, otp, type, name } = await request.json()
    console.log('Email Request:', { to, subject, type, nameProvided: !!name });

    // Check if all required credentials are present
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_FROM) {
      console.error('❌ Missing email credentials');
      return NextResponse.json({ 
        success: false, 
        error: "Email configuration missing",
        details: "Please check your .env.local file for email credentials"
      }, { status: 500 });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use App Password for Gmail
      },
    });

    // Verify transporter configuration
    console.log('Verifying email configuration...');
    await transporter.verify();
    console.log('✓ Email configuration verified');

    // Create email content based on type
    let htmlContent = '';
    let textContent = '';

    if (type === 'registration') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Nurvi Jewel</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px solid #f59e0b; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #d97706; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            .logo { font-size: 28px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">✨ Nurvi Jewel</div>
              <p>Welcome to Premium Anti-Tarnish Jewelry</p>
            </div>
            <div class="content">
              <h2>Welcome${name ? `, ${name}` : ''}! 🎉</h2>
              <p>Thank you for joining Nurvi Jewel, your destination for premium anti-tarnish jewelry perfect for content creators and fashion enthusiasts.</p>
              
              <p>To complete your registration, please verify your email address using the OTP below:</p>
              
              <div class="otp-box">
                <p>Your verification code is:</p>
                <div class="otp-code">${otp}</div>
                <p><small>This code will expire in 10 minutes</small></p>
              </div>
              
              <p>Once verified, you'll have access to:</p>
              <ul>
                <li>✨ Exclusive jewelry collections</li>
                <li>📱 Content creator friendly designs</li>
                <li>🛡️ Anti-tarnish guarantee</li>
                <li>🚚 Fast and secure delivery</li>
                <li>💎 Premium customer support</li>
              </ul>
              
              <p>If you didn't create this account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2024 Nurvi Jewel. All rights reserved.</p>
              <p>Premium Anti-Tarnish Jewelry for Content Creators</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      textContent = `
        Welcome to Nurvi Jewel!
        
        Thank you for joining us${name ? `, ${name}` : ''}!
        
        Your email verification code is: ${otp}
        
        This code will expire in 10 minutes.
        
        If you didn't create this account, please ignore this email.
        
        © 2024 Nurvi Jewel - Premium Anti-Tarnish Jewelry
      `;
    } else {
      // Login verification
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Login Verification - Nurvi Jewel</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px solid #f59e0b; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #d97706; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            .logo { font-size: 28px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">✨ Nurvi Jewel</div>
              <p>Secure Login Verification</p>
            </div>
            <div class="content">
              <h2>Email Verification Required 🔐</h2>
              <p>We need to verify your email address to complete your login to Nurvi Jewel.</p>
              
              <div class="otp-box">
                <p>Your verification code is:</p>
                <div class="otp-code">${otp}</div>
                <p><small>This code will expire in 10 minutes</small></p>
              </div>
              
              <p>Enter this code on the verification page to access your account.</p>
              
              <p><strong>Security Note:</strong> If you didn't try to log in, please ignore this email and ensure your account is secure.</p>
            </div>
            <div class="footer">
              <p>© 2024 Nurvi Jewel. All rights reserved.</p>
              <p>This is an automated security email.</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      textContent = `
        Nurvi Jewel - Login Verification
        
        Your email verification code is: ${otp}
        
        This code will expire in 10 minutes.
        
        If you didn't try to log in, please ignore this email.
        
        © 2024 Nurvi Jewel
      `;
    }

    console.log('Sending email...');

    const mailOptions = {
      from: `"Nurvi Jewel" <${process.env.EMAIL_FROM}>`,
      to: to,
      subject: subject || (type === 'registration' ? 'Welcome to Nurvi Jewel - Verify Your Email' : 'Login Verification - Nurvi Jewel'),
      text: textContent,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent successfully:', {
      messageId: info.messageId,
      to: to,
      subject: mailOptions.subject
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    });
    
  } catch (error) {
    console.error("❌ Error sending email:", error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json({ 
      success: false, 
      error: "Failed to send email",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 