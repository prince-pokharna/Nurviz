import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("RAZORPAY_KEY_SECRET is missing")
      return NextResponse.json({ 
        success: false, 
        error: "Payment gateway configuration error" 
      }, { status: 500 })
    }

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex")

    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      console.log("✅ Payment verified successfully:", { razorpay_payment_id, razorpay_order_id })
      // Payment is verified, you can save to database here
      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
      })
    } else {
      console.error("❌ Payment verification failed:", { 
        expected: expectedSignature, 
        received: razorpay_signature 
      })
      return NextResponse.json({ 
        success: false, 
        message: "Payment verification failed" 
      }, { status: 400 })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Payment verification failed" 
    }, { status: 500 })
  }
}
