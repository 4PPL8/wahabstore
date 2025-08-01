import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../utils/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  return (
    <motion.div 
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 0 15px rgba(0, 255, 170, 0.5)' // Neon glow effect
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/product-images/placeholder.jpg';
            }}
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-neon-accent transition-colors duration-300">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
        
        <div className="flex justify-between items-center mt-3">
          <span className="text-lg font-bold text-gray-900">PKR {product.price}</span>
          
          <motion.button
            onClick={() => addToCart(product)}
            className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-neon-accent hover:text-black transition-colors duration-300"
            whileTap={{ scale: 0.95 }}
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;