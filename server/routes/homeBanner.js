import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { HomeBanner } from '../models/homeBanner.js';
import { ImageUpload } from '../models/imageUpload.js';

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true
});

let imagesArr = [];

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads"),
    filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});

const upload = multer({ storage });

router.post(`/upload`, upload.array("images"), async (req, res) => {
    imagesArr = [];
    try {
        for (let i = 0; i < req?.files?.length; i++) {
            await cloudinary.uploader.upload(req.files[i].path, {
                use_filename: true, unique_filename: false, overwrite: false
            }, (error, result) => {
                imagesArr.push(result.secure_url);
                fs.unlinkSync(`uploads/${req.files[i].filename}`);
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

router.get(`/`, async (req, res) => {
    try {
        const bannerImagesList = await HomeBanner.find();
        if (!bannerImagesList) return res.status(500).json({ success: false });
        res.status(200).json(bannerImagesList);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

router.get('/:id', async (req, res) => {
    const slide = await HomeBanner.findById(req.params.id);
    if (!slide) return res.status(500).json({ message: 'The slide with the given ID was not found.' });
    res.status(200).send(slide);
});

router.post('/create', async (req, res) => {
    const newEntry = new HomeBanner({ images: imagesArr });
    if (!newEntry) return res.status(500).json({ success: false });
    await newEntry.save();
    imagesArr = [];
    res.status(201).json(newEntry);
});

router.delete('/deleteImage', async (req, res) => {
    const imgUrl = req.query.img;
    const imageName = imgUrl.split('/').pop().split('.')[0];
    const response = await cloudinary.uploader.destroy(imageName);
    if (response) res.status(200).send(response);
});

router.delete('/:id', async (req, res) => {
    const item = await HomeBanner.findById(req.params.id);
    if (item?.images) {
        for (const img of item.images) {
            const imageName = img.split('/').pop().split('.')[0];
            cloudinary.uploader.destroy(imageName);
        }
    }
    const deletedItem = await HomeBanner.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Slide not found!', success: false });
    res.status(200).json({ success: true, message: 'Slide Deleted!' });
});

router.put('/:id', async (req, res) => {
    const slideItem = await HomeBanner.findByIdAndUpdate(req.params.id, { images: req.body.images }, { new: true });
    if (!slideItem) return res.status(500).json({ message: 'Item cannot be updated!', success: false });
    imagesArr = [];
    res.send(slideItem);
});

export default router;
