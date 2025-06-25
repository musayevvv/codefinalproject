import express from 'express';
import { ProductSize } from '../models/productSize.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const productSizeList = await ProductSize.find();
        if (!productSizeList) {
            return res.status(500).json({ success: false });
        }
        return res.status(200).json(productSizeList);
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await ProductSize.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'The item with the given ID was not found.' });
        }
        return res.status(200).send(item);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving item.', error: error.message });
    }
});

router.post('/create', async (req, res) => {
    try {
        let productsize = new ProductSize({
            size: req.body.size
        });

        productsize = await productsize.save();
        return res.status(201).json(productsize);
    } catch (err) {
        return res.status(500).json({ error: err.message, success: false });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await ProductSize.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found!', success: false });
        }
        return res.status(200).json({ success: true, message: 'Item Deleted!' });
    } catch (err) {
        return res.status(500).json({ error: err.message, success: false });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const item = await ProductSize.findByIdAndUpdate(
            req.params.id,
            { size: req.body.size },
            { new: true }
        );
        if (!item) {
            return res.status(404).json({ message: 'Item cannot be updated!', success: false });
        }
        return res.status(200).json(item);
    } catch (err) {
        return res.status(500).json({ error: err.message, success: false });
    }
});

export default router;
