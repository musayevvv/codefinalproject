import express from 'express';
import { Cart } from '../models/cart.js';

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cartList = await Cart.find(req.query);
    if (!cartList) return res.status(500).json({ success: false });
    res.status(200).json(cartList);
  } catch {
    res.status(500).json({ success: false });
  }
});

router.post("/add", async (req, res) => {
  const existing = await Cart.find({ productId: req.body.productId, userId: req.body.userId });
  if (existing.length === 0) {
    let cartList = new Cart({
      productTitle: req.body.productTitle,
      image: req.body.image,
      rating: req.body.rating,
      price: req.body.price,
      quantity: req.body.quantity,
      subTotal: req.body.subTotal,
      productId: req.body.productId,
      userId: req.body.userId,
      countInStock: req.body.countInStock,
    });
    if (!cartList) return res.status(500).json({ success: false });
    cartList = await cartList.save();
    res.status(201).json(cartList);
  } else {
    res.status(401).json({ status: false, msg: "Product already added in the cart" });
  }
});

router.delete("/:id", async (req, res) => {
  const cartItem = await Cart.findById(req.params.id);
  if (!cartItem) return res.status(404).json({ msg: "The cart item with the given id is not found!" });
  const deleted = await Cart.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Cart item not found!", success: false });
  res.status(200).json({ success: true, message: "Cart Item Deleted!" });
});

router.get("/:id", async (req, res) => {
  const cartItem = await Cart.findById(req.params.id);
  if (!cartItem) return res.status(500).json({ message: "Cart item not found." });
  res.status(200).send(cartItem);
});

router.put("/:id", async (req, res) => {
  const updated = await Cart.findByIdAndUpdate(
    req.params.id,
    {
      productTitle: req.body.productTitle,
      image: req.body.image,
      rating: req.body.rating,
      price: req.body.price,
      quantity: req.body.quantity,
      subTotal: req.body.subTotal,
      productId: req.body.productId,
      userId: req.body.userId,
    },
    { new: true }
  );
  if (!updated) return res.status(500).json({ message: "Cart item cannot be updated!", success: false });
  res.send(updated);
});

export default router;
