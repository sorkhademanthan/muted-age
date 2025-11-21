import React from 'react';

const Reviews = () => {
  const reviews = [
    { id: 1, product: 'Muted Age Hoodie', rating: 5, comment: 'Amazing quality!' },
    // Add more based on Review model
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6 md:px-12">
      <h1 className="text-5xl font-bold mb-12 text-center">Product Reviews</h1>
      <div className="max-w-4xl mx-auto">
        {reviews.map(review => (
          <div key={review.id} className="bg-gray-800 p-6 rounded-lg mb-4">
            <h2 className="text-2xl">{review.product}</h2>
            <p>Rating: {review.rating}/5</p>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
