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
  function isActiveColor(realColor) {
    if (realColor == color) {
      return true
    } else {
      return false
    }
  }
  function handleClickColor(realColor) {
    if (realColor) {
      setColor(realColor)
    }
  }
  function isActiveSize(realSize) {
    if (realSize == size) {
      return true
    } else {
      return false
    }
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
          // setSize(productData.productSizes?.[0].sizeSymbol)
          // setColor(productData.productColors?.[0].colorName)
        } else {
          setProduct(null)
        }
      } catch (error) {
        setError(getApiError(error))
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [])
  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-10 text-gray-600">
        Product not found.
      </div>
    );
  }
  return (
    <>
      <div className="relative left-0 aspect-3/4 md:aspect-auto overflow-hidden w-full">
        {product.discount !== 0 &&
          <div
            className='rounded-full p-1 absolute top-4 left-4 w-14 h-14 z-20 bg-yellow flex flex-row items-center justify-center text-xl font-bold border-2 border-gray  text-gray'
          >
            {(Math.ceil(product.discount * 100)).toFixed(0)}%
          </div>
        }
        <div className='flex flex-row w-full  bg-white overflow-x-auto items-center md:justify-center'>
          {product.productImages.map((e) => (
            <img
              key={e?.id}
              src={e?.imageUrl}
              alt={e?.altText}
              className='min-w-full md:min-w-8  md:w-1/3 relative bg-cover bg-center  bg-no-repeat aspect-2/3 '
            />
          )
          )}
        </div>
      </div>
      <h3 className="p-2 text-xl font-semibold  ">
        {product.name}  <span className='text-gray text-lg'>{product.description}</span>
      </h3>

      {
        product.discount !== 0 ? (
          <>
            <del className="px-2 pt-1  line-clamp-1 text-ellipsis overflow-x-hidden text-xl text-black">
              {(product.price).toFixed(2)} EGP
            </del>
            <p className="px-2  line-clamp-1 text-ellipsis overflow-x-hidden text-xl text-red font-semibold">
              {(product.price - product.price * product.discount).toFixed(2)} EGP
            </p>
          </>
        ) : (
          <>
            <p className="px-2 pt-1  line-clamp-1 text-ellipsis overflow-x-hidden text-xl text-black font-semibold">
              {(product.price).toFixed(2)} EGP
            </p>
            <p className="px-2  line-clamp-1 text-ellipsis overflow-x-hidden text-transparent text-xl ">
              .
            </p>
          </>
        )
      }
      <div className='flex flex-col p-2' >
        <h2 className='text-lg font-bold my-2'>Size:</h2>
        <div className='flex flex-row w-full  overflow-x-auto gap-1 p-1 justify-start items-center'>
          {product.productSizes.map((e) => (
            <div
              key={e?.id}
              className={isActiveSize(e.sizeSymbol) ? "activeSize" : "inActiveSize"}
              onClick={() => handleClickSize(e.sizeSymbol)}
            >
              {e.sizeSymbol}
            </div>
          )
          )}
        </div>
      </div>
      <div className='flex flex-col p-2' >
        <h2 className='text-lg font-bold my-2'>Color:</h2>
        <div className='flex flex-row w-full  overflow-x-auto gap-1 p-1 justify-start items-center'>
          {product.productColors.map((e) => (
            <div key={e?.id}>
              <div className={isActiveColor(e.colorName) ? 'activeColorText' : "inActiveColorText"} 
              >
                {e.colorName}
              </div>
              <div
                className={isActiveColor(e.colorName) ? "activeColor" : "inActiveColor"}
                onClick={() => { handleClickColor(e.colorName) }}
                style={{ backgroundColor: e.hexCode }}
              >
              </div>
            </div>
          )
          )}
        </div>
      </div>
      <BuyButton
        productName={product.name}
        productPrice={product.discount != 0 ? (product.price - product.price * product.discount).toFixed(2) : product.price.toFixed(2)}
        productId={product.id}
        productColor={color}
        productSize={size}
      />
      {/* <div className='fixed md:relative left-0 bottom-3 px-2  w-full h-16 flex flex-col items-center justify-center '>
        <div className='w-84 h-12 flex flex-col items-center justify-center font-bold text-xl bg-yellow rounded-full hover:bg-black hover:text-yellow hover:border-3 hover:border-yellow'
        onClick={()=>{alert("You Bought Successfully")}}
        >
          Buy Now
        </div>
      </div> */}
    </>
  )
}

export default Product