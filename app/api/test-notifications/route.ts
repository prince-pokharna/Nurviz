import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  console.log('=== Testing Notification Services ===')
  
  try {
    const { email, phone, testType } = await request.json()
    
    if (!email && !phone) {
      return NextResponse.json({
        success: false,
        error: 'Email or phone number is required'
      }, { status: 400 })
    }

    const results = {
      email: null as any,
      sms: null as any,
      configuration: {
        email: {
          configured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
          user: process.env.EMAIL_USER ? '✓ Set' : '✗ Missing',
          pass: process.env.EMAIL_PASS ? '✓ Set' : '✗ Missing',
          from: process.env.EMAIL_FROM ? '✓ Set' : '✗ Missing'
        },
        sms: {
          configured: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
          accountSid: process.env.TWILIO_ACCOUNT_SID ? '✓ Set' : '✗ Missing',
          authToken: process.env.TWILIO_AUTH_TOKEN ? '✓ Set' : '✗ Missing',
          phoneNumber: process.env.TWILIO_PHONE_NUMBER ? '✓ Set' : '✗ Missing'
        }
      }
    }

    // Test Email if requested and configured
    if (email && results.configuration.email.configured) {
      try {
        console.log('Testing email configuration...')
        
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        })

        // Verify transporter
        await transporter.verify()
        console.log('✓ Email configuration verified')

        // Send test email
        const emailResult = await transporter.sendMail({
          from: `"Nurvi Jewel Test" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
          to: email,
          subject: '🧪 Test Email - Nurvi Jewel Notification System',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #d97706, #f59e0b); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1>✅ Email Test Successful!</h1>
                <p>Nurvi Jewel - Notification System</p>
              </div>
              <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px;">
                <h2>Test Results:</h2>
                <ul>
                  <li>✅ Email credentials are properly configured</li>
                  <li>✅ SMTP connection successful</li>
                  <li>✅ Email delivery working</li>
                  <li>✅ HTML formatting working</li>
                </ul>
                <p><strong>Test Type:</strong> ${testType || 'Manual Test'}</p>
                <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                <p>Your notification system is ready! 🎉</p>
              </div>
            </div>
          `
        })

        results.email = {
          success: true,
          messageId: emailResult.messageId,
          message: 'Test email sent successfully'
        }

        console.log('✅ Test email sent:', emailResult.messageId)

      } catch (error) {
        console.error('❌ Email test failed:', error)
        results.email = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    } else if (email) {
      results.email = {
        success: false,
        error: 'Email credentials not configured'
      }
    }

    // Test SMS if requested and configured
    if (phone && results.configuration.sms.configured) {
      try {
        console.log('Testing SMS configuration...')
        
        const smsMessage = `🧪 Test SMS from Nurvi Jewel!

This is a test message to verify your SMS notification system is working correctly.

✅ SMS credentials configured
✅ Message delivery successful
✅ Ready for order notifications

Test Time: ${new Date().toLocaleString()}

If you received this message, your SMS notifications are working perfectly! 🎉`

        const smsResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/twilio/send-sms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: phone,
            message: smsMessage,
          }),
        })

        const smsData = await smsResponse.json()
        results.sms = smsData

        console.log('✅ SMS test result:', smsData)

      } catch (error) {
        console.error('❌ SMS test failed:', error)
        results.sms = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    } else if (phone) {
      results.sms = {
        success: false,
        error: 'SMS credentials not configured'
      }
    }

    console.log('=== Test Results ===')
    console.log('Email:', results.email?.success ? '✅ Success' : '❌ Failed')
    console.log('SMS:', results.sms?.success ? '✅ Success' : '❌ Failed')

    return NextResponse.json({
      success: true,
      message: 'Notification test completed',
      results: results
    })

  } catch (error) {
    console.error('❌ Test failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 