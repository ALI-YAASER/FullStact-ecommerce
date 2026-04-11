import React, { useEffect, useState } from 'react';
import { assets } from "../assets/assets.js";
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const List = ({ token }) => {

    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    // ⭐ Search State
    const [searchTerm, setSearchTerm] = useState("");

    const currency = "$";

    const fetchlist = async () => {
        try {

            setLoading(true);

            const response = await axios.get(
                backendUrl + '/api/products'
            );

            if (response.data.success) {

                setList(response.data.products || []);

            } else {

                toast.error(
                    response.data.message ||
                    "Failed to fetch products"
                );

            }

        } catch (err) {

            console.error(err);
            toast.error("Error loading products");

        } finally {

            setLoading(false);

        }
    };

    const removeproduct = async (id) => {

        if (!window.confirm(
            "Are you sure you want to delete this product?"
        )) return;

        try {

            const response = await axios.delete(
                `${backendUrl}/api/products/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {

                toast.success("Product deleted successfully");

                fetchlist();

            } else {

                toast.error(response.data.message);

            }

        } catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Failed to delete product"
            );

        }

    };

    useEffect(() => {

        fetchlist();

    }, []);

    // ⭐ Filtered List (name + category + price)

    const filteredList = list.filter((item) => {

        const term = searchTerm.toLowerCase();

        return (

            item.name?.toLowerCase().includes(term) ||

            item.category?.toLowerCase().includes(term) ||

            item.price?.toString().includes(term)

        );

    });

    return (

        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">

            {/* Header */}

            <div className="
                flex flex-col
                lg:flex-row
                justify-between
                items-start
                lg:items-center
                mb-8
                gap-4
            ">

                <div>

                    <h1 className="
                        text-3xl
                        font-bold
                        text-gray-900
                        tracking-tight
                    ">
                        Inventory
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage and track your store products
                    </p>

                </div>

                {/* Search */}

                <div className="
                    flex flex-col
                    sm:flex-row
                    gap-3
                    w-full
                    lg:w-auto
                ">

                    <input
                        type="text"
                        placeholder="🔍 Search by name, category or price..."
                        value={searchTerm}
                        onChange={(e)=>
                            setSearchTerm(e.target.value)
                        }
                        className="
                            input
                            input-bordered
                            w-full
                            p-3
                            mt-1
                            sm:w-64
                            rounded-xl
                            border-gray-200
                            focus:border-blue-500
                        "
                    />

                    <div className="
                        bg-white
                        px-4
                        py-2
                        rounded-2xl
                        shadow-sm
                        border
                        border-gray-100
                    ">

                        <span className="
                            text-blue-600
                            font-bold
                        ">
                            {filteredList.length}
                        </span>

                        <span className="
                            text-gray-500
                            ml-2
                            text-sm
                            font-medium
                        ">
                            Results
                        </span>

                    </div>

                </div>

            </div>

            {loading ? (

                <div className="
                    flex
                    flex-col
                    justify-center
                    items-center
                    h-64
                    gap-4
                ">

                    <div className="
                        animate-spin
                        rounded-full
                        h-12
                        w-12
                        border-t-4
                        border-blue-600
                        border-opacity-25
                    "></div>

                    <p className="
                        text-gray-400
                        font-medium
                        animate-pulse
                    ">
                        Fetching inventory...
                    </p>

                </div>

            ) : (

                <>

                    {/* ⭐ Mobile Cards */}

                    <div className="md:hidden space-y-4">

                        {filteredList.length > 0 ? (

                            filteredList.map((item,index)=>(

                                <div
                                    key={item._id || index}
                                    className="
                                        bg-white
                                        p-4
                                        rounded-2xl
                                        shadow-sm
                                        border
                                    "
                                >

                                    <div className="flex gap-4">

                                        <img
                                            src={
                                                item.images?.[0] ||
                                                assets.placeholder_image
                                            }
                                            className="
                                                w-20 h-20
                                                rounded-xl
                                                object-cover
                                            "
                                        />

                                        <div className="flex-1">

                                            <h3 className="font-bold">
                                                {item.name}
                                            </h3>

                                            <p className="text-gray-500 text-sm">
                                                {item.category}
                                            </p>

                                            <p className="font-bold mt-1">
                                                {currency}{item.price}
                                            </p>

                                        </div>

                                    </div>

                                    <div className="
                                        flex
                                        gap-2
                                        mt-4
                                    ">

                                        <Link
                                            to={`/edit/${item._id}`}
                                            className="
                                                flex-1
                                                text-center
                                                p-2
                                                text-blue-600
                                                hover:bg-blue-100
                                                rounded-lg
                                            "
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={()=>
                                                removeproduct(item._id)
                                            }
                                            className="
                                                flex-1
                                                p-2
                                                text-rose-600
                                                hover:bg-rose-100
                                                rounded-lg
                                            "
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>

                            ))

                        ) : (

                            <p className="text-center text-gray-400">
                                No matching products found.
                            </p>

                        )}

                    </div>

                    {/* ⭐ Desktop Table */}

                    <div className="
                        hidden
                        md:block
                        bg-white
                        rounded-3xl
                        shadow-sm
                        border
                        border-gray-200
                        overflow-x-auto
                    ">

                        <table className="
                            w-full
                            text-left
                            border-collapse
                        ">

                            <thead className="
                                bg-gray-50
                                border-b
                                border-gray-100
                            ">

                            <tr>

                                <th className="px-6 py-4 text-xs font-semibold text-gray-400">
                                    #
                                </th>

                                <th className="px-6 py-4">
                                    Product
                                </th>

                                <th className="px-6 py-4">
                                    Category
                                </th>

                                <th className="px-6 py-4">
                                    Price
                                </th>

                                <th className="px-6 py-4 text-center">
                                    Actions
                                </th>

                            </tr>

                            </thead>

                            <tbody>

                            {filteredList.map((item,index)=>(

                                <tr
                                    key={item._id || index}
                                    className="hover:bg-blue-50 transition"
                                >

                                    <td className="px-6 py-4">
                                        {index + 1}
                                    </td>

                                    <td className="px-6 py-4">

                                        <div className="flex items-center gap-4">

                                            <img
                                                src={
                                                    item.images?.[0] ||
                                                    assets.placeholder_image
                                                }
                                                className="
                                                    w-16 h-16
                                                    rounded-xl
                                                    object-cover
                                                "
                                            />

                                            <span className="font-semibold">
                                                {item.name}
                                            </span>

                                        </div>

                                    </td>

                                    <td className="px-6 py-4">
                                        {item.category}
                                    </td>

                                    <td className="px-6 py-4 font-bold">
                                        {currency}{item.price}
                                    </td>

                                    <td className="px-6 py-4">

                                        <div className="flex justify-center gap-2">

                                            <Link
                                                to={`/edit/${item._id}`}
                                                className="
                                                    p-2
                                                    text-blue-600
                                                    hover:bg-blue-100
                                                    rounded-lg
                                                "
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={()=>
                                                    removeproduct(item._id)
                                                }
                                                className="
                                                    p-2
                                                    text-rose-600
                                                    hover:bg-rose-100
                                                    rounded-lg
                                                "
                                            >
                                                Remove
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                            </tbody>

                        </table>

                    </div>

                </>

            )}

        </div>

    );

};

export default List;