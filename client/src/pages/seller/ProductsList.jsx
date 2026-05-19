import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ProductsList = () => {
    const {products, currency, fetchProducts, axios, navigate} = useAppContext();
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    // HANDLERS
    const handleDeleteProduct = async (productId) => {
        try {
            const { data } = await axios.delete("/api/products/delete", {
                data: { id: productId }
            });
            if (data.message === "Product deleted successfully") {
                toast.success("Product deleted successfully");
                setConfirmDeleteId(null);
                fetchProducts();
            } else {
                toast.error("Error deleting product");
            }
        } catch (error) {
            toast.error("Error deleting product");
            console.error("Error deleting product:", error);
        }
    };

    const handleToggleStock = async (productId, currentStockStatus) => {
        try {
            const { data } = await axios.put("/api/products/stock", {
                id: productId,
                inStock: !currentStockStatus
            });

            if (data.success) {
                toast.success("Product stock status changed successfully");
                fetchProducts();
            } else {
                toast.error("Error changing product stock status");
            }
            
        } catch (error) {
            toast.error("Error changing product stock status");
            console.error("Error changing product stock status:", error);
        }
    }

    return (
        <div className="no-scrollbar overflow-y-scroll h-[95vh] flex-1 flex flex-col justify-between">
            <div className="w-full lg:p-10 md:p-6 p-3">
                <h2 className="pb-4 md:text-lg text-base font-medium">All Products</h2>
                <div className="flex flex-col items-center max-w-6xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-xs md:text-sm">
                            <thead className="text-gray-900 text-left bg-gray-50">
                                <tr>
                                    <th className="px-2 md:px-4 py-2 md:py-3 font-semibold truncate">Product</th>
                                    <th className="px-2 md:px-4 py-2 md:py-3 font-semibold truncate">Category</th>
                                    <th className="px-2 md:px-4 py-2 md:py-3 font-semibold truncate  sm:table-cell">Price</th>
                                    <th className="px-2 md:px-4 py-2 md:py-3 font-semibold truncate  md:table-cell">Offer</th>
                                    <th className="px-2 md:px-4 py-2 md:py-3 font-semibold truncate">Stock</th>
                                    <th className="px-2 md:px-4 py-2 md:py-3 font-semibold truncate">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-500">
                                {products.map((product) => (
                                    <tr key={product._id} className="border-t border-gray-500/20 hover:bg-gray-50">
                                        <td className="px-2 md:px-4 py-2 md:py-3 flex items-center space-x-2">
                                            <div className="border border-gray-300 rounded overflow-hidden flex-shrink-0">
                                                <img src={product.images[0]} alt="Product" className="w-10 h-10 md:w-16 md:h-16 object-cover" />
                                            </div>
                                            <span className="truncate text-xs md:text-sm">{product.name}</span>
                                        </td>
                                        <td className="px-2 md:px-4 py-2 md:py-3 truncate text-xs md:text-sm">{product.category}</td>
                                        <td className="px-2 md:px-4 py-2 md:py-3 truncate text-xs md:text-sm  sm:table-cell">{currency}{product.price}</td>
                                        <td className="px-2 md:px-4 py-2 md:py-3 truncate text-xs md:text-sm  md:table-cell">{currency}{product.offerPrice}</td>
                                        <td className="px-2 md:px-4 py-2 md:py-3">
                                            <label className="relative inline-flex items-center cursor-pointer text-gray-900">
                                                <input onChange={() => {handleToggleStock(product._id, product.inStock)}} type="checkbox" className="sr-only peer" defaultChecked={product.inStock} />
                                                <div className="w-10 h-5 md:w-12 md:h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                                                <span className="dot absolute left-1 top-0.5 md:top-1 w-4 h-4 md:w-5 md:h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4 md:peer-checked:translate-x-5"></span>
                                            </label>
                                        </td>
                                        <td className="px-2 md:px-4 py-2 md:py-3">
                                            <div className="flex flex-col sm:flex-row gap-1 md:gap-2">
                                                <button
                                                    onClick={() => navigate(`/seller/update-product/${product._id}`)}
                                                    className="px-2 md:px-3 py-1 md:py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs md:text-sm font-medium rounded transition-colors duration-200 whitespace-nowrap">
                                                    Edit
                                                </button>
                                                {confirmDeleteId === product._id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleDeleteProduct(product._id)}
                                                            className="w-6 h-8 md:w-8 text-center py-1 md:py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm md:text-base font-medium rounded transition-colors duration-200">
                                                            ✔
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmDeleteId(null)}
                                                            className="w-6 h-8 md:w-8 text-center py-1 md:py-1.5 bg-gray-400 hover:bg-gray-500 text-white text-sm md:text-base font-medium rounded transition-colors duration-200">
                                                            ❌
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => setConfirmDeleteId(product._id)}
                                                        className="w-18 h-8 px-2 md:px-3 py-1 md:py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs md:text-sm font-medium rounded transition-colors duration-200 whitespace-nowrap">
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductsList