// upload.js
import { cloudinary } from '../config/cloudinary.js'; // اتصال Cloudinary اللي كتبته
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ecommerce-products', // يمكنك تغيير اسم المجلد
        allowed_formats: ['jpg', 'png', 'jpeg'],
        public_id: (req, file) => `${Date.now()}-${file.originalname}`, // اسم مخصص للصورة
    },
});

const upload = multer({ storage });

export default upload;
