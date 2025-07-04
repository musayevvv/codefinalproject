import express from "express";
import Stripe from "stripe";
import authJwt from "../helper/jwt.js";
import { Orders } from "../models/orders.js";
import { body, validationResult } from 'express-validator';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const validateCheckoutInput = [
    body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
    body('items.*.name').trim().isLength({ min: 1, max: 255 }).escape(),
    body('items.*.price').isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('customerInfo.name').trim().isLength({ min: 2, max: 100 }).escape(),
    body('customerInfo.email').isEmail().normalizeEmail(),
    body('customerInfo.phoneNumber').optional().trim().isString(),
    body('customerInfo.address').trim().isLength({ min: 5, max: 500 }).escape(),
    body('customerInfo.zipCode').optional().isLength({ min: 4, max: 10 })

];
router.post("/create-checkout-session", authJwt(), validateCheckoutInput, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("❌ Validation Errors:", errors.array());
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array()
            });
        }

        const { items, customerInfo } = req.body;
        const line_items = items.map(item => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name.trim(),
                    description: item.description || `Quantity: ${item.quantity}`,
                    images: item.image ? [item.image] : undefined,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        const totalAmount = items.reduce((total, item) =>
            total + (item.price * item.quantity), 0
        );
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cart`,
            customer_email: customerInfo.email,
            billing_address_collection: 'auto',
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'IN'],
            },
            metadata: {
                userId: req.auth._id,
                customerName: customerInfo.name,
                customerEmail: customerInfo.email,
                customerPhone: customerInfo.phoneNumber,
                customerAddress: customerInfo.address,
                customerPincode: customerInfo.zipCode || '',
                itemCount: items.length.toString(),
                totalAmount: totalAmount.toString(),
                itemsData: JSON.stringify(items)
            },
            expires_at: Math.floor(Date.now() / 1000) + (30 * 60),
        });
        res.status(200).json({
            success: true,
            url: session.url,
            sessionId: session.id,
            totalAmount: totalAmount
        });

    } catch (error) {
        console.error("❌ Stripe Checkout Error:", error);

        const errorResponse = {
            success: false,
            message: "Payment processing failed"
        };

        if (error.type === 'StripeCardError') {
            errorResponse.message = "Card error: " + error.message;
            return res.status(400).json(errorResponse);
        } else if (error.type === 'StripeRateLimitError') {
            errorResponse.message = "Rate limit exceeded. Please try again later.";
            return res.status(429).json(errorResponse);
        } else if (error.type === 'StripeInvalidRequestError') {
            errorResponse.message = "Invalid payment request: " + error.message;
            return res.status(400).json(errorResponse);
        } else if (error.type === 'StripeAPIError') {
            errorResponse.message = "Payment service temporarily unavailable";
            return res.status(500).json(errorResponse);
        } else if (error.type === 'StripeConnectionError') {
            errorResponse.message = "Network error. Please try again.";
            return res.status(503).json(errorResponse);
        } else {
            errorResponse.message = "Internal server error during payment processing";
            return res.status(500).json(errorResponse);
        }
    }
});

router.get("/session/:sessionId", authJwt(), async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

        res.status(200).json({
            success: true,
            session: {
                id: session.id,
                status: session.payment_status,
                amount_total: session.amount_total,
                customer_email: session.customer_email,
                created: session.created
            }
        });
    } catch (error) {
        console.error("❌ Session retrieval error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve session details"
        });
    }
});

router.post("/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`❌ Webhook signature verification failed:`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(event.data.object);
                break;

            case 'checkout.session.expired':
                await handleCheckoutSessionExpired(event.data.object);
                break;

            case 'payment_intent.succeeded':
                await handlePaymentIntentSucceeded(event.data.object);
                break;

            case 'payment_intent.payment_failed':
                await handlePaymentIntentFailed(event.data.object);
                break;

            default:
        }
    } catch (error) {
        console.error(`❌ Webhook processing error for ${event.type}:`, error);
        return res.status(500).json({ error: 'Webhook processing failed' });
    }

    res.status(200).json({ received: true });
});

async function handleCheckoutSessionCompleted(session) {
    try {
        const metadata = session.metadata;
        const items = JSON.parse(metadata.itemsData);
        const order = new Orders({
            name: metadata.customerName,
            phoneNumber: metadata.customerPhone,
            address: metadata.customerAddress,
            pincode: metadata.customerPincode,
            amount: metadata.totalAmount,
            paymentId: session.payment_intent,
            email: metadata.customerEmail,
            userid: metadata.userId,
            products: items.map(item => ({
                productId: item.productId,
                productTitle: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image,
                subTotal: item.price * item.quantity
            })),
            status: 'processing',
            date: new Date()
        });

        const savedOrder = await order.save();
    } catch (error) {
        console.error('❌ Error creating order from webhook:', error);
        throw error;
    }
}

router.post("/refund", authJwt(), async (req, res) => {
    try {
        const { paymentIntentId, amount, reason } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({
                success: false,
                message: "Payment intent ID is required"
            });
        }

        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: amount ? Math.round(amount * 100) : undefined,
            reason: reason || 'requested_by_customer'
        });
        await Orders.findOneAndUpdate(
            { paymentId: paymentIntentId },
            { status: 'refunded', refundId: refund.id }
        );

        res.status(200).json({
            success: true,
            refund: {
                id: refund.id,
                amount: refund.amount / 100,
                status: refund.status
            }
        });
    } catch (error) {
        console.error("❌ Refund error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to process refund"
        });
    }
});

export default router;