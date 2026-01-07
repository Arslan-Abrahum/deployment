import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './ResetVerifyOTP.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearError } from '../store/slices/authSlice';
import { verifyPasswordOtp } from '../store/actions/authActions';

const VerifyResetOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get email from location state or navigate back
  const email = location.state?.email || '';

  console.log(email, 'emaillllll');
  
  // Redux state
  const { 
    isVerifyingResetOtp, 
    otpError, 
    resetToken 
  } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }

    return () => {
      dispatch(clearError());
    };
  }, [email, navigate, dispatch]);

  useEffect(() => {
    if (resetToken) {
      navigate('/reset-password', { 
        state: { 
          token: resetToken,
          email: email 
        } 
      });
    }
  }, [resetToken, navigate, email]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const otpArray = pastedData.split('');
      setOtp(otpArray);
    }
  };

  const validateForm = () => {
    const errors = {};
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      errors.otp = 'Please enter all 6 digits';
    } else if (!/^\d{6}$/.test(otpValue)) {
      errors.otp = 'OTP must be 6 digits';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!validateForm()) {
      return;
    }

    const otpValue = otp.join('');
    await dispatch(verifyPasswordOtp({
      email: email,
      otp_code: otpValue
    }));
  };

  const handleResendOtp = () => {
    // You can implement resend logic here
    // For now, navigate back to forgot password
    navigate('/forgot-password', { state: { email } });
  };

  return (
    <div className="verify-reset-otp-page">
      <div className="verify-reset-otp-header">
        <div className="verify-reset-otp-header-left">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate('/forgot-password', { state: { email } })}
            aria-label="Go back"
            disabled={isVerifyingResetOtp}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 12H5M12 19L5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </button>
        </div>
        <div className="verify-reset-otp-header-link">
          <span>Remember your password?</span>
          <Link to="/signin" className="header-link-button">
            Sign In
          </Link>
        </div>
      </div>

      <div className="verify-reset-otp-image-section">
        <div className="verify-reset-otp-image-overlay"></div>
        <div className="verify-reset-otp-image-content">
          <h2 className="verify-reset-otp-image-title">
            Verify Your Identity
          </h2>
          <p className="verify-reset-otp-image-description">
            Enter the 6-digit OTP sent to your email to continue.
          </p>
        </div>
      </div>

      <div className="verify-reset-otp-container">
        <div className="verify-reset-otp-form-wrapper">
          <h1 className="verify-reset-otp-title">Verify OTP</h1>
          <p className="verify-reset-otp-subtitle">
            Enter the OTP sent to <strong>{email}</strong>
          </p>

          <form className="verify-reset-otp-form" onSubmit={handleSubmit}>
            {/* Display API errors */}
            {otpError && (
              <div className="form-error-message">
                {otpError.message ||
                  otpError.detail ||
                  otpError.otp?.[0] ||
                  'OTP verification failed. Please try again.'}
              </div>
            )}

            <div className="otp-input-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`otp-input ${formErrors.otp ? 'error' : ''}`}
                  disabled={isVerifyingResetOtp}
                  autoFocus={index === 0}
                  required
                />
              ))}
            </div>
            {formErrors.otp && (
              <span className="field-error">{formErrors.otp}</span>
            )}

            <div className="verify-reset-otp-button-container">
              <button
                type="submit"
                className="submit-button"
                disabled={isVerifyingResetOtp}
              >
                {isVerifyingResetOtp ? (
                  <>
                    <span className="spinner"></span>
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>
            </div>

            {/* Resend OTP */}
            <div className="resend-otp-section">
              <p>Didn't receive the OTP?</p>
              <button
                type="button"
                className="resend-otp-button"
                onClick={handleResendOtp}
                disabled={isVerifyingResetOtp}
              >
                Resend OTP
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyResetOtp;