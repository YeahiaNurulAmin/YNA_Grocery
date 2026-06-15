import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    // Environment Variables
    const currency = import.meta.env.VITE_CURRENCY;

    // Navigation
    const navigate = useNavigate();
    // States
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch seller status
    const fetchSellerStatus = async () => {
        try {
            const { data } = await axios.get("/api/seller/is-auth");
            if (data.success) {
                setIsSeller(true);
            } else {
                setIsSeller(false);
            }
        } catch (error) {
            console.log("Error fetching seller status:", error);
        }
    };


    // Fetch user auth status
    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/users/is-auth");

            console.log("User auth response:", data);

            if (data.success) {
                setUser(data.user);
                setCartItems(data.cartItems || {});
            } else {
                setUser(null);
                setCartItems({});
            }
        } catch (error) {

            console.error("Error in fetchUser", error);
            setCartItems({});
        }
    };

    // Helper Functions
    // Fetch all products
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get("/api/products/list");
            if (data.success) {
                setProducts(data.products);
            } else {
                setProducts([]);
                console.log("Error fetching products:", data.message);
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error fetching products:", error);
            toast.error("Error fetching products");
        }
    };

    // Add to cart function
    const addToCart = (itemID) => {
        let itemData = structuredClone(cartItems);

        console.log("Adding to cart:", itemID);

        if (itemData[itemID]) {
            console.log("Item already in cart, incrementing quantity");
            itemData[itemID] += 1;
        } else {
            console.log("Item not in cart, adding to cart");
            itemData[itemID] = 1;
        }
        setCartItems(itemData);

        toast.success("Item added to cart");
    };

    // Update cart
    const updateCartItem = (itemID, quantity) => {
        let cartData = structuredClone(cartItems);

        cartData[itemID] = quantity;
        setCartItems(cartData);

        toast.success("Cart Updated");
    };

    // Remove products from cart
    const removeFromCart = (itemID) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemID]) {
            cartData[itemID] -= 1;

            if (cartData[itemID] === 0) {
                delete cartData[itemID];
            }
        }
        setCartItems(cartData);
        toast.success("Item removed from cart");
    };

    // Get total abound
    const getCartAmount = () => {
        let total = 0;

        for (let itemID in cartItems) {
            let product = products.find((product) => product._id === itemID);
            if (product) {
                if (product.offerPrice > 0)
                    total += product.offerPrice * cartItems[itemID];
                else total += product.price * cartItems[itemID];
            }
        }
        return (total * 100) / 100;
    };

    //
    useEffect(() => {
        fetchProducts();
        fetchSellerStatus();
        fetchUser();
    }, []);
    // Update cart in the database
    useEffect(() => {
        const updateCartInDB = async () => {
            try {
                const { data } = await axios.post("/api/cart/update", { cartItems });
                if (!data.success) {
                    console.error("Error updating cart in DB:", data.message);
                    toast.error(data.message);
                }
            } catch (error) {
                console.error("Error updating cart in DB:", error);
                toast.error("Error updating cart");
            }
        };

        if (user) {
            updateCartInDB();
        }
    }, [cartItems]);


    const value = {
        navigate,
        user,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setShowUserLogin,
        products,
        currency,
        addToCart,
        updateCartItem,
        removeFromCart,
        cartItems,
        setCartItems,
        searchQuery,
        setSearchQuery,
        getCartAmount,
        axios,
        fetchProducts,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    return useContext(AppContext);
};
