import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Resources from './components/Resources'
import MyBookings from './components/MyBookings'
import MyTasks from './components/MyTasks'
import AdminPanel from './components/AdminPanel'
import Navbar from './components/Navbar'

const hasValidToken = () => {
  const token = localStorage.getItem('token')
  return Boolean(token && token !== 'null' && token !== 'undefined')
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(hasValidToken)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userPhone')
    setIsLoggedIn(false)
  }

  useEffect(() => {
    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [])

  return (
    <Router>
      <Toaster position="top-right" />
      {isLoggedIn && <Navbar onLogout={handleLogout} />}
      <Routes>
        <Route path="/login" element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/resources" element={isLoggedIn ? <Resources /> : <Navigate to="/login" replace />} />
        <Route path="/my-bookings" element={isLoggedIn ? <MyBookings /> : <Navigate to="/login" replace />} />
        <Route path="/my-tasks" element={isLoggedIn ? <MyTasks /> : <Navigate to="/login" replace />} />
        <Route path="/admin" element={isLoggedIn ? <AdminPanel /> : <Navigate to="/login" replace />} />
        <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  )
}

export default App
