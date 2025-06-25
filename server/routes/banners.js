import express from "express";
import multer from "multer";
import fs from "fs";
import { Banner } from "../models/banners.js";
import { ImageUpload } from "../models/imageUpload.js";
import cloudinaryPkg from "cloudinary";

const router = express.Router();
const cloudinary = cloudinaryPkg.v2;

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

let imagesArr = [];

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads"),
  filename: (_, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});

const upload = multer({ storage });

router.post("/upload", upload.array("images"), async (req, res) => {
  imagesArr = [];
  try {
    for (let i = 0; i < req?.files?.length; i++) {
      const img = await cloudinary.uploader.upload(
        req.files[i].path,
        { use_filename: true, unique_filename: false, overwrite: false },
        (_, result) => {
          imagesArr.push(result.secure_url);
          fs.unlinkSync(`uploads/${req.files[i].filename}`);
        }
      );
    }
    const imagesUploaded = await new ImageUpload({ images: imagesArr }).save();
    res.status(200).json(imagesArr);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
});

router.get("/", async (_, res) => {
  try {
    const bannerList = await Banner.find();
    if (!bannerList) return res.status(500).json({ success: false });
    res.status(200).json(bannerList);
  } catch {
    res.status(500).json({ success: false });
  }
});

router.get("/:id", async (req, res) => {
  const slide = await Banner.findById(req.params.id);
  if (!slide) return res.status(500).json({ message: "The Banner with the given ID was not found." });
  res.status(200).send(slide);
});

router.post("/create", async (req, res) => {
  try {
    const newEntry = await new Banner({
      images: imagesArr,
      catId: req.body.catId,
      catName: req.body.catName,
      subCatId: req.body.subCatId,
      subCatName: req.body.subCatName
    }).save();
    imagesArr = [];
    res.status(201).json(newEntry);
  } catch {
    res.status(500).json({ success: false });
  }
});

router.delete("/deleteImage", async (req, res) => {
  const imageName = req.query.img.split("/").pop().split(".")[0];
  const response = await cloudinary.uploader.destroy(imageName);
  if (response) res.status(200).send(response);
});

router.delete("/:id", async (req, res) => {
  const item = await Banner.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Banner not found!", success: false });
  for (const img of item.images) {
    const imageName = img.split("/").pop().split(".")[0];
    cloudinary.uploader.destroy(imageName);
  }
  await Banner.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "Banner Deleted!" });
});

router.put("/:id", async (req, res) => {
  const slideItem = await Banner.findByIdAndUpdate(
    req.params.id,
    {
      images: req.body.images,
      catId: req.body.catId,
      catName: req.body.catName,
      subCatId: req.body.subCatId,
      subCatName: req.body.subCatName
    },
    { new: true }
  );
  if (!slideItem) return res.status(500).json({ message: "Item cannot be updated!", success: false });
  imagesArr = [];
  res.send(slideItem);
});

export default router;
