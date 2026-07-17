/**
 * Cart — shopping cart with address picker, payment method, COD/Stripe checkout.
 * Route: /cart. Preserves existing order APIs and tax calculation.
 */
import React, { useEffect } from "react";
import { Minus, Plus, Trash2, ShoppingBag, MapPin, ChevronDown, ArrowLeft } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { Button, Card, EmptyState, Badge } from "../components/ui";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    currency,
    cartItems,
    setCartItems,
    products,
    navigate,
    removeFromCart,
    updateCartItem,
    user,
    axios,
    setShowUserLogin,
  } = useAppContext();

  const [cartArray, setCartArray] = React.useState([]);
  const [address, setAddress] = React.useState([]);
  const [showAddress, setShowAddress] = React.useState(false);
  const [selectedAddress, setSelectedAddress] = React.useState(null);
  const [paymentMethod, setPaymentMethod] = React.useState("COD");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [itemsPrice, setItemsPrice] = React.useState(0);
  const [placing, setPlacing] = React.useState(false);

  const itemCount = Object.values(cartItems || {}).reduce((a, b) => a + b, 0);
  const tax = Math.floor(itemsPrice * 0.15 * 100) / 100;
  const total = Math.floor(itemsPrice * 1.15 * 100) / 100;

  const handlePlaceOrder = async () => {
    try {
      if (!user) {
        setShowUserLogin(true);
        toast.error("Please login to checkout");
        return;
      }
      if (!selectedAddress) {
        toast.error("Please select a delivery address");
        return;
      }
      setPlacing(true);
      const payload = {
        userId: user._id,
        items: Object.entries(cartItems).map(([productId, quantity]) => ({
          product: productId,
          quantity,
        })),
        address: selectedAddress._id,
      };

      if (paymentMethod === "COD") {
        const { data } = await axios.post("/api/order/cod", payload);
        if (data.success) {
          toast.success("Order placed successfully");
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error("Failed to place order");
          console.error("Error placing order:", data.message);
        }
      } else {
        const { data } = await axios.post("/api/order/online", payload);
        if (data.success) {
          window.location.replace(data.url);
        } else {
          toast.error("Failed to place order");
          console.error("Error placing order:", data.message);
        }
      }
    } catch (error) {
      toast.error("Failed to place order");
      console.error("Error placing order:", error);
    } finally {
      setPlacing(false);
    }
  };

  const calculateItemsPrice = () => {
    let totalPrice = 0;
    for (let itemID in cartItems) {
      const foundProduct = products.find((product) => product._id === itemID);
      if (foundProduct) {
        totalPrice += (foundProduct.offerPrice || foundProduct.price) * cartItems[itemID];
      }
    }
    setItemsPrice(totalPrice);
  };

  const getCartProducts = () => {
    const cartData = [];
    for (let itemID in cartItems) {
      const foundProduct = products.find((product) => product._id === itemID);
      if (foundProduct) {
        const productInfo = structuredClone(foundProduct);
        productInfo.stockQuantity = foundProduct.quantity;
        productInfo.quantity = cartItems[itemID];
        cartData.push(productInfo);
      }
    }
    setCartArray(cartData);
  };

  const getUserAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get", { userId: user._id });
      if (data.success) {
        setAddress(data.addresses);
        if (data.addresses.length > 0) setSelectedAddress(data.addresses[0]);
      } else {
        toast.error("Failed to fetch address");
      }
    } catch (error) {
      console.error("Error fetching user address:", error);
    }
  };

  useEffect(() => {
    if (products?.length > 0 && cartItems) {
      getCartProducts();
      calculateItemsPrice();
    }
  }, [products, cartItems, paymentMethod, address]);

  useEffect(() => {
    if (user) getUserAddress();
  }, [user]);

  const hasItemsInCart = cartItems && Object.keys(cartItems).length > 0;

  if (!(products?.length > 0 && hasItemsInCart)) {
    return (
      <div className="py-16 mb-nav">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven’t added anything yet. Browse fresh picks and fill your cart."
          action={
            <Button onClick={() => navigate("/products")}>
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="py-10 md:py-14 mb-nav animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 max-w-6xl mx-auto">
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-text-primary">
              Shopping Cart
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>

          <div className="space-y-3">
            {cartArray.map((product) => {
              const img = product.images?.[0] || product.image?.[0];
              const unit = product.offerPrice || product.price;
              return (
                <Card key={product._id} className="!p-4" hover={false}>
                  <div className="flex gap-4 items-center">
                    <button
                      type="button"
                      className="w-20 h-20 md:w-24 md:h-24 rounded-[16px] bg-surface-muted flex items-center justify-center overflow-hidden shrink-0 cursor-pointer"
                      onClick={() => {
                        navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                        scrollTo(0, 0);
                      }}
                    >
                      <img src={img} alt={product.name} className="max-w-full max-h-full object-contain" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-semibold text-text-primary truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs text-text-tertiary mt-0.5">
                        {product.weight || product.category}
                      </p>
                      <p className="font-heading font-bold text-primary mt-2">
                        {currency}{unit * product.quantity}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => removeFromCart(product._id)}
                        className="text-text-tertiary hover:text-error transition-colors cursor-pointer"
                        aria-label={`Remove ${product.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="h-9 flex items-center rounded-[14px] bg-bg-light-mint border border-primary/20">
                        <button
                          type="button"
                          className="w-8 h-full flex items-center justify-center text-primary cursor-pointer"
                          onClick={() => {
                            if (product.quantity <= 1) removeFromCart(product._id);
                            else updateCartItem(product._id, product.quantity - 1);
                          }}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-bold">{product.quantity}</span>
                        <button
                          type="button"
                          className="w-8 h-full flex items-center justify-center text-primary cursor-pointer"
                          onClick={() => {
                            const max = product.stockQuantity < 9 ? product.stockQuantity : 9;
                            if (product.quantity < max) updateCartItem(product._id, product.quantity + 1);
                          }}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </button>
        </div>

        {/* Sticky summary */}
        <aside className="lg:w-[380px] shrink-0">
          <Card className="lg:sticky lg:top-24 !p-6 space-y-5">
            <h2 className="font-heading text-lg font-bold text-text-primary">Order Summary</h2>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Delivery
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddress(!showAddress)}
                  className="text-xs font-semibold text-primary cursor-pointer"
                >
                  Change
                </button>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {selectedAddress
                  ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "No address selected"}
              </p>
              {showAddress && (
                <div className="mt-2 rounded-[16px] border border-border bg-bg-white shadow-md overflow-hidden animate-scale-in">
                  {address.map((addr) => (
                    <button
                      key={addr._id}
                      type="button"
                      onClick={() => {
                        setSelectedAddress(addr);
                        setShowAddress(false);
                      }}
                      className="w-full text-left px-3 py-2.5 text-sm text-text-secondary hover:bg-bg-light-mint cursor-pointer"
                    >
                      {addr.street}, {addr.city}, {addr.state}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => navigate("/add-address")}
                    className="w-full text-center px-3 py-2.5 text-sm font-semibold text-primary hover:bg-bg-light-mint cursor-pointer border-t border-border"
                  >
                    Add address
                  </button>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2">
                Payment
              </p>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full h-11 px-4 rounded-[16px] border border-border bg-bg-white flex items-center justify-between text-sm cursor-pointer"
                >
                  <span>{paymentMethod === "COD" ? "Cash On Delivery" : "Online Payment"}</span>
                  <ChevronDown className="w-4 h-4 text-text-tertiary" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-1 rounded-[16px] border border-border bg-bg-white shadow-md z-10 overflow-hidden animate-scale-in">
                    {["COD", "Online"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setPaymentMethod(m);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-bg-light-mint cursor-pointer"
                      >
                        {m === "COD" ? "Cash On Delivery" : "Online Payment"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-border text-sm text-text-secondary">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{currency}{itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <Badge variant="success">Free</Badge>
              </div>
              <div className="flex justify-between">
                <span>Tax (15%)</span>
                <span>{currency}{tax}</span>
              </div>
              <div className="flex justify-between font-heading text-base font-bold text-text-primary pt-2">
                <span>Total</span>
                <span>{currency}{total}</span>
              </div>
            </div>

            <Button className="w-full" size="lg" loading={placing} onClick={handlePlaceOrder}>
              {paymentMethod === "COD" ? "Place Order" : "Proceed to Payment"}
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
