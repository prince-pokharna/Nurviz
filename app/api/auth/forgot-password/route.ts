import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  console.log('=== Forgot Password API Called ===')
  
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    console.log('Password reset requested for:', email)

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour expiry

    // Store reset token in localStorage (for demo purposes - in production use a proper database)
    const tokenData = {
      email,
      token: resetToken,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString()
    }

    // Send reset email
    const emailSent = await sendPasswordResetEmail(email, resetToken)
    
    if (!emailSent) {
      return NextResponse.json(
        { success: false, error: 'Failed to send reset email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'If an account with this email exists, you will receive a password reset link.',
      tokenData // Include for demo purposes - remove in production
    })

  } catch (error) {
    console.error('❌ Forgot password error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Email credentials not configured')
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

    // Create reset link
    const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`

    // Email template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset - Nurvi Jewel</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d97706, #f59e0b); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #d97706; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          .warning { background: #fef3cd; border: 1px solid #facc15; color: #92400e; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
            <p>Nurvi Jewel - Where Elegance Meets Excellence</p>
          </div>
          <div class="content">
            <h2>Hello there!</h2>
            <p>We received a request to reset your password for your Nurvi Jewel account.</p>
            
            <p>Click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 5px;">
              ${resetLink}
            </p>
            
            <div class="warning">
              <strong>⚠️ Important:</strong>
              <ul>
                <li>This link will expire in 1 hour</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Your password won't be changed until you click the link above</li>
              </ul>
            </div>
            
            <p>If you're having trouble with the button above, copy and paste the URL into your web browser.</p>
            
            <p>Best regards,<br>The Nurvi Jewel Team</p>
          </div>
          <div class="footer">
            <p>This email was sent to ${email}</p>
            <p>© 2024 Nurvi Jewel. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send email
    const result = await transporter.sendMail({
      from: `"Nurvi Jewel" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Password Reset Request - Nurvi Jewel',
      html: htmlTemplate,
    })

    console.log('✅ Password reset email sent:', result.messageId)
    return true

  } catch (error) {
    console.error('❌ Error sending password reset email:', error)
    return false
  }
} 