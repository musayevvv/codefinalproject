import express from 'express';
import { Cart } from '../models/cart.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const cartList = await Cart.find({ userId: req.user.userId });
    res.status(200).json(cartList);
  } catch (error) {
    console.error("Cart fetch error:", error);
    res.status(500).json({ success: false });
  }
});

router.post("/add", verifyToken, async (req, res) => {
  try {
    const existing = await Cart.findOne({
      productId: req.body.productId,
      userId: req.user.userId,
    });

    if (existing) {
      return res.status(200).json({ status: false, msg: "Product already in cart" });
    }

    const cartItem = new Cart({
      productTitle: req.body.productTitle,
      image: req.body.image,
      rating: req.body.rating,
      price: req.body.price,
      quantity: req.body.quantity,
      subTotal: req.body.subTotal,
      productId: req.body.productId,
      userId: req.user.userId,
      countInStock: req.body.countInStock,
    });

    const saved = await cartItem.save();
    res.status(201).json({ status: true, data: saved });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Cart.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Cart item not found!" });
    }
    res.status(200).json({ success: true, message: "Cart item deleted!" });
  } catch (error) {
    console.error("Delete cart item error:", error);
    res.status(500).json({ success: false });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Cart.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updated) {
      return res.status(500).json({ success: false, message: "Update failed" });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error("Update cart item error:", error);
    res.status(500).json({ success: false });
  }
});

router.delete("/clear/:userId", verifyToken, async (req, res) => {
  try {
    if (req.params.userId !== req.user.userId) {
      return res.status(403).json({ msg: "Unauthorized clear" });
    }
    await Cart.deleteMany({ userId: req.params.userId });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

export default router;
