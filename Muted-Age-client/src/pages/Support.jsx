import React from 'react';

const Support = () => {
  return (
    <div className="min-h-screen bg-black text-white py-20 px-6 md:px-12">
      <h1 className="text-5xl font-bold mb-12 text-center">Customer Support</h1>
      <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg">
        <div className="mb-6">
          <label className="block text-xl mb-2">Describe your issue</label>
          <textarea className="w-full p-3 bg-gray-700 rounded h-32" placeholder="Enter your complaint or question"></textarea>
        </div>
        <button className="px-6 py-3 bg-gold-600 text-black rounded-full hover:bg-gold-500">Submit</button>
      </div>
    </div>
  );
};

export default Support;
