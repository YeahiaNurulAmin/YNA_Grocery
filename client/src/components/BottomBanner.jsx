import React from "react";
import { assets, features } from "../assets/assets";

const BottomBanner = () => {
    return (
        <div className="relative mt-24">
            <img
                src={assets.bottom_banner_image}
                alt="Banner"
                className="w-full h-[450px] md:h-[500px] lg:h-[600px] object-cover object-center hidden md:block rounded-xl"
            />
            <img
                src={assets.bottom_banner_image_sm}
                alt="Banner"
                className="w-full h-[450px] object-cover object-center md:hidden rounded-xl"
            />
            <div className="absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-24">
                <div>
                    <h1 className="text-2xl md:text-4x1 font-semibold text-primary mb-6">
                        Why We Are The Best
                    </h1>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 mt-2">
                            <img
                                className="w-9 md:w-12"
                                src={feature.icon}
                                alt={feature.title}
                            />
                            <div className=" gap-4 mt-4">
                                <h2 className="text-lg md:text-xl font-semibold text-text-secondary">
                                    {feature.title}
                                </h2>
                                <p className="text-xs md:text-sm text-text-tertiary">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BottomBanner;
