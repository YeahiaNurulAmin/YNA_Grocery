import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import Login from './components/Login'
import { useAppContext } from './context/AppContext'
import AllProducts from './pages/AllProducts'
import ProductCategory from './pages/ProductCategory'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import AddAddress from './pages/AddAddress'
import MyOrder from './pages/MyOrder'
import Seller from './pages/seller/Seller'
import SellerLogin from './components/seller/SellerLogin'
import AddProduct from './pages/seller/AddProduct'
import ProductsList from './pages/seller/ProductsList'
import OrdersList from './pages/seller/OrdersList'
import OrderHistory from './pages/seller/OrderHistory'
import Coupons from './pages/seller/Coupons'
import EditProduct from './pages/seller/EditProduct'
import LoadingPage from './pages/seller/LoadingPage'

const App = () => {
  const isSellerPath = useLocation().pathname.includes('/seller');
  const { showUserLogin, isSeller } = useAppContext();
  // The main

  return (
    <div className='flex flex-col min-h-screen text-default'>
      {!isSellerPath && <Navbar></Navbar>}
      {showUserLogin && <Login></Login>}

      <Toaster></Toaster>
      <div className={`grow w-full ${isSellerPath ? '' : 'px-5 md:px-16 lg:px-20 xl:px-24 2xl:px-32'}`}>
        <Routes>
          <Route path='/' element={<Home></Home>}></Route>
          <Route path='/products' element={<AllProducts></AllProducts>}></Route>
          <Route path='/products/:category' element={<ProductCategory></ProductCategory>}></Route>
          <Route path='/products/:category/:id' element={<ProductDetails></ProductDetails>}></Route>
          <Route path='/cart' element={<Cart></Cart>}></Route>
          <Route path='/add-address' element={<AddAddress></AddAddress>}></Route>
          <Route path='/my-orders' element={<MyOrder></MyOrder>}></Route>
          <Route path='/loader' element={<LoadingPage></LoadingPage>}></Route>
          <Route path='/seller' element={isSeller ? <Seller></Seller> : <SellerLogin></SellerLogin>}>
            <Route index element={isSeller && <AddProduct />} />
            <Route path='products' element={isSeller && <ProductsList />} />
            <Route path='orders' element={isSeller && <OrdersList />} />
            <Route path='history' element={isSeller && <OrderHistory />} />
            <Route path='coupons' element={isSeller && <Coupons />} />
            <Route path='update-product/:id' element={isSeller && <EditProduct />} />
          </Route>

        </Routes>
      </div>
      {!isSellerPath && <Footer></Footer>}

    </div>
  )
}

export default App
