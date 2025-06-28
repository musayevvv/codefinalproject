import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/user.js";
import { ImageUpload } from "../models/imageUpload.js";
import { sendEmail } from "../utils/emailService.js";

const router = express.Router();

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
    for (let file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        use_filename: true, unique_filename: false, overwrite: false
      });
      imagesArr.push(result.secure_url);
      fs.unlinkSync(file.path);
    }
    const uploaded = await new ImageUpload({ images: imagesArr }).save();
    return res.status(200).json(uploaded.images);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true });
  }
});

const sendEmailFun = async (to, subject, text, html) => {
  const result = await sendEmail(to, subject, text, html);
  return result.success;
};

router.post("/signup", async (req, res) => {


  const { name, phone, email, password, isAdmin } = req.body;
  try {

    
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const existingUser = await User.findOne({ email });
    const existingUserByPh = await User.findOne({ phone });

    if (existingUser) return res.json({ status: "FAILED", msg: "User already exist with this email!" });
    if (existingUserByPh) return res.json({ status: "FAILED", msg: "User already exist with this phone number!" });

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await new User({
      name, email, phone, password: hashPassword, isAdmin,
      otp: verifyCode, otpExpires: Date.now() + 600000
    }).save();

    await sendEmailFun(email, "Verify Email", "", "Your OTP is " + verifyCode);
    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

    return res.status(200).json({
      success: true,
      message: "User registered successfully! Please verify your email.",
      token
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "FAILED", msg: "something went wrong" });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: true, msg: "User not found!" });
    if (!user.isVerified) {
      return res.json({
        error: true, isVerify: false,
        msg: "Your account is not active yet. Please verify your account."
      });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: true, msg: "Invalid credentials" });

    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);
    return res.status(200).send({ user, token, msg: "User Authenticated" });
  } catch (error) {
    res.status(500).json({ error: true, msg: "Something went wrong" });
  }
});

router.post("/verifyemail", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    if (user.otp === otp && user.otpExpires > Date.now()) {
      user.isVerified = true;
      user.otp = null;
      user.otpExpires = null;
      await user.save();
      return res.status(200).json({ success: true, message: "OTP verified successfully" });
    }
    return res.status(400).json({
      success: false,
      message: user.otp !== otp ? "Invalid OTP" : "OTP expired"
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error in verifying email" });
  }
});

router.post("/verifyAccount/resendOtp", async (req, res) => {
  const { email } = req.body;
  try {
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({
        success: true, message: "OTP SENT", otp: verifyCode, existingUserId: user._id
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "FAILED", msg: "something went wrong" });
  }
});

router.put("/verifyAccount/emailVerify/:id", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await User.findByIdAndUpdate(req.params.id, {
        ...existingUser._doc,
        otp, otpExpires: Date.now() + 600000
      });
      await sendEmailFun(email, "Verify Email", "", "Your OTP is " + otp);
      const token = jwt.sign({ email, id: existingUser._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);
      return res.status(200).json({ success: true, message: "OTP SENT", token });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "FAILED", msg: "something went wrong" });
  }
});

router.put("/changePassword/:id", async (req, res) => {
  const { name, phone, email, password, newPass, images } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: true, msg: "User not found!" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(404).json({ error: true, msg: "Current password wrong" });

  const hashed = newPass ? bcrypt.hashSync(newPass, 10) : user.password;
  const updated = await User.findByIdAndUpdate(req.params.id, {
    name, phone, email, password: hashed, images
  }, { new: true });

  if (!updated) return res.status(400).json({ error: true, msg: "The user cannot be Updated!" });
  res.send(updated);
});

router.get("/", async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(500).json({ success: false });
  res.send(users);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(500).json({ message: "The user with the given ID was not found." });
  res.status(200).send(user);
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "User not found!" });
    return res.status(200).json({ success: true, message: "The user is deleted!" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

router.get("/get/count", async (req, res) => {
  const count = await User.countDocuments();
  if (!count) return res.status(500).json({ success: false });
  res.send({ userCount: count });
});

router.post("/authWithGoogle", async (req, res) => {
  const { name, phone, email, password, images, isAdmin } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, phone, email, password, images, isAdmin, isVerified: true });
    }
    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);
    res.status(200).send({ user, token, msg: "User Login Successfully!" });
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id", async (req, res) => {
  const { name, phone, email } = req.body;
  const user = await User.findById(req.params.id);
  const newPassword = req.body.password ? bcrypt.hashSync(req.body.password, 10) : user.password;
  const updated = await User.findByIdAndUpdate(req.params.id, {
    name, phone, email, password: newPassword, images: imagesArr
  }, { new: true });

  if (!updated) return res.status(400).send("The user cannot be Updated!");
  res.send(updated);
});

router.delete("/deleteImage", async (req, res) => {
  const imgUrl = req.query.img;
  const parts = imgUrl.split("/");
  const publicId = parts[parts.length - 1].split(".")[0];
  const result = await cloudinary.uploader.destroy(publicId);
  if (result) res.status(200).send(result);
});

router.post("/forgotPassword", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ status: "FAILED", msg: "User not exist with this email!" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 600000;
    await user.save();
    await sendEmailFun(email, "Verify Email", "", "Your OTP is " + otp);

    return res.status(200).json({ success: true, status: "SUCCESS", message: "OTP Sent" });
  } catch (error) {
    console.log(error);
    res.json({ status: "FAILED", msg: "something went wrong" });
  }
});

router.post("/forgotPassword/changePassword", async (req, res) => {
  const { email, newPass } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.password = await bcrypt.hash(newPass, 10);
      await user.save();
      return res.status(200).json({ success: true, status: "SUCCESS", message: "Password changed successfully" });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "FAILED", msg: "something went wrong" });
  }
});

export default router;
