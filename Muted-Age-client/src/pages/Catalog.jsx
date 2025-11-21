import React, { useState } from 'react';

const Catalog = () => {
  const [products] = useState([
    // Placeholder products
    { id: 1, name: 'Product 1', price: 50, image: '/placeholder.jpg' },
    { id: 2, name: 'Product 2', price: 60, image: '/placeholder.jpg' },
    // Add more
  ]);
  const [filter, setFilter] = useState('All');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Catalog</h1>
          <p className="text-gray-600">Browse our collection</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <label className="mr-4">Filter:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2 border rounded">
              <option value="All">All</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </select>
          </div>
          <input type="text" placeholder="Search products..." className="px-4 py-2 border rounded" />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white shadow rounded-lg overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-600">${product.price}</p>
                <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 text-center">
          <button className="px-4 py-2 bg-gray-200 rounded mr-2">Previous</button>
          <span>Page 1 of 1</span>
          <button className="px-4 py-2 bg-gray-200 rounded ml-2">Next</button>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
