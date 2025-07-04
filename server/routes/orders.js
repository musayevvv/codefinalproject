import express from 'express';
import { Orders } from '../models/orders.js';
import { body, validationResult, param, query } from 'express-validator';
import authJwt from '../helper/jwt.js';

const router = express.Router();
const validateOrderCreation = [
    body('name').trim().isLength({ min: 2, max: 100 }).escape(),
    body('phoneNumber').isMobilePhone().withMessage('Invalid phone number'),
    body('email').isEmail().normalizeEmail(),
    body('address').trim().isLength({ min: 5, max: 500 }).escape(),
    body('pincode').isPostalCode('any').withMessage('Invalid pincode'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('paymentId').trim().isLength({ min: 1 }).escape(),
    body('userid').isMongoId().withMessage('Invalid user ID'),
    body('products').isArray({ min: 1 }).withMessage('At least one product required'),
    body('products.*.productId').isMongoId(),
    body('products.*.quantity').isInt({ min: 1 }),
    body('products.*.price').isFloat({ min: 0.01 }),
    body('products.*.subTotal').isFloat({ min: 0.01 })
];

const validateOrderUpdate = [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
];
router.get('/sales', authJwt(), async (req, res) => {
    try {
        const currentYear = parseInt(req.query.year) || new Date().getFullYear();

        if (currentYear < 2000 || currentYear > 2100) {
            return res.status(400).json({ error: 'Invalid year parameter' });
        }

        const pipeline = [
            {
                $match: {
                    date: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lt: new Date(`${currentYear + 1}-01-01`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$date' },
                    totalSales: { $sum: { $toDouble: '$amount' } },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ];

        const salesData = await Orders.aggregate(pipeline);

        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
            'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

        const monthlySales = monthNames.map((month, index) => {
            const data = salesData.find(item => item._id === index + 1);
            return {
                month,
                sale: data ? data.totalSales : 0,
                orderCount: data ? data.orderCount : 0
            };
        });

        const totalSales = monthlySales.reduce((sum, month) => sum + month.sale, 0);

        return res.status(200).json({
            totalSales: Math.round(totalSales * 100) / 100,
            monthlySales,
            year: currentYear
        });
    } catch (error) {
        console.error('Sales data error:', error);
        return res.status(500).json({ error: 'Failed to fetch sales data' });
    }
});

router.get('/', authJwt(), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.userid) filter.userid = req.query.userid;
        if (req.query.status) filter.status = req.query.status;
        if (req.query.paymentId) filter.paymentId = req.query.paymentId;

        const orders = await Orders.find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Orders.countDocuments(filter);

        return res.status(200).json({
            orders,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get orders error:', error);
        return res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

router.get('/:id', [param('id').isMongoId()], authJwt(), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const order = await Orders.findById(req.params.id).lean();
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json(order);
    } catch (error) {
        console.error('Get order error:', error);
        return res.status(500).json({ error: 'Failed to fetch order' });
    }
});

router.post('/create', validateOrderCreation, authJwt(), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const calculatedTotal = req.body.products.reduce((sum, product) =>
            sum + (product.price * product.quantity), 0
        );
        if (Math.abs(calculatedTotal - parseFloat(req.body.amount)) > 0.01) {
            return res.status(400).json({ error: 'Amount mismatch with products total' });
        }
        const order = new Orders({
            ...req.body,
            date: new Date()
        });

        const savedOrder = await order.save();
        return res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Create order error:', error);
        return res.status(500).json({ error: 'Failed to create order' });
    }
});

router.put('/:id', validateOrderUpdate, authJwt(), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const updatedOrder = await Orders.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Update order error:', error);
        return res.status(500).json({ error: 'Failed to update order' });
    }
});

router.delete('/:id', [param('id').isMongoId()], authJwt(), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const deletedOrder = await Orders.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Delete order error:', error);
        return res.status(500).json({ error: 'Failed to delete order' });
    }
});

router.get('/stats/summary', authJwt(), async (req, res) => {
    try {
        const stats = await Orders.aggregate([
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: { $toDouble: '$amount' } },
                    avgOrderValue: { $avg: { $toDouble: '$amount' } }
                }
            }
        ]);

        const statusStats = await Orders.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        return res.status(200).json({
            summary: stats[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 },
            statusBreakdown: statusStats
        });
    } catch (error) {
        console.error('Stats error:', error);
        return res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

router.get('/get/count', authJwt(), async (req, res) => {
  try {
    const orderCount = await Orders.countDocuments();
    res.status(200).json({ count: orderCount });
  } catch (error) {
    console.error('Order count error:', error);
    res.status(500).json({ error: 'Failed to fetch order count' });
  }
});


export default router;