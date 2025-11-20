import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { productService } from "../services/productService"
import { getApiError } from '../utils/errorHandler';
import BuyButton from '../components/BuyButton';

function Product() {
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
  }, [id])

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
    <>
      <div className="relative left-0 aspect-3/4 md:aspect-auto overflow-hidden w-full min-h-[60vh]">
        {product.discount !== 0 &&
          <div className='rounded-full p-1 absolute top-4 left-4 w-14 h-14 z-20 bg-yellow flex flex-row items-center justify-center text-xl font-bold border-2 border-gray text-gray'>
            {(Math.ceil(product.discount * 100)).toFixed(0)}%
          </div>
        }

        <div className="relative w-full bg-white overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {product.productImages.map((e) => (
              <div key={e?.id} className="w-full shrink-0">
                <img
                  src={e?.imageUrl}
                  alt={e?.altText}
                  className="w-full aspect-3/4 object-cover"
                />
              </div>
            ))}
          </div>

          {product.productImages.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10 text-2xl"
              >
                ‹
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10 text-2xl"
              >
                ›
              </button>
            </>
          )}

          {product.productImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {product.productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex ? 'bg-yellow border border-gray' : 'bg-white bg-opacity-50 border border-gray'
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {product.productImages.length > 1 && (
        <div className='w-full h-12 bg-white flex flex-row gap-2 items-center justify-center overflow-x-auto px-2'>
          {product.productImages.map((e, index) => (
            <button
              key={e?.id}
              onClick={() => goToSlide(index)}
              className={`shrink-0 w-10 h-10 border-2 rounded transition-all ${index === currentImageIndex ? 'border-yellow' : 'border-gray-300'
                }`}
            >
              <img
                src={e?.imageUrl}
                alt={e?.altText}
                className="w-full h-full object-cover rounded"
              />
            </button>
          ))}
        </div>
      )}

      <h3 className="p-2 text-xl font-semibold">
        {product.name}  <span className='text-gray text-lg'>{product.description}</span>
      </h3>

      {product.discount !== 0 ? (
        <>
          <del className="px-2 pt-1 line-clamp-1 text-ellipsis overflow-x-hidden text-xl text-black">
            {(product.price).toFixed(2)} EGP
          </del>
          <p className="px-2 line-clamp-1 text-ellipsis overflow-x-hidden text-xl text-red font-semibold">
            {(product.price - product.price * product.discount).toFixed(2)} EGP
          </p>
        </>
      ) : (
        <>
          <p className="px-2 pt-1 line-clamp-1 text-ellipsis overflow-x-hidden text-xl text-black font-semibold">
            {(product.price).toFixed(2)} EGP
          </p>
          <p className="px-2 line-clamp-1 text-ellipsis overflow-x-hidden text-transparent text-xl">
            .
          </p>
        </>
      )}

      <div className='flex flex-col p-2'>
        <h2 className='text-lg font-bold my-2'>Size:</h2>
        <div className='flex flex-row w-full overflow-x-auto gap-1 p-1 justify-start items-center'>
          {product.productSizes.map((e) => (
            <div
              key={e?.id}
              className={isActiveSize(e.sizeSymbol) ? "activeSize" : "inActiveSize"}
              onClick={() => handleClickSize(e.sizeSymbol)}
            >
              {e.sizeSymbol}
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-col p-2'>
        <h2 className='text-lg font-bold my-2'>Color:</h2>
        <div className='flex flex-row w-full overflow-x-auto gap-1 p-1 justify-start items-center'>
          {product.productColors.map((e) => (
            <div key={e?.id}>
              <div className={isActiveColor(e.colorName) ? 'activeColorText' : "inActiveColorText"}>
                {e.colorName}
              </div>
              <div
                className={isActiveColor(e.colorName) ? "activeColor" : "inActiveColor"}
                onClick={() => { handleClickColor(e.colorName) }}
                style={{ backgroundColor: e.hexCode }}
              >
              </div>
            </div>
          ))}
        </div>
      </div>

      <BuyButton
        productName={product.name}
        productPrice={product.discount !== 0 ? (product.price - product.price * product.discount).toFixed(2) : product.price.toFixed(2)}
        productId={product.id}
        productColor={color}
        productSize={size}
      />
    </>
  )
}

export default Product