import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate()
  const userRoleNum = Number(localStorage.getItem('userRole') || 0)
  const userName = localStorage.getItem('userName') || 'User'

  const handleLogout = () => {
    onLogout()
    toast.success('Logged out')
    navigate('/login', { replace: true })
  }

  const roleName = userRoleNum === 3 ? 'Admin' : userRoleNum === 2 ? 'Manager' : 'User'

  return (
    <nav className="top-nav">
      <div className="top-nav-inner">
        <NavLink to="/dashboard" className="brand-link">Resource Booking</NavLink>

        <div className="nav-links">
          <NavItem to="/dashboard">Dashboard</NavItem>
          <NavItem to="/resources">Resources</NavItem>
          <NavItem to="/my-bookings">My bookings</NavItem>
          <NavItem to="/my-tasks">My tasks</NavItem>
          {userRoleNum >= 2 && <NavItem to="/admin">Manage</NavItem>}
        </div>

        <div className="nav-account">
          <span>{userName}</span>
          <span className="role-chip">{roleName}</span>
          <button type="button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  )
}

const NavItem = ({ to, children }) => (
  <NavLink to={to} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
    {children}
  </NavLink>
)

export default Navbar
