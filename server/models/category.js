import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    images: [{ type: String, required: true }],
    color: { type: String, required: true },
});

export const Category = mongoose.model("Category", categorySchema);