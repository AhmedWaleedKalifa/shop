import React from 'react'
import CategoryCard from '../components/CategoryCard'
import { useEffect } from 'react'
import { categoryService } from '../services/categoryService'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons'

export default function Categories() {
    const [loading, setLoading] = useState(true)
    const [categories, setCategories] = useState(null)
    const [error, setError] = useState("")
    const nav=useNavigate()
    useEffect(() => {
        async function loadCategories() {
            try {
                setLoading(true)
                setError("")
                const response = await categoryService.getAll()
              
               if (response.categories && Array.isArray(response.categories)) {
                    setCategories(response.categories)
                }
              
                
            } catch (error) {
                setError("Failed to load categories. Please try again.")
                setCategories([])
            } finally {
                setLoading(false)
            }
        }
        
        loadCategories()
    }, [])
    return (
        <>
            <h2 className='my-2'>Categories</h2>
           <div className='flex flex-row gap-2'>
             <button onClick={()=>{nav(-1)}} className='absolute left-2 top-3 z-50 cursor-pointer'><FontAwesomeIcon icon={faArrowLeft}/></button>
                       <Link to="/page/createCategory" className='block bg-yellow text-white cursor-pointer px-4 py-2 rounded-full'><FontAwesomeIcon icon={faPlus}/>New</Link>

           </div>
            <div className='flex row flex-wrap py-4 gap-2'>

                {categories?.length > 0 && (
                    categories.map((e) => {
                        return <CategoryCard id={e.id} priority={e.displayOrder} name={e.name} leftImage={e.leftImage} key={e.id}></CategoryCard>
                    })
                )
                }

            </div>
        </>
    )
}
