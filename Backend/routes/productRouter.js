import express from "express";
import {
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controller/productController.js";
import adminAuth from "../middleware/adminAuth.js";
import multer from 'multer';
import upload from '../middleware/multer.js'
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

// Use memoryStorage since we'll upload to Cloudinary manually
const storage = multer.memoryStorage();
// const upload = multer({
//     storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB per file
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype.startsWith('image/')) {
//             cb(null, true);
//         } else {
//             cb(new Error('Only image files are allowed!'), false);
//         }
//     }
// });

const router = express.Router();

// POST: Add new product with images (max 4)
router.post("/", upload.array("images", 4), addProduct);

// GET: All products
router.get("/", getAllProducts);

// GET: Product by ID
router.get("/:id", getProductById);

// PUT: Update product
router.put("/:id",  upload.array("images", 4), adminAuth, updateProduct);

// DELETE: Remove product
router.delete("/:id", adminAuth, deleteProduct);


export default router;
