import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getApiError } from '../utils/errorHandler';
import { categoryService } from '../services/categoryService';
import ProductCard from '../components/ProductCard';

function Category() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        let categoryData = await categoryService.getById(id);
        categoryData = categoryData.category;
        
        let productsData = await categoryService.getCategoryProducts(id);
        productsData = productsData.products;
        console.log(productsData)
        if (productsData) {
          setProducts(productsData);
        } else {
          setProducts([]);
        }
        
        if (categoryData && categoryData.name) {
          setCategory(categoryData);
        } else {
          setCategory(null);
        }

      } catch (error) {
        setErrorMsg(getApiError(error));
        setCategory(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    window.scrollTo(0, 0);

    if (id) {
      loadData();
    } else {
      setLoading(false);
      setErrorMsg("No category ID provided");
    }

  }, [id]);

  if (loading) {
    return <div className="text-center py-10 text-gray min-h-[70vh]">Loading...</div>;
  }

  if (errorMsg) {
    return (
      <div className="text-center py-10 text-red font-semibold min-h-[70vh]">
        {errorMsg}
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-10 text-gray min-h-[70vh]">
        Category not found.
      </div>
    );
  }

  return (
    <div className=" bg-white m-2 min-h-[70vh]">
      <h2 className='font-bold text-black'>{category.name}</h2>
      <div className="flex flex-row flex-wrap gap-2 lg:gap-1.5 mt-2 w-full h-auto ">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            name={product.name} 
            id={product.id} 
            description={product.description} 
            price={product.price} 
            discount={product.discount} 
            image={product.productImages?.[0]?.imageUrl||"https://res.cloudinary.com/dgiproy8s/image/upload/v1763208708/0f4b2b6c-d3c7-4b64-9d55-3497177af7e3_prwkpe.jpg" }
          />
        ))}
        {products.length === 0 && (
          <div className="text-gray-600 text-center py-6">
            No Products found.
          </div>
        )}
      </div>
    </div>
  );
}

export default Category;