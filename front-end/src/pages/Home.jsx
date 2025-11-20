import React, { useEffect, useState } from 'react';
import { categoryService } from "../services/categoryService";
import Navbar from '../components/Navbar';
import CategoryCard from '../components/CategoryCard';

// Simple error handler function
function getApiError(error) {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'Failed to load categories. Please try again.';
}

function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await categoryService.getAll();
        setCategories(Array.isArray(data) ? data : data.categories || []);
      } catch (error) {
        setErrorMsg(getApiError(error));
      } finally {
        setLoading(false);
      }
    }
    window.scrollTo(0, 0);

    loadCategories();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray min-h-screen">Loading...</div>;
  }

  if (errorMsg) {
    return (
      <div className="text-center py-10 text-red font-semibold min-h-screen">
        {errorMsg}
      </div>
    );
  }

  return (
    <div className="mx-auto bg-gray min-h-screen">
      <div className="">
         <CategoryCard 
            id="1"
            buttonText="discover"
            name="Home"
            leftImage="./leftImage.png"
            rightImage="./rightImage.png"  
          />
        
        {categories.map((cat) => (
          <CategoryCard 
            id={cat.id} 
            buttonText={cat.buttonText}
            name={cat.name} 
            leftImage={cat.leftImage}
            rightImage={cat.rightImage} 
            key={cat.id} 
          />
        ))}
        {categories.length === 0 && (
          <div className="text-gray-600 text-center py-6">
            No categories found.
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;