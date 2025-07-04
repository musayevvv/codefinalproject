import express from 'express';
import { Orders } from '../models/orders.js';

const router = express.Router();

router.get('/sales', async (req, res) => {
    try {
        const currentYear = parseInt(req?.query?.year);
        const ordersList = await Orders.find();

        let totalSales = 0;
        const monthlySales = [
            { month: 'JAN', sale: 0 }, { month: 'FEB', sale: 0 }, { month: 'MAR', sale: 0 },
            { month: 'APRIL', sale: 0 }, { month: 'MAY', sale: 0 }, { month: 'JUNE', sale: 0 },
            { month: 'JULY', sale: 0 }, { month: 'AUG', sale: 0 }, { month: 'SEP', sale: 0 },
            { month: 'OCT', sale: 0 }, { month: 'NOV', sale: 0 }, { month: 'DEC', sale: 0 }
        ];

        for (const order of ordersList) {
            const amount = parseInt(order.amount);
            totalSales += amount;
            const orderDate = new Date(order.date);
            const year = orderDate.getFullYear();
            const month = orderDate.getMonth();

            if (year === currentYear) {
                monthlySales[month].sale += amount;
            }
        }

        return res.status(200).json({ totalSales, monthlySales });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const ordersList = await Orders.find(req.query);
        if (!ordersList) return res.status(500).json({ success: false });
        return res.status(200).json(ordersList);
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const order = await Orders.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'The order with the given ID was not found.' });
        return res.status(200).send(order);
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/get/count', async (req, res) => {
    try {
        const orderCount = await Orders.countDocuments();
        return res.send({ orderCount });
    } catch (error) {
        return res.status(500).json({ success: false });
    }
});

router.post('/create', async (req, res) => {
    try {
        const order = new Orders({
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            pincode: req.body.pincode,
            amount: req.body.amount,
            paymentId: req.body.paymentId,
            email: req.body.email,
            userid: req.body.userid,
            products: req.body.products,
            date: req.body.date
        });

        const savedOrder = await order.save();
        return res.status(201).json(savedOrder);
    } catch (err) {
        return res.status(500).json({ error: err.message, success: false });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedOrder = await Orders.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ message: 'Order not found!', success: false });
        return res.status(200).json({ success: true, message: 'Order Deleted!' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const order = await Orders.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
                pincode: req.body.pincode,
                amount: req.body.amount,
                paymentId: req.body.paymentId,
                email: req.body.email,
                userid: req.body.userid,
                products: req.body.products,
                status: req.body.status
            },
            { new: true }
        );

        if (!order) return res.status(500).json({ message: 'Order cannot be updated!', success: false });
        return res.send(order);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

export default router;
