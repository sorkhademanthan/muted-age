// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CheckoutProvider, useCheckout } from "./contexts/CheckoutContext";
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
import CartDrawer from "./components/CartDrawer";

const AppContent = () => {
  const { isCartDrawerOpen, setIsCartDrawerOpen } = useCheckout();

  return (
    <>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<Shop />} />
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
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          
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
      <CheckoutProvider>
        <AppContent />
      </CheckoutProvider>
    </BrowserRouter>
  );
}

export default App;