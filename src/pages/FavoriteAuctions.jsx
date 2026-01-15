import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchAuctionsList } from '../store/actions/AuctionsActions';
// import { buyerService } from '../services/interceptors/buyer.service';
import { clearBuyerError } from '../store/slices/buyerSlice';
import './FavoriteAuctions.css';
import { toast } from 'react-toastify';
import { getMyFavoriteAuctions } from '../store/actions/buyerActions';


const FavoriteAuctionCard = lazy(() => import('../components/FavoriteAuctionCard'));

const FavoriteAuctions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  // Redux state
  const { auctions, error } = useSelector(state => state.buyer);
  const { token } = useSelector(state => state.auth);

  // Local state for complete dataset
  const [allAuctions, setAllAuctions] = useState([]);
  const [isLoadingAllPages, setIsLoadingAllPages] = useState(false);

  const handleCheckAuth = useCallback(() => {
    if (!token) {
      toast.info('Please sign in to view auction details');
      navigate('/signin');
    }
  }, [token, navigate]);

  // Fetch all pages of auctions
  useEffect(() => {
    const fetchAllPages = async () => {
      setIsLoadingAllPages(true);
      try {
        let allResults = [];
        let nextPage = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await dispatch(getMyFavoriteAuctions({ page: nextPage })).unwrap();
          allResults = [...allResults, ...(response.results || [])];

          if (response.next) {
            nextPage += 1;
          } else {
            hasMore = false;
          }
        }

        setAllAuctions(allResults);
      } catch (err) {
        console.log(err, 'errorssss');
        
        console.error('Error fetching all auctions:', err);
        toast.error('Failed to load complete auction list');
      } finally {
        setIsLoadingAllPages(false);
      }
    };

    fetchAllPages();
  }, [dispatch]);

  // Apply filters to show only ACTIVE and APPROVED auctions
  const filteredAuctions = useMemo(() => {
    return allAuctions.filter(auction => {
      // Show both ACTIVE and APPROVED status
      return auction.status === 'ACTIVE' || auction.status === 'APPROVED';
    });
  }, [allAuctions]);

  // Paginate filtered results (10 per page)
  const itemsPerPage = 10;
  const totalFilteredCount = filteredAuctions.length;
  const totalPages = Math.ceil(totalFilteredCount / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAuctions = filteredAuctions.slice(startIndex, endIndex);

  // Pagination handlers
  const handleNext = useCallback(() => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  }, [page, totalPages]);

  const handlePrevious = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }, [page]);

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

    // Handle favorite update from AuctionCard
    const handleFavoriteUpdate = useCallback((auctionId, isFavorite) => {
      setAllAuctions(prevAuctions =>
        prevAuctions.map(auction =>
          auction.id === auctionId
            ? { ...auction, is_favourite: isFavorite }
            : auction
        )
      );
    }, []);


  // Cleanup
  useEffect(() => {
    return () => {
      dispatch(clearBuyerError());
    };
  }, [dispatch]);


  return (
    <div className="buyer-dashboard-page">
      <main className="buyer-dashboard-main">
        <div className="dashboard-container">
          <div className="dashboard-welcome">
            <div className="welcome-content">
              <h1 className="welcome-title">Favorite Auctions</h1>
            </div>
          </div>

          {/* Loading State */}
          {isLoadingAllPages && allAuctions.length === 0 && (
            <div className="auctions-loading">
              <div className="auctions-spinner"></div>
              <p>Loading auctions...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoadingAllPages && allAuctions.length === 0 && (
            <div className="auctions-error">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#fca5a5" strokeWidth="2" />
                <path d="M12 8v4M12 16h.01" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="auctions-error-message">
                {error.message || error.detail || 'Failed to load auctions'}
              </p>
              <button
                className="auctions-retry-btn"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoadingAllPages && !error && paginatedAuctions.length === 0 && (
            <div className="auctions-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M9 11L12 14L22 4" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#d1d5db" strokeWidth="2" />
              </svg>
              <h2>No auctions found</h2>
              <p>Check back later for new auctions</p>
            </div>
          )}

          {/* Auctions Grid */}
          {!isLoadingAllPages && !error && paginatedAuctions.length > 0 && (
            <>
              <div className="auctions-grid">
                <Suspense fallback={
                  <div className="auctions-loading">
                    <div className="auctions-spinner"></div>
                  </div>
                }>
                  {paginatedAuctions.map(auction => (
                    <FavoriteAuctionCard
                      key={auction.id}
                      auction={{
                        ...auction,
                        categoryname: auction.category_name,
                        initialprice: auction.initial_price,
                        startdate: auction.start_date,
                        enddate: auction.end_date,
                        totalbids: auction.total_bids,
                        status: auction.status
                      }}
                      onClick={() => {
                        if (token) {
                          navigate(`/buyer/auction/${auction.id}`, { 
                            state: { 
                              from: 'buyer-dashboard', 
                              listing: auction 
                            } 
                          });
                        } else {
                          handleCheckAuth();
                        }
                      }}
                       onFavoriteUpdate={handleFavoriteUpdate}
                    />
                  ))}
                </Suspense>
              </div>

              {/* Pagination Controls */}
              {totalFilteredCount > itemsPerPage && (
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={handlePrevious}
                    disabled={!hasPrevPage}
                    className={`px-4 py-2 rounded border-[1px] ${hasPrevPage
                      ? 'text-[#8cc63f] border-[#8cc63f] hover:bg-[#8cc63f] hover:text-black cursor-pointer transition-all duration-200'
                      : 'border-white/20 bg-black text-white/40 cursor-not-allowed'
                      }`}
                  >
                    Previous
                  </button>
                  <button disabled className="px-4 py-2 rounded-sm border-[1px] border-[#8cc63f] text-[#8cc63f] bg-black">
                    <strong className='text-sm'>{page} of {totalPages}</strong>
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!hasNextPage}
                    className={`px-4 py-2 rounded border-[1px] ${hasNextPage
                      ? 'text-[#8cc63f] border-[#8cc63f] hover:bg-[#8cc63f] hover:text-black cursor-pointer transition-all duration-200'
                      : 'border-white/20 bg-black text-white/40 cursor-not-allowed'
                      }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default FavoriteAuctions;
