import React from 'react';

const Orders = () => {
  const orders = [
    { id: 1, date: '2023-10-01', status: 'Shipped', total: 49.99 },
    // Add more based on Order model
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6 md:px-12">
      <h1 className="text-5xl font-bold mb-12 text-center">Your Orders</h1>
      <div className="max-w-4xl mx-auto">
        {orders.map(order => (
          <div key={order.id} className="bg-gray-800 p-6 rounded-lg mb-4">
            <p>Order #{order.id} - {order.date}</p>
            <p>Status: {order.status}</p>
            <p>Total: ${order.total}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
