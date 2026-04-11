import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const Edit = ({ token }) => {
  const { id: paramId } = useParams();
  const [manualId, setManualId] = useState("");
  const productId = paramId || manualId;

  const [productData, setProductData] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProduct = async () => {
    if (!productId) return toast.error("Please provide a product ID");
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/products/${productId}`);
      if (res.data.success) {
        setProductData(res.data.product);
      } else {
        toast.error("Product not found");
      }
    } catch (err) {
      toast.error("Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramId) fetchProduct();
  }, [paramId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const toggleSize = (size) => {
    setProductData((prev) => {
      const updatedSizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: updatedSizes };
    });
  };

  const handleImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const clearNewImages = () => {
    setNewImages([]);
  };

  const removeExistingImage = (indexToRemove) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove)
    }));
  };

  const saveProduct = async () => {
    try {
      const formData = new FormData();

      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("category", productData.category);
      formData.append("subCategory", productData.subCategory);
      formData.append("bestseller", productData.bestseller);
      formData.append("date", productData.date);
      formData.append("date", new Date(productData.date).getTime());
      formData.append("sizes", JSON.stringify(productData.sizes));
      formData.append("images", JSON.stringify(productData.images));

      newImages.forEach((img) => {
        formData.append("images", img);
      });


      const res = await axios.put(
        `${backendUrl}/api/products/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Product updated successfully");
        setNewImages([]);
      } else {
        toast.error("Failed to update product");
      }
    } catch (err) {
      toast.error("Error while updating");
      console.error(err);
    }
  };

  return (
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-2xl">

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">
          Edit Product
        </h2>

        {!paramId && (
            <div className="flex gap-3 mb-6">

              <input
                  type="text"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  className="input input-bordered rounded-md  w-full"
                  placeholder="Enter Product ID"
              />

              <button
                  onClick={fetchProduct}
                  className="px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Load
              </button>

            </div>
        )}

        {!productData && (
            <p className="text-gray-500 text-center">
              No product loaded.
            </p>
        )}

        {productData && (

            <form className="space-y-6">

              {/* Product Info */}
              <div className="grid md:grid-cols-2 gap-6">

                <div>
                  <label className="block font-medium mb-2">
                    Product Name
                  </label>

                  <input
                      type="text"
                      name="name"
                      value={productData.name || ""}
                      onChange={handleChange}
                      className="input input-bordered rounded-md  w-full"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">
                    Price
                  </label>

                  <input
                      type="number"
                      name="price"
                      value={productData.price || ""}
                      onChange={handleChange}
                      className="input input-bordered rounded-md  w-full"
                  />
                </div>

              </div>

              {/* Description */}
              <div>

                <label className="block font-medium mb-2">
                  Description
                </label>

                <textarea
                    name="description"
                    value={productData.description || ""}
                    onChange={handleChange}
                    className="textarea textarea-bordered border border-gray-300 rounded-md  w-full"
                    rows="4"
                />

              </div>

              {/* Categories */}
              <div className="grid md:grid-cols-2 gap-6">

                <div>

                  <label className="block font-medium mb-2">
                    Main Category
                  </label>

                  <select
                      name="category"
                      value={productData.category}
                      onChange={handleChange}
                      className="select select-bordered rounded-md  w-full"
                  >

                    <option value="">Select category</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>

                  </select>

                </div>

                <div>

                  <label className="block font-medium mb-2">
                    Sub Category
                  </label>

                  <select
                      name="subCategory"
                      value={productData.subCategory}
                      onChange={handleChange}
                      className="select select-bordered rounded-md  w-full"
                  >

                    <option value="">Select sub-category</option>
                    <option value="Topwear">Topwear</option>
                    <option value="Bottomwear">Bottomwear</option>
                    <option value="Winterwear">Winterwear</option>
                    <option value="Accessories">Accessories</option>

                  </select>

                </div>

              </div>

              {/* Sizes */}
              <div>

                <label className="block font-medium mb-3">
                  Available Sizes
                </label>

                <div className="flex flex-wrap gap-3">

                  {["S","M","L","XL","XXL","XXXL"].map((size)=>(
                      <button
                          key={size}
                          type="button"
                          onClick={()=>toggleSize(size)}
                          className={`
                  px-4 py-2 rounded-lg border
                  transition
                  ${
                              productData.sizes.includes(size)
                                  ? "bg-blue-500 text-white border-blue-500"
                                  : "bg-gray-100 hover:bg-gray-200"
                          }
                `}
                      >
                        {size}
                      </button>
                  ))}

                </div>

              </div>

              {/* Bestseller */}
              <div className="flex items-center gap-3">

                <input
                    type="checkbox"
                    id="bestseller"
                    name="bestseller"
                    checked={productData.bestseller || false}
                    onChange={handleChange}
                    className="checkbox checkbox-primary w-4 w-4"
                />

                <label htmlFor="bestseller">
                  Mark as Bestseller
                </label>

              </div>

              {/* Date */}
              <div>

                <label className="block font-medium mb-2">
                  Product Date
                </label>

                <input
                    type="date"
                    value={
                      productData.date
                          ? new Date(productData.date)
                              .toISOString()
                              .split("T")[0]
                          : ""
                    }
                    onChange={(e)=>
                        setProductData(prev=>({
                          ...prev,
                          date:e.target.value
                        }))
                    }
                    className="input input-bordered rounded-md  w-full"
                />

              </div>

              {/* Existing Images */}
              {productData.images && (

                  <div>

                    <p className="font-medium mb-3">
                      Existing Images
                    </p>

                    <div className="flex flex-wrap gap-4">

                      {productData.images.map((img,index)=>(
                          <div
                              key={index}
                              className="relative w-24 h-24"
                          >

                            <img
                                src={img}
                                className="
                      w-full h-full
                      object-cover
                      rounded-lg
                      border
                    "
                            />

                            <button
                                type="button"
                                onClick={()=>
                                    removeExistingImage(index)
                                }
                                className="
                      absolute
                      top-0
                      right-0
                      bg-red-600
                      text-white
                      w-6 h-6
                      rounded-full
                      text-xs
                      hover:bg-red-700
                    "
                            >
                              ✕
                            </button>

                          </div>
                      ))}

                    </div>

                  </div>

              )}

              {/* Upload New Images */}
              <div>

                <p className="font-medium mb-2">
                  Upload New Images
                </p>

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input file-input-bordered rounded-md  w-full"
                />

                {newImages.length > 0 && (
                    <button
                        type="button"
                        onClick={clearNewImages}
                        className="
                mt-2
                text-sm
                text-red-500
                underline
              "
                    >
                      Clear new images
                    </button>
                )}

              </div>

              {/* Save Button */}
              <button
                  type="button"
                  onClick={saveProduct}
                  className="
            btn
            w-full
            text-lg
            hover:bg-blue-800
            text-blue-700
            hover:text-white
            border
            border-blue-500
            py-2
            rounded-md
            transition
          "
              >

                Save Changes

              </button>

            </form>

        )}

      </div>
  );
};

export default Edit;

