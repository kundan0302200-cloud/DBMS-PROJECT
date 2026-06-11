import React, { useState } from 'react'
import { bookingService } from '../services/api'
import toast from 'react-hot-toast'

const BookResourceModal = ({ resource, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    resource_id: resource.resourceId || resource.resource_id,
    quantity: 1,
    start_time: '',
    end_time: '',
    purpose: ''
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
      const response = await bookingService.bookResource(formData)
      
      if (response.code === 200) {
        toast.success('Resource booked successfully!')
        onSuccess()
      } else {
        toast.error(response.message || 'Booking failed')
      }
    } catch (error) {
      toast.error('Error booking resource')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>📅 Book {resource.resourceName || resource.resource_name}</h3>
          <button 
            style={styles.closeButton}
            onClick={onClose}
            title="Close"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Quantity</label>
            <input
              type="number"
              name="quantity"
              min="1"
              max={resource.availableQuantity || resource.available_quantity}
              value={formData.quantity}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Start Time</label>
            <input
              type="datetime-local"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>End Time</label>
            <input
              type="datetime-local"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Purpose</label>
            <textarea
              name="purpose"
              rows="3"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Why do you need this resource?"
              style={styles.textarea}
            />
          </div>
          
          <div style={styles.modalButtons}>
            <button 
              type="button" 
              onClick={onClose}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                ...styles.confirmButton,
                ...(loading ? styles.confirmButtonDisabled : {})
              }}
            >
              {loading ? '⏳ Booking...' : '✓ Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modalContent: {
    background: 'white',
    borderRadius: '15px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    animation: 'slideUp 0.3s ease'
  },
  modalHeader: {
    padding: '25px',
    borderBottom: '2px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: '#333'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#999',
    padding: '0',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    transition: 'all 0.2s'
  },
  form: {
    padding: '25px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#555',
    fontWeight: '600',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'all 0.3s',
    outline: 'none',
    fontFamily: 'inherit'
  },
  textarea: {
    width: '100%',
    padding: '12px 15px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'all 0.3s',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  modalButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: '25px'
  },
  cancelButton: {
    flex: 1,
    padding: '12px',
    background: '#e0e0e0',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  confirmButton: {
    flex: 1,
    padding: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
  },
  confirmButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  }
}

export default BookResourceModal
