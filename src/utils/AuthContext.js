import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load user from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);
  
  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);
  
  // Simulate login process
  const login = async (email) => {
    // In a real app, this would be an API call
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a random verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store email and code in sessionStorage for verification step
      sessionStorage.setItem('pendingAuth', JSON.stringify({
        email,
        verificationCode,
        timestamp: Date.now()
      }));
      
      setIsLoading(false);
      toast.success(`Verification code sent to ${email}`);
      return { success: true, verificationCode };
    } catch (error) {
      setIsLoading(false);
      toast.error('Login failed. Please try again.');
      return { success: false, error: error.message };
    }
  };
  
  // Verify OTP code
  const verifyCode = (code) => {
    const pendingAuth = JSON.parse(sessionStorage.getItem('pendingAuth'));
    
    if (!pendingAuth) {
      toast.error('No pending verification found. Please try logging in again.');
      return false;
    }
    
    // Check if verification code has expired (10 minutes)
    const isExpired = Date.now() - pendingAuth.timestamp > 10 * 60 * 1000;
    
    if (isExpired) {
      toast.error('Verification code has expired. Please try logging in again.');
      sessionStorage.removeItem('pendingAuth');
      return false;
    }
    
    if (pendingAuth.verificationCode === code) {
      // Set the user
      const newUser = {
        email: pendingAuth.email,
        name: pendingAuth.email.split('@')[0], // Simple name from email
        isVerified: true,
        loginTime: Date.now()
      };
      
      setUser(newUser);
      sessionStorage.removeItem('pendingAuth');
      toast.success('Login successful!');
      return true;
    } else {
      toast.error('Invalid verification code. Please try again.');
      return false;
    }
  };
  
  // Logout
  const logout = () => {
    setUser(null);
    toast.success('Logged out successfully');
  };
  
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    verifyCode,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};