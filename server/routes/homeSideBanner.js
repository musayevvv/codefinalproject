import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { HomeSideBanners } from '../models/homeSideBanner.js';
import { ImageUpload } from '../models/imageUpload.js';

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

let imagesArr = [];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});

const upload = multer({ storage });

router.post('/upload', upload.array('images'), async (req, res) => {
  imagesArr = [];
  try {
    for (let i = 0; i < req?.files?.length; i++) {
      const options = { use_filename: true, unique_filename: false, overwrite: false };
    }
    let imagesUploaded = new ImageUpload({ images: imagesArr });
    imagesUploaded = await imagesUploaded.save();
    return res.status(200).json(imagesArr);
  } catch (error) {
    console.log(error);
  }
});

router.get('/', async (req, res) => {
  try {
    const bannerList = await HomeSideBanners.find();
    if (!bannerList) return res.status(500).json({ success: false });
    return res.status(200).json(bannerList);
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.get('/:id', async (req, res) => {
  const slide = await HomeSideBanners.findById(req.params.id);
  if (!slide) return res.status(500).json({ message: 'The Banner with the given ID was not found.' });
  return res.status(200).send(slide);
});

router.post('/create', async (req, res) => {
  let newEntry = new HomeSideBanners({
    images: imagesArr,
    catId: req.body.catId,
    catName: req.body.catName,
    subCatId: req.body.subCatId,
    subCatName: req.body.subCatName
  });
  if (!newEntry) return res.status(500).json({ error: err, success: false });
  newEntry = await newEntry.save();
  imagesArr = [];
  res.status(201).json(newEntry);
});

router.delete('/deleteImage', async (req, res) => {
  const imgUrl = req.query.img;
  const urlArr = imgUrl.split('/');
  const image = urlArr[urlArr.length - 1];
  const imageName = image.split('.')[0];
  const response = await cloudinary.uploader.destroy(imageName, (error, result) => { });
  if (response) res.status(200).send(response);
});

router.delete('/:id', async (req, res) => {
  const item = await HomeSideBanners.findById(req.params.id);
  const images = item.images;
  for (let img of images) {
    const imgUrl = img;
    const urlArr = imgUrl.split('/');
    const image = urlArr[urlArr.length - 1];
    const imageName = image.split('.')[0];
    cloudinary.uploader.destroy(imageName, (error, result) => { });
  }
  const deletedItem = await HomeSideBanners.findByIdAndDelete(req.params.id);
  if (!deletedItem) return res.status(404).json({ message: 'Banner not found!', success: false });
  res.status(200).json({ success: true, message: 'Banner Deleted!' });
});

router.put('/:id', async (req, res) => {
  const slideItem = await HomeSideBanners.findByIdAndUpdate(req.params.id, {
    images: req.body.images,
    catId: req.body.catId,
    catName: req.body.catName,
    subCatId: req.body.subCatId,
    subCatName: req.body.subCatName
  }, { new: true });
  if (!slideItem) return res.status(500).json({ message: 'Item cannot be updated!', success: false });
  imagesArr = [];
  res.send(slideItem);
});

export default router;