import express from 'express';
import { ProductRams } from '../models/productRAMS.js';

const router = express.Router();

// Get all RAM options
router.get('/', async (req, res) => {
    try {
        const productRAMSList = await ProductRams.find();

        if (!productRAMSList) {
            return res.status(500).json({ success: false });
        }

        return res.status(200).json(productRAMSList);
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

// Get single RAM option by ID
router.get('/:id', async (req, res) => {
    try {
        const item = await ProductRams.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'The item with the given ID was not found.' });
        }

        return res.status(200).send(item);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching item', error: error.message });
    }
});

// Create new RAM option
router.post('/create', async (req, res) => {
    try {
        let productRAMS = new ProductRams({
            productRam: req.body.productRam
        });

        productRAMS = await productRAMS.save();

        return res.status(201).json(productRAMS);
    } catch (err) {
        return res.status(500).json({ error: err.message, success: false });
    }
});

// Delete RAM option
router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await ProductRams.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found!', success: false });
        }

        return res.status(200).json({ success: true, message: 'Item Deleted!' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Update RAM option
router.put('/:id', async (req, res) => {
    try {
        const item = await ProductRams.findByIdAndUpdate(
            req.params.id,
            { productRam: req.body.productRam },
            { new: true }
        );

        if (!item) {
            return res.status(500).json({ message: 'Item cannot be updated!', success: false });
        }

        return res.status(200).json(item);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

export default router;
