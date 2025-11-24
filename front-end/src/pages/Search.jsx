import React, { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { productService } from '../services/productService'
import { categoryService } from '../services/categoryService'

function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt', // Default to newest first
    sortOrder: 'desc'    // Default to descending for dates
  })
  const [showFilters, setShowFilters] = useState(false)
  const [errors, setErrors] = useState({})
  const [results, setResults] = useState({
    products: [],
    loading: false,
    error: null,
    pagination: null
  })
  const [availableCategories, setAvailableCategories] = useState([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })

  // Fetch available categories and price range on component mount
  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      // Fetch categories using categoryService
      const categoriesData = await categoryService.getAll()
      setAvailableCategories(categoriesData.categories || categoriesData || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      setAvailableCategories([])
    }

    // Always set default price range - don't wait for API
    setPriceRange({ min: 0, max: 1000 })
  }

  const handleSearch = async (e) => {
    if (e) e.preventDefault()

    // Basic frontend validation
    const newErrors = {}
    if (!searchQuery.trim()) {
      newErrors.searchQuery = 'Search query is required'
    }
    if (filters.minPrice && filters.maxPrice && parseFloat(filters.minPrice) > parseFloat(filters.maxPrice)) {
      newErrors.priceRange = 'Min price cannot be greater than max price'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    await performSearch()
  }

  const performSearch = async () => {
    try {
      setResults(prev => ({ ...prev, loading: true, error: null }))

      // Use productService for search - it has error handling built in
      const searchData = await productService.search({
        query: searchQuery.trim(),
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      })

      // The service will return data even if API fails
      setResults({
        products: searchData.data?.products || [],
        loading: false,
        error: null,
        pagination: searchData.data?.pagination || null
      })
    } catch (error) {
      console.error('Unexpected search error:', error)
      setResults({
        products: [],
        loading: false,
        error: 'An unexpected error occurred',
        pagination: null
      })
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
    if (key === 'minPrice' || key === 'maxPrice') {
      setErrors(prev => ({ ...prev, priceRange: '' }))
    }
  }

  const handleSortChange = (sortBy, sortOrder) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
    setErrors({})
  }

  const handleQuickSearch = (quickQuery) => {
    setSearchQuery(quickQuery)
    // Auto-search after a short delay
    setTimeout(() => {
      handleSearch()
    }, 100)
  }

  // Get sort order options based on selected sort field
  const getSortOrderOptions = () => {
    switch (filters.sortBy) {
      case 'price':
        return [
          { value: 'asc', label: 'Low to High' },
          { value: 'desc', label: 'High to Low' }
        ]
      case 'name':
        return [
          { value: 'asc', label: 'A to Z' },
          { value: 'desc', label: 'Z to A' }
        ]
      case 'createdAt':
      case 'updatedAt':
        return [
          { value: 'desc', label: 'Newest First' },
          { value: 'asc', label: 'Oldest First' }
        ]
      default:
        return [
          { value: 'asc', label: 'Ascending' },
          { value: 'desc', label: 'Descending' }
        ]
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 font-body min-h-screen">
      {/* Search Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-black mb-2 font-heading tracking-wide">
          Search Products
        </h1>
        <p className="text-gray">Find exactly what you're looking for</p>
      </div>

      {/* Quick Search Suggestions */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <button
          onClick={() => handleQuickSearch('t-shirt')}
          className="px-4 py-2 bg-gray/10 text-gray rounded-full hover:bg-yellow hover:text-black transition-all duration-200 font-body text-sm"
        >
          T-Shirts
        </button>
        <button
          onClick={() => handleQuickSearch('hoodie')}
          className="px-4 py-2 bg-gray/10 text-gray rounded-full hover:bg-yellow hover:text-black transition-all duration-200 font-body text-sm"
        >
          Hoodies
        </button>
       
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-sm border border-gray/20 p-6 mb-8">
        {/* Main Search Input */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products by name or description..."
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow focus:border-yellow font-body ${errors.searchQuery ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.searchQuery && (
              <p className="text-red-500 text-sm mt-1 font-body">{errors.searchQuery}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-yellow text-black py-3 px-8 rounded-lg font-body font-semibold hover:bg-black hover:text-yellow transition-all duration-300 whitespace-nowrap"
            disabled={results.loading}
          >
            {results.loading ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray/10 text-gray py-3 px-6 rounded-lg font-body font-semibold hover:bg-gray/20 transition-all duration-300 whitespace-nowrap"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Collapsible Filters */}
        {showFilters && (
          <div className="border-t border-gray/20 pt-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-body-semibold">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow font-body"
                >
                  <option value="">All Categories</option>
                  {availableCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-body-semibold">
                  Min Price (EGP)
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow font-body"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-body-semibold">
                  Max Price (EGP)
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="1000"
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow font-body"
                />
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-body-semibold">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow font-body"
                >
                  <option value="createdAt">Newest</option>
                  <option value="updatedAt">Recently Updated</option>
                  <option value="price">Price</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            {/* Sort Order Selection */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-body-semibold">
                  Sort Order
                </label>
                <div className="flex gap-2">
                  {getSortOrderOptions().map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSortChange(filters.sortBy, option.value)}
                      className={`flex-1 py-2 px-4 rounded-lg font-body font-medium transition-all duration-300 ${
                        filters.sortOrder === option.value
                          ? 'bg-yellow text-black'
                          : 'bg-gray/10 text-gray hover:bg-gray/20'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {errors.priceRange && (
              <p className="text-red-500 text-sm mb-4 font-body">{errors.priceRange}</p>
            )}

            {/* Filter Actions */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={clearFilters}
                className="text-gray hover:text-red-500 font-body font-medium transition-colors duration-200"
              >
                Clear All Filters
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="bg-gray/10 text-gray py-2 px-4 rounded-lg font-body font-medium hover:bg-gray/20 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow text-black py-2 px-6 rounded-lg font-body font-semibold hover:bg-black hover:text-yellow transition-all duration-300"
                  disabled={results.loading}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Search Results */}
      <div className="bg-white rounded-lg shadow-sm border border-gray/20 p-6">
        {results.loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow"></div>
            <p className="text-gray mt-2 font-body">Searching products...</p>
          </div>
        )}

        {results.error && (
          <div className="text-center py-8 text-red-500 font-body">
            <p className="text-lg mb-4">Error: {results.error}</p>
            <button
              onClick={performSearch}
              className="mt-2 bg-yellow text-black py-2 px-4 rounded-lg font-body font-semibold hover:bg-black hover:text-yellow transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        )}

        {!results.loading && !results.error && (
          <>
            {/* Results Header */}
            {results.products.length > 0 && (
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-black font-body-semibold">
                  Found {results.pagination?.totalCount || results.products.length} product{results.products.length !== 1 ? 's' : ''}
                </h2>
                {/* Current Sort Info */}
                <div className="text-sm text-gray font-body">
                  Sorted by: {getSortOrderOptions().find(opt => opt.value === filters.sortOrder)?.label || filters.sortOrder}
                </div>
              </div>
            )}

            {/* Products Grid */}
            {results.products.length === 0 && !results.loading && searchQuery && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-2 font-body">No products found for "{searchQuery}"</p>
                <p className="text-gray-500 font-body mb-4">Try adjusting your search criteria</p>
              </div>
            )}

            {results.products.length === 0 && !results.loading && !searchQuery && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-2 font-body">Start searching for products</p>
                <p className="text-gray-500 font-body">Enter a search term above to find products</p>
              </div>
            )}

            {results.products.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-start items-center">
                {results.products.map(product => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    id={product.id}
                    description={product.description}
                    price={product.price}
                    discount={product.discount}
                    image={product.productImages?.[0]?.imageUrl}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Search