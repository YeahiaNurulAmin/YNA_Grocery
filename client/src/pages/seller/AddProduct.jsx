import React, { useState } from 'react'
import { categories } from '../../assets/assets'

const AddProduct = () => {

    const [productData, setProductData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        offerPrice: "",
        images: []
    });

    // Handle form submission
    const submitHandler = async (e) => {
        e.preventDefault();
        console.log(productData);

    }

    return (
        <div className="no-scrollbar overflow-y-scroll py-10 flex flex-col justify-between bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100">
            <form onSubmit={submitHandler} className="md:p-10 p-4 space-y-5 max-w-lg">
                <div>
                    <p className="text-base font-medium">Product Image</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {Array(4).fill('').map((_, index) => (
                            <label key={index} htmlFor={`image${index}`}>
                                <input onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const newImages = [...productData.images];
                                        newImages[index] = file;
                                        setProductData({ ...productData, images: newImages });
                                    }
                                }} accept="image/*" type="file" id={`image${index}`} hidden />
                                <div className="w-24 h-24 flex items-center justify-center">
                                    {productData.images[index] ? <img src={URL.createObjectURL(productData.images[index])} alt="" className="rounded w-full h-full object-cover border dark:border-slate-700" /> :
                                        <div className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-primary/50 rounded-lg bg-primary/5 cursor-pointer hover:bg-primary/10 hover:border-primary transition-all text-primary/60">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                    }
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                    <input id="product-name" type="text" value={productData.name} onChange={(e) => setProductData({ ...productData, name: e.target.value })} placeholder="Type here" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:border-primary transition-colors" required />
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                    <textarea id="product-description" rows={4} value={productData.description} onChange={(e) => setProductData({ ...productData, description: e.target.value })} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:border-primary transition-colors resize-none" placeholder="Type here"></textarea>
                </div>
                <div className="w-full flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="category">Category</label>
                    <select id="category" value={productData.category} onChange={(e) => setProductData({ ...productData, category: e.target.value })} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:border-primary transition-colors">
                        <option value="">Select Category</option>
                        {categories.map((item, index) => (
                            <option key={index} value={item.text} className="bg-white dark:bg-slate-800">{item.text}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                        <input id="product-price" type="number" value={productData.price} onChange={(e) => setProductData({ ...productData, price: e.target.value })} placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:border-primary transition-colors" required />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                        <input id="offer-price" type="number" value={productData.offerPrice} onChange={(e) => setProductData({ ...productData, offerPrice: e.target.value })} placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:border-primary transition-colors" required />
                    </div>
                </div>
                <button type='submit' className="px-8 py-2.5 bg-primary hover:bg-primary-dark cursor-pointer text-white font-medium rounded transition-colors">ADD</button>
            </form>
        </div>
    )
}

export default AddProduct