import express from "express";
import multer from "multer";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { HomeBottomBanners } from "../models/homeBottomBanner.js";
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
  destination: (cb) => cb(null, "uploads"),
  filename: (file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});

const upload = multer({ storage });

router.post("/upload", upload.array("images"), async (req, res) => {
  imagesArr = [];
  try {
    for (let i = 0; i < req?.files?.length; i++) {
      await cloudinary.uploader.upload(req.files[i].path, {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      }, (result) => {
        imagesArr.push(result.secure_url);
        fs.unlinkSync(`uploads/${req.files[i].filename}`);
      });
    }
    const imagesUploaded = new ImageUpload({ images: imagesArr });
    await imagesUploaded.save();
    return res.status(200).json(imagesArr);
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const bannerList = await HomeBottomBanners.find();
    if (!bannerList) return res.status(500).json({ success: false });
    return res.status(200).json(bannerList);
  } catch {
    res.status(500).json({ success: false });
  }
});

router.get("/:id", async (req, res) => {
  const slide = await HomeBottomBanners.findById(req.params.id);
  if (!slide) return res.status(500).json({ message: "The Banner with the given ID was not found." });
  return res.status(200).send(slide);
});

router.post("/create", async (req, res) => {
  const newEntry = new HomeBottomBanners({
    images: imagesArr,
    catId: req.body.catId,
    catName: req.body.catName,
    subCatId: req.body.subCatId,
    subCatName: req.body.subCatName,
  });
  if (!newEntry) return res.status(500).json({ error: "Creation failed", success: false });
  await newEntry.save();
  imagesArr = [];
  res.status(201).json(newEntry);
});

router.delete("/deleteImage", async (req, res) => {
  const imgUrl = req.query.img;
  const imageName = imgUrl.split("/").pop().split(".")[0];
  const response = await cloudinary.uploader.destroy(imageName);
  if (response) res.status(200).send(response);
});

router.delete("/:id", async (req, res) => {
  const item = await HomeBottomBanners.findById(req.params.id);
  const images = item?.images || [];
  for (const img of images) {
    const imageName = img.split("/").pop().split(".")[0];
    cloudinary.uploader.destroy(imageName);
  }
  const deletedItem = await HomeBottomBanners.findByIdAndDelete(req.params.id);
  if (!deletedItem) return res.status(404).json({ message: "Banner not found!", success: false });
  res.status(200).json({ success: true, message: "Banner Deleted!" });
});

router.put("/:id", async (req, res) => {
  const slideItem = await HomeBottomBanners.findByIdAndUpdate(
    req.params.id,
    {
      images: req.body.images,
      catId: req.body.catId,
      catName: req.body.catName,
      subCatId: req.body.subCatId,
      subCatName: req.body.subCatName,
    },
    { new: true }
  );
  if (!slideItem) return res.status(500).json({ message: "Item cannot be updated!", success: false });
  imagesArr = [];
  res.send(slideItem);
});

export default router;
