import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import './FeaturedAuctions.css'
import { useSelector, useDispatch } from 'react-redux'
import { browseAuctions } from '../store/actions/buyerActions'
import { toast } from 'react-toastify'
const FeaturedAuctions = ({ selectedCategory }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const { browseAuctionsList, isLoading } = useSelector(state => state.buyer);
  const { token } = useSelector(state => state.auth);
  const auctions = browseAuctionsList?.results || []
  const totalCount = browseAuctionsList?.count || 0
  const PAGE_SIZE = 20

  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerRow, setItemsPerRow] = useState(4)

  useEffect(() => {
    dispatch(browseAuctions());
  }, [dispatch]);

  useEffect(() => {
    const calculateItemsPerRow = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth
        if (width >= 1400) return 8
        if (width >= 1024) return 8
        if (width >= 768) return 6
        return 1
      }
      return 5
    }
    setItemsPerRow(calculateItemsPerRow())
    const handleResize = () => {
      const newItemsPerRow = calculateItemsPerRow()
      setItemsPerRow(newItemsPerRow)
      const maxIndex = Math.ceil(filteredAuctions.length / newItemsPerRow) - 1
      if (currentIndex > maxIndex) setCurrentIndex(0)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentIndex])

  const filteredAuctions = useMemo(() => {
    if (!selectedCategory) {
      return auctions.filter(a => a.status === 'ACTIVE')
    }
    return auctions.filter(
      a =>
        a.category_name === selectedCategory &&
        a.status === 'ACTIVE'
    )
  }, [auctions, selectedCategory])


  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const startIndex = currentIndex * itemsPerRow
  const endIndex = startIndex + itemsPerRow
  const visibleAuctions = filteredAuctions.slice(startIndex, endIndex)

  const handlePrevious = () => setCurrentIndex(prev => (prev > 0 ? prev - 1 : totalPages - 1))
  const handleNext = () => setCurrentIndex(prev => (prev < totalPages - 1 ? prev + 1 : 0))

  return (
    <section className="featured-section">
      <div className="featured-container">
        <div className="featured-header">
          <h2 className="featured-title">Featured Auctions</h2>
          <div className="featured-nav">
            <button className="nav-arrow left-arrow" onClick={handlePrevious} aria-label="Previous">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="nav-arrow right-arrow" onClick={handleNext} aria-label="Next">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <div className="auctions-grid">
          {visibleAuctions.length === 0 ? (
            <div className="featured-empty-state">
              <div className="featured-empty-icon">📦</div>
              <h3 className="featured-empty-title">
                No auctions available
              </h3>
              <p className="featured-empty-text">
                There are currently no active auctions
                {selectedCategory ? ` in this category.` : '.'}
              </p>
            </div>
          ) : (
            visibleAuctions.map((auction) => (
              <div key={auction.id} className="feature-auction-card">
                <div className="auction-image">
                  <img
                    src={auction?.media?.[0]?.file}
                    alt={auction.title}
                  />
                </div>

                <div className="auction-content">
                  <h3 className="auction-title">{auction.title}</h3>

                  <div className="auction-details">
                    <div className="auction-bid">
                      <span className="detail-label">Starting Price</span>
                      <span className="detail-value">
                        {`${auction?.currency || 'USD'} ${auction.initial_price}`}
                      </span>
                    </div>

                    <div className="auction-time">
                      <span className="detail-label">Total Bids</span>
                      <span className="detail-value">
                        {auction?.total_bids}
                      </span>
                    </div>
                  </div>

                  <button
                    className="auction-button"
                    onClick={() => {
                      token
                        ? navigate(`/auction/${auction.id}`)
                        : (
                          toast.info(
                            'Please sign in to view auction details.'
                          ),
                          navigate('/signin')
                        )
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {totalPages > 1 && (
          <div className="slider-indicators">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`indicator ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(index + 1)}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}

export default FeaturedAuctions
