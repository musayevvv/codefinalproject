import express from 'express';
import { MyList } from '../models/myList.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const myList = await MyList.find(req.query);
        if (!myList) return res.status(500).json({ success: false });
        res.status(200).json(myList);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

router.post('/add', async (req, res) => {
    try {
        const item = await MyList.find({ productId: req.body.productId, userId: req.body.userId });
        if (item.length === 0) {
            const list = new MyList({
                productTitle: req.body.productTitle,
                image: req.body.image,
                rating: req.body.rating,
                price: req.body.price,
                productId: req.body.productId,
                userId: req.body.userId,
            });
            const saved = await list.save();
            return res.status(201).json(saved);
        }
        res.status(409).json({ status: false, msg: 'Product already added in the My List' });
    } catch (err) {
        res.status(500).json({ error: err, success: false });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const item = await MyList.findById(req.params.id);
        if (!item) return res.status(404).json({ msg: 'The item with the given ID is not found!' });
        const deleted = await MyList.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Item not found!', success: false });
        res.status(200).json({ success: true, message: 'Item Deleted!' });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await MyList.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'The item with the given ID was not found.' });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

export default router;