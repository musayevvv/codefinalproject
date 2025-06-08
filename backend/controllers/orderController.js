import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
    const { items, address, totalPrice } = req.body;
    const order = await Order.create({
        user: req.user.id,
        items,
        address,
        totalPrice,
        status: 'Preparing',
    });
    res.status(201).json(order);
};

export const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status;
    await order.save();
    res.json(order);
};
