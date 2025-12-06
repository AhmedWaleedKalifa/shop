import { useState } from 'react';
import { authService } from '../services/authService';
import {useNavigate} from "react-router-dom"
function Login() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const [loading, setLoading] = useState(false);
  
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    if (apiError) setApiError('');
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    setApiError('');
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Set loading state
    setLoading(true);
    
    try {
      // Call your authService.login method
      const response = await authService.login(formData.email, formData.password);
      
      console.log('Login successful:', response);
      
      // Handle successful login
      if (response.message === 'Login successful') {
        // Redirect based on user role or to home page
        if (response.user.role === 'ADMIN'|"MODERATOR") {
          navigate('/page/dashboard');
        } 
        
        // Optional: Show success message
        // alert('Login successful!');
      }
      
    } catch (error) {
      // Handle API errors
      console.error('Login error:', error);
      
      // Check for specific error messages from your backend
      if (error.response?.data?.error) {
        setApiError(error.response.data.error);
      } else if (error.message?.includes('Invalid email or password')) {
        setApiError('Invalid email or password');
      } else {
        setApiError('Something went wrong. Please try again.');
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-heading text-black text-center mb-6">
          Login to Your Account
        </h2>
        
        {/* Display API error message */}
        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {apiError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent ${
                errors.email ? 'border-red' : 'border-gray-300'
              }`}
              placeholder="you@example.com"
              disabled={loading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red">{errors.email}</p>
            )}
          </div>
          
          {/* Password Field */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent ${
                errors.password ? 'border-red' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
              disabled={loading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red">{errors.password}</p>
            )}
          </div>
          
          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="h-4 w-4 text-yellow focus:ring-yellow border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray">Remember me</span>
            </label>
            
            <a 
              href="/forgot-password" 
              className="text-sm text-yellow hover:text-yellow/80 font-medium"
            >
              Forgot password?
            </a>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              loading 
                ? 'bg-yellow/70 cursor-not-allowed' 
                : 'bg-yellow hover:bg-yellow/90'
            } text-white font-heading text-lg`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        
          
         
        </form>
      </div>
    </div>
  );
}

export default Login;