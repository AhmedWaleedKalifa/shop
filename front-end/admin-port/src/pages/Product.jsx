import React, { lazy, Suspense, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { productService } from "../services/productService"
import { getApiError } from '../utils/errorHandler';
import { useLocation } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Lazy load components if needed
// const BuyButton = lazy(() => import('../components/BuyButton'));

// Product Skeleton Component
function ProductSkeleton() {
  return (
    <div className='flex flex-col lg:flex-row lg:justify-between mt-8 font-body'>
      {/* Left Section - Product Images Skeleton */}
      <section className='leftDiv lg:w-1/2' aria-label="Loading product images">
        <div className="relative left-0 aspect-3/4 md:aspect-auto overflow-hidden w-full min-h-[60vh]">
          {/* Discount badge skeleton */}
          <div className='rounded-full p-1 absolute top-4 left-4 w-14 h-14 z-20 bg-gray-200 flex flex-row items-center justify-center'></div>

          <div className="relative w-full bg-white overflow-hidden">
            {/* Main image skeleton */}
            <div className="flex">
              <div className="w-full shrink-0">
                <Skeleton 
                  height="100%" 
                  width="100%" 
                  className="aspect-3/4 md:max-h-[70vh]"
                />
              </div>
            </div>

            {/* Navigation arrows skeleton */}
            {[...Array(2)].map((_, index) => (
              <div 
                key={index}
                className={`absolute ${index === 0 ? 'left-2' : 'right-2'} top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full z-10 w-10 h-10`}
              />
            ))}

            {/* Image indicators skeleton */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} circle width={12} height={12} />
              ))}
            </div>
          </div>
        </div>

        {/* Thumbnails skeleton */}
        <div className='w-full h-12 bg-white flex flex-row gap-2 items-center justify-center overflow-x-auto px-2 mt-4'>
          {[...Array(4)].map((_, index) => (
            <div key={index} className="shrink-0 w-10 h-10 border-2 border-gray-200 rounded">
              <Skeleton height="100%" width="100%" />
            </div>
          ))}
        </div>
      </section>

      {/* Right Section - Product Details Skeleton */}
      <section className='rightDiv lg:w-[60%] lg:px-8 mt-6 lg:mt-0' aria-label="Loading product details">
        <header className="mb-6">
          {/* Product title skeleton */}
          <Skeleton height={32} width="70%" className="mb-4" />
          
          {/* Product description skeleton */}
          <div className="p-2 lg:p-0 space-y-2">
            <Skeleton height={20} width="100%" />
            <Skeleton height={20} width="90%" />
            <Skeleton height={20} width="80%" />
          </div>
        </header>

        {/* Price skeleton */}
        <div className="mb-6 font-body p-2 space-y-2">
          <Skeleton height={28} width="40%" />
          <Skeleton height={28} width="30%" />
        </div>

        {/* Size selection skeleton */}
        <section className='flex flex-col p-2 mb-6'>
          <Skeleton height={24} width="20%" className="mb-3" />
          <div className='flex flex-row w-full overflow-x-auto gap-2 p-1 justify-start items-center'>
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} height={40} width={60} className="rounded-lg" />
            ))}
          </div>
        </section>

        {/* Color selection skeleton */}
        <section className='flex flex-col p-2 mb-6'>
          <Skeleton height={24} width="20%" className="mb-3" />
          <div className='flex flex-row w-full overflow-x-auto gap-3 p-1 justify-start items-center'>
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-1 p-2">
                <Skeleton 
                  circle 
                  height={32} 
                  width={32} 
                  className="border-2 border-gray-200"
                />
                <Skeleton height={12} width={40} />
              </div>
            ))}
          </div>
        </section>

        {/* Buy button skeleton */}
        <div className="p-2">
          <Skeleton height={50} width="100%" className="rounded-lg" />
        </div>
      </section>
    </div>
  );
}

