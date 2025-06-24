import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import categoryRoutes from "./routes/categories.js";

dotenv.config();

const app = express();

app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());

app.use("/api/category", categoryRoutes);

mongoose
    .connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("✅ Database Connection is ready...");
        app.listen(process.env.PORT, () => {
            console.log(`🚀 Server is running: http://localhost:${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("❌ Database connection error:", err);
    });