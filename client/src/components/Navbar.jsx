import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
const Navbar = () => {
    const [open, setOpen] = React.useState(false);
    const [userMenuOpen, setUserMenuOpen] = React.useState(false);
    const {
        user,
        setUser,
        setShowUserLogin,
        navigate,
        cartItems,
        searchQuery,
        setSearchQuery,
        axios,
    } = useAppContext();

    // Handlers
    const logoutHandler = async () => {
        try {
            const { data } = await axios.get("/api/users/logout");

            if (data.success) {
                toast.success(data.message);
                setUser(null);
                navigate("/");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error in logoutHandler:", error);
        }
    };

    // Get numbers of items in cart
    const getNumberOfCartItems = () => {
        let numOfCartItems = null;

        for (const item in cartItems) {
            numOfCartItems += cartItems[item];
        }
        return numOfCartItems;
    };

    useEffect(() => {
        if (searchQuery) {
            navigate("/products");
        }
    }, [searchQuery]);

    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
            <NavLink to="/">
                <assets.YNALogo></assets.YNALogo>
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8 font-bold text-accent">
                <NavLink className="hover:text-accent-dark" to="/">
                    Home
                </NavLink>
                <NavLink className="hover:text-accent-dark" to="/products">
                    All Product
                </NavLink>
                <NavLink className="hover:text-accent-dark" to="/">
                    Contact
                </NavLink>

                <div className="hidden lg:flex items-center text-sm gap-2 border border-primary px-3 rounded-full">
                    <input
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            console.log(e.target.value);
                        }}
                        className="py-1.5 w-full bg-transparent outline-none placeholder-text-tertiary"
                        type="text"
                        placeholder="Search products"
                    />
                    <svg
                        className="cursor-pointer"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10.836 10.615 15 14.695"
                            stroke="#ff6b35"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            clip-rule="evenodd"
                            d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
                            stroke="#ff6b35"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </div>

                <div
                    onClick={() => navigate("/cart")}
                    className="relative cursor-pointer">
                    <img
                        className="w-8"
                        src={assets.nav_cart_icon}
                        alt="Cart Icon"
                    />
                    {getNumberOfCartItems() && (
                        <button className="absolute -top-2 -right-3 text-xs text-white bg-accent w-[18px] h-[18px] rounded-full">
                            {getNumberOfCartItems()}
                        </button>
                    )}
                </div>

                {!user ? (
                    <button
                        onClick={() => {
                            setShowUserLogin(true);
                        }}
                        className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dark transition text-white rounded-full">
                        Login
                    </button>
                ) : (
                    <div className="relative">
                        <img
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            src={assets.profile_icon}
                            className="w-12 cursor-pointer"
                            alt="Profile icon"
                        />
                        {userMenuOpen && (
                            <ul className="absolute bg-bg-light-mint border border-gray-200 p-2.5 w-30 rounded-md rounded-tr-none text-sm z-40 transition duration-700 top-12 right-5">
                                <li
                                    onClick={() => {
                                        navigate("/my-orders");
                                        setUserMenuOpen(false);
                                    }}
                                    className="p-1.5 pl-3 hover:bg-primary hover:text-white hover:rounded-md cursor-pointer">
                                    My Orders
                                </li>
                                <li
                                    onClick={() => {
                                        logoutHandler();
                                        setUserMenuOpen(false);
                                    }}
                                    className="p-1.5 pl-3 hover:bg-primary hover:text-white hover:rounded-md cursor-pointer">
                                    Logout
                                </li>
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile Menu */}
            <div
                onClick={() => navigate("/cart")}
                className="relative cursor-pointer md:hidden">
                <img
                    className="w-8"
                    src={assets.nav_cart_icon}
                    alt="Cart Icon"
                />
                {getNumberOfCartItems() && (
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-accent w-[18px] h-[18px] rounded-full">
                        {getNumberOfCartItems()}
                    </button>
                )}
            </div>

            <button
                onClick={() => (open ? setOpen(false) : setOpen(true))}
                aria-label="Menu"
                className="sm:hidden hover:cursor-pointer text-primary ">
                {/* Menu Icon SVG */}
                <svg
                    width="21"
                    height="15"
                    viewBox="0 0 21 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <rect
                        width="21"
                        height="1.5"
                        rx=".75"
                        fill="currentColor"
                    />
                    <rect
                        x="8"
                        y="6"
                        width="13"
                        height="1.5"
                        rx=".75"
                        fill="currentColor"
                    />
                    <rect
                        x="6"
                        y="13"
                        width="15"
                        height="1.5"
                        rx=".75"
                        fill="currentColor"
                    />
                </svg>
            </button>

            <div
                className={`${open ? "flex" : "hidden"} absolute top-[80px] right-0 w-full  bg-white shadow-md py-4 flex-col items-end gap-5 px-5 text-sm md:hidden z-10`}>
                <NavLink to="/" onClick={() => setOpen(false)}>
                    Home
                </NavLink>
                <NavLink to="/products" onClick={() => setOpen(false)}>
                    All Product
                </NavLink>
                {user && (
                    <NavLink to="/" onClick={() => setOpen(false)}>
                        My Orders
                    </NavLink>
                )}
                <NavLink to="/contact" onClick={() => setOpen(false)}>
                    Contact
                </NavLink>

                {!user ? (
                    <button
                        onClick={() => {
                            setOpen(false);
                            setShowUserLogin(true);
                        }}
                        className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dark transition text-white rounded-full text-sm">
                        Login
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setOpen(false);
                            logoutHandler();
                        }}
                        className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dark transition text-white rounded-full text-sm">
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
