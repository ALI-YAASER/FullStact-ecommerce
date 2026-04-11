import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { assets } from "../assets/assets.js";

const Add = ({ token }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    sizes: [],
    bestseller: false,
    date: Date.now(),
  });
  const [image1,setImage1] = useState(false)
  const [image2,setImage2] = useState(false)
  const [image3,setImage3] = useState(false)
  const [image4,setImage4] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleSize = (size) => {
    setFormData((prev) => {
      const updatedSizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: updatedSizes };
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    // التحقق من الحقول المطلوبة
    if (!formData.name || !formData.description || !formData.price ||
        !formData.category || !formData.subCategory) {
      setError("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }
  
    try {
      const productData = new FormData();
  
      // تعبئة البيانات النصية مباشرة
      productData.append('name', formData.name);
      productData.append('description', formData.description);
      productData.append('price', formData.price);
      productData.append('category', formData.category);
      productData.append('subCategory', formData.subCategory);
      productData.append('bestseller', formData.bestseller);
      productData.append('sizes', JSON.stringify(formData.sizes)); // كـ JSON string
      productData.append('date', new Date().toISOString());

      if (image1) productData.append('images', image1);
      if (image2) productData.append('images', image2);
      if (image3) productData.append('images', image3);
      if (image4) productData.append('images', image4);


      const response = await axios.post(`${backendUrl}/api/products`, productData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
  
      if (response.data.success) {
        alert("✅ Product added successfully!");
  
        // إعادة تعيين النموذج
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          subCategory: "",
          sizes: [],
          bestseller: false,
          date: Date.now(),
        });
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
      }
    } catch (error) {
      console.error("❌ Full error object:", error);
      console.error("❌ Error uploading product:", error.response?.data || error.message);
      setError(error.response?.data?.message || "An internal error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-2xl">

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">
          Add New Product
        </h2>

        {error && (
            <div className="alert alert-error mb-6">
              <span>{error}</span>
            </div>
        )}

        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >

          {/* Product Info */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block font-medium mb-2">
                Product Name*
              </label>

              <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered rounded-md p-1 w-full"
                  placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Price*
              </label>

              <input
                  type="number"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="input input-bordered w-full border border-blue-500 rounded-md "
                  placeholder="Enter price"
              />
            </div>

          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-2">
              Description*
            </label>

            <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                className="textarea textarea-bordered border border-gray-300 rounded-md w-full"
                rows="4"
                placeholder="Enter product description"
            />
          </div>

          {/* Categories */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block font-medium mb-2">
                Main Category*
              </label>

              <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="select select-bordered rounded-md w-full"
              >
                <option value="">Select category</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">
                Sub Category*
              </label>

              <select
                  name="subCategory"
                  required
                  value={formData.subCategory}
                  onChange={handleChange}
                  className="select select-bordered rounded-md w-full"
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
                          formData.sizes.includes(size)
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
                checked={formData.bestseller}
                onChange={handleChange}
                className="checkbox checkbox-primary w-4 h-4"
            />

            <label htmlFor="bestseller">
              Mark as Bestseller
            </label>
          </div>

          {/* Images */}
          <div>

            <p className="font-medium mb-3">
              Product Images (max 4)
            </p>

            <div className="flex flex-wrap gap-4">

              {[image1,image2,image3,image4].map((img,index)=>(
                  <label
                      key={index}
                      htmlFor={`image${index+1}`}
                      className="cursor-pointer"
                  >

                    <img
                        src={
                          !img
                              ? assets.upload_area
                              : URL.createObjectURL(img)
                        }
                        className="
                  w-24 h-24
                  object-cover
                  rounded-lg
                  border
                  hover:scale-105
                  transition
                "
                    />

                    <input
                        hidden
                        type="file"
                        id={`image${index+1}`}
                        onChange={(e)=>{
                          const setter = [
                            setImage1,
                            setImage2,
                            setImage3,
                            setImage4
                          ][index]

                          setter(e.target.files[0])
                        }}
                    />

                  </label>
              ))}

            </div>

          </div>

          {/* Submit Button */}
          <button
              type="submit"
              disabled={isSubmitting}
              className="
          btn
          w-full
          text-lg
          hover:bg-blue-800
          text-blue-700
          hover:text-white
          border
          border-blue-500
          py-1
          rounded-md
          transition
        "
          >

            {isSubmitting
                ? "Adding Product..."
                : "Add Product"}

          </button>

        </form>

      </div>
  );
};

export default Add;