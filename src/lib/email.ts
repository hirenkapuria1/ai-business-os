import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmationEmail(
  email: string,
  order: any
) {
  try {
    await resend.emails.send({
      from: 'orders@ai-business-os.com',
      to: email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <h1>Thank you for your purchase!</h1>
        <p>Your order <strong>${order.orderNumber}</strong> has been confirmed.</p>
        <p><strong>Order Total:</strong> ₹${order.totalAmount}</p>
        <p>Your download links will be available in your account dashboard.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders">View Order</a></p>
      `,
    })
  } catch (error) {
    console.error('Send order confirmation email error:', error)
  }
}

export async function sendWelcomeEmail(email: string, name?: string) {
  try {
    await resend.emails.send({
      from: 'welcome@ai-business-os.com',
      to: email,
      subject: 'Welcome to AI Business OS',
      html: `
        <h1>Welcome, ${name || 'there'}!</h1>
        <p>Thank you for joining AI Business OS.</p>
        <p>Explore our collection of digital products and tools to boost your productivity.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/products">Browse Products</a></p>
      `,
    })
  } catch (error) {
    console.error('Send welcome email error:', error)
  }
}

export async function sendLeadMagnetEmail(
  email: string,
  leadMagnetUrl: string,
  leadMagnetName: string
) {
  try {
    await resend.emails.send({
      from: 'resources@ai-business-os.com',
      to: email,
      subject: `Your Free Resource: ${leadMagnetName}`,
      html: `
        <h1>Your Free Resource</h1>
        <p>Thank you for signing up! Here's your free resource:</p>
        <p><strong>${leadMagnetName}</strong></p>
        <p><a href="${leadMagnetUrl}">Download Now</a></p>
        <p>We've also added you to our newsletter. You'll receive valuable updates and offers.</p>
      `,
    })
  } catch (error) {
    console.error('Send lead magnet email error:', error)
  }
}

export async function sendMarketingEmail(
  emails: string[],
  subject: string,
  html: string
) {
  try {
    const results = await Promise.all(
      emails.map((email) =>
        resend.emails.send({
          from: 'marketing@ai-business-os.com',
          to: email,
          subject,
          html,
        })
      )
    )
    return results
  } catch (error) {
    console.error('Send marketing email error:', error)
    throw error
  }
}

export async function sendSupportReplyEmail(
  email: string,
  ticketNumber: string,
  response: string
) {
  try {
    await resend.emails.send({
      from: 'support@ai-business-os.com',
      to: email,
      subject: `Support Reply - Ticket ${ticketNumber}`,
      html: `
        <h1>Support Response</h1>
        <p>Thank you for contacting us. Here's our response to your ticket <strong>${ticketNumber}</strong>:</p>
        <div>${response}</div>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/support/${ticketNumber}">View Ticket</a></p>
      `,
    })
  } catch (error) {
    console.error('Send support reply email error:', error)
  }
}
