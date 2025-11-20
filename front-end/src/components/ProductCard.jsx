import { Link } from "react-router"

function ProductCard({ name, id, description, price, discount, image }) {
  return (
    <Link to={`/product/${id}`} className='relative left-0 w-[calc(50%-4px)] md:w-[calc(25%-6px)] lg:w-[calc(12.5%-8px)]  h-auto  bg-gray/4  flex flex-col justify-between'>
    
      <div className="aspect-3/4 overflow-hidden">
      {discount!==0&&
          <div
        className='rounded-full p-1 absolute top-2 left-2 w-10 h-10 bg-yellow flex flex-row items-center justify-center text-lg font-bold border  text-gray'
      >
        {(Math.ceil(discount * 100)).toFixed(0)}%
      </div>
      }
        <img
          src={image}
          alt={name}
          className='w-full h-full object-cover'
        />
      </div>
      <h3 className="p-2 text-base font-semibold  line-clamp-1">
        {name}
      </h3>
      <p className="px-2  line-clamp-1 text-ellipsis overflow-x-hidden text-sm text-gray">
        {description}
      </p>
      {discount !== 0 ? (
        <>
          <del className="px-2 pt-1  line-clamp-1 text-ellipsis overflow-x-hidden text-sm text-black">
            {price} EGP
          </del>
          <p className="px-2  line-clamp-1 text-ellipsis overflow-x-hidden text-sm text-red font-semibold">
            {(price - price * discount).toFixed(2)} EGP
          </p>
        </>
      ) : (
        <>
          <p className="px-2 pt-1  line-clamp-1 text-ellipsis overflow-x-hidden text-sm text-black font-semibold">
            {(price).toFixed(2)} EGP
          </p>
          <p className="px-2  line-clamp-1 text-ellipsis overflow-x-hidden text-transparent text-sm ">
            .
          </p>
        </>
      )}

    </Link>
  )
}
export default ProductCard