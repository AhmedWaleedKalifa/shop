import React, { lazy, Suspense, useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { getApiError } from '../utils/errorHandler';
import { categoryService } from '../services/categoryService';
import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'

const ProductCard = lazy(() => import("../components/ProductCard"))

function ProductCardSkeleton() {
  return (
    <div 
      className='relative left-0 w-[calc(50%-4px)] md:w-[calc(25%-6px)] lg:w-[calc(12.5%-5.5px)] h-auto bg-gray/4 flex flex-col justify-between font-body'
    >
      <div className="aspect-3/4 overflow-hidden relative">
        <div className='rounded-full absolute top-1 left-1 w-10 h-10 lg:w-8 lg:h-8'>
        </div>
        <Skeleton 
          height="100%" 
          width="100%" 
          style={{ lineHeight: 'unset' }}
        />
      </div>
      
      <div className="px-2 pt-2 mb-1 h-5">
        <Skeleton height={16} width="90%" />
      </div>
      
      <div className="px-2 h-4">
        <Skeleton height={12} width="100%" />
      </div>
      
      <div className="font-body">
        <div className="px-2 pt-1 h-5">
          <Skeleton height={16} width="40%" />
        </div>
        <div className="px-2 h-4">
          <Skeleton height={16} width="30%" className="opacity-0" />

        </div>
      </div>
    </div>
  );
}

function Category() {
  const location = useLocation();
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setErrorMsg("");
        let categoryData = await categoryService.getById(id);
        categoryData = categoryData.category;
        
        let productsData = await categoryService.getCategoryProducts(id);
        productsData = productsData.products;
        console.log(productsData)
        
        if (productsData) {
          console.log(productsData)
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

  }, [id, location.key]);

  if (loading) {
    return (
      <main className="bg-white m-2 min-h-[70vh] font-body">
        <header className="mb-4">
          <Skeleton height={32} width="40%" style={{ marginBottom: '8px' }} />
          <Skeleton height={16} width="20%" />
        </header>
        
        <section className="flex flex-row flex-wrap gap-2 lg:gap-1.5 mt-2 w-full">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} />
          ))}
        </section>
      </main>
    );
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
    <main className="bg-white m-2 min-h-[70vh] font-body">
      <header className="mb-4">
        <h1 className='font-bold text-black text-2xl lg:text-3xl font-heading tracking-wide capitalize'>
          {category?.name}
        </h1>
        {products.length > 0 && (
          <p className='text-gray text-sm mt-1 font-body'>
            {products.length} product{products.length !== 1 ? 's' : ''} available
          </p>
        )}
      </header>
      
      <section className="flex flex-row flex-wrap gap-2 lg:gap-1.5 mt-2 w-full">
        {products.length > 0 ? (
          products.map((product) => (
            <Suspense key={product.id} fallback={<ProductCardSkeleton />}>
              <ProductCard 
                name={product.name} 
                id={product.id} 
                description={product.description} 
                price={product.price} 
                discount={product.discount} 
                image={product.productImages?.[0]?.imageUrl || "https://res.cloudinary.com/dgiproy8s/image/upload/v1763208708/0f4b2b6c-d3c7-4b64-9d55-3497177af7e3_prwkpe.jpg"}
              />
            </Suspense>
          ))
        ) : (
          <div className="text-gray-600 text-center py-6 w-full font-body">
            <p className="text-lg mb-2">No products found in this category.</p>
            <p className="text-sm text-gray">Check back later for new arrivals.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Category;