import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authService } from '../services/api'

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    phone: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authService.signup(formData)
      
      console.log('Signup response:', response)
      
      // FIXED: Your backend returns { code: 200, message: "User Registerd Successfully" }
      if (response.code === 200) {
        toast.success('Account created successfully! Please login.')
        setTimeout(() => {
          navigate('/login')
        }, 1500)
      } else {
        toast.error(response.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Register error:', error)
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <div style={styles.card}>
          <div style={styles.leftPanel}>
            <div style={styles.logoSection}>
              <div style={styles.logoIcon}>🎉</div>
              <h2 style={styles.logoText}>Join<span style={styles.logoHighlight}>Us</span></h2>
              <p style={styles.tagline}>Start your journey with us today</p>
            </div>
            <div style={styles.benefits}>
              <div style={styles.benefit}>
                <span style={styles.benefitIcon}>✨</span>
                <div>
                  <h4>Free Registration</h4>
                  <p>No hidden fees</p>
                </div>
              </div>
              <div style={styles.benefit}>
                <span style={styles.benefitIcon}>🚀</span>
                <div>
                  <h4>Easy Booking</h4>
                  <p>Book resources instantly</p>
                </div>
              </div>
              <div style={styles.benefit}>
                <span style={styles.benefitIcon}>💎</span>
                <div>
                  <h4>Premium Support</h4>
                  <p>24/7 customer support</p>
                </div>
              </div>
            </div>
          </div>
          
          <div style={styles.rightPanel}>
            <div style={styles.header}>
              <h2 style={styles.title}>Create Account</h2>
              <p style={styles.subtitle}>Fill in your details to get started</p>
            </div>
            
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>👤</span>
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  style={styles.input}
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>📧</span>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  style={styles.input}
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>📱</span>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                  style={styles.input}
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>🔒</span>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a strong password"
                  style={styles.input}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>
            
            <div style={styles.footer}>
              <p>Already have an account? <Link to="/login" style={styles.link}>Sign In</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  overlay: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  card: {
    display: 'flex',
    maxWidth: '1100px',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    padding: '50px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: 'white'
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  logoIcon: {
    fontSize: '60px',
    marginBottom: '20px'
  },
  logoText: {
    fontSize: '36px',
    marginBottom: '10px',
    fontWeight: 'bold'
  },
  logoHighlight: {
    color: '#ffd700'
  },
  tagline: {
    fontSize: '14px',
    opacity: 0.9
  },
  benefits: {
    marginTop: '40px'
  },
  benefit: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '25px'
  },
  benefitIcon: {
    fontSize: '30px'
  },
  rightPanel: {
    flex: 1,
    padding: '50px',
    backgroundColor: 'white'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '32px',
    color: '#333',
    marginBottom: '10px'
  },
  subtitle: {
    color: '#666',
    fontSize: '14px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    color: '#555',
    fontWeight: '500',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  labelIcon: {
    fontSize: '16px'
  },
  input: {
    padding: '12px 15px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '16px',
    transition: 'all 0.3s',
    outline: 'none'
  },
  button: {
    padding: '14px',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: 'scale(1)',
    marginTop: '10px',
    boxShadow: '0 4px 15px rgba(245, 87, 108, 0.3)'
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'scale(1)'
  },
  footer: {
    textAlign: 'center',
    marginTop: '25px',
    color: '#666',
    fontSize: '14px'
  },
  link: {
    color: '#f5576c',
    textDecoration: 'none',
    fontWeight: '600'
  }
}

export default Register