import React, { useState, useEffect } from 'react'
import { bookingService } from '../services/api'
import toast from 'react-hot-toast'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getMyBookings()
      if (response.code === 200) {
        setBookings(response.bookings || [])
      }
    } catch (error) {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (window.confirm('Cancel this booking?')) {
      try {
        const response = await bookingService.cancelBooking(id)
        if (response.code === 200) {
          toast.success('Cancelled successfully')
          fetchBookings()
        } else {
          toast.error(response.message || 'Cancellation failed')
        }
      } catch (error) {
        toast.error('Error cancelling booking')
      }
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading bookings...</div>

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2>My Bookings</h2>
      {bookings.length === 0 ? <p>No bookings found.</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '10px', overflow: 'hidden' }}>
            <thead><tr style={{ background: '#667eea', color: 'white' }}><th style={{ padding: '12px' }}>ID</th><th style={{ padding: '12px' }}>Resource ID</th><th style={{ padding: '12px' }}>Quantity</th><th style={{ padding: '12px' }}>Status</th><th style={{ padding: '12px' }}>Purpose</th><th style={{ padding: '12px' }}>Action</th></tr></thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.bookingId || booking.booking_id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{booking.bookingId || booking.booking_id}</td>
                  <td style={{ padding: '12px' }}>{booking.resourceId || booking.resource_id}</td>
                  <td style={{ padding: '12px' }}>{booking.quantity}</td>
                  <td style={{ padding: '12px' }}>{booking.status === 1 ? 'Confirmed' : booking.status === 2 ? 'Cancelled' : 'Completed'}</td>
                  <td style={{ padding: '12px' }}>{booking.purpose || '-'}</td>
                  <td style={{ padding: '12px' }}>{booking.status === 1 && <button onClick={() => handleCancel(booking.bookingId || booking.booking_id)} style={{ padding: '5px 10px', background: '#f56565', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Cancel</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MyBookings
