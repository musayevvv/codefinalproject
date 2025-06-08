import Product from '../models/Product.js';
import generateSlug from '../utils/generateSlug.js';

export const getAllProducts = async (req, res) => {
    const { keyword, min, max, discountOnly } = req.query;
    let filter = {};
    if (keyword) filter.name = { $regex: keyword, $options: 'i' };
    if (min || max) filter.price = { $gte: min || 0, $lte: max || Infinity };
    if (discountOnly === 'true') filter.discount = { $gt: 0 };
    const products = await Product.find(filter);
    res.json(products);
};

export const getProductBySlug = async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
};

export const createProduct = async (req, res) => {
    const { name, description, price, tags, keywords, discount } = req.body;
    const slug = generateSlug(name);
    const product = new Product({
        name,
        description,
        price,
        slug,
        tags,
        keywords,
        discount,
        seller: req.user.id,
    });
    const saved = await product.save();
    res.status(201).json(saved);
};

export const updateProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.seller.toString() !== req.user.id)
        return res.status(403).json({ message: 'Not allowed' });
    Object.assign(product, req.body);
    await product.save();
    res.json(product);
};

export const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.isDeleted = true;
    await product.save();
    res.json({ message: 'Product hidden from users' });
};
