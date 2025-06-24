const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

// 🔧 BUNU DÜZGÜN ADLANDIR:
const categoryRoutes = require('./routes/categories.js');
app.use('/api/category', categoryRoutes); // İndi doğrudur


// Database bağlantısı
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('✅ Database Connection is ready...');
        app.listen(process.env.PORT, () => {
            console.log(`🚀 Server is running: http://localhost:${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log('❌ Database connection error:', err);
    });
