import React from 'react';

const Delivery = () => {
  const deliveries = [
    { id: 1, orderId: 123, status: 'In Transit', tracking: 'TRK123456' },
    // Add more based on Delivery model
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6 md:px-12">
      <h1 className="text-5xl font-bold mb-12 text-center">Delivery Tracking</h1>
      <div className="max-w-4xl mx-auto">
        {deliveries.map(delivery => (
          <div key={delivery.id} className="bg-gray-800 p-6 rounded-lg mb-4">
            <p>Order #{delivery.orderId}</p>
            <p>Status: {delivery.status}</p>
            <p>Tracking: {delivery.tracking}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Delivery;
