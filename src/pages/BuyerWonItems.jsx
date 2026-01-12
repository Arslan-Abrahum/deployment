import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './BuyerWonItems.css'

const BuyerWonItems = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState('unpaid')
  const itemsPerPage = 8

  // Empty array - showing no data
  const wonItems = []

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  // Filter items based on active tab
  const filteredByTab = wonItems.filter(item => {
    if (activeTab === 'paid') {
      return item.paymentStatus === 'paid'
    } else {
      return item.paymentStatus === 'pending'
    }
  })

  const filteredItems = filteredByTab.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lotId.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const totalItems = filteredItems.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredItems.slice(startIndex, endIndex)

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1) // Reset to first page when changing tabs
  }

  return (
    <div className="won-items-page">
      <div className="won-items-content">
        <div className="won-items-container">
      
          <nav className="breadcrumbs">
            <Link to="/buyer/dashboard">Dashboard</Link>
            <span>/</span>
            <span>Won Items</span>
          </nav>

          <div className="page-header">
            <div className="header-left">
              <h1 className="page-title">Won Items</h1>
            </div>
          </div>

          <div className="search-bar">
            <div className="search-wrapper">
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search by lot name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="won-items-tabs">
            <button
              className={`won-items-tab ${activeTab === 'unpaid' ? 'won-items-tab-active' : ''}`}
              onClick={() => handleTabChange('unpaid')}
            >
              UnPaid
            </button>
            <button
              className={`won-items-tab ${activeTab === 'paid' ? 'won-items-tab-active' : ''}`}
              onClick={() => handleTabChange('paid')}
            >
              Paid
            </button>
          </div>

          {/* Empty State */}
          {totalItems === 0 ? (
            <div className="won-items-empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M9 11L12 14L22 4" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" />
              </svg>
              <h2>No items found</h2>
              <p>{activeTab === 'paid' ? 'You don\'t have any paid items yet.' : 'You don\'t have any unpaid items yet.'}</p>
            </div>
          ) : (
            <>
              <div className="items-grid">
                {currentItems.map(item => (
                  <div key={item.id} className="won-item-card">
                    <div className="won-item-image">
                      <img src={item.image} alt={item.title} />
                      <div className="won-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
                        </svg>
                        <span>Won</span>
                      </div>
                    </div>

                    <div className="item-details">
                      <div className="item-category">{item.category.toUpperCase()}</div>
                      <h3 className="item-title">{item.title}</h3>
                      <div className="item-lot-id">Lot {item.lotId}</div>

                      <div className="winning-price">
                        {formatCurrency(item.winningPrice)}
                      </div>

                      <div className="congratulations-msg">
                        Congratulations! You won this lot.
                      </div>

                      {item.paymentStatus === 'pending' ? (
                        <div className="payment-status pending">
                          <div className="status-header">
                            <span className="status-label">PAYMENT DEADLINE</span>
                            <span className="status-timer">{item.paymentDeadline}</span>
                          </div>
                          <div className="won-invoice-status">
                            <span className="invoice-label">Invoice:</span>
                            <span className="invoice-badge pending-badge">Pending Payment</span>
                          </div>
                        </div>
                      ) : (
                        <div className="payment-status paid">
                          <div className="status-header">
                            <span className="status-label">PAYMENT COMPLETE</span>
                            <span className="status-date">{item.paymentDate}</span>
                          </div>
                          <div className="won-invoice-status">
                            <span className="invoice-label">Invoice:</span>
                            <span className="invoice-badge paid-badge">Paid</span>
                          </div>
                        </div>
                      )}

                      <div className="item-actions">
                        {item.paymentStatus === 'pending' ? (
                          <>
                            <button
                              className="wonItems-action-btn primary"
                              // onClick={() => navigate(`/payment/${item.id}`)}
                            >
                              Proceed to Payment
                            </button>
                            <button
                              className="wonItems-action-btn secondary"
                              // onClick={() => navigate(`/buyer/invoices`)}
                            >
                              View Invoice
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="wonItems-action-btn primary"
                              // onClick={() => navigate(`/invoice/${item.invoiceNumber}`)}
                            >
                              View Invoice
                            </button>
                            <button
                              className="wonItems-action-btn secondary"
                              onClick={() => navigate(`/buyer/auction/${item.id}`)}
                            >
                              View Lot Details
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="wonItems-pagination">
                  <button
                    className="wonItems-pagination-btn wonItems-prev-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Previous
                  </button>

                  <div className="wonItems-page-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                      <button
                        key={pageNumber}
                        className={`wonItems-page-number ${currentPage === pageNumber ? 'active' : ''}`}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>

                  <button
                    className="wonItems-pagination-btn wonItems-next-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    Next
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BuyerWonItems
