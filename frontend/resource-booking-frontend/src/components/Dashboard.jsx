import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { bookingService, resourceService, userService } from '../services/api'

const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalResources: 0,
    availableResources: 0,
    myBookings: 0,
    totalUsers: 0,
    allBookings: 0
  })
  const [loading, setLoading] = useState(true)

  const userName = localStorage.getItem('userName') || 'User'
  const userEmail = localStorage.getItem('userEmail') || ''
  const userRole = localStorage.getItem('userRole') || '1'
  const roleName = userRole === '3' ? 'Admin' : userRole === '2' ? 'Manager' : 'User'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || token === 'null') {
      toast.error('Please login to continue')
      navigate('/login')
      return
    }

    fetchDashboardStats()
  }, [navigate])

  const fetchDashboardStats = async () => {
    try {
      const [resourcesRes, myBookingsRes] = await Promise.all([
        resourceService.getAllResources(),
        bookingService.getMyBookings()
      ])

      const resources = resourcesRes.code === 200 ? resourcesRes.resources || [] : []
      const myBookings = myBookingsRes.code === 200 ? myBookingsRes.bookings || [] : []

      let allBookings = 0
      let totalUsers = 0

      if (userRole === '2' || userRole === '3') {
        const allBookingsRes = await bookingService.getAllBookings()
        if (allBookingsRes.code === 200) allBookings = (allBookingsRes.bookings || []).length
      }

      if (userRole === '3') {
        const usersRes = await userService.getAllUsers(1, 100)
        if (usersRes.code === 200) totalUsers = usersRes.totalElements || (usersRes.users || []).length
      }

      setStats({
        totalResources: resources.length,
        availableResources: resources.filter((item) => (item.availableQuantity ?? item.available_quantity ?? 0) > 0).length,
        myBookings: myBookings.length,
        totalUsers,
        allBookings
      })
    } catch (error) {
      toast.error('Could not load dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <main className="page-shell"><div className="admin-empty">Loading dashboard...</div></main>
  }

  return (
    <main className="page-shell">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Welcome back, {userName}</h1>
          <p>{userEmail || 'Account details are available from your profile.'}</p>
        </div>
        <span className="role-pill">{roleName}</span>
      </section>

      <section className="summary-grid">
        <SummaryCard label="Total resources" value={stats.totalResources} />
        <SummaryCard label="Available resources" value={stats.availableResources} />
        <SummaryCard label="My bookings" value={stats.myBookings} />
        {(userRole === '2' || userRole === '3') && <SummaryCard label="All bookings" value={stats.allBookings} />}
        {userRole === '3' && <SummaryCard label="Users" value={stats.totalUsers} />}
      </section>

      <section className="quick-panel">
        <h2>Quick actions</h2>
        <div className="quick-grid">
          <button type="button" onClick={() => navigate('/resources')}>Browse resources</button>
          <button type="button" onClick={() => navigate('/my-bookings')}>View bookings</button>
          {(userRole === '2' || userRole === '3') && <button type="button" onClick={() => navigate('/admin')}>Open management</button>}
        </div>
      </section>
    </main>
  )
}

const SummaryCard = ({ label, value }) => (
  <article className="summary-card">
    <span>{label}</span>
    <strong>{value}</strong>
  </article>
)

export default Dashboard
