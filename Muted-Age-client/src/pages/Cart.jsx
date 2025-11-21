import React from 'react';

const Cart = () => {
  const cartItems = [
    { id: 1, name: 'Muted Age Hoodie', quantity: 1, price: 49.99 },
    // Add more based on Cart model
  ];

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6 md:px-12">
      <h1 className="text-5xl font-bold mb-12 text-center">Your Cart</h1>
      <div className="max-w-4xl mx-auto">
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between items-center bg-gray-800 p-6 rounded-lg mb-4">
            <div>
              <h2 className="text-2xl">{item.name}</h2>
              <p>Qty: {item.quantity}</p>
            </div>
            <p className="text-xl">${item.price}</p>
          </div>
        ))}
        <div className="text-right mt-8">
          <p className="text-3xl font-bold">Total: ${total.toFixed(2)}</p>
          <button className="mt-4 px-8 py-3 bg-gold-600 text-black rounded-full hover:bg-gold-500">Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
