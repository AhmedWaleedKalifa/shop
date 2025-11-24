import { Link } from "react-router"

function ProductCard({ name, id, description, price, discount, image }) {
  return (
   <Link 
    to={`/product/${id}`} 
    className='relative left-0 w-[calc(50%-4px)] md:w-[calc(25%-6px)] lg:w-[calc(12.5%-5.5px)]  h-auto bg-gray/4 flex flex-col justify-between font-body'
    aria-label={`View ${name} product details`}
>
    <article className="aspect-3/4 overflow-hidden relative">
        {discount !== 0 && (
            <div className='rounded-full p-2 absolute top-1 left-1 w-10 h-10 lg:w-8 lg:h-8 lg:text-xs lg:left-1 lg:top-1 bg-yellow flex flex-row items-center justify-center text-lg font-bold border text-gray font-heading'>
                {(Math.ceil(discount * 100)).toFixed(0)}%
            </div>
        )}
        <img
            src={image}
            alt={name}
            className='w-full h-full object-cover'
        />
    </article>
    
    <h3 className="px-2 pt-2 mb-1 text-base font-semibold line-clamp-1 font-body-medium lg:text-xs lg:font-normal">
        {name}
    </h3>
    
    <p className="px-2 line-clamp-1 text-ellipsis overflow-x-hidden text-sm text-gray font-body lg:text-[10px] ">
        {description}
    </p>
    
    {discount !== 0 ? (
        <div className="font-body">
            <del className="px-2 pt-1 line-clamp-1 text-ellipsis overflow-x-hidden text-sm text-black">
                {price} EGP
            </del>
            <p className="px-2 line-clamp-1 text-ellipsis overflow-x-hidden text-sm text-red font-semibold">
                {(price - price * discount).toFixed(2)} EGP
            </p>
        </div>
    ) : (
        <div className="font-body">
            <p className="px-2 pt-1 line-clamp-1 text-ellipsis overflow-x-hidden text-sm text-black font-semibold">
                {(price).toFixed(2)} EGP
            </p>
            <p className="px-2 line-clamp-1 text-ellipsis overflow-x-hidden text-transparent text-sm">
                .
            </p>
        </div>
    )}
</Link>
  )
}
export default ProductCard