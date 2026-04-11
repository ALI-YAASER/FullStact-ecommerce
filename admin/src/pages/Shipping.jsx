import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App.jsx";

const governorates = [
    "القاهرة", "الجيزة", "الأسكندرية", "الشرقية", "الدقهلية",
    "البحر الأحمر", "البحيرة", "الفيوم", "الغربية",
    "الإسماعيلية", "المنوفية", "المنيا", "القليوبية",
    "الوادي الجديد", "السويس", "أسوان", "أسيوط",
    "بني سويف", "بورسعيد", "دمياط",
    "جنوب سيناء", "كفر الشيخ", "مطروح",
    "الأقصر", "قنا", "شمال سيناء", "سوهاج"
];

const Shipping = ({ token }) => {

    const [shippingData, setShippingData] = useState([]);
    const [formData, setFormData] = useState({
        governorate: "",
        charge: ""
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const fetchShippingData = async () => {
        try {
            const res = await axios.get(
                `${backendUrl}/api/orders/shipping`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setShippingData(res.data.data);

        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.governorate || !formData.charge) return;

        try {
            setLoading(true);

            await axios.post(
                `${backendUrl}/api/orders/shipping/update`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess("✔ Shipping updated successfully");

            setFormData({
                governorate: "",
                charge: ""
            });

            fetchShippingData();

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(""), 3000);
        }
    };

    useEffect(() => {
        fetchShippingData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 p-6">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Shipping Control Panel
                </h1>
                <p className="text-gray-500 mt-1">
                    Manage shipping prices by governorate
                </p>
            </div>

            {/* Form Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">

                {success && (
                    <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl mb-4 text-center">
                        {success}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="grid md:grid-cols-3 gap-4 items-end"
                >

                    {/* Governorate */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Governorate
                        </label>

                        <select
                            value={formData.governorate}
                            name="Governorate"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    governorate: e.target.value
                                })
                            }
                            className="w-full bg-white border mt-3 border-gray-300 text-gray-700 rounded-xl p-3 focus:outline-none focus:border-blue-500"
                            required
                        >
                            <option value="">Select governorate</option>
                            {governorates.map((gov) => (
                                <option key={gov} value={gov}>
                                    {gov}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Charge */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Shipping Charge
                        </label>

                        <input
                            type="number"
                            min="0"
                            required
                            value={formData.charge}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    charge: e.target.value
                                })
                            }
                            className="w-full bg-white border mt-2 border-gray-300 text-gray-700 rounded-xl p-3 focus:outline-none focus:border-blue-500"
                            placeholder="e.g. 40"
                        />
                    </div>

                    {/* Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>

                </form>
            </div>

            {/* Table Card */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <h3 className="text-gray-800 font-semibold">
                        Shipping Prices
                    </h3>
                    <span className="text-gray-500 text-sm">
                        {shippingData.length} items
                    </span>
                </div>

                <div className="overflow-x-auto">

                    <table className="w-full text-left">

                        <thead className="bg-gray-100 text-gray-600 text-sm">
                        <tr>
                            <th className="p-4">#</th>
                            <th className="p-4">Governorate</th>
                            <th className="p-4">Charge</th>
                        </tr>
                        </thead>

                        <tbody>

                        {shippingData.length > 0 ? (
                            shippingData.map((item, index) => (
                                <tr
                                    key={item._id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                                >
                                    <td className="p-4 text-gray-500">
                                        {index + 1}
                                    </td>

                                    <td className="p-4 text-gray-700">
                                        {item.governorate}
                                    </td>

                                    <td className="p-4 text-blue-600 font-semibold">
                                        {item.charge} EGP
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="text-center p-10 text-gray-400"
                                >
                                    No shipping data found
                                </td>
                            </tr>
                        )}

                        </tbody>

                    </table>

                </div>
            </div>

        </div>
    );
};
export default Shipping;