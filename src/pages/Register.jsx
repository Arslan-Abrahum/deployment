import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useDispatch, useSelector } from 'react-redux'
import './Register.css'
import { clearRegistrationData, clearError } from '../store/slices/authSlice'
import { registerUser } from '../store/actions/authActions'

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { isRegistering, registrationError, registrationData } = useSelector(
    (state) => state.auth
  )

  console.log('Registration Data: ', registrationData);
  

  const [userType, setUserType] = useState('buyer')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    business_name: '',
    business_reg_no: ''
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (registrationData) {
      navigate('/otp-verification', {
        state: {
          email: formData.email,
          userType: formData.role
        }
      })
    }
  }, [registrationData, navigate, formData.email, formData.role])

  useEffect(() => {
    return () => {
      dispatch(clearRegistrationData())
      dispatch(clearError())
    }
  }, [dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      })
    }
  }

  const handleUserTypeChange = (type) => {
    setUserType(type)
    setFormData(prev => ({
      ...prev,
      role: type
    }))
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required'
    }

    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (formData.phone && !formData.phone.match(/^\+?[1-9]\d{1,14}$/)) {
      errors.phone = 'Please enter a valid phone number (e.g., +923071913124)'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, number and special character'
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (formData.role === 'seller') {
      if (!formData.business_name.trim()) {
        errors.business_name = 'Business name is required for sellers'
      }
      if (!formData.business_reg_no.trim()) {
        errors.business_reg_no = 'Business registration number is required for sellers'
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    dispatch(clearError())

    if (!validateForm()) {
      return
    }

    const registrationData = {
      role: formData.role,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone || '',
      password: formData.password,
    }

    if (formData.role === 'seller') {
      registrationData.business_name = formData.business_name
      registrationData.business_reg_no = formData.business_reg_no
    }

    await dispatch(registerUser(registrationData))
  }

  return (
    <div className="register-page">
      <div className="register-header">
        <div className="register-header-left">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            disabled={isRegistering}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <Link to="/" className="register-logo">
            <img src={logo} alt="Hammers & Tongues Logo" />
            <span>Hammers & Tongues</span>
          </Link>
        </div>
        <div className="register-header-link">
          <span>Already have an account?</span>
          <Link to="/signin" className="header-link-button">Log In</Link>
        </div>
      </div>

      <div className="register-container">
        <div className="register-left">
          <div className="register-image-section">
            <div className="register-image-overlay"></div>
            <div className="register-image-content">
              <h2 className="register-image-title">Your Gateway to Exclusive Auctions</h2>
              <p className="register-image-description">
                Discover unique items, bid with confidence, and never miss an opportunity to own something extraordinary.
              </p>
            </div>
          </div>
        </div>

        <div className="register-right">
          <div className="register-form-wrapper">
            <h1 className="register-title">Create Your H&T Account</h1>

            <form className="register-form" onSubmit={handleSubmit}>
              {/* Display API errors */}
              {registrationError && (
                <div className="form-error-message">
                  {registrationError.message || 'Registration failed. Please try again.'}
                  {registrationError.email && <div>{registrationError.email[0]}</div>}
                  {registrationError.phone && <div>{registrationError.phone[0]}</div>}
                </div>
              )}

              {/* User Type Selector */}
              <div className="form-group">
                <label htmlFor="userType" className="form-label">I am a</label>
                <div className="user-type-selector">
                  <button
                    type="button"
                    className={`user-type-btn ${userType === 'buyer' ? 'active' : ''}`}
                    onClick={() => handleUserTypeChange('buyer')}
                    disabled={isRegistering}
                  >
                    Buyer
                  </button>
                  <button
                    type="button"
                    className={`user-type-btn ${userType === 'seller' ? 'active' : ''}`}
                    onClick={() => handleUserTypeChange('seller')}
                    disabled={isRegistering}
                  >
                    Seller
                  </button>
                </div>
              </div>

              {/* First Name */}
              <div className="form-group">
                <label htmlFor="first_name" className="form-label">
                  First Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  className={`form-input ${formErrors.first_name ? 'error' : ''}`}
                  placeholder="John"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={isRegistering}
                  required
                />
                {formErrors.first_name && (
                  <span className="field-error">{formErrors.first_name}</span>
                )}
              </div>

              {/* Last Name */}
              <div className="form-group">
                <label htmlFor="last_name" className="form-label">
                  Last Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  className={`form-input ${formErrors.last_name ? 'error' : ''}`}
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={isRegistering}
                  required
                />
                {formErrors.last_name && (
                  <span className="field-error">{formErrors.last_name}</span>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input ${formErrors.email ? 'error' : ''}`}
                  placeholder="yourname@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isRegistering}
                  required
                />
                {formErrors.email && (
                  <span className="field-error">{formErrors.email}</span>
                )}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number {formData.role === 'seller' && <span className="required">*</span>}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`form-input ${formErrors.phone ? 'error' : ''}`}
                  placeholder="+923071913124"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isRegistering}
                />
                {formErrors.phone && (
                  <span className="field-error">{formErrors.phone}</span>
                )}
              </div>

              {/* Seller-specific fields */}
              {formData.role === 'seller' && (
                <>
                  <div className="form-group">
                    <label htmlFor="business_name" className="form-label">
                      Business Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="business_name"
                      name="business_name"
                      className={`form-input ${formErrors.business_name ? 'error' : ''}`}
                      placeholder="Your Business Name"
                      value={formData.business_name}
                      onChange={handleChange}
                      disabled={isRegistering}
                      required
                    />
                    {formErrors.business_name && (
                      <span className="field-error">{formErrors.business_name}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="business_reg_no" className="form-label">
                      Business Registration Number <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="business_reg_no"
                      name="business_reg_no"
                      className={`form-input ${formErrors.business_reg_no ? 'error' : ''}`}
                      placeholder="BRN-00923898"
                      value={formData.business_reg_no}
                      onChange={handleChange}
                      disabled={isRegistering}
                      required
                    />
                    {formErrors.business_reg_no && (
                      <span className="field-error">{formErrors.business_reg_no}</span>
                    )}
                  </div>
                </>
              )}

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password <span className="required">*</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className={`form-input ${formErrors.password ? 'error' : ''}`}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isRegistering}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isRegistering}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      {showPassword ? (
                        <>
                          <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </>
                      ) : (
                        <>
                          <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {formErrors.password && (
                  <span className="field-error">{formErrors.password}</span>
                )}
                <small className="field-hint">
                  Must contain uppercase, lowercase, number and special character
                </small>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-input ${formErrors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isRegistering}
                  required
                />
                {formErrors.confirmPassword && (
                  <span className="field-error">{formErrors.confirmPassword}</span>
                )}
              </div>

              {/* Terms checkbox */}
              <div className="form-group">
                <label className="checkbox-label terms">
                  <input type="checkbox" required disabled={isRegistering} />
                  <span>
                    By creating an account, you agree to our{' '}
                    <Link to="/terms" className="terms-link">Terms of Service</Link>
                  </span>
                </label>
              </div>

              {/* Submit button */}
              <button 
                type="submit" 
                className="submit-button"
                disabled={isRegistering}
              >
                {isRegistering ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

              <div className="form-divider">
                <span>OR</span>
              </div>

              <div className="social-buttons">
                <button 
                  type="button" 
                  className="social-button google"
                  disabled={isRegistering}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign up with Google
                </button>
                <button 
                  type="button" 
                  className="social-button apple"
                  disabled={isRegistering}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  Sign up with Apple
                </button>
              </div>

              <div className="kyc-notice">
                <div className="kyc-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <p>
                  Please note: To place bids, you will need to complete a simple identity
                  verification (KYC) process after registration.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register