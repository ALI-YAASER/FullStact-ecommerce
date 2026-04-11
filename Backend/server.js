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

connectDB()
await connectCloudinary()

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/user', userRouter)
app.use('/api/products', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/orders', orderRouter)

app.get('/', (req, res) => {
    res.send("API ALI")
})

// ❌ احذف app.listen تمامًا

export default app
