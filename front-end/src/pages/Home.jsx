import React, { useEffect, useState } from 'react';
import { categoryService } from "../services/categoryService";
import Navbar from '../components/Navbar';
import CategoryCard from '../components/CategoryCard';
import { useLocation } from 'react-router-dom';

// Simple error handler function
function getApiError(error) {
    const location = useLocation();

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
    const location = useLocation();

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
  }, [location.pathname]);

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
   <main className="mx-auto bg-gray min-h-screen font-body" role="main">
    <div className="">
        
        <section aria-label="All categories">
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
                <div className="text-gray-600 text-center py-6 font-body">
                    <p className="text-lg mb-2">No categories found.</p>
                    <p className="text-sm">Please check back later for new collections.</p>
                </div>
            )}
        </section>
    </div>
</main>
  );
}

export default Home;