import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Routes
import userRoutes from './routes/user.js';
import categoryRoutes from './routes/categories.js';
import productRoutes from './routes/products.js';
import imageUploadRoutes from './helper/imageUpload.js';
import productWeightRoutes from './routes/productWeight.js';
import productRAMSRoutes from './routes/productRAMS.js';
import productSIZESRoutes from './routes/productSize.js';
import productReviews from './routes/productReviews.js';
import cartRoutes from './routes/cart.js';
import myListRoutes from './routes/myList.js';
import ordersRoutes from './routes/orders.js';
import homeBannerRoutes from './routes/homeBanner.js';
import searchRoutes from './routes/search.js';
import bannersRoutes from './routes/banners.js';
import homeSideBannerRoutes from './routes/homeSideBanner.js';
import homeBottomBannerRoutes from './routes/homeBottomBanner.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors('*'));
app.use(bodyParser.json());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/imageUpload', imageUploadRoutes);
app.use('/api/productWeight', productWeightRoutes);
app.use('/api/productRAMS', productRAMSRoutes);
app.use('/api/productSIZE', productSIZESRoutes);
app.use('/api/productReviews', productReviews);
app.use('/api/cart', cartRoutes);
app.use('/api/my-list', myListRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/homeBanner', homeBannerRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/banners', bannersRoutes);
app.use('/api/homeSideBanners', homeSideBannerRoutes);
app.use('/api/homeBottomBanners', homeBottomBannerRoutes);

// Database connection & server
mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => {
        console.log('✅ Database connection is ready...');

        app.listen(process.env.PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Database connection error:', err.message);
        process.exit(1);
    });
