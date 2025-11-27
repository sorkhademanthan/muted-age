// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CheckoutProvider, useCheckout } from "./contexts/CheckoutContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Footer from "./components/layout/Footer";
import HomePage from "./components/layout/HomePage";
import Shop from "./pages/Shop";
import Brand from "./pages/Brand";
import Contact from "./pages/Contact";
import Account from "./pages/Account";
import TrackOrders from "./pages/TrackOrders";
import NewArrivals from "./pages/NewArrivals";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import UPIPayment from "./pages/UPIPayment";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import TrackOrder from "./pages/TrackOrder";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AddressBook from "./pages/AddressBook";
import Wishlist from "./pages/Wishlist";
import WriteReview from "./pages/WriteReview";
import Reviews from "./pages/Reviews";
import Support from "./pages/Support";
import CreateTicket from "./pages/CreateTicket";
import TicketDetail from "./pages/TicketDetail";
import ProductDetail from "./pages/ProductDetail";
import CartDrawer from "./components/CartDrawer";

const AppContent = () => {
  const { isCartDrawerOpen, setIsCartDrawerOpen } = useCheckout();

  return (
    <>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/brand" element={<Brand />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/account" element={<Account />} />
          <Route path="/track-orders" element={<TrackOrders />} />
          <Route path="/newarrivals" element={<NewArrivals />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          
          {/* Checkout Flow Routes */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/upi" element={<UPIPayment />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          
          {/* Order Management Routes */}
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
          <Route path="/track-order/:orderId" element={<TrackOrder />} />
          
          {/* Profile & Wishlist Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile/addresses" element={<AddressBook />} />
          <Route path="/wishlist" element={<Wishlist />} />
          
          {/* Review Routes */}
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/reviews/write" element={<WriteReview />} />
          
          {/* Support Routes */}
          <Route path="/support" element={<Support />} />
          <Route path="/support/new" element={<CreateTicket />} />
          <Route path="/support/:ticketId" element={<TicketDetail />} />
          
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <CartDrawer isOpen={isCartDrawerOpen} onClose={() => setIsCartDrawerOpen(false)} />
      </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <CheckoutProvider>
            <AppContent />
          </CheckoutProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;