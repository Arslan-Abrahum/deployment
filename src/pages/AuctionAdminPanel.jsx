import React, { useState } from "react";
import "./AuctionAdminPanel.css";
import "./AdminPanel.css";
import { Link, useNavigate } from "react-router-dom";

export default function AuctionPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All");
  const itemsPerPage = 5;

  // Card data – replace iconUrl with your links
  const cardData = [
    {
      title: "Active Bidders",
      value: "1,204",
      change: "+5.2% vs last period",
      iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt3WpWd9ggi9EY-ZecKXm326Zwf_OQW4BHhw&s"
    },
    {
      title: "Total Lots",
      value: "850",
      change: "+1.8% vs last period",
      iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqKtPikqGQLSttXbrMpROp-psrJgi_-cykwA&s"
    },
    {
      title: "Live Rooms",
      value: "15",
      change: "+2 since yesterday",
      iconUrl: "https://png.pngtree.com/png-vector/20220521/ourmid/pngtree-icon-live-streaming-vector-png-image_4643886.png"
    },
  ];

  const tableData = [
    { name: "Vintage Watch Collection", id: "#VW-10234", status: "Live", start: "Oct 25, 2023", end: "Nov 01, 2023", lots: 45, value: "$15,420" },
    { name: "Modern Art & Sculptures", id: "#MA-98765", status: "Upcoming", start: "Nov 05, 2023", end: "Nov 12, 2023", lots: 82, value: "$0.00" },
    { name: "Estate Jewelry Clearance", id: "#EJ-45678", status: "Ended", start: "Oct 10, 2023", end: "Oct 17, 2023", lots: 120, value: "$48,950" },
    { name: "Antique Furniture Finds", id: "#AF-33211", status: "Draft", start: "-", end: "-", lots: 35, value: "-" },
    { name: "Luxury Cars Auction", id: "#LC-11223", status: "Live", start: "Oct 12, 2023", end: "Oct 20, 2023", lots: 60, value: "$22,300" },
    { name: "Rare Books Lot", id: "#RB-65432", status: "Upcoming", start: "Dec 01, 2023", end: "Dec 10, 2023", lots: 90, value: "$0.00" },
    { name: "Vintage Cameras", id: "#VC-90876", status: "Ended", start: "Sep 15, 2023", end: "Sep 20, 2023", lots: 25, value: "$9,500" },
    { name: "Art Statues", id: "#AS-77889", status: "Draft", start: "-", end: "-", lots: 14, value: "-" },
    { name: "Old Coins", id: "#OC-55511", status: "Live", start: "Oct 19, 2023", end: "Oct 22, 2023", lots: 80, value: "$12,100" },
    { name: "Antique Watches", id: "#AW-22445", status: "Upcoming", start: "Nov 15, 2023", end: "Nov 25, 2023", lots: 35, value: "$0.00" },
  ];

  const filteredData = tableData.filter(
    (item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "All" || item.status === filterStatus;
      return matchSearch && matchStatus;
    }
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const generatePageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="container-fluid">
      <div className="cards-container">
        {cardData.map((card, index) => (
          <div className="category-card-horizontal" key={index}>
            <div className="category-card-icon-wrapper">
              <img src={card.iconUrl} alt={card.title} className="category-card-icon-img" />
            </div>
            <div className="category-card-content">
              <h4>{card.title}</h4>
              <p>{card.value}</p>
              <span>{card.change}</span>
            </div>
          </div>
        ))}
      </div>


      {/* Table Section */}
      <div className="card p-3 dark-card mt-3">

        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 mt-3 mobile-flex-column">
          <h1 className="mt-2" style={{ marginLeft: 20 }}>All Auctions</h1>

          <div className="d-flex flex-wrap gap-2 align-items-center full-width-mobile">
            <Link to="/publishnew">
              <button className="createBtn full-width-mobile-btn">+ Create New Auction</button>
            </Link>

            <input
              type="text"
              className="form-control bg-dark text-white border-secondary search-input"
              placeholder=" 🔍 Search by Name or ID"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />

            <div className="btn-group ms-2 filter-btn-group">
              <button
                className={`btn custom-filter-btn ${filterStatus === "All" ? "active" : ""}`}
                onClick={() => { setFilterStatus("All"); setCurrentPage(1); }}
              >
                All
              </button>
              <button
                className={`btn custom-filter-btn ${filterStatus === "Live" ? "active" : ""}`}
                onClick={() => { setFilterStatus("Live"); setCurrentPage(1); }}
              >
                Live
              </button>
              <button
                className={`btn custom-filter-btn ${filterStatus === "Upcoming" ? "active" : ""}`}
                onClick={() => { setFilterStatus("Upcoming"); setCurrentPage(1); }}
              >
                Upcoming
              </button>
              <button
                className={`btn custom-filter-btn ${filterStatus === "Ended" ? "active" : ""}`}
                onClick={() => { setFilterStatus("Ended"); setCurrentPage(1); }}
              >
                Ended
              </button>
              <button
                className={`btn custom-filter-btn ${filterStatus === "Draft" ? "active" : ""}`}
                onClick={() => { setFilterStatus("Draft"); setCurrentPage(1); }}
              >
                Draft
              </button>
            </div>
          </div>
        </div>

        <div className="table-responsive1">
          <table className="table table-dark align-middle">
            <thead>
              <tr>
                <th>Auction Name / ID</th>
                <th className="text-center">Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th className="text-right">Lots</th>
                <th className="text-right">Current Value</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic' }}>
                    No auctions found
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr
                    key={index}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/controlpanel")}
                  >
                    <td>
                      <strong>{item.name}</strong><br />
                      <small className="text-secondary">{item.id}</small>
                    </td>

                    <td className="text-center">
                      <span className={`badgecustomadmin 
                      ${item.status === "Live" ? "bg-live" :
                          item.status === "Upcoming" ? "bg-upcoming" :
                            item.status === "Ended" ? "bg-ended" :
                              "bg-draft"
                        }`}>
                        {item.status}
                      </span>
                    </td>

                    <td>{item.start === "-" ? <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontStyle: 'italic' }}>N/A</span> : item.start}</td>
                    <td>{item.end === "-" ? <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontStyle: 'italic' }}>N/A</span> : item.end}</td>
                    <td className="text-right">{item.lots}</td>
                    <td className="text-right">{item.value === "-" ? <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontStyle: 'italic' }}>N/A</span> : item.value}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="table-pagination">
            <div className="pagination-info">
              Page {currentPage} of {totalPages}
            </div>
            <div className="pagination-controls">

              <button
                className="pagination-btn prev"
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="page-numbers">
                {generatePageNumbers().map((page, index) =>
                  page === '...' ? (
                    <span key={`dots-${index}`} className="page-dots">...</span>
                  ) : (
                    <button
                      key={page}
                      className={`page-number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                className="pagination-btn next"
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === totalPages}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
