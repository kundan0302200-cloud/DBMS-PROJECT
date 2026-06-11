import axios from 'axios'
import toast from 'react-hot-toast'

// USE GATEWAY ON PORT 8000
const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Token = token
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear()
      window.dispatchEvent(new Event('auth:logout'))
      toast.error('Session expired. Please login again.')
    }
    return Promise.reject(error)
  }
)

// Auth Services
export const authService = {
  signin: async (data) => {
    const response = await api.post('/authservice/signin', data)
    return response.data
  },
  signup: async (data) => {
    const response = await api.post('/authservice/signup', data)
    return response.data
  },
  getProfile: async () => {
    const response = await api.get('/authservice/profile')
    return response.data
  },
  getUserInfo: async () => {
    const response = await api.get('/authservice/uinfo')
    return response.data
  }
}

// Resource Services
export const resourceService = {
  getAllResources: async () => {
    const response = await api.get('/resource/getall')
    return response.data
  },
  addResource: async (data) => {
  const payload = {
    resource_name: data.resource_name || '',
    resource_type: data.resource_type || '',
    description: data.description || '',
    total_quantity: Number(data.total_quantity) || 0,
    available_quantity: Number(data.available_quantity) || 0
  }

  const response = await api.post('/resource/add', payload)
  return response.data
},
  updateResource: async (id, data) => {
    const payload = {
      resource_name: data.resource_name,
      resource_type: data.resource_type,
      description: data.description || '',
      total_quantity: Number(data.total_quantity),
      available_quantity: Number(data.available_quantity)
    }

    const response = await api.put(`/resource/update/${id}`, payload)
    return response.data
  },
  
  deleteResource: async (id) => {
    const response = await api.delete(`/resource/delete/${id}`)
    return response.data
  }
}

// Booking Services
export const bookingService = {
  bookResource: async (data) => {
    const response = await api.post('/booking/book', data)
    return response.data
  },
  getMyBookings: async () => {
    const response = await api.get('/booking/mybookings')
    return response.data
  },
  cancelBooking: async (id) => {
    const response = await api.put(`/booking/cancel/${id}`)
    return response.data
  },
  getAllBookings: async () => {
    const response = await api.get('/booking/all')
    return response.data
  },
  getBookingsByResource: async (resourceId) => {
    const response = await api.get(`/booking/getbyresource/${resourceId}`)
    return response.data
  }
}

// Task Services
export const taskService = {
  getAllTasks: async (page = 1, size = 100) => {
    const response = await api.get(`/taskservice/getalltasks/${page}/${size}`)
    return response.data
  },
  addTask: async (data) => {
    const response = await api.post('/taskservice/createtask', data)
    return response.data
  },
  updateTask: async (id, data) => {
    const response = await api.put(`/taskservice/updatetask/${id}`, data)
    return response.data
  },
  deleteTask: async (id) => {
    const response = await api.delete(`/taskservice/deletetask/${id}`)
    return response.data
  }
}

// User Services
export const userService = {
  getAllUsers: async (page = 1, limit = 100) => {
    const response = await api.get(`/authservice/getallusers/${page}/${limit}`)
    return response.data
  },
  searchUsersByEmail: async (email) => {
    const response = await api.get('/authservice/getallusers/1/100')
    const users = response.data?.users || []
    const query = email.trim().toLowerCase()
    return {
      ...response.data,
      users: query
        ? users.filter((user) => String(user.email || '').toLowerCase().includes(query))
        : users
    }
  },
  getUserById: async (id) => {
    const response = await api.get(`/authservice/getuser/${id}`)
    return response.data
  },
  addUser: async (data) => {
    const response = await api.post('/authservice/saveuser', {
      fullname: data.fullname,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: data.role || 1,
      status: 1
    })
    return response.data
  },
  updateUser: async (id, data) => {
    const response = await api.put(`/authservice/updateuser/${id}`, {
      fullname: data.fullname,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: data.role || 1
    })
    return response.data
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/authservice/deleteuser/${id}`)
    return response.data
  }
}

export default api
