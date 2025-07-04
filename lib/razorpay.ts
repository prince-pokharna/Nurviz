// Razorpay Integration
// Replace with your actual Razorpay credentials

export const RAZORPAY_CONFIG = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_ID", // Replace with your actual key
  currency: "INR",
  name: "Nurvi Jewel",
  description: "Premium Anti-Tarnish Jewelry",
  image: "/logo.png", // Add your logo
  prefill: {
    name: "",
    email: "",
    contact: "",
  },
  theme: {
    color: "#f59e0b",
  },
}

export interface RazorpayOptions {
  amount: number
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  onSuccess: (response: any) => void
  onFailure: (error: any) => void
}

export const initializeRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export const createRazorpayOrder = async (amount: number) => {
  try {
    const response = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    throw error
  }
}

export const openRazorpayCheckout = async (options: RazorpayOptions) => {
  const isRazorpayLoaded = await initializeRazorpay()

  if (!isRazorpayLoaded) {
    throw new Error("Razorpay SDK failed to load")
  }

  const razorpayOptions = {
    ...RAZORPAY_CONFIG,
    amount: options.amount * 100, // Convert to paise
    order_id: options.orderId,
    prefill: {
      name: options.customerName,
      email: options.customerEmail,
      contact: options.customerPhone,
    },
    handler: options.onSuccess,
    modal: {
      ondismiss: options.onFailure,
    },
  }

  const razorpay = new (window as any).Razorpay(razorpayOptions)
  razorpay.open()
}
