import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  console.log('=== Email API Called ===');
  
  try {
    const { to, subject, otp, type, name } = await request.json()
    console.log('Email Request:', { to, subject, type, nameProvided: !!name });

    // Check if all required credentials are present
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_FROM) {
      console.error('❌ Missing email credentials - using development mode');
      
      // In development, simulate successful email sending
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Development mode: Simulating email send');
        console.log(`📧 Would send OTP ${otp} to ${to} for ${type}`);
        
        // Store OTP in a way that can be retrieved for testing
        const testOTPData = {
          email: to,
          otp: otp,
          type: type,
          timestamp: new Date().toISOString()
        };
        
        // In a real scenario, you'd store this in a database
        // For now, we'll just log it
        console.log('🧪 Test OTP Data:', testOTPData);
        
        return NextResponse.json({
          success: true,
          messageId: 'dev-' + Date.now(),
          message: 'Email sent successfully (development mode)',
          development: true,
          otp: otp // Include OTP in response for testing
        });
      }
      
      return NextResponse.json({ 
        success: false, 
        error: "Email configuration missing",
        details: "Please configure email credentials in .env.local file",
        setupInstructions: {
          gmail: "1. Enable 2FA on Gmail\n2. Generate App Password\n3. Set EMAIL_USER and EMAIL_PASS in .env.local",
          outlook: "1. Use your Outlook credentials\n2. Set EMAIL_USER and EMAIL_PASS in .env.local"
        }
      }, { status: 500 });
    }

    // Create transporter with flexible configuration
    let transporterConfig: any = {
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };

    // Configure based on email provider
    if (process.env.EMAIL_HOST) {
      // Custom SMTP configuration
      transporterConfig = {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      };
    } else if (process.env.EMAIL_USER?.includes('@gmail.com')) {
      // Gmail configuration
      transporterConfig.service = 'gmail';
    } else if (process.env.EMAIL_USER?.includes('@outlook.com') || process.env.EMAIL_USER?.includes('@hotmail.com')) {
      // Outlook/Hotmail configuration
      transporterConfig.service = 'hotmail';
    } else {
      // Default to Gmail
      transporterConfig.service = 'gmail';
    }

    const transporter = nodemailer.createTransport(transporterConfig);

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