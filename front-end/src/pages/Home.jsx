import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import {categoryService} from "../services/categoryService"
import Navbar from '../components/Navbar';
import CategoryCard from '../components/CategoryCard';
function Home() {
     const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await categoryService.getAll();
        setCategories(Array.isArray(data) ? data : data.categories || []);
      } catch (error) {
        // setErrorMsg(getApiError(error));
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
  }

  // if (errorMsg) {
  //   return (
  //     <div className="text-center py-10 text-red-500 font-semibold">
  //       {errorMsg}
  //     </div>
  //   );
  // }

  return (
    <div className=" mx-auto bg-gray-400">
        <h1>Home</h1>
      <h2 className="text-2xl font-bold mb-4">All Categories</h2>

      <div className="space-y-4">
        {categories.map((cat) => (
          <CategoryCard id={cat.id} buttonText={cat.buttonText}name={cat.name} leftImage={cat.leftImage}rightImage={cat.rightImage} key={cat.id} />
        ))}
        <CategoryCard name="Hello" leftImage={"./leftImage.png"}rightImage={"./rightImage.png"} buttonText="discover"/>
        {categories.length === 0 && (
          <div className="text-gray-600 text-center py-6">
            No categories found.
          </div>
        )}
      </div>
    </div>
  );
  
}

export default Home