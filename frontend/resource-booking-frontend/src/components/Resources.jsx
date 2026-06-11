import React, { useState, useEffect } from 'react'
import { resourceService, bookingService } from '../services/api'
import toast from 'react-hot-toast'

const Resources = () => {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedResource, setSelectedResource] = useState(null)
  const [bookingData, setBookingData] = useState({
    resource_id: '',
    quantity: 1,
    start_time: '',
    end_time: '',
    purpose: ''
  })

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await resourceService.getAllResources()
      console.log('Resources API response:', response)
      
      if (response.code === 200 && response.resources) {
        // Backend returns camelCase fields, keep as is
        setResources(response.resources)
      } else {
        setResources([])
      }
    } catch (error) {
      console.error('Error fetching resources:', error)
      toast.error('Failed to load resources')
    } finally {
      setLoading(false)
    }
  }

  const handleBookClick = (resource) => {
    if (resource.availableQuantity === 0) {
      toast.error('Resource not available')
      return
    }
    setSelectedResource(resource)
    setBookingData({
      resource_id: resource.resourceId,  // Note: camelCase from backend
      quantity: 1,
      start_time: '',
      end_time: '',
      purpose: ''
    })
    setShowBookingModal(true)
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await bookingService.bookResource(bookingData)
      if (response.code === 200) {
        toast.success('Booked successfully!')
        setShowBookingModal(false)
        fetchResources()
      } else {
        toast.error(response.message || 'Booking failed')
      }
    } catch (error) {
      toast.error('Error booking resource')
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading resources...</div>

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2>Available Resources</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {resources.length === 0 ? (
          <p>No resources available.</p>
        ) : (
          resources.map((resource) => (
            <div key={resource.resourceId} style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3>{resource.resourceName}</h3>
              <p><strong>Type:</strong> {resource.resourceType}</p>
              <p><strong>Total:</strong> {resource.totalQuantity}</p>
              <p><strong>Available:</strong> <span style={{ color: resource.availableQuantity > 0 ? '#48bb78' : '#f56565' }}>{resource.availableQuantity}</span></p>
              {resource.description && <p><strong>Description:</strong> {resource.description}</p>}
              <button 
                onClick={() => handleBookClick(resource)}
                disabled={resource.availableQuantity === 0}
                style={{
                  marginTop: '10px',
                  padding: '10px',
                  background: resource.availableQuantity > 0 ? '#667eea' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: resource.availableQuantity > 0 ? 'pointer' : 'not-allowed',
                  width: '100%'
                }}
              >
                {resource.availableQuantity > 0 ? 'Book Now' : 'Not Available'}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedResource && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.content}>
            <h3>Book {selectedResource.resourceName}</h3>
            <form onSubmit={handleBookingSubmit}>
              <div style={modalStyles.inputGroup}>
                <label>Quantity (Max: {selectedResource.availableQuantity})</label>
                <input
                  type="number"
                  value={bookingData.quantity}
                  onChange={(e) => setBookingData({...bookingData, quantity: parseInt(e.target.value)})}
                  min="1"
                  max={selectedResource.availableQuantity}
                  required
                  style={modalStyles.input}
                />
              </div>
              <div style={modalStyles.inputGroup}>
                <label>Start Time</label>
                <input
                  type="datetime-local"
                  value={bookingData.start_time}
                  onChange={(e) => setBookingData({...bookingData, start_time: e.target.value})}
                  required
                  style={modalStyles.input}
                />
              </div>
              <div style={modalStyles.inputGroup}>
                <label>End Time</label>
                <input
                  type="datetime-local"
                  value={bookingData.end_time}
                  onChange={(e) => setBookingData({...bookingData, end_time: e.target.value})}
                  required
                  style={modalStyles.input}
                />
              </div>
              <div style={modalStyles.inputGroup}>
                <label>Purpose</label>
                <textarea
                  value={bookingData.purpose}
                  onChange={(e) => setBookingData({...bookingData, purpose: e.target.value})}
                  rows="3"
                  style={modalStyles.textarea}
                  placeholder="Why do you need this resource?"
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowBookingModal(false)} style={modalStyles.cancelBtn}>Cancel</button>
                <button type="submit" style={modalStyles.submitBtn}>Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const modalStyles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  content: { background: 'white', borderRadius: '10px', padding: '30px', width: '90%', maxWidth: '500px' },
  inputGroup: { marginBottom: '15px' },
  input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' },
  textarea: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', minHeight: '80px' },
  cancelBtn: { flex: 1, padding: '10px', background: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  submitBtn: { flex: 1, padding: '10px', background: '#48bb78', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
}

export default Resources