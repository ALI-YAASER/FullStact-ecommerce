import shippingModel from "../models/shippingModel.js";

const updateShipping = async (req, res) => {
    try {
        const { governorate, charge } = req.body;

        const updated = await shippingModel.findOneAndUpdate(
            { governorate: new RegExp(`^${governorate}$`, "i") },
            { charge },
            { upsert: true, new: true }
        );

        res.json({ success: true, message: "Shipping charge updated", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// const updateShipping = async (req, res) => {
//   try {
//     const { governorate, charge } = req.body;

//     if (!governorate || !charge) {
//       return res.status(400).json({ message: 'يجب تحديد المحافظة وقيمة الشحن' });
//     }

//     const existing = await ShippingModel.findOne({ governorate });

//     if (existing) {
//       existing.charge = charge;
//       await existing.save();
//     } else {
//       await ShippingModel.create({ governorate, charge });
//     }

//     res.status(200).json({ message: 'تم التحديث بنجاح' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'حدث خطأ في السيرفر' });
//   }
// };

const getAllShipping = async (req, res) => {
    try {
        const shippingData = await shippingModel.find({});
        res.json({ success: true, data: shippingData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getShippingByGovernorate = async (req, res) => {
    try {
        const { governorate } = req.params;

        if (!governorate) {
            return res.status(400).json({ success: false, message: "يجب تحديد اسم المحافظة" });
        }

        const shipping = await shippingModel.findOne({
            governorate: new RegExp(`^${governorate}$`, "i")
        });

        if (!shipping) {
            return res.status(404).json({ success: false, message: "لم يتم العثور على المحافظة" });
        }

        res.json({ success: true, charge: shipping.charge });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



export { updateShipping, getAllShipping , getShippingByGovernorate };