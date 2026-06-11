import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Logout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Clear all localStorage items
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userPhone')
    
    // Set flag to show logout message on login page
    localStorage.setItem('justLoggedOut', 'true')
    
    // Show success message
    toast.success('Logged out successfully!')
    
    // Redirect to login page
    setTimeout(() => {
      navigate('/login')
    }, 500)
  }, [navigate])

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>🚪</div>
        <h2 style={styles.title}>Logging out...</h2>
        <p style={styles.message}>Please wait while we securely log you out.</p>
        <div style={styles.spinner}></div>
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
    textAlign: 'center',
    background: 'white',
    borderRadius: '20px',
    padding: '50px',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  icon: {
    fontSize: '60px',
    marginBottom: '20px'
  },
  title: {
    color: '#333',
    marginBottom: '10px',
    fontSize: '24px'
  },
  message: {
    color: '#666',
    marginBottom: '30px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    margin: '0 auto',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
}

// Add keyframes for spinner animation
const styleSheet = document.createElement("style")
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
document.head.appendChild(styleSheet)

export default Logout