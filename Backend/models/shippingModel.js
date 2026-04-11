import mongoose from "mongoose";

const shippingSchema = new mongoose.Schema({
    governorate: { type: String, required: true, unique: true },
    charge: { type: Number, required: true }
});

const shippingModel = mongoose.models.shipping || mongoose.model("Shipping", shippingSchema);
export default shippingModel;