function Product() {
  const location = useLocation();
  const { id } = useParams()
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [color, setColor] = useState("")
  const [size, setSize] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Image slider functions
  const goToSlide = (index) => {
    setCurrentImageIndex(index);
  };

  const goToNext = () => {
    setCurrentImageIndex(prevIndex =>
      prevIndex === product.productImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setCurrentImageIndex(prevIndex =>
      prevIndex === 0 ? product.productImages.length - 1 : prevIndex - 1
    );
  };

  function isActiveColor(realColor) {
    return realColor === color;
  }

  function handleClickColor(realColor) {
    if (realColor) {
      setColor(realColor)
    }
  }

  function isActiveSize(realSize) {
    return realSize === size;
  }

  function handleClickSize(realSize) {
    if (realSize) {
      setSize(realSize)
    }
  }

  useEffect(() => {
    async function loadProduct() {
      try {
        let productData = await productService.getById(id);
        productData = productData.product;

        if (productData) {
          setProduct(productData)
        } else {
          setProduct(null)
        }
      } catch (error) {
        setError(getApiError(error))
      } finally {
        setLoading(false)
      }
    }
    window.scrollTo(0, 0);
    loadProduct()
  }, [id, location.pathname])

  // Show skeleton while loading
  if (loading) {
    return <ProductSkeleton />;
  }

  // Show error if any
  if (error) {
    return (
      <div className="text-center py-10 text-red font-semibold min-h-[60vh]">
        {error}
      </div>
    );
  }

  // Show product not found if no product data
  if (!product) {
    return (
      <div className="text-center py-10 text-gray min-h-[60vh] ">
        Product not found.
      </div>
    );
  }

  return (
    <div className='flex flex-col lg:flex-row lg:justify-between mt-8 font-body'>
      {/* Left Section - Product Images */}
      <section className='leftDiv lg:w-1/2' aria-label="Product images">
        <div className="relative left-0 aspect-3/4 md:aspect-auto overflow-hidden w-full min-h-[60vh]">
          {product.discount !== 0 && (
            <div className='rounded-full p-1 absolute top-4 left-4 w-14 h-14 z-20 bg-yellow flex flex-row items-center justify-center text-xl font-bold border-2 border-gray text-gray font-heading'>
              {(Math.ceil(product.discount * 100)).toFixed(0)}%
            </div>
          )}

          <div className="relative w-full bg-white overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {product.productImages.map((image) => (
                <figure key={image?.id} className="w-full shrink-0">
                  <img
                    src={image?.imageUrl}
                    alt={image?.altText || `${product.name} product image`}
                    className="w-full aspect-3/4 md:max-h-[70vh] md:aspect-auto md:object-contain lg:max-h-[75vh] object-cover"
                  />
                </figure>
              ))}
            </div>

            {product.productImages.length > 1 && (
              <>
                <button
                  onClick={goToPrev}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10 text-2xl font-body"
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10 text-2xl font-body"
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}

            {product.productImages.length > 1 && (
              <nav className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10" aria-label="Image navigation">
                {product.productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex ? 'bg-yellow border border-gray' : 'bg-white bg-opacity-50 border border-gray'}`}
                    aria-label={`Go to image ${index + 1}`}
                    aria-current={index === currentImageIndex ? 'true' : 'false'}
                  />
                ))}
              </nav>
            )}
          </div>
        </div>

        {product.productImages.length > 1 && (
          <nav className='w-full h-12 bg-white flex flex-row gap-2 items-center justify-center overflow-x-auto px-2' aria-label="Product thumbnails">
            {product.productImages.map((image, index) => (
              <button
                key={image?.id}
                onClick={() => goToSlide(index)}
                className={`shrink-0 w-10 h-10 border-2 rounded transition-all ${index === currentImageIndex ? 'border-yellow' : 'border-gray-300'}`}
                aria-label={`View ${image?.altText || 'product image'} ${index + 1}`}
              >
                <img
                  src={image?.imageUrl}
                  alt={image?.altText || `${product.name} thumbnail`}
                  className="w-full h-full object-cover rounded"
                />
              </button>
            ))}
          </nav>
        )}
      </section>

      {/* Right Section - Product Details */}
      <section className='rightDiv lg:w-[60%] lg:px-8' aria-label="Product details">
        <header className="mb-6">
          <h1 className="p-2 lg:p-0 text-2xl font-semibold text-black font-body-semibold capitalize">
            {product.name}
          </h1>
          <p className='text-gray text-lg mt-2 font-body p-2'>{product.description}</p>
        </header>

        <div className="mb-6 font-body">
          {product.discount !== 0 ? (
            <div>
              <del className="px-2 pt-1 line-clamp-1 text-ellipsis overflow-x-hidden text-xl text-black">
                {(product.price).toFixed(2)} EGP
              </del>
              <p className="px-2 line-clamp-1 text-ellipsis overflow-x-hidden text-xl text-red font-semibold">
                {(product.price - product.price * product.discount).toFixed(2)} EGP
              </p>
            </div>
          ) : (
            <div>
              <p className="px-2 pt-1 line-clamp-1 text-ellipsis overflow-x-hidden text-xl text-black font-semibold">
                {(product.price).toFixed(2)} EGP
              </p>
              <p className="px-2 line-clamp-1 text-ellipsis overflow-x-hidden text-transparent text-xl">
                .
              </p>
            </div>
          )}
        </div>

        <section className='flex flex-col p-2 mb-6'>
          <h2 className='text-lg font-bold my-2 font-body-semibold'>Size:</h2>
          <div className='flex flex-row w-full overflow-x-auto gap-2 p-1 justify-start items-center' role="listbox" aria-label="Available sizes">
            {product.productSizes.map((sizeOption) => (
              <button
                key={sizeOption?.id}
                className={`px-4 py-2 rounded-lg border-2 transition-all font-body capitalize ${isActiveSize(sizeOption.sizeSymbol) ? "activeSize border-yellow bg-yellow text-black" : "inActiveSize border-gray-300 text-gray hover:border-yellow"}`}
                onClick={() => handleClickSize(sizeOption.sizeSymbol)}
                aria-pressed={isActiveSize(sizeOption.sizeSymbol)}
              >
                {sizeOption.sizeSymbol}
              </button>
            ))}
          </div>
        </section>

        <section className='flex flex-col p-2 mb-6'>
          <h2 className='text-lg font-bold my-2 font-body-semibold'>Color:</h2>
          <div className='flex flex-row w-full overflow-x-auto gap-3 p-1 justify-start items-center' role="listbox" aria-label="Available colors">
            {product.productColors.map((colorOption) => (
              <button
                key={colorOption?.id}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 font-body ${isActiveColor(colorOption.colorName) ? "activeColorText border-2 border-yellow" : "inActiveColorText border-2 border-transparent"}`}
                onClick={() => handleClickColor(colorOption.colorName)}
                aria-pressed={isActiveColor(colorOption.colorName)}
              >
                <div
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-300 capitalize  ${isActiveColor(colorOption.colorName) ? "border-yellow scale-110" : "border-gray-300"}`}
                  style={{ backgroundColor: colorOption.hexCode }}
                  aria-label={colorOption.colorName}
                />
                <span className="text-xs transition-all duration-300 ">{colorOption.colorName}</span>
              </button>
            ))}
          </div>
        </section>

        <BuyButton
          productName={product.name}
          productPrice={product.discount !== 0 ? (product.price - product.price * product.discount).toFixed(2) : product.price.toFixed(2)}
          productId={product.id}
          productColor={color}
          productSize={size}
        />
      </section>
    </div>
  )
}

export default Product;