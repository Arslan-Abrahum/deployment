import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '../../store/actions/profileActions';
import { toast } from 'react-toastify';
import './SellerKYCVerification.css';

const SellerKYCDocumentUpload = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { documentType } = useParams();
  const { profile: profileData } = useSelector((state) => state.profile);

  const [selectedFiles, setSelectedFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRefs = useRef({});

  // Document type configuration
  const documentConfig = {
    'national-id': {
      title: 'National ID',
      fields: [
        { key: 'id_front', label: 'ID Front', required: true },
        { key: 'id_back', label: 'ID Back', required: true },
      ],
      instructions: 'Take a photo of both sides of your National ID. Make sure all information is clearly visible.',
    },
    'driver-license': {
      title: "Driver's License",
      fields: [
        { key: 'driving_license_front', label: 'License Front', required: true },
        { key: 'driving_license_back', label: 'License Back', required: true },
      ],
      instructions: 'Take a photo of both sides of your Driver\'s License. Make sure all information is clearly visible.',
    },
    'passport': {
      title: 'Passport',
      fields: [
        { key: 'passport_front', label: "Passport's Biodata Page", required: true },
      ],
      instructions: 'Take a photo of your passport\'s biodata page. Make sure that entire biodata page is visible, including the machine-readable zone at the bottom. Ensure the photo is clear and legible.',
    },
  };

  const config = documentConfig[documentType];

  useEffect(() => {
    if (!config) {
      toast.error('Invalid document type');
      navigate('/seller/kyc-verification');
      return;
    }

    // First, load from sessionStorage (recently selected files)
    const storedPreviews = JSON.parse(sessionStorage.getItem('seller_kyc_previews') || '{}');
    const storedFiles = JSON.parse(sessionStorage.getItem('seller_kyc_files') || '{}');
    
    const sessionPreviews = {};
    const sessionFiles = {};
    
    config.fields.forEach(field => {
      if (storedPreviews[field.key]) {
        sessionPreviews[field.key] = storedPreviews[field.key];
      }
      if (storedFiles[field.key]) {
        // Store the file data reference
        sessionFiles[field.key] = storedFiles[field.key];
      }
    });

    if (Object.keys(sessionPreviews).length > 0) {
      setPreviews(sessionPreviews);
    }

    // Then, load existing documents from profile (if not in sessionStorage)
    if (profileData?.seller_profile) {
      const sp = profileData.seller_profile;
      const existingPreviews = { ...sessionPreviews };
      
      config.fields.forEach(field => {
        // Only use API data if not already in sessionStorage
        if (sp[field.key] && !sessionPreviews[field.key]) {
          existingPreviews[field.key] = sp[field.key];
        }
      });

      if (Object.keys(existingPreviews).length > 0) {
        setPreviews(existingPreviews);
      }
    }
  }, [documentType, profileData, config, navigate]);

  const handleFileSelect = (fieldKey, e) => {
    const file = e.target.files?.[0];
    if (!file) {
      // Reset input if no file selected
      if (fileInputRefs.current[fieldKey]) {
        fileInputRefs.current[fieldKey].value = '';
      }
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPG, PNG, or JPEG)');
      if (fileInputRefs.current[fieldKey]) {
        fileInputRefs.current[fieldKey].value = '';
      }
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      if (fileInputRefs.current[fieldKey]) {
        fileInputRefs.current[fieldKey].value = '';
      }
      return;
    }

    // Create preview immediately
    const reader = new FileReader();
    reader.onerror = () => {
      toast.error('Failed to read image file');
      if (fileInputRefs.current[fieldKey]) {
        fileInputRefs.current[fieldKey].value = '';
      }
    };
    reader.onloadend = () => {
      if (reader.result) {
        setPreviews(prev => ({
          ...prev,
          [fieldKey]: reader.result,
        }));
        setSelectedFiles(prev => ({
          ...prev,
          [fieldKey]: file,
        }));
        toast.success('Image selected successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (fieldKey) => {
    setPreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fieldKey];
      return newPreviews;
    });
    setSelectedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[fieldKey];
      return newFiles;
    });
    if (fileInputRefs.current[fieldKey]) {
      fileInputRefs.current[fieldKey].value = '';
    }
  };

  const handleContinue = () => {
    // Check if all required fields are filled
    const requiredFields = config.fields.filter(f => f.required);
    const missingFields = requiredFields.filter(f => !selectedFiles[f.key] && !previews[f.key]);

    if (missingFields.length > 0) {
      toast.error(`Please upload ${missingFields.map(f => f.label).join(' and ')}`);
      return;
    }

    // Store files in sessionStorage for later upload on Submit
    // We'll store file metadata and convert to base64 for storage
    const storedFiles = {};
    const filePromises = Object.keys(selectedFiles).map((key) => {
      return new Promise((resolve) => {
        if (selectedFiles[key] instanceof File) {
          const reader = new FileReader();
          reader.onloadend = () => {
            storedFiles[key] = {
              name: selectedFiles[key].name,
              type: selectedFiles[key].type,
              size: selectedFiles[key].size,
              data: reader.result, // base64
            };
            resolve();
          };
          reader.onerror = () => {
            console.error('Error reading file:', key);
            resolve();
          };
          reader.readAsDataURL(selectedFiles[key]);
        } else {
          resolve();
        }
      });
    });

    Promise.all(filePromises).then(() => {
      // Merge with existing stored files
      const existingFiles = JSON.parse(sessionStorage.getItem('seller_kyc_files') || '{}');
      const mergedFiles = { ...existingFiles, ...storedFiles };
      sessionStorage.setItem('seller_kyc_files', JSON.stringify(mergedFiles));

      // Store previews to show uploaded status (use current previews state which includes both new and existing)
      const existingPreviews = JSON.parse(sessionStorage.getItem('seller_kyc_previews') || '{}');
      const mergedPreviews = { ...existingPreviews, ...previews };
      sessionStorage.setItem('seller_kyc_previews', JSON.stringify(mergedPreviews));

      toast.success('Documents selected! Click Submit on the main page to upload.');
      
      // Navigate back to main KYC page
      navigate('/seller/kyc-verification');
    }).catch(error => {
      console.error('Error storing files:', error);
      toast.error('Failed to save documents. Please try again.');
    });
  };

  if (!config) {
    return null;
  }

  return (
    <div className="seller-kyc-upload">
      <div className="kyc-header">
        <button className="kyc-back-btn" onClick={() => navigate('/seller/kyc-verification')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="kyc-title">Verify Your Identity</h1>
      </div>

      <div className="kyc-upload-content">
        <div className="kyc-upload-intro">
          <h2 className="kyc-upload-heading">Take a photo of your {config.title.toLowerCase()}</h2>
          <p className="kyc-upload-instructions">{config.instructions}</p>
        </div>

        {config.fields.map((field) => (
          <div key={field.key} className="kyc-upload-section">
            <h3 className="kyc-upload-section-title">{field.label}</h3>
            
            <div className="kyc-upload-box">
              <input
                ref={el => fileInputRefs.current[field.key] = el}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFileSelect(field.key, e)}
              />
              {previews[field.key] ? (
                <div className="kyc-upload-preview">
                  <img src={previews[field.key]} alt={field.label} />
                  <button
                    className="kyc-upload-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(field.key);
                    }}
                    type="button"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                    </svg>
                  </button>
                  <button
                    className="kyc-upload-replace"
                    onClick={() => fileInputRefs.current[field.key]?.click()}
                    type="button"
                  >
                    Replace Image
                  </button>
                </div>
              ) : (
                <div 
                  className="kyc-upload-placeholder"
                  onClick={() => fileInputRefs.current[field.key]?.click()}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="kyc-upload-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="kyc-upload-text">Upload Your Document</p>
                  <p className="kyc-upload-hint">
                    Tap to upload a clear image of your document. Ensure all details are visible.
                  </p>
                  <button
                    className="kyc-choose-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRefs.current[field.key]?.click();
                    }}
                    type="button"
                  >
                    Choose Document
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="kyc-upload-actions">
          <button
            className="kyc-continue-btn"
            onClick={handleContinue}
            disabled={isUploading || config.fields.some(f => f.required && !previews[f.key] && !selectedFiles[f.key])}
          >
            {isUploading ? 'Uploading...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerKYCDocumentUpload;
