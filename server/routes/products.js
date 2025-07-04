import express from "express";
import multer from "multer";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { Category } from "../models/category.js";
import { Product } from "../models/products.js";
import { MyList } from "../models/myList.js";
import { Cart } from "../models/cart.js";
import { RecentlyViewd } from "../models/recentlyViewd.js";
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
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}_${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });
router.post("/upload", upload.array("images"), async (req, res) => {
  imagesArr = [];

  try {
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path,
        { use_filename: true, unique_filename: false, overwrite: false, });
      imagesArr.push(result.secure_url);
      fs.unlinkSync(file.path);
    }

    const imagesUploaded = new ImageUpload({ images: imagesArr });
    await imagesUploaded.save();

    return res.status(200).json(imagesArr);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const { page = 1, perPage = 16, location } = req.query;

    let filter = {};

    if (location && location !== "all") {
      filter = {
        location: {
          $elemMatch: { value: { $regex: new RegExp(`^${location}$`, "i") } },
        },
      };
    }

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(perPage));
    const products = await Product.find(filter)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    res.status(200).json({
      success: true,
      products,
      totalPages,
      page: parseInt(page),
    });
  } catch (error) {
    console.error("GET /all ERROR:", error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});




router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});

router.get(`/catName`, async (req, res) => {
  let productList = [];

  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage);
  const totalPosts = await Product.countDocuments();
  const totalPages = Math.ceil(totalPosts / perPage);

  if (page > totalPages) {
    return res.status(404).json({ message: "Page not found" });
  }

  if (req.query.page !== undefined && req.query.perPage !== undefined) {
    const productListArr = await Product.find({ catName: req.query.catName })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return res.status(200).json({
      products: productListArr,
      totalPages: totalPages,
      page: page,
    });
  } else {
    const productListArr = await Product.find({ catName: req.query.catName })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    for (let i = 0; i < productListArr.length; i++) {
      for (let j = 0; j < productListArr[i].location.length; j++) {
        if (productListArr[i].location[j].value === req.query.location) {
          productList.push(productListArr[i]);
        }
      }
    }

    if (req.query.location !== "All") {
      return res.status(200).json({
        products: productList,
        totalPages: totalPages,
        page: page,
      });
    } else {
      return res.status(200).json({
        products: productListArr,
        totalPages: totalPages,
        page: page,
      });
    }
  }
});

router.get(`/catId`, async (req, res) => {
  let productList = [];
  let productListArr = [];

  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage);
  const totalPosts = await Product.countDocuments();
  const totalPages = Math.ceil(totalPosts / perPage);

  if (page > totalPages) {
    return res.status(404).json({ message: "Page not found" });
  }

  if (req.query.page !== undefined && req.query.perPage !== undefined) {
    const productListArr = await Product.find({ catId: req.query.catId })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return res.status(200).json({
      products: productListArr,
      totalPages: totalPages,
      page: page,
    });
  } else {
    productListArr = await Product.find({ catId: req.query.catId });

    for (let i = 0; i < productListArr.length; i++) {
      for (let j = 0; j < productListArr[i].location.length; j++) {
        if (productListArr[i].location[j].value === req.query.location) {
          productList.push(productListArr[i]);
        }
      }
    }

    if (req.query.location !== "All" && req.query.location !== undefined) {
      return res.status(200).json({
        products: productList,
        totalPages: totalPages,
        page: page,
      });
    } else {
      return res.status(200).json({
        products: productListArr,
        totalPages: totalPages,
        page: page,
      });
    }

  }
});

