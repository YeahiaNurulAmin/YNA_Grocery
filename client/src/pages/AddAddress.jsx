import React, { useState } from "react";
import { dummyAddress } from "../assets/assets";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useEffect } from "react";

const AddAddress = () => {
    const { navigate, axios, user } = useAppContext();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phone: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            
            const { data } = await axios.post("/api/address/add", { address: formData });

            if (data.success) {
                toast.success("Address added successfully");
                navigate("/cart");

            } else {
                toast.error(data.message || "Failed to add address");

            }
        } catch (error) {
            toast.error("Error adding address");
            console.error("Error adding address:", error);
        }
    };

    const inputFields = (name, placeholder, value, onChange, type = "text") => (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            className="border border-gray-300 rounded py-2.5 px-3 w-full outline-none focus:border-primary text-gray-700"
            required
        />
    );

    useEffect(() => {
        if(!user) {
            navigate("/cart");
        }
    }, []);

    return (
        <div className="max-w-6xl w-full px-6 mx-auto py-16 flex flex-col md:flex-row items-center gap-10">
            {/* Form Section */}
            <div className="flex-1 w-full max-w-xl">
                <h2 className="text-2xl font-medium text-text-secondary mb-8">
                    Add Shipping <span className="text-primary">Address</span>
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        {inputFields(
                            "firstName",
                            "First Name",
                            formData.firstName,
                            handleChange,
                        )}
                        {inputFields(
                            "lastName",
                            "Last Name",
                            formData.lastName,
                            handleChange,
                        )}
                    </div>
                    {inputFields(
                        "email",
                        "Email address",
                        formData.email,
                        handleChange,
                        "email",
                    )}
                    {inputFields(
                        "street",
                        "Street",
                        formData.street,
                        handleChange,
                    )}
                    <div className="flex gap-4">
                        {inputFields(
                            "city",
                            "City",
                            formData.city,
                            handleChange,
                        )}
                        {inputFields(
                            "state",
                            "State",
                            formData.state,
                            handleChange,
                        )}
                    </div>
                    <div className="flex gap-4">
                        {inputFields(
                            "zipCode",
                            "Zip code",
                            formData.zipCode,
                            handleChange,
                        )}
                        {inputFields(
                            "country",
                            "Country",
                            formData.country,
                            handleChange,
                        )}
                    </div>
                    {inputFields(
                        "phone",
                        "Phone",
                        formData.phone,
                        handleChange,
                        "tel",
                    )}
                    <button
                        type="submit"
                        className="bg-primary hover:bg-primary-dark cursor-pointer text-white font-medium py-3 rounded transition w-full uppercase">
                        Save Address
                    </button>
                </form>
            </div>

            {/* Image Section */}
            <div className="flex-1 hidden md:flex justify-center items-center">
                <img
                    src={assets.add_address_iamge}
                    alt="Add Address Illustration"
                    className="max-w-full h-auto w-3/4"
                />
            </div>
        </div>
    );
};

export default AddAddress;
