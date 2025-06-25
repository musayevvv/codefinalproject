import express from 'express';
import { ImageUpload } from '../models/imageUpload.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const imageUploadList = await ImageUpload.find();
        if (!imageUploadList) return res.status(500).json({ success: false });
        return res.status(200).json(imageUploadList);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

router.delete('/deleteAllImages', async (req, res) => {
    const images = await ImageUpload.find();
    let deletedImage;
    if (images.length !== 0) {
        for (const image of images) {
            deletedImage = await ImageUpload.findByIdAndDelete(image.id);
        }
    }
    res.json(deletedImage);
});

export default router;
