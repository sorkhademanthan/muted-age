import React, { useState, useEffect } from 'react';

const Journal = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Placeholder data (replace with API fetch)
  useEffect(() => {
    const sampleArticles = [
      {
        id: 1,
        title: 'Minimalist Wardrobe Essentials for 2024',
        excerpt: 'Discover the key pieces that define understated elegance.',
        image: '/path/to/image1.jpg',
        category: 'Trends',
        publishedAt: '2024-01-01',
      },
      {
        id: 2,
        title: 'Street Style Inspiration from Urban Explorers',
        excerpt: 'Real-life outfits blending comfort and style.',
        image: '/path/to/image2.jpg',
        category: 'Looks',
        publishedAt: '2024-01-05',
      },
      // Add more articles
    ];
    setArticles(sampleArticles);
    setFilteredArticles(sampleArticles);
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = articles;
    if (category !== 'All') {
      filtered = filtered.filter(article => article.category === category);
    }
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredArticles(filtered);
  }, [category, searchTerm, articles]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Muted Age Journal</h1>
          <p className="text-lg text-gray-600">Explore fashion trends, styling tips, and brand stories.</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-4 sm:mt-0 sm:ml-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
          >
            <option value="All">All Categories</option>
            <option value="Trends">Trends</option>
            <option value="Looks">Looks</option>
            <option value="Brand Stories">Brand Stories</option>
          </select>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <div key={article.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{article.title}</h2>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{article.category} • {article.publishedAt}</span>
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">Read More</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 bg-indigo-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-6">Subscribe to our journal for the latest fashion insights.</p>
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 border border-gray-300 rounded-md mr-4 focus:outline-none focus:ring-indigo-500"
          />
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">Subscribe</button>
        </div>
      </div>
    </div>
  );
};

export default Journal;