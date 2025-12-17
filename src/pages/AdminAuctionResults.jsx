import React, { useState, useMemo } from "react";
import "./AdminAuctionResults.css";

const DATA = [
  { lot: "001", item: "Rolex Daytona Ref. 6263", bid: 75000, bidder: "BIDDER-A487", reserve: "Met", status: "Payment Received" },
  { lot: "002", item: "Patek Philippe Calatrava", bid: 22500, bidder: "BIDDER-C901", reserve: "Met", status: "Invoice Sent" },
  { lot: "003", item: "Omega Speedmaster Moonwatch", bid: 0, bidder: "Unsold", reserve: "Not Met", status: "Unsold" },
  { lot: "004", item: "TAG Heuer Carrera", bid: 4800, bidder: "BIDDER-F2E5", reserve: "Met", status: "Payment Pending" },
  { lot: "005", item: "Vintage Rolex Submariner", bid: 16000, bidder: "BIDDER-K447", reserve: "Met", status: "Payment Received" },
  { lot: "006", item: "Cartier Tank", bid: 14000, bidder: "BIDDER-X882", reserve: "Met", status: "Invoice Sent" },
];

const ROWS_PER_PAGE = 5;

export default function AdminAuctionResults() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filteredData = useMemo(() => {
    return DATA.filter((item) => {
      const searchMatch =
        item.item.toLowerCase().includes(search.toLowerCase()) ||
        item.bidder.toLowerCase().includes(search.toLowerCase()) ||
        item.lot.toLowerCase().includes(search.toLowerCase());
      const statusMatch = statusFilter === "All" || item.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);

  const paginatedRows = useMemo(() => {
    const startIndex = (page - 1) * ROWS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [filteredData, page]);

  const exportResults = () => {
    const headers = ["Lot", "Item", "Bid", "Bidder", "Reserve", "Status"];
    const csvRows = filteredData.map(d =>
      `${d.lot},${d.item},${d.bid},${d.bidder},${d.reserve},${d.status}`
    );
    const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...csvRows].join("\n");
    const link = document.createElement("a");
    link.href = csv;
    link.download = "auction_results.csv";
    link.click();
  };

  return (
    <div className="results-wrapper">
      <h1 className="title">Auction Results: Vintage Watch Collection - 24 Oct 2024</h1>
      <p className="subtitle">Review winning bids, financial status, and next steps for the auction.</p>

      <div className="stats-row">
        <div className="stat-card">$1,245,600<br /><span>Total Hammer Price</span></div>
        <div className="stat-card">92%<br /><span>Sell-Through Rate</span></div>
        <div className="stat-card">138<br /><span>Total Lots Sold</span></div>
        <div className="stat-card">12<br /><span>Lots Unsold</span></div>
      </div>

      <div className="filter-row">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search by Lot, Item Name, or Bidder..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <button className="createBtn export-btn" onClick={exportResults}>
          Export Results
        </button>

        <div className="btn-group filter-btn-group status-buttons">
          {["All", "Payment Received", "Invoice Sent", "Payment Pending", "Unsold"].map((s) => (
            <button
              key={s}
              className={`custom-filter-btn ${statusFilter === s ? "active" : ""}`}
              onClick={() => { setStatusFilter(s); setPage(1); }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="table-box">
        <table className="table-dark">
          <thead>
            <tr>
              <th>LOT</th>
              <th>ITEM DESCRIPTION</th>
              <th>WINNING BID</th>
              <th>WINNING BIDDER</th>
              <th>RESERVE STATUS</th>
              <th>FINANCIAL STATUS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row) => (
              <tr key={row.lot}>
                <td>{row.lot}</td>
                <td>{row.item}</td>
                <td>{row.bid ? `$${row.bid.toLocaleString()}` : "—"}</td>
                <td>{row.bidder}</td>
                <td>
                  <span className={`badgecustomadmin ${row.reserve === "Met" ? "bg-live" : "bg-draft"}`}>
                    {row.reserve}
                  </span>
                </td>
                <td>
                  <span className={`badgecustomadmin
                    ${row.status === "Payment Received" ? "bg-live" :
                      row.status === "Invoice Sent" ? "bg-upcoming" :
                        row.status === "Payment Pending" ? "bg-ended" :
                          "bg-draft"}`}>
                    {row.status}
                  </span>
                </td>
                <td className="dots">⋮</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bottom Left & Right */}
      {filteredData.length > 0 && (
        <div className="table-pagination">
          <div className="pagination-info">
            Page {page} of {totalPages}
          </div>

          <div className="pagination-controls">
            <button style={{color:"black"}}
              className="pagination-btn prev"
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              .
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`page-number ${page === i + 1 ? "active" : ""}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button style={{color:"black"}}
              className="pagination-btn next"
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              .
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
