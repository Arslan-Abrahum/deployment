// import React, { useState, useEffect, useRef } from "react"
// import { Link, useLocation } from "react-router-dom"
// import logo from "../assets/logo.png"
// import "./AdminHeader.css"

// function AdminHeader() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const location = useLocation()
//   const menuRef = useRef(null)

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setMobileMenuOpen(false)
//       }
//     }

//     if (mobileMenuOpen) {
//       document.addEventListener("mousedown", handleClickOutside)
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [mobileMenuOpen])

//   return (
//     <header className="admin-header4">
//       <div className="header-container4" ref={menuRef}>
//         <div className="header-left4">
//           <Link to="/" className="logo">
//             <div className="logo-icon">
//               <img src={logo} alt="Logo" />
//             </div>
//             <span className="logo-text">Hammers & Tongues</span>
//           </Link>
//           <button
//             className="mobile-menu-btn"
//             onClick={() => setMobileMenuOpen(prev => !prev)}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="#35B24A"
//               strokeWidth="4"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               width="30"
//               height="30"

//             >
//               <line x1="3" y1="6" x2="21" y2="6" />
//               <line x1="3" y1="12" x2="21" y2="12" />
//               <line x1="3" y1="18" x2="21" y2="18" />
//             </svg>
//           </button>
//         </div>

//         <div className={`header-center4 ${mobileMenuOpen ? "open" : ""}`}>
//           <nav className="nav">
//             <Link to="/admin-panel" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>Dashboard</Link>
//             <Link to="/reports" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${location.pathname.includes("reports") ? "active" : ""}`}>Reports</Link>
//             <Link to="/auctiontab" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${location.pathname.includes("auctiontab") ? "active" : ""}`}>Auction</Link>
//             <Link to="/livetab" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${location.pathname.includes("livetab") ? "active" : ""}`}>Live Auctions</Link>
//             <Link to="/finance" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${location.pathname.includes("finance") ? "active" : ""}`}>Finance</Link>
//             <Link to="/admin/category" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${location.pathname.includes("admin/category") ? "active" : ""}`}>Category Management</Link>
//             <Link to="/admin/user-management" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${location.pathname.includes("admin/user-management") ? "active" : ""}`}>User Management</Link>
//           </nav>
//         </div>

//         <div className="header-right4">
//           <button className="header-icon-button notification-button" aria-label="Notifications">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//               <path d="M15.137 21C14.695 21.622 13.91 22 13 22H11C10.09 22 9.305 21.622 8.863 21M18 8C18 5.239 15.761 3 13 3H11C8.239 3 6 5.239 6 8V11C6 12.326 5.473 13.597 4.535 14.535L4 15.07V17H20V15.07L19.465 14.535C18.527 13.597 18 12.326 18 11V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//             </svg>
//           </button>

//           <button className="header-icon-button settings-button" aria-label="Settings">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//               <path d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//               <path d="M19.4 15A1.65 1.65 0 0 0 20 13.6V10.4A1.65 1.65 0 0 0 19.4 9L17.55 8.25A1.65 1.65 0 0 0 16.6 7L16.25 5.1A1.65 1.65 0 0 0 14.85 4.5H9.15A1.65 1.65 0 0 0 7.75 5.1L7.4 7A1.65 1.65 0 0 0 6.45 8.25L4.6 9A1.65 1.65 0 0 0 4 10.4V13.6A1.65 1.65 0 0 0 4.6 15L6.45 15.75A1.65 1.65 0 0 0 7.4 17L7.75 18.9A1.65 1.65 0 0 0 9.15 19.5H14.85A1.65 1.65 0 0 0 16.25 18.9L16.6 17A1.65 1.65 0 0 0 17.55 15.75L19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//             </svg>
//           </button>

//           <button className="header-icon-button profile-button" aria-label="Profile">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//               <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//               <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//             </svg>
//           </button>
//         </div>

//       </div>
//     </header>
//   )
// }

// export default AdminHeader


import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import './AdminHeader.css'

function AdminHeader() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <>
      <header className="admin-header">
        <div className="admin-header__container">
          <Link to="/" className="admin-header__logo">
            <img src={logo} alt="Hammer & Tongues Logo" />
            <span>Hammer & Tongues</span>
          </Link>

          <nav className="admin-header__nav">
            <Link
              to="/admin-panel"
              className={`admin-header__nav-link ${location.pathname === '/admin-panel' ? 'active' : ''
                }`}
            >
              Dashboard Overview
            </Link>
            <Link
              to="/reports"
              className={`admin-header__nav-link ${location.pathname === '/reports' ? 'active' : ''
                }`}
            >
              Reports
            </Link>
            <Link
              to="/auctiontab"
              className={`admin-header__nav-link ${location.pathname === '/auctiontab' ? 'active' : ''
                }`}
            >
              Auctions
            </Link>
            <Link
              to="/livetab"
              className={`admin-header__nav-link ${location.pathname === '/livetab' ? 'active' : ''
                }`}
            >
              Live Auction
            </Link>
            <Link
              to="/finance"
              className={`admin-header__nav-link ${location.pathname === '/finance' ? 'active' : ''
                }`}
            >
              Finance
            </Link>
            <Link
              to="/admin/category"
              className={`admin-header__nav-link ${location.pathname === '/admin/category' ? 'active' : ''
                }`}
            >
              Category Management
            </Link>
            <Link
              to="/admin/user-management"
              className={`admin-header__nav-link ${location.pathname === '/admin/user-management' ? 'active' : ''
                }`}
            >
              User Management
            </Link>
           
          </nav>

          <div className="admin-header__right">
            <button
              className="admin-header__mobile-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link to="/seller/profile" className="admin-header__profile-btn" aria-label="Profile">
              <div className="admin-header__avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="7"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </div>

        <div
          className={`admin-header__mobile-overlay ${mobileMenuOpen ? 'open' : ''}`}
          onClick={closeMobileMenu}
        />

        <div className={`admin-header__mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <nav className="admin-header__mobile-nav">
            <Link
             to="/seller-dashboard"
              className={`admin-header__mobile-nav-link ${location.pathname === '/seller-dashboard' ? 'active' : ''
                }`}
              onClick={closeMobileMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard Overview
            </Link>
            <Link
              to="/admin/auctions"
              className={`admin-header__mobile-nav-link ${location.pathname === '/admin/auctions' ? 'active' : ''
                }`}
              onClick={closeMobileMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Auctions
            </Link>
            <Link
              to="/my-bids"
              className={`admin-header__mobile-nav-link ${location.pathname === '/my-bids' ? 'active' : ''
                }`}
              onClick={closeMobileMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              My Bids
            </Link>
            <Link
              to="/won-items"
              className={`admin-header__mobile-nav-link ${location.pathname === '/won-items' ? 'active' : ''
                }`}
              onClick={closeMobileMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Won Items
            </Link>
          </nav>
        </div>
      </header>
    </>
  )
}

export default AdminHeader