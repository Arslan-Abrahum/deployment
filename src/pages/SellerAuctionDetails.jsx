import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom'
import './SellerAuctionDetails.css'
import { deleteAuction, updateAuction } from '../store/actions/sellerActions'
import { useSelector, useDispatch } from 'react-redux'

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount)
}

const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
    })
}

const ImageGallery = ({ images, activeImage, onImageChange }) => (
    <div className="image-gallery">
        <div className="main-image">
            <img src={images[activeImage]?.file || images[activeImage]} alt="Main view" />
        </div>
        <div className="thumbnail-images">
            {images.map((image, index) => (
                <button
                    key={`thumb-${image.id || index}`}
                    className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                    onClick={() => onImageChange(index)}
                    aria-label={`View image ${index + 1}`}
                >
                    <img src={image.file || image} alt={`Thumbnail ${index + 1}`} />
                </button>
            ))}
        </div>
    </div>
)

const StatItem = ({ icon, value, label }) => (
    <div className="stat-item">
        <div className="stat-icon">
            {icon}
        </div>
        <div className="stat-content">
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
        </div>
    </div>
)

const SellerListingDetails = () => {
    const location = useLocation();
    const dispatch = useDispatch()
    const auction = location?.state?.listing || [];
    const [activeImage, setActiveImage] = useState(0)
    const [showFullDescription, setShowFullDescription] = useState(false)
    const [timeRemaining, setTimeRemaining] = useState('')
    const [listing, setListing] = useState( auction || {})

    const navigate = useNavigate()

    const calculateTimeRemaining = useCallback(() => {
        if (!listing?.end_date) return 'Loading...'
        
        const now = new Date()
        const endDate = new Date(listing.end_date)
        const diff = endDate - now

        if (diff <= 0) return 'Auction ended'

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

        return `${days}d ${hours}h ${minutes}m`
    }, [listing?.end_date])

    useEffect(() => {
        if (!listing) return;

        const updateTime = () => {
            setTimeRemaining(calculateTimeRemaining())
        }

        updateTime()
        const interval = setInterval(updateTime, 60000)

        return () => clearInterval(interval)
    }, [calculateTimeRemaining, listing])

    const handleEditListing = () => {
        if (!listing) return;

        navigate(`/seller/product`, {
            state: {
                isEditing: true,
                listingData: listing
            }
        })
    }

    const handleRemoveListing = () => {
        if (!listing) return;
        
        if (window.confirm('Are you sure you want to remove this listing? This action cannot be undone.')) {
            console.log('Remove listing clicked for ID:', listing.id)
            dispatch(deleteAuction(listing.id));
            navigate('/seller/auction-listings');
        }
    }

    const handleSendForApproval = async () => {
        if (!listing) return;
        
        if (window.confirm('Send this listing for admin approval?')) {
            try {
                // Call the edit API with PENDING status
                await dispatch(updateAuction({
                    auctionId: listing.id,
                    auctionData: { status: 'PENDING' }
                })).unwrap();
                
                // Navigate back to listings page after successful submission
                navigate('/seller/auction-listings');
            } catch (error) {
                console.error('Error sending for approval:', error);
            }
        }
    }

    const handleEndAuction = () => {
        if (!listing) return;
        
        if (window.confirm('Are you sure you want to end this auction early?')) {
            console.log('End auction clicked for ID:', listing.id)
            // Add API call to end auction
        }
    }

    if (!listing) {
        return (
            <div className="seller-page">
                <main className="seller-main">
                    <div className="page-container">
                        <div className="loading-state">
                            <p>Loading listing details...</p>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    const images = listing.media || []
    const specificData = listing.specific_data || {}

    return (
        <div className="seller-page">
            <main className="seller-main">
                <div className="page-container">
                    <div className="page-header">
                        <div className="page-title-section">
                            <h1 className="page-title">Listing Details</h1>
                            <p className="page-subtitle">Manage and monitor your listing performance</p>
                        </div>
                        <div className="page-actions">
                            <Link to="/seller/auction-listings" className="s-secondary-button">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Back to Listings
                            </Link>
                        </div>
                    </div>

                    <div className="breadcrumb">
                        <Link to="/seller/dashboard" className="breadcrumb-item">Dashboard</Link>
                        <span className="breadcrumb-separator">/</span>
                        <Link to="/seller/auction-listings" className="breadcrumb-item">My Listings</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-item active">{listing.title}</span>
                    </div>

                    <div className="listing-details-grid">
                        <div className="listing-details-left">
                            {images.length > 0 && (
                                <ImageGallery
                                    images={images}
                                    activeImage={activeImage}
                                    onImageChange={setActiveImage}
                                />
                            )}

                            <div className="details-card">
                                <h3 className="details-card-title">Item Details</h3>
                                <div className="details-list">
                                    {Object.entries(specificData).map(([key, value]) => (
                                        <div className="detail-item" key={key}>
                                            <span className="detail-label">{key.replace(/_/g, ' ').toUpperCase()}:</span>
                                            <span className="detail-value">{value}</span>
                                        </div>
                                    ))}
                                    <div className="detail-item">
                                        <span className="detail-label">HANDOVER TYPE:</span>
                                        <span className="detail-value">{listing.handover_type}</span>
                                    </div>
                                    {listing.pickup_address && (
                                        <div className="detail-item">
                                            <span className="detail-label">PICKUP ADDRESS:</span>
                                            <span className="detail-value">{listing.pickup_address}</span>
                                        </div>
                                    )}
                                    <div className="detail-item">
                                        <span className="detail-label">CURRENCY:</span>
                                        <span className="detail-value">{listing.currency}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="listing-details-right">
                            <div className="info-card">
                                <div className="info-card-header">
                                    <h2 className="listing-title">{listing.title}</h2>
                                    <div className="listing-category">{listing.category_name}</div>
                                    <div className="listing-status">
                                        <span className={`status-badge ${listing.status.toLowerCase()}`}>
                                            {listing.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="info-card-body">
                                    <div className="listing-description">
                                        <h3 className="description-title">Description</h3>
                                        <p className={`description-text ${showFullDescription ? 'expanded' : ''}`}>
                                            {listing.description}
                                        </p>
                                        {listing.description && listing.description.length > 200 && !showFullDescription && (
                                            <button
                                                className="show-more-button"
                                                onClick={() => setShowFullDescription(true)}
                                            >
                                                Show More
                                            </button>
                                        )}
                                    </div>

                                    {/* Auction Details - Only show when status is LIVE or COMPLETED */}
                                    {(listing.status?.toUpperCase() === 'LIVE' || listing.status?.toUpperCase() === 'COMPLETED' || listing.status?.toUpperCase() === 'CLOSED') && (
                                        <div className="auction-details-card">
                                            <h3 className="details-title">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h7" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Auction Details
                                            </h3>
                                            <div className="details-grid">
                                                <div className="detail-row">
                                                    <span className="detail-label">Initial Price:</span>
                                                    <span className="detail-value highlight">{formatCurrency(listing.initial_price)}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="detail-label">Seller Expected Price:</span>
                                                    <span className="detail-value">{formatCurrency(listing.seller_expected_price)}</span>
                                                </div>
                                                {listing.is_buy_now_enabled && listing.buy_now_price && (
                                                    <div className="detail-row">
                                                        <span className="detail-label">Buy Now Price:</span>
                                                        <span className="detail-value">{formatCurrency(listing.buy_now_price)}</span>
                                                    </div>
                                                )}
                                                <div className="detail-row">
                                                    <span className="detail-label">Start Date:</span>
                                                    <span className="detail-value">{formatDate(listing.start_date)}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="detail-label">End Date:</span>
                                                    <span className="detail-value">{formatDate(listing.end_date)}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="detail-label">Extended Time:</span>
                                                    <span className="detail-value">{listing.extended_time_seconds} seconds</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Seller Information - Removed as per requirements */}

                                    {/* Listing Actions - Only show when status is DRAFT */}
                                    {listing.status?.toUpperCase() === 'DRAFT' && (
                                        <div className="listing-actions-card">
                                            <h3 className="actions-title">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 15v3M15 21H9a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2v7" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M17 21l5-5-5-5M17 16h6" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Listing Actions
                                            </h3>
                                            <div className="action-buttons-grid">
                                                <button className="action-btn-primary" onClick={handleEditListing}>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <span>Edit Listing</span>
                                                </button>
                                                <button className="action-btn-secondary" onClick={handleSendForApproval}>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M22 4L12 14.01L9 11.01" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <span>Send for Approval</span>
                                                </button>
                                                <button className="action-btn-danger" onClick={handleRemoveListing}>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M3 6H5H21" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <span>Remove Listing</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {listing.rejection_reason && (
                                <div className="rejection-card">
                                    <div className="card-header">
                                        <h3 className="card-title">Rejection Reason</h3>
                                    </div>
                                    <div className="rejection-content">
                                        <p>{listing.rejection_reason}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SellerListingDetails