router.get(`/subCatId`, async (req, res) => {
  let productList = [];

  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage);
  const totalPosts = await Product.countDocuments();
  const totalPages = Math.ceil(totalPosts / perPage);

  if (page > totalPages) {
    return res.status(404).json({ message: "Page not found" });
  }

  if (req.query.page !== undefined && req.query.perPage !== undefined) {
    const productListArr = await Product.find({ subCatId: req.query.subCatId })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return res.status(200).json({
      products: productListArr,
      totalPages: totalPages,
      page: page,
    });
  } else {
    const productListArr = await Product.find({ subCatId: req.query.subCatId });

    for (let i = 0; i < productListArr.length; i++) {
      for (let j = 0; j < productListArr[i].location.length; j++) {
        if (productListArr[i].location[j].value === req.query.location) {
          productList.push(productListArr[i]);
        }
      }
    }

    if (req.query.location !== "All") {
      return res.status(200).json({
        products: productList,
        totalPages: totalPages,
        page: page,
      });
    } else {
      return res.status(200).json({
        products: productListArr,
        totalPages: totalPages,
        page: page,
      });
    }
  }
});

router.get(`/fiterByPrice`, async (req, res) => {
  let productList = [];

  if (req.query.catId !== "" && req.query.catId !== undefined) {
    const productListArr = await Product.find({
      catId: req.query.catId,
    }).populate("category");

    if (req.query.location !== "All") {
      for (let i = 0; i < productListArr.length; i++) {
        for (let j = 0; j < productListArr[i].location.length; j++) {
          if (productListArr[i].location[j].value === req.query.location) {
            productList.push(productListArr[i]);
          }
        }
      }
    } else {
      productList = productListArr;
    }
  } else if (req.query.subCatId !== "" && req.query.subCatId !== undefined) {
    const productListArr = await Product.find({
      subCatId: req.query.subCatId,
    }).populate("category");

    if (req.query.location !== "All") {
      for (let i = 0; i < productListArr.length; i++) {
        for (let j = 0; j < productListArr[i].location.length; j++) {
          if (productListArr[i].location[j].value === req.query.location) {
            productList.push(productListArr[i]);
          }
        }
      }
    } else {
      productList = productListArr;
    }
  }

  const filteredProducts = productList.filter((product) => {
    if (req.query.minPrice && product.price < parseInt(+req.query.minPrice)) {
      return false;
    }
    if (req.query.maxPrice && product.price > parseInt(+req.query.maxPrice)) {
      return false;
    }
    return true;
  });

  return res.status(200).json({
    products: filteredProducts,
    totalPages: 0,
    page: 0,
  });
});

router.get(`/rating`, async (req, res) => {
  let productList = [];

  if (req.query.catId !== "" && req.query.catId !== undefined) {
    const productListArr = await Product.find({
      catId: req.query.catId,
      rating: req.query.rating,
    }).populate("category");

    if (req.query.location !== "All") {
      for (let i = 0; i < productListArr.length; i++) {
        for (let j = 0; j < productListArr[i].location.length; j++) {
          if (productListArr[i].location[j].value === req.query.location) {
            productList.push(productListArr[i]);
          }
        }
      }
    } else {
      productList = productListArr;
    }
  } else if (req.query.subCatId !== "" && req.query.subCatId !== undefined) {
    const productListArr = await Product.find({
      subCatId: req.query.subCatId,
      rating: req.query.rating,
    }).populate("category");

    if (req.query.location !== "All") {
      for (let i = 0; i < productListArr.length; i++) {
        for (let j = 0; j < productListArr[i].location.length; j++) {
          if (productListArr[i].location[j].value === req.query.location) {
            productList.push(productListArr[i]);
          }
        }
      }
    } else {
      productList = productListArr;
    }
  }

  return res.status(200).json({
    products: productList,
    totalPages: 0,
    page: 0,
  });
});

router.get(`/get/count`, async (req, res) => {
  const productsCount = await Product.countDocuments();

  if (!productsCount) {
    res.status(500).json({ success: false });
  } else {
    res.send({
      productsCount: productsCount,
    });
  }
});

