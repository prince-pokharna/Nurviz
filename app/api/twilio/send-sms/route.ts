import { type NextRequest, NextResponse } from "next/server"
import twilio from "twilio"

export async function POST(request: NextRequest) {
  console.log('=== SMS API Called ===');
  
  try {
    // Log environment variables for debugging
    console.log('Environment check:');
    console.log('- TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? '✓ Set' : '✗ Missing');
    console.log('- TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '✓ Set' : '✗ Missing');
    console.log('- TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER ? '✓ Set' : '✗ Missing');

    const { to, message } = await request.json()
    console.log('SMS Request:', { to, messageLength: message?.length });

    // Check if all required credentials are present
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.error('❌ Missing Twilio credentials');
      return NextResponse.json({ 
        success: false, 
        error: "Twilio configuration missing",
        details: "Please check your .env.local file for Twilio credentials"
      }, { status: 500 });
    }

    // Initialize Twilio client
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );

    console.log('Creating SMS message...');

    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    console.log('✅ SMS sent successfully:', {
      messageId: sms.sid,
      status: sms.status,
      to: to
    });

    return NextResponse.json({
      success: true,
      messageId: sms.sid,
      status: sms.status,
    });
    
  } catch (error) {
    console.error("❌ Error sending SMS:", error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json({ 
      success: false, 
      error: "Failed to send SMS",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
