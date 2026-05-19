import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const MyOrder = () => {
    const [myOrders, setMyOrders] = React.useState([]);
    const { currency, axios, user } = useAppContext();


    const fetchMyOrders = async () => {
        try {
            const { data } = await axios.get("/api/order/user");

            if (data.success) {
                setMyOrders(data.orders);
            } else {
                console.error("Error fetching orders:", data.message);
            }
        } catch (error) {
            console.error("Error fetching my orders:", error);
        }
    }

    useEffect(() => {
        if(user) {
            fetchMyOrders();
        }
    }, [user]);

    return (
        <div className='mt-16 pb-16'>
            <div className='flex flex-col items-end w-max mb-8'>
                <h2 className='text-2xl font-medium text-text-secondary uppercase'>My orders</h2>
                <div className='w-24 h-0.5 bg-primary rounded-full right-0 mt-1'></div>
            </div>

            {myOrders.length > 0 ? (
                <div className="space-y-6">
                    {myOrders.map((order, idx) => (
                        <div key={idx} className='border border-black/10 rounded-lg p-6 max-w-4xl text-sm md:text-base text-gray-500 font-medium'>
                            <div className='flex flex-col sm:flex-row justify-between mb-6'>
                                <span>OrderId : {order._id}</span>
                                <span>Payment : {order.paymentType}</span>
                                <span className='text-accent font-medium'>Total Amount : {currency}{order.amount}</span>
                            </div>

                            <div className='flex flex-col gap-5'>
                                {order.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className={`flex flex-col md:flex-row md:items-center justify-between gap-5 ${itemIdx > 0 ? 'border-t border-black/10 pt-5' : ''}`}>
                                        <div className="flex items-center gap-4 md:w-5/12">
                                            <div className="bg-primary/10 p-2 rounded-lg w-24 h-24 flex justify-center items-center">
                                                <img src={item.product?.images?.[0]} alt={item.product?.name} className="w-full h-full object-cover mix-blend-multiply" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800 text-[17px]">{item.product?.name}</h3>
                                                <p className="text-gray-500 text-sm mt-1">Category: {item.product?.category}</p>
                                            </div>
                                        </div>

                                        <div className='flex flex-col justify-center md:m1-8 mb-4 md:mb-e'>
                                            <p>Quantity: {item.quantity}</p>
                                            <p>Status: {order.status}</p>
                                            <p>Date: {new Date(order.createdAt).toLocaleDateString('en-US')}</p>
                                        </div>

                                        <div className='text-[#4CB08A] font-medium md:w-3/12 md:text-right'>
                                            <p>Amount: {currency}{item.quantity * (item.product?.offerPrice || item.product?.price || 0)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No orders found</p>
            )}

        </div>
    )
}

export default MyOrder