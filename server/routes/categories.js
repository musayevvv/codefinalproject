import express from "express";
import multer from "multer";
import fs from "fs";
import slugify from "slugify";
import { v2 as cloudinary } from "cloudinary";
import { Category } from "../models/category.js";
import { ImageUpload } from "../models/imageUpload.js";

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

let imagesArr = [];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});

const upload = multer({ storage });

router.post("/upload", upload.array("images"), async (req, res) => {
  imagesArr = [];
  try {
    for (let file of req.files) {
      await cloudinary.uploader.upload(file.path, {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      }, (err, result) => {
        imagesArr.push(result.secure_url);
        fs.unlinkSync(`uploads/${file.filename}`);
      });
    }
    const imagesUploaded = new ImageUpload({ images: imagesArr });
    await imagesUploaded.save();
    res.status(200).json(imagesArr);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
});

const createCategories = (categories, parentId = null) => {
  const categoryList = [];
  const filtered = parentId == null
    ? categories.filter(cat => !cat.parentId)
    : categories.filter(cat => cat.parentId == parentId);
  for (let cat of filtered) {
    categoryList.push({
      _id: cat._id,
      id: cat._id,
      name: cat.name,
      images: cat.images,
      color: cat.color,
      slug: cat.slug,
      children: createCategories(categories, cat._id)
    });
  }
  return categoryList;
};

router.get("/", async (req, res) => {
  try {
    const categoryList = await Category.find();
    if (!categoryList) return res.status(500).json({ success: false });
    res.status(200).json({ categoryList: createCategories(categoryList) });
  } catch {
    res.status(500).json({ success: false });
  }
});

router.get("/get/count", async (req, res) => {
  const count = await Category.countDocuments({ parentId: undefined });
  count
    ? res.send({ categoryCount: count })
    : res.status(500).json({ success: false });
});

router.get("/subCat/get/count", async (req, res) => {
  const all = await Category.find();
  if (!all) return res.status(500).json({ success: false });
  const subCats = all.filter(cat => cat.parentId !== undefined);
  res.send({ categoryCount: subCats.length });
});

const createCat = (categories, parentId = null, cat) => {
  const filtered = categories.filter(c => c.parentId == parentId);
  return [{
    _id: cat._id,
    id: cat._id,
    name: cat.name,
    images: cat.images,
    color: cat.color,
    slug: cat.slug,
    children: filtered
  }];
};

router.get("/:id", async (req, res) => {
  try {
    const categoryList = await Category.find();
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(500).json({ message: "Category not found." });
    res.status(200).json({ categoryData: createCat(categoryList, category._id, category) });
  } catch {
    res.status(500).json({ success: false });
  }
});

router.post("/create", async (req, res) => {
  let catObj = {
    name: req.body.name,
    slug: req.body.name,
    ...(imagesArr.length > 0 && { images: imagesArr, color: req.body.color }),
    ...(req.body.parentId && { parentId: req.body.parentId })
  };
  const category = new Category(catObj);
  if (!category) return res.status(500).json({ success: false });
  await category.save();
  imagesArr = [];
  res.status(201).json(category);
});

router.delete("/deleteImage", async (req, res) => {
  const imageName = req.query.img.split("/").pop().split(".")[0];
  const result = await cloudinary.uploader.destroy(imageName);
  if (result) res.status(200).send(result);
});

router.delete("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  for (let img of category.images) {
    const imageName = img.split("/").pop().split(".")[0];
    cloudinary.uploader.destroy(imageName);
  }
  const deleted = await Category.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Category not found!", success: false });
  res.status(200).json({ success: true, message: "Category Deleted!" });
});

router.put("/:id", async (req, res) => {
  const updated = await Category.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    images: req.body.images,
    color: req.body.color,
  }, { new: true });
  if (!updated) return res.status(500).json({ message: "Update failed", success: false });
  imagesArr = [];
  res.send(updated);
});

export default router;
