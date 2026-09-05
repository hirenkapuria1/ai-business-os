import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export { razorpay }

export async function createRazorpayOrder(amount: number, orderId: string) {
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: orderId,
      payment_capture: true, // Auto capture payment
    })

    return order
  } catch (error) {
    console.error('Razorpay order creation error:', error)
    throw error
  }
}

export async function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
) {
  try {
    const crypto = require('crypto')
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    hmac.update(`${orderId}|${paymentId}`)
    const generated_signature = hmac.digest('hex')

    return generated_signature === signature
  } catch (error) {
    console.error('Razorpay signature verification error:', error)
    return false
  }
}

export async function fetchRazorpayPayment(paymentId: string) {
  try {
    const payment = await razorpay.payments.fetch(paymentId)
    return payment
  } catch (error) {
    console.error('Razorpay fetch payment error:', error)
    throw error
  }
}
