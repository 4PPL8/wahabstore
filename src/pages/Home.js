import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  
  // Hero images
  const heroImages = [
    {
      image: '/product-images/slice-juice-1.jpg',
      title: 'Refreshing Slice Mango Juice',
      description: 'Start your day with the taste of fresh mangoes'
    },
    {
      image: '/product-images/olper-milk-1.jpg',
      title: 'Pure & Fresh Olper Milk',
      description: 'Healthy and nutritious for the whole family'
    },
    {
      image: '/product-images/dalda-oil-1.jpg',
      title: 'Premium Dalda Cooking Oil',
      description: 'For delicious and healthy cooking'
    }
  ];
  
  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await import('../data/products.json')
          .then(module => module.default);
        
        setProducts(allProducts);
        
        // Select featured products (first 6)
        setFeaturedProducts(allProducts.slice(0, 6));
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    
    loadProducts();
  }, []);
  
  // Auto-change hero image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex(prevIndex => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroImages.length]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        {heroImages.map((hero, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: currentHeroIndex === index ? 1 : 0,
              transition: { duration: 1 }
            }}
          >
            <div 
              className="w-full h-full bg-cover bg-center relative"
              style={{ 
                backgroundImage: `url(${hero.image})`,
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <motion.h1 
                    className="text-4xl md:text-6xl font-bold mb-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ 
                      y: currentHeroIndex === index ? 0 : 20, 
                      opacity: currentHeroIndex === index ? 1 : 0 
                    }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                  >
                    {hero.title}
                  </motion.h1>
                  
                  <motion.p 
                    className="text-xl md:text-2xl mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ 
                      y: currentHeroIndex === index ? 0 : 20, 
                      opacity: currentHeroIndex === index ? 1 : 0 
                    }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    {hero.description}
                  </motion.p>
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ 
                      y: currentHeroIndex === index ? 0 : 20, 
                      opacity: currentHeroIndex === index ? 1 : 0 
                    }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    <Link 
                      to="/products" 
                      className="bg-neon-accent text-black px-8 py-3 rounded-full text-lg font-bold hover:bg-white transition-colors duration-300 inline-block"
                    >
                      Shop Now
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Hero Navigation Dots */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroIndex(index)}
              className={`w-3 h-3 rounded-full ${currentHeroIndex === index ? 'bg-neon-accent' : 'bg-white bg-opacity-50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          
          {/* Infinite Scroll Ribbon */}
          <div className="relative overflow-hidden py-8">
            <motion.div
              className="flex space-x-6"
              animate={{ x: ["-10%", "-60%"] }}
              transition={{ 
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear"
                }
              }}
            >
              {/* Double the products to create seamless loop */}
              {[...products, ...products].map((product, index) => (
                <div key={`${product.id}-${index}`} className="flex-shrink-0 w-64">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/product-images/placeholder.jpg';
                    }}
                  />
                  <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
                  <p className="text-neon-accent font-bold">PKR {product.price}</p>
                </div>
              ))}
            </motion.div>
          </div>
          
          {/* Top Products Grid */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Top Products</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link 
                to="/products" 
                className="bg-black text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-neon-accent hover:text-black transition-colors duration-300 inline-block"
              >
                View All Products
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-12 px-4 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'Dairy', image: '/product-images/olper-milk-1.jpg' },
              { name: 'Beverages', image: '/product-images/slice-juice-1.jpg' },
              { name: 'Snacks & Biscuits', image: '/product-images/sooper-biscuits-1.jpg' },
              { name: 'Cooking Essentials', image: '/product-images/dalda-oil-1.jpg' },
              { name: 'Toiletries', image: '/product-images/lifebuoy-soap-1.jpg' },
              { name: 'Cleaning', image: '/product-images/surf-excel-1.jpg' },
              { name: 'Spices', image: '/product-images/shan-biryani-1.jpg' },
              { name: 'Grains & Staples', image: '/product-images/guard-rice-1.jpg' },
            ].map((category, index) => (
              <motion.div 
                key={index}
                className="relative rounded-lg overflow-hidden h-40 group"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/product-images/placeholder.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Link 
                    to={`/products?category=${category.name}`}
                    className="text-white text-xl font-bold hover:text-neon-accent transition-colors duration-300"
                  >
                    {category.name}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;