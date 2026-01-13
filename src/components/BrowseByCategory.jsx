import React, { useEffect } from 'react'
import './BrowseByCategory.css'
import { fetchCategories } from '../store/actions/AuctionsActions'
import { useDispatch, useSelector } from 'react-redux'

const BrowseByCategory = ({ selectedCategory, setSelectedCategory }) => {
  const dispatch = useDispatch()
  const { categories } = useSelector(state => state.buyer)

  console.log(categories);


  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  return (
    <section className="browse-section">
      <div className="browse-container">
        <h2 className="browse-title">Browse by Category</h2>

        <div className="category-tabs-container">
          <div className="category-tabs">

            <button
              className={`category-tab ${selectedCategory === null ? 'active' : ''
                }`}
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </button>

            {
              categories?.map(category => (
                <button
                  key={category?.id}
                  className={`category-tab ${selectedCategory === category.name ? 'active' : ''
                    }`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </button>
              ))

            }

          </div>

          <div className="scroll-indicator">
            <span className="scroll-dot active"></span>
            <span className="scroll-dot"></span>
            <span className="scroll-dot"></span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrowseByCategory
