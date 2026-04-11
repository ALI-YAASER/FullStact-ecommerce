import productModel from "../models/productmodel.js";
import fs from 'fs';
import {cloudinary} from '../config/cloudinary.js';

export const addProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            subCategory,
            bestseller,
            sizes,
            date,
        } = req.body;

        const images = req.files || [];

        if (images.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one product image is required",
            });
        }

        // ✅ رفع الصور على Cloudinary
        const imageUrls = [];
        for (const file of images) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "product-images",
            });
            imageUrls.push(result.secure_url);
            fs.unlinkSync(file.path); // 🧹 حذف الصورة المؤقتة
        }

        const productData = {
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            images: imageUrls,
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === "true",
            date: date && !isNaN(new Date(date).getTime())
                ? new Date(date).getTime()
                : Date.now(),
        };

        // ❌ لا تضف _id يدويًا!
        const newProduct = new productModel(productData);
        await newProduct.validate();
        const savedProduct = await newProduct.save();

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: savedProduct,
        });
    } catch (error) {
        console.error("❌ FULL BACKEND ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};




export const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error: error.message
        });
    }
};


export const getProductById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Product ID is required",
        });
    }

    try {
        const product = await productModel.findOne({ _id: id });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        console.error("Get product error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch product",
            error: error.message,
        });
    }
};


export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const updates = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            subCategory: req.body.subCategory,
            sizes: req.body.sizes ? JSON.parse(req.body.sizes) : [],
            bestseller: req.body.bestseller === 'true',
            date: req.body.date && !isNaN(new Date(req.body.date).getTime())
                ? new Date(req.body.date).getTime()
                : Date.now()
        };

        // ✅ الصور القديمة من الفرونت
        let existingImages = [];
        if (req.body.images) {
            try {
                existingImages = JSON.parse(req.body.images);
            } catch (e) {
                console.error("Error parsing existing images:", e);
            }
        }

        // ✅ رفع الصور الجديدة على Cloudinary
        const newImages = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "product-images"
                });
                newImages.push(result.secure_url);
                fs.unlinkSync(file.path);
            }
        }

        updates.images = [...existingImages, ...newImages];

        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update product"
        });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to delete product",
            error: error.message
        });
    }
};