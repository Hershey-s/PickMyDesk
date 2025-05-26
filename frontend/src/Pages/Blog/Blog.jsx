import React, { useState } from 'react';
import { Calendar, User, ArrowRight, Search, Tag } from 'lucide-react';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'workspace-tips', name: 'Workspace Tips' },
    { id: 'productivity', name: 'Productivity' },
    { id: 'remote-work', name: 'Remote Work' },
    { id: 'business', name: 'Business' },
    { id: 'technology', name: 'Technology' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'The Ultimate Guide to Productive Workspace Design',
      excerpt: 'Discover how the right workspace design can boost your productivity by up to 40%. Learn about lighting, ergonomics, and layout optimization.',
      category: 'workspace-tips',
      author: 'Priya Sharma',
      date: '2025-01-15',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
      tags: ['Design', 'Productivity', 'Ergonomics']
    },
    {
      id: 2,
      title: 'Remote Work Revolution: India\'s Changing Workspace Landscape',
      excerpt: 'How the pandemic transformed India\'s approach to workspaces and what it means for the future of work in major Indian cities.',
      category: 'remote-work',
      author: 'Rajesh Kumar',
      date: '2025-01-12',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
      tags: ['Remote Work', 'India', 'Future of Work']
    },
    {
      id: 3,
      title: 'Top 10 Co-working Spaces in Bangalore for Tech Startups',
      excerpt: 'A comprehensive guide to the best co-working spaces in Bangalore\'s tech hubs, featuring amenities, pricing, and community culture.',
      category: 'business',
      author: 'Anita Desai',
      date: '2025-01-10',
      readTime: '12 min read',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400',
      tags: ['Bangalore', 'Startups', 'Co-working']
    },
    {
      id: 4,
      title: 'Maximizing Focus: The Science of Distraction-Free Workspaces',
      excerpt: 'Research-backed strategies for creating environments that enhance concentration and minimize interruptions in shared workspaces.',
      category: 'productivity',
      author: 'Dr. Meera Patel',
      date: '2025-01-08',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400',
      tags: ['Focus', 'Science', 'Productivity']
    },
    {
      id: 5,
      title: 'Digital Nomad\'s Guide to Mumbai\'s Best Work-Friendly Cafes',
      excerpt: 'Explore Mumbai\'s thriving cafe culture and discover the perfect spots for digital nomads and remote workers.',
      category: 'remote-work',
      author: 'Arjun Mehta',
      date: '2025-01-05',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
      tags: ['Mumbai', 'Digital Nomad', 'Cafes']
    },
    {
      id: 6,
      title: 'The Future of Workspace Technology: AI and Smart Offices',
      excerpt: 'How artificial intelligence and IoT are revolutionizing workspace management and user experience in modern offices.',
      category: 'technology',
      author: 'Vikram Singh',
      date: '2025-01-03',
      readTime: '9 min read',
      image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=400',
      tags: ['AI', 'Smart Offices', 'Technology']
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts[0];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PickMyDesk Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Insights, tips, and stories about the future of workspaces, productivity, and remote work in India.
          </p>
        </div>

        {/* Featured Post */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <div className="flex items-center mb-4">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
                <span className="ml-3 text-gray-500 text-sm">
                  {categories.find(cat => cat.id === featuredPost.category)?.name}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {featuredPost.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="w-4 h-4 mr-1" />
                  <span className="mr-4">{featuredPost.author}</span>
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                </div>
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 flex items-center">
                  Read More <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.slice(1).map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="text-purple-600 text-sm font-medium">
                    {categories.find(cat => cat.id === post.category)?.name}
                  </span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-gray-500 text-sm">{post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs flex items-center"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="w-4 h-4 mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <button className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center">
                    Read More <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-purple-700 rounded-lg text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Get the latest insights on workspace trends, productivity tips, and remote work strategies 
            delivered to your inbox every week.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <button className="bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
