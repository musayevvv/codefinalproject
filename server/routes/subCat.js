import express from 'express';
import { SubCategory } from '../models/subCat.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage);
        const totalPosts = await SubCategory.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) return res.status(404).json({ message: "No data found!" });

        const subCategoryList = req.query.page && req.query.perPage
            ? await SubCategory.find().populate("category").skip((page - 1) * perPage).limit(perPage)
            : await SubCategory.find().populate("category");

        if (!subCategoryList) return res.status(500).json({ success: false });

        return res.status(200).json({ subCategoryList, totalPages, page });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/get/count', async (req, res) => {
    try {
        const subCatCount = await SubCategory.countDocuments();
        res.send({ subCatCount });
    } catch {
        res.status(500).json({ success: false });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const subCat = await SubCategory.findById(req.params.id).populate("category");
        if (!subCat) return res.status(404).json({ message: 'SubCategory not found.' });
        res.status(200).send(subCat);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/create', async (req, res) => {
    try {
        let subCat = new SubCategory({
            category: req.body.category,
            subCat: req.body.subCat
        });
        const saved = await subCat.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: err.message, success: false });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deleted = await SubCategory.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'SubCategory not found!', success: false });
        res.status(200).json({ success: true, message: 'SubCategory deleted!' });
    } catch (err) {
        res.status(500).json({ error: err.message, success: false });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updated = await SubCategory.findByIdAndUpdate(
            req.params.id,
            { category: req.body.category, subCat: req.body.subCat },
            { new: true }
        );
        if (!updated) return res.status(500).json({ message: 'Update failed', success: false });
        res.send(updated);
    } catch (err) {
        res.status(500).json({ error: err.message, success: false });
    }
});

export default router;
