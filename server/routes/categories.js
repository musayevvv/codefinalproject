const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();

// GET: Bütün kateqoriyaları əldə et
router.get('/', async (req, res) => {
    try {
        const categoryList = await Category.find();

        if (!categoryList || categoryList.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No categories found',
            });
        }

        res.status(200).json({
            success: true,
            data: categoryList,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;
