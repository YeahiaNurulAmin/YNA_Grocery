import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { categories } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const EditProduct = () => {
    const { id } = useParams();
    console.log("Product ID from URL:", id);
    const { axios, navigate } = useAppContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [productData, setProductData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        offerPrice: "",
        images: [],
        existingImages: [],
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/id?id=${id}`);

                console.log("Fetched product data:", data);
                
                if (data.success && data.product) {
                    setProductData({
                        name: data.product.name || "",
                        description: data.product.description || "",
                        category: data.product.category || "",
                        price: data.product.price || "",
                        offerPrice: data.product.offerPrice || "",
                        images: [],
                        existingImages: data.product.images || [],
                    });
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Error loading product");
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id, axios]);

    const submitHandler = async (e) => {
        try {
            e.preventDefault();
            setIsSubmitting(true);

            if (
                !productData.name ||
                !productData.category ||
                !productData.price
            ) {
                toast.error("Please fill all required fields");
                setIsSubmitting(false);
            } else {
                const formData = new FormData();
                formData.append("id", id);
                formData.append("productDate", JSON.stringify({
                    name: productData.name,
                    description: productData.description,
                    category: productData.category,
                    price: productData.price,
                    offerPrice: productData.offerPrice,
                }));
                productData.images.forEach((image) => {
                    if (image) {
                        formData.append("images", image);
                    }
                });
                const { data } = await axios.put(
                    "/api/products/update",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                if (data.message === "Product updated successfully") {
                    toast.success("Product updated successfully");
                    navigate("/seller/products");
                } else {
                    toast.error("Error updating product");
                }
                setIsSubmitting(false);
            }
        } catch (error) {
            toast.error("Error updating product");
            console.error("Error updating product:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="no-scrollbar overflow-y-scroll py-6 md:py-10 flex flex-col justify-between bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100">
            <form
                onSubmit={submitHandler}
                className="lg:p-10 md:p-6 p-4 space-y-4 md:space-y-5 max-w-lg w-full">
                {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <p className="text-gray-600 dark:text-slate-400">Loading product...</p>
                    </div>
                ) : (
                    <>
                        <div>
                            <p className="text-sm md:text-base font-medium">Product Image</p>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2">
                                {Array(4)
                                    .fill("")
                                    .map((_, index) => (
                                        <label key={index} htmlFor={`image${index}`}>
                                            <input
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const newImages = [
                                                            ...productData.images,
                                                        ];
                                                        newImages[index] = file;
                                                        setProductData({
                                                            ...productData,
                                                            images: newImages,
                                                        });
                                                    }
                                                }}
                                                accept="image/*"
                                                type="file"
                                                id={`image${index}`}
                                                hidden
                                            />
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center">
                                                {productData.images[index] ? (
                                                    <img
                                                        src={URL.createObjectURL(
                                                            productData.images[index],
                                                        )}
                                                        alt=""
                                                        className="w-full h-full object-cover rounded border dark:border-slate-700"
                                                    />
                                                ) : productData.existingImages[index] ? (
                                                    <img
                                                        src={productData.existingImages[index]}
                                                        alt=""
                                                        className="w-full h-full object-cover rounded border dark:border-slate-700"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-primary/50 rounded-lg bg-primary/5 cursor-pointer hover:bg-primary/10 hover:border-primary transition-all text-primary/60">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth={2}>
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M12 4v16m8-8H4"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                            </div>
                        </div>
                <div className="flex flex-col gap-1">
                    <label
                        className="text-sm md:text-base font-medium"
                        htmlFor="product-name">
                        Product Name
                    </label>
                    <input
                        id="product-name"
                        type="text"
                        value={productData.name}
                        onChange={(e) =>
                            setProductData({
                                ...productData,
                                name: e.target.value,
                            })
                        }
                        placeholder="Type here"
                        className="outline-none py-2 md:py-2.5 px-3 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:border-primary transition-colors text-sm"
                        required
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label
                        className="text-sm md:text-base font-medium"
                        htmlFor="product-description">
                        Product Description
                    </label>
                    <textarea
                        id="product-description"
                        rows={4}
                        value={productData.description}
                        onChange={(e) =>
                            setProductData({
                                ...productData,
                                description: e.target.value,
                            })
                        }
                        className="outline-none py-2 md:py-2.5 px-3 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:border-primary transition-colors resize-none text-sm"
                        placeholder="Type here"></textarea>
                </div>
                <div className="w-full flex flex-col gap-1">
                    <label className="text-sm md:text-base font-medium" htmlFor="category">
                        Category
                    </label>
                    <select
                        id="category"
                        value={productData.category}
                        onChange={(e) =>
                            setProductData({
                                ...productData,
                                category: e.target.value,
                            })
                        }
                        className="outline-none py-2 md:py-2.5 px-3 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:border-primary transition-colors text-sm">
                        <option value="">Select Category</option>
                        {categories.map((item, index) => (
                            <option key={index} value={item.text} className="bg-white dark:bg-slate-800">
                                {item.text}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 md:gap-5">
                    <div className="flex flex-col gap-1 w-full sm:w-auto sm:flex-1">
                        <label
                            className="text-sm md:text-base font-medium"
                            htmlFor="product-price">
                            Product Price
                        </label>
                        <input
                            id="product-price"
                            type="number"
                            value={productData.price}
                            onChange={(e) =>
                                setProductData({
                                    ...productData,
                                    price: e.target.value,
                                })
                            }
                            placeholder="0"
                            className="outline-none py-2 md:py-2.5 px-3 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:border-primary transition-colors text-sm"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-full sm:w-auto sm:flex-1">
                        <label
                            className="text-sm md:text-base font-medium"
                            htmlFor="offer-price">
                            Offer Price
                        </label>
                        <input
                            id="offer-price"
                            type="number"
                            value={productData.offerPrice}
                            onChange={(e) =>
                                setProductData({
                                    ...productData,
                                    offerPrice: e.target.value,
                                })
                            }
                            placeholder="0"
                            className="outline-none py-2 md:py-2.5 px-3 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:border-primary transition-colors text-sm"
                            required
                        />
                    </div>
                </div>
                        <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-40 py-2 md:py-3 px-4 rounded-lg bg-primary/80 hover:bg-primary disabled:bg-gray-400 text-white text-sm md:text-base font-medium transition-all duration-200">
                                {isSubmitting ? "UPDATING..." : "UPDATE"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/seller/products")}
                                className="w-full sm:w-40 py-2 md:py-3 px-4 rounded-lg bg-gray-300 dark:bg-slate-700 hover:bg-gray-400 dark:hover:bg-slate-600 text-gray-800 dark:text-slate-200 text-sm md:text-base font-medium transition-all duration-200">
                                CANCEL
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default EditProduct;
