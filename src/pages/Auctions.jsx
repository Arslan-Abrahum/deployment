import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import { fetchAuctionsList, fetchCategories } from '../store/actions/AuctionsActions';
import { clearBuyerError } from '../store/slices/buyerSlice';
import './Auctions.css';
import { toast } from 'react-toastify';

const AuctionCard = lazy(() => import('../components/AuctionCard'));

const Auctions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const { auctions, isLoading, error, categories } = useSelector(state => state.buyer);
  const { token } = useSelector(state => state.auth);
  // Local state
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(null);
  console.log('Filtered Data:', filteredData);
  
  // Status options matching your API
  const statusOptions = useMemo(() => [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'DRAFT', label: 'Draft' }
  ], []);

  // Extract categories from API response
  const extractedCategories = useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];
    return categories.map(cat => ({
      name: cat.name || cat.category_name,
      value: cat.id || cat.category,
      label: cat.name || cat.category_name
    }));
  }, [categories]);

  console.log("extractedCategories: ", extractedCategories);
  
  const handleCheckAuth = useCallback(() => {
    if (!token) {
      toast.info('Please sign in to view auction details');
      navigate('/signin');
    }
  }, [token, navigate]);

  // Check if filters are active
  const hasActiveFilters = useMemo(() => 
    selectedCategories.length > 0 ||
    selectedStatus.length > 0 ||
    priceRange.min ||
    priceRange.max ||
    debouncedSearch
  , [selectedCategories, selectedStatus, priceRange, debouncedSearch]);

  // Debounced search handler
  const debouncedSetSearch = useMemo(() =>
    debounce((query) => setDebouncedSearch(query), 500)
  , []);

  // Handlers
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSetSearch(value);
  }, [debouncedSetSearch]);

  const handleCategoryToggle = useCallback((category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }, []);

  const handleStatusToggle = useCallback((status) => {
    setSelectedStatus(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  }, []);

  const handlePriceRangeChange = useCallback((newRange) => {
    setPriceRange(newRange);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedStatus([]);
    setPriceRange({ min: '', max: '' });
    setSortBy('newest');
    setSearchQuery('');
    setDebouncedSearch('');
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const filters = {
      page: currentPage,
    };

    // Add search if present
    if (debouncedSearch && debouncedSearch.trim()) {
      filters.search = debouncedSearch.trim();
    }

    // Add category filter - send as comma-separated string
    if (selectedCategories.length > 0) {
      filters.category = selectedCategories.join(',');
    }

    // Add status filter - send as comma-separated string
    if (selectedStatus.length > 0) {
      filters.status = selectedStatus.join(',');
    }

    // Add price filters
    if (priceRange.min && priceRange.min !== '') {
      filters.min_price = parseFloat(priceRange.min);
    }
    if (priceRange.max && priceRange.max !== '') {
      filters.max_price = parseFloat(priceRange.max);
    }
    setFilteredData(filters); 
    dispatch(fetchAuctionsList());

  }, [selectedCategories, selectedStatus, priceRange, debouncedSearch, currentPage, dispatch]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [selectedCategories, selectedStatus, priceRange, debouncedSearch]);

  // Cleanup
  useEffect(() => {
    return () => {
      dispatch(clearBuyerError());
      debouncedSetSearch.cancel();
    };
  }, [dispatch, debouncedSetSearch]);

  // Calculate pagination
  const totalPages = auctions?.count ? Math.ceil(auctions.count / 12) : 1;
  const currentAuctions = auctions?.results || [];

  return (
    <div className="auctions-page">
      {/* Sticky Filter Bar */}
      <div className="auctions-filter-bar">
        <div className="auctions-filter-bar-content">

          <div className="filter-search-container">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.134 17 3 13.866 3 10C3 6.134 6.134 3 10 3C13.866 3 17 6.134 17 10Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <input
              type="text"
              placeholder="Search auctions..."
              className="filter-search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              disabled={isLoading}
            />
          </div>

          {/* Desktop Filters */}
          <div className="desktop-filters">
            <FilterDropdown
              label="Category"
              options={extractedCategories}
              selectedValues={selectedCategories}
              onToggle={handleCategoryToggle}
              disabled={isLoading}
            />
            <FilterDropdown
              label="Status"
              options={statusOptions}
              selectedValues={selectedStatus}
              onToggle={handleStatusToggle}
              disabled={isLoading}
            />
            <PriceFilter
              priceRange={priceRange}
              onChange={handlePriceRangeChange}
              disabled={isLoading}
            />
      
            {hasActiveFilters && (
              <button className="clear-filters-btn" onClick={handleClearFilters} disabled={isLoading}>
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="active-filter-tags">
          {selectedCategories.map(cat => {
            const category = extractedCategories.find(c => c.value === cat);
            return category ? (
              <span key={cat} className="active-filter-tag">
                {category.label}
                <button onClick={() => handleCategoryToggle(cat)} disabled={isLoading}>×</button>
              </span>
            ) : null;
          })}
          {selectedStatus.map(status => {
            const statusObj = statusOptions.find(s => s.value === status);
            return statusObj ? (
              <span key={status} className="active-filter-tag">
                {statusObj.label}
                <button onClick={() => handleStatusToggle(status)} disabled={isLoading}>×</button>
              </span>
            ) : null;
          })}
          {priceRange.min && (
            <span className="active-filter-tag">
              Min ${priceRange.min}
              <button onClick={() => handlePriceRangeChange({ ...priceRange, min: '' })} disabled={isLoading}>×</button>
            </span>
          )}
          {priceRange.max && (
            <span className="active-filter-tag">
              Max ${priceRange.max}
              <button onClick={() => handlePriceRangeChange({ ...priceRange, max: '' })} disabled={isLoading}>×</button>
            </span>
          )}
          {debouncedSearch && (
            <span className="active-filter-tag">
              Search: "{debouncedSearch}"
              <button onClick={() => { setSearchQuery(''); setDebouncedSearch(''); }} disabled={isLoading}>×</button>
            </span>
          )}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="auctions-error-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {error.message || error.detail || 'Failed to load auctions'}
          <button className="error-dismiss-btn" onClick={() => dispatch(clearBuyerError())}>×</button>
        </div>
      )}

      {/* Main Content */}
      <main className="auctions-main">
        <div className="auctions-header">
          <div className="auctions-header-content">
            <h1 className="auctions-page-title">Live & Upcoming Auctions</h1>
            <span className="auctions-results-count">
              {isLoading ? 'Loading...' : `${auctions?.count || 0} Results`}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && !auctions && (
          <div className="auctions-loading">
            <div className="auctions-spinner"></div>
            <p>Loading auctions...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && !auctions && (
          <div className="auctions-error">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#fca5a5" strokeWidth="2"/>
              <path d="M12 8v4M12 16h.01" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className="auctions-error-message">
              {error.message || error.detail || 'Failed to load auctions'}
            </p>
            <button 
              className="auctions-retry-btn" 
              onClick={() => dispatch(fetchAuctionsList({ page: 1, ordering: '-created_at' }))}
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && currentAuctions.length === 0 && (
          <div className="auctions-empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M9 11L12 14L22 4" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#d1d5db" strokeWidth="2"/>
            </svg>
            <h2>No auctions found</h2>
            <p>Try adjusting your filters or check back later</p>
            {hasActiveFilters && (
              <button className="auctions-clear-filters-btn" onClick={handleClearFilters}>
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Auctions Grid */}
        {!isLoading && !error && currentAuctions.length > 0 && (
          <>
            <div className="auctions-grid">
              <Suspense fallback={
                <div className="auctions-loading">
                  <div className="auctions-spinner"></div>
                </div>
              }>
                {currentAuctions.map(auction => (
                  <AuctionCard 
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
                    onClick={() => { token ? navigate(`/auction/${auction.id}`) : handleCheckAuth(); }}
                  />
                ))}
              </Suspense>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="auctions-pagination">
                <button 
                  className="auctions-pagination-btn auctions-prev-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Previous
                </button>

                <div className="auctions-page-numbers">
                  {generatePageNumbers(currentPage, totalPages).map((page, index) => 
                    page === '...' ? (
                      <span key={`dots-${index}`} className="auctions-page-dots">...</span>
                    ) : (
                      <button
                        key={page}
                        className={`auctions-page-number ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                        disabled={isLoading}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button 
                  className="auctions-pagination-btn auctions-next-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                >
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

// Filter Dropdown Component
const FilterDropdown = ({ label, options, selectedValues, onToggle, disabled, type = 'checkbox' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (value) => {
    onToggle(value);
    if (type === 'radio') setIsOpen(false);
  };

  const selectionCount = Array.isArray(selectedValues) ? selectedValues.length : (selectedValues ? 1 : 0);

  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <button 
        className={`filter-dropdown-trigger ${selectionCount > 0 ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {label}
        {selectionCount > 0 && <span className="filter-badge">{selectionCount}</span>}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </button>
      {isOpen && (
        <div className="filter-dropdown-menu">
          {options.length === 0 ? (
            <div className="filter-dropdown-empty">No options available</div>
          ) : (
            options.map(option => (
              <label key={option.value} className="filter-dropdown-item">
                <input
                  type={type}
                  name={type === 'radio' ? label : undefined}
                  checked={Array.isArray(selectedValues) 
                    ? selectedValues.includes(option.value) 
                    : selectedValues === option.value}
                  onChange={() => handleToggle(option.value)}
                  disabled={disabled}
                />
                <span>{option.label}</span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Price Filter Component
const PriceFilter = ({ priceRange, onChange, disabled }) => {
  const [localRange, setLocalRange] = useState({ min: '', max: '' });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  const debouncedOnChange = useMemo(() =>
    debounce((newRange) => {
      if (newRange.min !== priceRange.min || newRange.max !== priceRange.max) {
        onChange(newRange);
      }
    }, 500)
  , [onChange, priceRange.min, priceRange.max]);

  useEffect(() => {
    setLocalRange(priceRange);
  }, [priceRange]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (field, value) => {
    const newRange = { ...localRange, [field]: value };
    setLocalRange(newRange);
    debouncedOnChange(newRange);
  };

  const hasActiveFilter = priceRange.min || priceRange.max;

  return (
    <div className="filter-dropdown price-filter" ref={dropdownRef}>
      <button 
        className={`filter-dropdown-trigger ${hasActiveFilter ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        Price Range
        {hasActiveFilter && <span className="filter-badge">1</span>}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </button>
      {isOpen && (
        <div className="filter-dropdown-menu price-filter-menu">
          <div className="price-filter-inputs">
            <div className="price-input-group">
              <label className="price-input-label">Min</label>
              <input
                type="number"
                className="price-input"
                placeholder="0"
                value={localRange.min}
                onChange={(e) => handleChange('min', e.target.value)}
                disabled={disabled}
                min="0"
              />
            </div>
            <span className="price-range-separator">to</span>
            <div className="price-input-group">
              <label className="price-input-label">Max</label>
              <input
                type="number"
                className="price-input"
                placeholder="No limit"
                value={localRange.max}
                onChange={(e) => handleChange('max', e.target.value)}
                disabled={disabled}
                min="0"
              />
            </div>
          </div>
          {localRange.min && localRange.max && 
           parseFloat(localRange.min) > parseFloat(localRange.max) && (
            <div className="price-error">Min price cannot exceed max price</div>
          )}
        </div>
      )}
    </div>
  );
};

// Pagination Helper
const generatePageNumbers = (currentPage, totalPages) => {
  const pages = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }
  }
  return pages;
};

export default Auctions;