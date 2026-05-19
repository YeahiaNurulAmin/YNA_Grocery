import React, { useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets, dummyOrders } from '../../assets/assets';
import toast from 'react-hot-toast';


const OrdersList = () => {
    const boxIcon = "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg"

    const {currency, axios} = useAppContext();
    const [orders, setOrders] = React.useState([]);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get("/api/order/seller");
            if (data.success) {
                setOrders(data.orders);
            } else {
                toast.error(data.message || "Failed to fetch orders");
                console.error("Error fetching orders:", data.message);
            }
        } catch (error) {
            toast.error("Failed to fetch orders");
            console.error("Error fetching orders:", error);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, [])

    return (
        <div className="md:p-10 p-4 space-y-4 no-scrollbar flex-I h-[95vh] overflow-y-scroll">
            <h2 className="text-lg font-medium text-primary">Orders List</h2>
            {orders.map((order, index) => (
                <div key={index} className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800">
                    <div className="flex gap-5">
                        <img className="w-12 h-12 object-cover opacity-60" src={assets.box_icon} alt="boxIcon" />
                        <div className="flex flex-col justify-center gap-2">
                            {order.items.map((item, index) => (
                                <div key={index}>
                                    <p className="font-bold">
                                        {item.product.name} <span className={`text-primary ${item.quantity < 2 && "hidden"}`}> x {item.quantity}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-sm md:text-base text-black/60">
                        <p className='font-medium mb-1'>{order.address.firstName} {order.address.lastName}</p>
                        <p>{order.address.street}, {order.address.city}</p>
                        <p>{order.address.state},{order.address.zipcode}, {order.address.country}</p>
                        <br />
                        <p>Phone: {order.address.phone}</p>
                    </div>

                    <p className="font-medium text-lg my-auto text-text-secondary">{currency}{order.amount}</p>

                    <div className="flex flex-col text-sm text-text-secondary">
                        <p>Method: {order.paymentType}</p>
                        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default OrdersList