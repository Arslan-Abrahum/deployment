import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import './WonItems.css'

const WonItems = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Mock won items data
  const wonItems = [
    {
      id: 1,
      lotId: '#1024',
      title: 'Vintage Abstract Painting',
      category: 'Modern Art Collection',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
      winningPrice: 1250.00,
      paymentStatus: 'pending',
      paymentDeadline: '2d 14h 32m',
      invoiceNumber: 'INV-2024-001'
    },
    {
      id: 2,
      lotId: '#781',
      title: '19th Century Rocking Chair',
      category: 'Antique Furniture Fair',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
      winningPrice: 475.00,
      paymentStatus: 'paid',
      paymentDate: 'June 12, 2024',
      invoiceNumber: 'INV-2024-002'
    },
    {
      id: 3,
      lotId: '#2345',
      title: 'Rare Vintage Watch Collection',
      category: 'Luxury Timepieces',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      winningPrice: 3200.00,
      paymentStatus: 'pending',
      paymentDeadline: '4d 8h 5m',
      invoiceNumber: 'INV-2024-003'
    },
    {
      id: 4,
      lotId: '#5678',
      title: 'Classic Persian Rug',
      category: 'Fine Art & Collectibles',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
      winningPrice: 890.00,
      paymentStatus: 'paid',
      paymentDate: 'May 28, 2024',
      invoiceNumber: 'INV-2024-004'
    },
    {
      id: 5,
      lotId: '#9012',
      title: 'Mid-Century Modern Lamp',
      category: 'Design & Decor',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
      winningPrice: 650.00,
      paymentStatus: 'pending',
      paymentDeadline: '1d 6h 20m',
      invoiceNumber: 'INV-2024-005'
    },
    {
      id: 6,
      lotId: '#3456',
      title: 'Vintage Camera Collection',
      category: 'Photography Equipment',
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&q=80',
      winningPrice: 1850.00,
      paymentStatus: 'paid',
      paymentDate: 'June 5, 2024',
      invoiceNumber: 'INV-2024-006'
    }
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const filteredItems = wonItems.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lotId.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const itemsPerPage = 12
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleItems = filteredItems.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="won-items-page">
      {/* Buyer Dashboard Header */}
      {/* <header className="won-items-header">
        <div className="won-items-header-container">
          <Link to="/dashboard" className="won-items-logo">
            <img src={logo} alt="Hammers & Tongues Logo" />
            <span>Hammers & Tongues</span>
          </Link>
          
          <nav className="won-items-nav">
            <Link to="/dashboard" className="nav-link">Home</Link>
            <Link to="/buyer/auctions" className="nav-link">Auctions</Link>
            <Link to="/my-bids" className="nav-link">My Bids</Link>
            <Link to="/won-items" className="nav-link active">Won Items</Link>
          </nav>

          <div className="won-items-header-right">
            <button className="notification-button" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 0 0 6 8C6 11.3137 3.31371 14 0 14M18 8C20.2091 8 22 9.79086 22 12C22 14.2091 20.2091 16 18 16M18 8C20.2091 8 22 5.79086 22 3C22 0.790861 20.2091 -1 18 -1C15.7909 -1 14 0.790861 14 3C14 5.79086 15.7909 8 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 8C6 11.3137 8.68629 14 12 14C15.3137 14 18 11.3137 18 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="notification-badge">3</span>
            </button>
            <Link to="/profile" className="profile-button" aria-label="Profile">
              <div className="profile-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </header> */}

      {/* Won Items Content */}
      <div className="won-items-content">
        <div className="won-items-container">
          {/* Breadcrumbs */}
          <nav className="breadcrumbs">
            <Link to="/dashboard">Dashboard</Link>
            <span>/</span>
            <span>Won Items</span>
          </nav>

          {/* Page Header */}
          <div className="page-header">
            <div className="header-left">
              <h1 className="page-title">Won Items</h1>
            </div>
          </div>

          {/* Search */}
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

          {/* Items Grid */}
          <div className="items-grid">
            {visibleItems.map(item => (
              <div key={item.id} className="won-item-card">
                {/* Image */}
                <div className="item-image">
                  <img src={item.image} alt={item.title} />
                  <div className="won-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
                    </svg>
                    <span>Won</span>
                  </div>
                </div>

                {/* Details */}
                <div className="item-details">
                  <div className="item-category">{item.category.toUpperCase()}</div>
                  <h3 className="item-title">{item.title}</h3>
                  <div className="item-lot-id">Lot {item.lotId}</div>

                  {/* Winning Price */}
                  <div className="winning-price">
                    {formatCurrency(item.winningPrice)}
                  </div>

                  {/* Congratulations Message */}
                  <div className="congratulations-msg">
                    Congratulations! You won this lot.
                  </div>

                  {/* Payment Status */}
                  {item.paymentStatus === 'pending' ? (
                    <div className="payment-status pending">
                      <div className="status-header">
                        <span className="status-label">PAYMENT DEADLINE</span>
                        <span className="status-timer">{item.paymentDeadline}</span>
                      </div>
                      <div className="invoice-status">
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
                      <div className="invoice-status">
                        <span className="invoice-label">Invoice:</span>
                        <span className="invoice-badge paid-badge">Paid</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="item-actions">
                    {item.paymentStatus === 'pending' ? (
                      <>
                        <button
                          className="action-btn primary"
                          onClick={() => navigate(`/payment/${item.id}`)}
                        >
                          Proceed to Payment
                        </button>
                        <button
                          className="action-btn secondary"
                          onClick={() => navigate(`/invoices`)}
                        >
                          View Invoice
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="action-btn primary"
                          onClick={() => navigate(`/invoice/${item.invoiceNumber}`)}
                        >
                          View Invoice
                        </button>
                        <button
                          className="action-btn secondary"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="pagination-numbers">
                {Array.from({ length: Math.min(totalPages, 3) }).map((_, index) => {
                  const pageNum = index + 1
                  return (
                    <button
                      key={pageNum}
                      className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                {totalPages > 3 && (
                  <>
                    <span className="pagination-ellipsis">...</span>
                    <button
                      className={`pagination-number ${currentPage === totalPages ? 'active' : ''}`}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WonItems

