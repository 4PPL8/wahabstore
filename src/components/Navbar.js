import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../utils/CartContext';
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { getTotalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  
  // Handle search functionality
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }
      
      try {
        // In a real app, this would be an API call
        // Here we're importing the JSON directly
        const products = await import('../data/products.json')
          .then(module => module.default);
        
        const filtered = products.filter(product => {
          const nameMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
          const brandMatch = product.brand.toLowerCase().includes(searchQuery.toLowerCase());
          return nameMatch || brandMatch;
        }).slice(0, 5); // Limit to 5 results
        
        setSearchResults(filtered);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Error searching products:', error);
      }
    };
    
    const debounceTimer = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);
  
  return (
    <nav className="bg-black text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white hover:text-neon-accent transition duration-300">
            <span className="text-neon-accent">Pak</span>Grocery
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-neon-accent transition duration-300">Home</Link>
            <Link to="/products" className="hover:text-neon-accent transition duration-300">Products</Link>
            
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="bg-gray-800 text-white px-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-neon-accent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 mt-2 bg-white text-black rounded-md shadow-lg overflow-hidden z-50"
                >
                  {searchResults.map(product => (
                    <Link 
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="block px-4 py-2 hover:bg-gray-100 transition duration-200"
                    >
                      <div className="flex items-center">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-10 h-10 object-cover mr-3"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/product-images/placeholder.jpg';
                          }}
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.brand}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
            
            {/* Auth Links */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="hover:text-neon-accent transition duration-300">
                  {user?.name || 'Account'}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-2 text-black">
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hover:text-neon-accent transition duration-300">Login</Link>
            )}
            
            {/* Cart */}
            <Link to="/cart" className="relative hover:text-neon-accent transition duration-300">
              <span className="mr-1">Cart</span>
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-neon-accent text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4"
          >
            <div className="flex flex-col space-y-4">
              <Link to="/" className="hover:text-neon-accent transition duration-300">Home</Link>
              <Link to="/products" className="hover:text-neon-accent transition duration-300">Products</Link>
              
              {/* Mobile Search */}
              <input
                type="text"
                placeholder="Search products..."
                className="bg-gray-800 text-white px-4 py-2 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-neon-accent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              {/* Mobile Search Results */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="bg-white text-black rounded-md shadow-lg overflow-hidden">
                  {searchResults.map(product => (
                    <Link 
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="block px-4 py-2 hover:bg-gray-100 transition duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-10 h-10 object-cover mr-3"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/product-images/placeholder.jpg';
                          }}
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.brand}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              
              {/* Mobile Auth Links */}
              {isAuthenticated ? (
                <>
                  <span className="text-neon-accent">{user?.name || 'Account'}</span>
                  <button 
                    onClick={logout}
                    className="text-left hover:text-neon-accent transition duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="hover:text-neon-accent transition duration-300">Login</Link>
              )}
              
              {/* Mobile Cart */}
              <Link to="/cart" className="relative hover:text-neon-accent transition duration-300">
                <span>Cart ({getTotalItems()})</span>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;