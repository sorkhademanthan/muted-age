// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/layout/Footer";
import HomePage from "./components/layout/HomePage";
import Shop from "./pages/Shop";
import Brand from "./pages/Brand";
import Contact from "./pages/Contact";
import Journal from "./pages/Journal";
import NewArrivals from "./pages/NewArrivals";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/newarrivals" element={<NewArrivals />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;