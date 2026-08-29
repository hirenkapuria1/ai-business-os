import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRazorpaySignature, fetchRazorpayPayment } from '@/lib/razorpay'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      await request.json()

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      )
    }

    // Verify Razorpay signature
    const isSignatureValid = await verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    )

    if (!isSignatureValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 401 }
      )
    }

    // Fetch payment details from Razorpay
    const payment = await fetchRazorpayPayment(razorpayPaymentId)

    if (payment.status !== 'captured') {
      return NextResponse.json(
        { error: 'Payment not captured' },
        { status: 400 }
      )
    }

    // Find order by ID
    const order = await prisma.order.findUnique({
      where: { id: razorpayOrderId },
      include: {
        user: {
          select: { email: true, name: true },
        },
        items: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PAID',
      },
    })

    // Create payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        stripePaymentId: razorpayPaymentId,
        amount: new Decimal(order.totalAmount),
        status: 'SUCCEEDED',
        receipt: payment.receipt,
      },
    })

    // Update customer total spent
    await prisma.customer.update({
      where: { id: order.customerId },
      data: {
        totalSpent: {
          increment: new Decimal(order.totalAmount),
        },
      },
    })

    // Record analytics
    await prisma.websiteAnalytics.upsert({
      where: {
        date_trafficSource: {
          date: new Date(),
          trafficSource: 'purchase',
        },
      },
      update: {
        purchases: { increment: 1 },
        revenue: { increment: new Decimal(order.totalAmount) },
      },
      create: {
        date: new Date(),
        trafficSource: 'purchase',
        purchases: 1,
        revenue: new Decimal(order.totalAmount),
      },
    })

    // Send confirmation email
    await sendOrderConfirmationEmail(order.user.email, order)

    return NextResponse.json(
      {
        message: 'Payment successful',
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: 'PAID',
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
