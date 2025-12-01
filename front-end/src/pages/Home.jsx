import React, { lazy, Suspense, useEffect, useState } from 'react';
import { categoryService } from "../services/categoryService";
import { useLocation } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Lazy load CategoryCard
const CategoryCard = lazy(() => import('../components/CategoryCard'));

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

// Skeleton component for CategoryCard
function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col md:flex-row w-full md:aspect-auto relative font-body min-h-[400px] md:min-h-[500px]">
      {/* Mobile/Tablet: Single full-width skeleton */}
    
      
      {/* Desktop: Two-column skeleton */}
      <div className=" md:w-1/2 relative aspect-2/3">
        <Skeleton 
          height="100%" 
          width="100%" 
          style={{ lineHeight: 'unset' }}
        />
      </div>
      
      <div className="hidden md:block md:w-1/2 relative aspect-2/3">
        <Skeleton 
          height="100%" 
          width="100%" 
          style={{ lineHeight: 'unset' }}
        />
      </div>
      
      {/* Content overlay skeleton */}
      <div className="absolute inset-0 flex flex-col justify-end items-center pb-8 lg:pb-12">
        <div className="mb-4 text-center">
          <Skeleton 
            height={40} 
            width={200} 
            style={{ marginBottom: '16px' }}
            className="lg:hidden"
          />
          <Skeleton 
            height={60} 
            width={300} 
            style={{ marginBottom: '16px' }}
            className="hidden lg:block"
          />
        </div>
        <Skeleton 
          height={48} 
          width={150} 
          borderRadius={8}
        />
      </div>
    </div>
  );
}

// Alternative: Simpler skeleton
function SimpleCategoryCardSkeleton() {
  return (
    <div className="flex flex-col md:flex-row w-full md:aspect-auto relative font-body min-h-[400px]">
      <Skeleton 
        height="100%" 
        width="100%" 
        className="aspect-2/3 md:aspect-auto"
        style={{ lineHeight: 'unset' }}
      />
    </div>
  );
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

  if (errorMsg) {
    return (
      <div className="text-center py-10 text-red font-semibold min-h-screen flex items-center justify-center">
        <div>
          <p className="text-xl mb-4">⚠️</p>
          <p className="text-lg">{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto bg-gray min-h-screen font-body" role="main">
      <div className="">
        <section aria-label="All categories">
          {loading ? (
            // Show skeleton loaders while loading
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <CategoryCardSkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          ) : (
            // Show actual categories when loaded
            <>
              {categories.map((cat) => (
                <Suspense 
                  key={cat.id} 
                  fallback={<SimpleCategoryCardSkeleton />}
                >
                  <CategoryCard 
                    id={cat.id} 
                    buttonText={cat.buttonText}
                    name={cat.name} 
                    leftImage={cat.leftImage}
                    rightImage={cat.rightImage} 
                  />
                </Suspense>
              ))}
              
              {categories.length === 0 && (
                <div className="text-gray-600 text-center py-20 font-body">
                  <p className="text-2xl mb-4">📁</p>
                  <p className="text-xl mb-2">No categories found</p>
                  <p className="text-gray">Please check back later for new collections</p>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default Home;