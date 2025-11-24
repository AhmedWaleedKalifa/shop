import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { productService } from "../services/productService"
import { getApiError } from '../utils/errorHandler';
import BuyButton from '../components/BuyButton';
import { useLocation } from 'react-router-dom';

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
  }, [id,location.pathname])

  if (loading) {
    return <div className="text-center py-10 text-gray min-h-[60vh]">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red font-semibold min-h-[60vh]">
        {error}
      </div>
    );
  }

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
            <h1 className="p-2 lg:p-0 text-2xl font-semibold text-black font-body-semibold">
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
                        className={`px-4 py-2 rounded-lg border-2 transition-all font-body ${isActiveSize(sizeOption.sizeSymbol) ? "activeSize border-yellow bg-yellow text-black" : "inActiveSize border-gray-300 text-gray hover:border-yellow"}`}
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
                            className={`w-8 h-8 rounded-full border-2 transition-all duration-300  ${isActiveColor(colorOption.colorName) ? "border-yellow scale-110" : "border-gray-300"}`}
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

export default Product