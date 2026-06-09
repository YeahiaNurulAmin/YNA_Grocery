import { Link, NavLink, Outlet } from "react-router-dom";
import { YNALogo } from "../../assets/YNALogo.jsx";
import { assets } from "../../assets/assets.js";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Seller = () => {

    const {  navigate, axios } = useAppContext();
    const sidebarLinks = [
        { name: "Add Product", path: "/seller", icon: <img src={assets.add_icon} alt="add_icon" className="w-6 h-6" /> },
        { name: "Products", path: "/seller/products", icon: <img src={assets.product_list_icon} alt="product_list_icon" className="w-6 h-6" /> },
        { name: "Orders", path: "/seller/orders", icon: <img src={assets.order_icon} alt="order_icon" className="w-6 h-6" /> },
        { 
            name: "History", 
            path: "/seller/history", 
            icon: (
                <svg className="w-6 h-6 text-current" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            )
        },
    ];

    const logoutHandler = async () => {
        try {
            const {data} = await axios.get('/api/seller/logout');

            if(data.success) {
                toast.success(data.message);
                navigate("/");
            } else {
                toast.error(data.message);
            }
            
        } catch (error) {
            toast.error("Error logging out");
            console.error("Error in logoutHandler:", error);
        }
    }

    return (
        <>
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
                <Link to="/">
                    <YNALogo size="small"></YNALogo>
                </Link>
                <div className="flex items-center gap-5 text-gray-500">
                    <p>Hi! Admin</p>
                    <button className="cursor-pointer hover:bg-primary-light border border-primary rounded-full text-sm px-4 py-1 text-accent" onClick={logoutHandler}>Logout</button>
                </div>
            </div>
            <div className="flex">
                <div className="md:w-44 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
                    {sidebarLinks.map((item, index) => (
                        <NavLink to={item.path} key={index} end={item.path === "/seller"}
                            className={({ isActive }) => `flex items-center py-3 px-4 gap-3 
                            ${isActive ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                                    : "hover:bg-gray-100/90 border-white text-gray-700"
                                }`
                            }
                        >
                            {item.icon}
                            <p className="md:block hidden text-center">{item.name}</p>
                        </NavLink>
                    ))}
                </div>
                <Outlet></Outlet>
            </div>
        </>
    );
};

export default Seller;