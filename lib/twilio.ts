// Twilio Integration for Order Notifications
// Replace with your actual Twilio credentials

export const TWILIO_CONFIG = {
  accountSid: process.env.TWILIO_ACCOUNT_SID || "YOUR_ACCOUNT_SID", // Replace with your actual SID
  authToken: process.env.TWILIO_AUTH_TOKEN || "YOUR_AUTH_TOKEN", // Replace with your actual token
  phoneNumber: process.env.TWILIO_PHONE_NUMBER || "+1234567890", // Replace with your Twilio number
}

export interface OrderNotification {
  customerPhone: string
  customerName: string
  orderId: string
  amount: number
  items: Array<{
    name: string
    quantity: number
  }>
}

export const sendOrderConfirmationSMS = async (notification: OrderNotification) => {
  try {
    const message = `Hi ${notification.customerName}! 🎉

Your Nurvi Jewel order #${notification.orderId} has been confirmed!

Order Details:
${notification.items.map((item) => `• ${item.name} (Qty: ${item.quantity})`).join("\n")}

Total: ₹${notification.amount.toLocaleString()}

We'll notify you once your jewelry is shipped. Thank you for choosing Nurvi Jewel! ✨

Track your order: https://nurvijewel.com/orders/${notification.orderId}`

    const response = await fetch("/api/twilio/send-sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: notification.customerPhone,
        message: message,
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error sending SMS:", error)
    throw error
  }
}

export const sendShippingNotificationSMS = async (
  customerPhone: string,
  customerName: string,
  orderId: string,
  trackingNumber: string,
) => {
  try {
    const message = `Hi ${customerName}! 📦

Great news! Your Nurvi Jewel order #${orderId} has been shipped!

Tracking Number: ${trackingNumber}

Your beautiful jewelry is on its way to you. Expected delivery: 7-10 working days.

Track your package: https://nurvijewel.com/track/${trackingNumber}

Thank you for choosing Nurvi Jewel! ✨`

    const response = await fetch("/api/twilio/send-sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: customerPhone,
        message: message,
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error sending shipping SMS:", error)
    throw error
  }
}
