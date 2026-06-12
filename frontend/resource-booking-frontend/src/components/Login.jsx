import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authService } from '../services/api'

const Login = ({ onLogin }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('token')
    if (token && token !== '' && token !== 'null') {
      navigate('/dashboard')
    }
  }, [navigate])

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
      const response = await authService.signin(formData)

      if (response.code === 200 && response.jwt) {
        localStorage.setItem('token', response.jwt)
        localStorage.setItem('userName', formData.username.trim())

        try {
          const profileRes = await authService.getProfile()

          if (profileRes.code === 200 && profileRes.data) {
            const userRole = profileRes.data.role
            localStorage.setItem('userId', String(profileRes.data.id || profileRes.data.userId || profileRes.data.user_id || ''))
            localStorage.setItem('userRole', String(userRole || 1))
            localStorage.setItem('userName', profileRes.data.fullname || formData.username.trim())
            localStorage.setItem('userEmail', profileRes.data.email || '')
            localStorage.setItem('userPhone', profileRes.data.phone || '')
          } else {
            localStorage.setItem('userRole', '1')
          }
        } catch (profileError) {
          localStorage.setItem('userRole', '1')
        }

        toast.success('Signed in')
        onLogin()
        navigate('/dashboard', { replace: true })
      } else {
        toast.error(response.message || 'Invalid username or password')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.leftPanel}>
          <div style={styles.logoSection}>
            <div style={styles.logoIcon}>📚</div>
            <h2 style={styles.logoText}>Resource<span style={styles.logoHighlight}>Booking</span></h2>
            <p style={styles.tagline}>Manage your resources efficiently</p>
          </div>
          <div style={styles.features}>
            <div style={styles.feature}>✓ Easy Resource Booking</div>
            <div style={styles.feature}>✓ Real-time Availability</div>
            <div style={styles.feature}>✓ 24/7 Support</div>
            <div style={styles.feature}>✓ Role Based Access</div>
          </div>
          <div style={styles.testCredentials}>
            <p style={styles.testTitle}>🔐 Test Credentials:</p>
            <p>👤 Regular User: john_doe / john123</p>
            <p>👑 Admin: admin_user / admin123</p>
            <p>⭐ Super Admin: super_admin / super123</p>
            <p style={styles.note}>⚠️ Login with your credentials - Role detected automatically!</p>
          </div>
        </div>
        
        <div style={styles.rightPanel}>
          <div style={styles.header}>
            <h2 style={styles.title}>Welcome Back!</h2>
            <p style={styles.subtitle}>Sign in to your account</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name or Email</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your full name or email"
                style={styles.input}
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                style={styles.input}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div style={styles.footer}>
            <p>Don't have an account? <Link to="/register" style={styles.link}>Create Account</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  card: {
    display: 'flex',
    maxWidth: '1000px',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: 'white'
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  logoIcon: {
    fontSize: '50px',
    marginBottom: '15px'
  },
  logoText: {
    fontSize: '24px',
    marginBottom: '5px',
    fontWeight: 'bold'
  },
  logoHighlight: {
    color: '#ffd700'
  },
  tagline: {
    fontSize: '12px',
    opacity: 0.9
  },
  features: {
    marginTop: '20px'
  },
  feature: {
    marginBottom: '10px',
    fontSize: '13px'
  },
  testCredentials: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '10px',
    fontSize: '11px'
  },
  testTitle: {
    fontWeight: 'bold',
    marginBottom: '8px',
    fontSize: '12px'
  },
  note: {
    marginTop: '8px',
    fontSize: '10px',
    fontStyle: 'italic',
    opacity: 0.8
  },
  rightPanel: {
    flex: 1,
    padding: '40px',
    backgroundColor: 'white'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '28px',
    color: '#333',
    marginBottom: '5px'
  },
  subtitle: {
    color: '#666',
    fontSize: '13px'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#555',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border-color 0.3s',
    outline: 'none'
  },
  button: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'transform 0.2s'
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed'
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#666'
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '500'
  }
}

export default Login
