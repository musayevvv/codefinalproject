import Review from '../models/Review.js';
import Order from '../models/Order.js';

export const addReview = async (req, res) => {
    const { rating, comment } = req.body;
    const { productId } = req.params;
    const order = await Order.findOne({ user: req.user.id, 'items.product': productId });
    if (!order) return res.status(403).json({ message: 'You haven’t purchased this product' });
    const review = new Review({
        user: req.user.id,
        product: productId,
        rating,
        comment,
    });
    await review.save();
    res.status(201).json(review);
};
