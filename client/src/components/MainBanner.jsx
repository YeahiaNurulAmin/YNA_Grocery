import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const MainBanner = () => {
    return (
        <div className="relative">
            <img
                src={assets.main_banner_bg}
                alt="Banner"
                className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover object-center hidden md:block rounded-xl"
            />
            <img
                src={assets.main_banner_bg_sm}
                alt="Banner"
                className="w-full h-[400px] object-cover object-center md:hidden rounded-xl"
            />
            <div className="absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24">
                <h1 className="text-5xl md:text-3xl lg:text-5xl font-bold text-center md:text-left max-w-72 md:max-w-80 lg:max-w-105 leading-tight lg:leading-15 text-text-secondary">
                    Quality You Trust, Freshness You Taste
                </h1>

                <div className="flex items-center mt-6 font-medium">
                    <Link
                        to="/products"
                        className="group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dark transition rounded text-white cursor-pointer">
                        Shop Now
                        <img
                            className="md:hidden transition group-focus: translate-x-1"
                            src={assets.white_arrow_icon}
                            alt="arrow"
                        />
                    </Link>

                    <Link
                        to="/products"
                        className="font-bold text-accent-light group hidden md:flex hover:text-accent-dark items-center gap-2 px-9 py-3 cursor-pointer">
                        Explore deals
                        <img
                            className="w-5 transition duration-300 group-hover:translate-x-2"
                            src={assets.black_arrow_icon}
                            alt="arrow"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MainBanner;
