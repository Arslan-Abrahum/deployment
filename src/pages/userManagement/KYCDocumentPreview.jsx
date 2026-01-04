import React from 'react';
import './KYCDocumentPreview.css';

const KYCDocumentPreview = ({ documents, onPreviewImage, onDownloadImage }) => {
  // Filter out documents without images
  const documentsWithImages = documents.filter(
    doc => doc.path !== null && doc.path !== undefined && doc.path.trim() !== ''
  );

  if (documentsWithImages.length === 0) {
    return null;
  }

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const errorDiv = e.target.nextElementSibling;
    if (errorDiv) {
      errorDiv.style.display = 'flex';
    }
  };

  return (
    <div className="kyc-document-preview-card">
      <div className="kyc-document-preview-header">
        <h3>Document Preview</h3>
      </div>

      <div className="kyc-documents-scroll-container">
        {documentsWithImages.map((doc) => (
          <div key={doc.key} className="kyc-document-item">
            <div className="kyc-document-image-wrapper">
              <img 
                src={doc.path} 
                alt={doc.label}
                className="kyc-document-image"
                onClick={() => onPreviewImage && onPreviewImage(doc.path)}
                onError={handleImageError}
              />
              <div className="kyc-document-image-error" style={{ display: 'none' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>Failed to load image</p>
              </div>
              <div className="kyc-document-image-overlay">
                <button 
                  className="kyc-document-action-btn kyc-document-preview-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewImage && onPreviewImage(doc.path);
                  }}
                  title="Preview & Zoom"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M1 1L5 5M23 23L19 19M11 19C15.9706 19 20 14.9706 20 10C20 5.02944 15.9706 1 11 1C6.02944 1 2 5.02944 2 10C2 14.9706 6.02944 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button 
                  className="kyc-document-action-btn kyc-document-download-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadImage && onDownloadImage(doc.path, `${doc.label.replace(/\s+/g, '-').toLowerCase()}.jpg`);
                  }}
                  title="Download"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <h4 className="kyc-document-label">{doc.label}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KYCDocumentPreview;


