import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    // _id: {
    //     type: String, // 👈 ضروري لو عايز تعين ID يدويًا
    //     required: false
    //   },
    name:{type: String, required:true},
    description:{type: String, required:true},
    price:{type: Number, required:true},
    images: { type: [String], required: true },
    category:{type: String, required:true},
    subCategory:{type: String, required:true},
    sizes:{type:Array,required:true},
    bestseller: {type : Boolean},
    date:{type:Number,default: Date.now}

})

const productModel= mongoose.models.product || mongoose.model("product",productSchema)

export default productModel