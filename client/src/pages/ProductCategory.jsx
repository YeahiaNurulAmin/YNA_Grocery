import React from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { categories } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductCategory = () => {
    const { products } = useAppContext();
    const { category } = useParams();

    const searchCategory = categories.find(
        (cargo) => cargo.path.toLowerCase() === category.toLowerCase(),
    );

    const filteredProducts = products.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase(),
    );


    return (
        <div className="mt-16 min-h-dvh">
            {searchCategory ? (
                <div className="flex flex-col items-end w-max">
                    <p className="text-2x1 font-bold text-text-secondary">
                        {searchCategory.text.toUpperCase()}
                    </p>
                    <div className="w-16 h-0.5 bg-accent rounded-full"></div>
                </div>
            ) : (
                <h1>404 Not Found</h1>
            )}

            {filteredProducts.length === 0 ? (
                <div className="flex items-center justify-center h-[60vh]">
                    <h1 className="text-2x1 font-medium text-accent">Product Not Found In this Category</h1>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6 content-center justify-items-center">
                    {filteredProducts
                        .filter((product) => product.inStock)
                        .map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                </div>
            )}
        </div>
    );
};

export default ProductCategory;