router.get("/featured", async (req, res) => {
  try {
    const locationQuery = req.query.location;
    const productListArr = await Product.find({ isFeatured: true }).populate("category");

    let productList = [];

    if (locationQuery && locationQuery !== "All") {
      for (let i = 0; i < productListArr.length; i++) {
        const locations = productListArr[i].location || [];

        for (let j = 0; j < locations.length; j++) {
          if (
            locations[j] &&
            typeof locations[j].value === "string" &&
            locations[j].value.toLowerCase() === locationQuery.toLowerCase()
          ) {
            productList.push(productListArr[i]);
            break;
          }
        }
      }
    } else {
      productList = productListArr;
    }

    return res.status(200).json(productList);
  } catch (error) {
    console.log("❌ FEATURED route ERROR:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});



router.get(`/recentlyViewd`, async (req, res) => {
  let productList = [];
  productList = await RecentlyViewd.find(req.query).populate("category");

  if (!productList) {
    res.status(500).json({ success: false });
  }

  return res.status(200).json(productList);
});

router.post(`/recentlyViewd`, async (req, res) => {
  let findProduct = await RecentlyViewd.find({ prodId: req.body.id });

  var product;

  if (findProduct.length === 0) {
    product = new RecentlyViewd({
      prodId: req.body.id,
      name: req.body.name,
      description: req.body.description,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      oldPrice: req.body.oldPrice,
      subCatId: req.body.subCatId,
      catName: req.body.catName,
      subCat: req.body.subCat,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
      discount: req.body.discount,
      productRam: req.body.productRam,
      size: req.body.size,
      productWeight: req.body.productWeight,
    });

    product = await product.save();

    if (!product) {
      res.status(500).json({
        error: err,
        success: false,
      });
    }

    res.status(201).json(product);
  }
});

router.post("/create", async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(404).json({ success: false, message: "Invalid Category!" });
    }

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      oldPrice: req.body.oldPrice,
      catId: req.body.catId,
      catName: req.body.catName,
      subCat: req.body.subCat,
      subCatId: req.body.subCatId,
      subCatName: req.body.subCatName,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
      discount: req.body.discount,
      productRam: req.body.productRam,
      size: req.body.size,
      productWeight: req.body.productWeight,
      location: req.body.location?.length ? req.body.location : [{ value: "all", label: "All" }]
    });

    const savedProduct = await product.save();

    res.status(201).json({ success: true, data: savedProduct });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Product creation failed" });
  }
});


router.delete("/deleteImage", async (req, res) => {
  const imgUrl = req.query.img;
  const urlArr = imgUrl.split("/");
  const image = urlArr[urlArr.length - 1];

  const imageName = image.split(".")[0];

  const response = await cloudinary.uploader.destroy(
    imageName
  );

  if (response) {
    res.status(200).send(response);
  }
});

router.delete("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  const images = product.images;

  for (img of images) {
    const imgUrl = img;
    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];

    const imageName = image.split(".")[0];

    if (imageName) {
      cloudinary.uploader.destroy(imageName, (error, result) => {
      });
    }
  }

  const deletedProduct = await Product.findByIdAndDelete(req.params.id);

  const myListItems = await MyList.find({ productId: req.params.id });

  for (var i = 0; i < myListItems.length; i++) {
    await MyList.findByIdAndDelete(myListItems[i].id);
  }

  const cartItems = await Cart.find({ productId: req.params.id });

  for (var i = 0; i < cartItems.length; i++) {
    await Cart.findByIdAndDelete(cartItems[i].id);
  }

  if (!deletedProduct) {
    res.status(404).json({
      message: "Product not found!",
      success: false,
    });
  }

  res.status(200).json({
    success: true,
    message: "Product Deleted!",
  });
});

router.put("/:id", async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      subCat: req.body.subCat,
      description: req.body.description,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      oldPrice: req.body.oldPrice,
      catId: req.body.catId,
      subCat: req.body.subCat,
      subCatId: req.body.subCatId,
      subCatName: req.body.subCatName,
      catName: req.body.catName,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
      productRam: req.body.productRam,
      size: req.body.size,
      productWeight: req.body.productWeight,
      location: req.body.location,
    },
    { new: true }
  );

  if (!product) {
    res.status(404).json({
      message: "the product can not be updated!",
      status: false,
    });
  }

  imagesArr = [];

  res.status(200).json({
    message: "the product is updated!",
    status: true,
  });
});
export default router;