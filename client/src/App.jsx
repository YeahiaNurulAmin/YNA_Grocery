/**
 * App — root router for storefront + seller dashboard.
 * Wires redesigned pages; seller APIs and existing routes preserved.
 */
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import MobileBottomNav from "./components/MobileBottomNav";
import ChatBot from "./components/ChatBot";
import { useAppContext } from "./context/AppContext";
import Home from "./pages/Home";
import AllProducts from "./pages/AllProducts";
import ProductCategory from "./pages/ProductCategory";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import MyOrder from "./pages/MyOrder";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import SearchResults from "./pages/SearchResults";
import NotFound from "./pages/NotFound";
import Wishlist from "./pages/Wishlist";
import RecentlyViewed from "./pages/RecentlyViewed";
import Seller from "./pages/seller/Seller";
import SellerLogin from "./components/seller/SellerLogin";
import AddProduct from "./pages/seller/AddProduct";
import ProductsList from "./pages/seller/ProductsList";
import OrdersList from "./pages/seller/OrdersList";
import OrderHistory from "./pages/seller/OrderHistory";
import Coupons from "./pages/seller/Coupons";
import EditProduct from "./pages/seller/EditProduct";
import LoadingPage from "./pages/seller/LoadingPage";
import SellerDashboard from "./pages/seller/Dashboard";
import SellerSettings from "./pages/seller/SellerSettings";
import SellerProfile from "./pages/seller/SellerProfile";
import SellerNotifications from "./pages/seller/SellerNotifications";

const App = () => {
  const isSellerPath = useLocation().pathname.includes("/seller");
  const { showUserLogin, isSeller } = useAppContext();

  return (
    <div className="flex flex-col min-h-screen bg-bg-cream text-text-primary">
      {!isSellerPath && <Navbar />}
      {showUserLogin && <Login />}
      <Toaster
        position="top-center"
        toastOptions={{
          className: "font-body text-sm",
          style: {
            borderRadius: "16px",
            background: "var(--color-bg-white)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--border-color)",
          },
        }}
      />
      <div
        className={`grow w-full ${
          isSellerPath ? "" : "px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-[1600px] mx-auto"
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrder />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/loader" element={<LoadingPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/recently-viewed" element={<RecentlyViewed />} />
          <Route
            path="/seller"
            element={isSeller ? <Seller /> : <SellerLogin />}
          >
            <Route index element={isSeller && <AddProduct />} />
            <Route path="dashboard" element={isSeller && <SellerDashboard />} />
            <Route path="products" element={isSeller && <ProductsList />} />
            <Route path="orders" element={isSeller && <OrdersList />} />
            <Route path="history" element={isSeller && <OrderHistory />} />
            <Route path="coupons" element={isSeller && <Coupons />} />
            <Route path="update-product/:id" element={isSeller && <EditProduct />} />
            <Route path="settings" element={isSeller && <SellerSettings />} />
            <Route path="profile" element={isSeller && <SellerProfile />} />
            <Route path="notifications" element={isSeller && <SellerNotifications />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!isSellerPath && (
        <>
          <Footer />
          <MobileBottomNav />
          <ChatBot />
        </>
      )}
    </div>
  );
};

export default App;
