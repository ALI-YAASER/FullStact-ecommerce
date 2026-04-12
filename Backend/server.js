// import express from 'express'
// import cors from 'cors'
// import 'dotenv/config'
// import path from 'path'
// import { fileURLToPath } from 'url'
// import connectDB from './config/mongodb.js'
// import {connectCloudinary} from './config/cloudinary.js'
// import userRouter from './routes/userRouter.js'
// import productRouter from './routes/productRouter.js'
// import cartRouter from './routes/cartRouter.js'
// import orderRouter from "./routes/orderRouter.js";

// // App config
// const app = express()
// const port = 4000
// connectDB()
// await  connectCloudinary()

// // Get __dirname equivalent in ES modules
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// // Middlewares


// app.use(cors({
//     origin: '*', // أو حدد frontend فقط لو حبيت
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// }));

// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
// app.use(express.urlencoded({ extended: true })); // ← يدعم form-data
// app.use(express.json());                          // ← بعده عادي


// // Routes
// app.use('/api/user', userRouter)
// app.use('/api/products', productRouter)
// app.use('/api/cart',cartRouter)
// app.use('/api/orders', orderRouter)

// // API endpoint
// app.get('/', (req, res) => {
//     res.send("API ALI")
// })

// // Start server
// app.listen(port, () => console.log(`Server started on port ${port}`))

import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/mongodb.js'
import { connectCloudinary } from './config/cloudinary.js'
import userRouter from './routes/userRouter.js'
import productRouter from './routes/productRouter.js'
import cartRouter from './routes/cartRouter.js'
import orderRouter from "./routes/orderRouter.js";

const app = express()

// الاتصال بقواعد البيانات
connectDB()
connectCloudinary()

// الإعدادات (Middlewares)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}))

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// المسارات (Routes)
app.use('/api/user', userRouter)
app.use('/api/products', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/orders', orderRouter)

app.get('/', (req, res) => {
    res.send("API Forever IS RUNNING")
})

// --- التعديل الجوهري للتشغيل المحلي والرفع ---
const PORT = process.env.PORT || 4000;

// يعمل Listen فقط إذا لم يكن المشروع مرفوعاً على Vercel (Production)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running locally on: http://localhost:${PORT}`);
    });
}

// تصدير app لـ Vercel
export default app;