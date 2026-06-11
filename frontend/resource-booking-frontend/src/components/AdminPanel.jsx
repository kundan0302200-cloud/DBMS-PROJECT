import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { bookingService, resourceService, taskService, userService } from '../services/api'

const emptyTask = {
  title: '',
  description: '',
  assignedto: '',
  priority: 2,
  deadline: '',
  status: 0,
  createdby: 1
}

const emptyResource = {
  resource_name: '',
  resource_type: '',
  description: '',
  total_quantity: 1,
  available_quantity: 1
}

const emptyUser = {
  fullname: '',
  email: '',
  password: '',
  phone: '',
  role: 1
}

const tabs = [
  { id: 'tasks', label: 'Tasks' },
  { id: 'resources', label: 'Resources' },
  { id: 'users', label: 'Users' },
  { id: 'bookings', label: 'Bookings' }
]

const getUserId = (user) => user?.id ?? user?.userId ?? user?.user_id
const getUserLabel = (user) => `${user.fullname || user.email || 'User'} (${user.email || `ID ${getUserId(user)}`})`

const AdminPanel = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('tasks')
  const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState([])
  const [resources, setResources] = useState([])
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [taskForm, setTaskForm] = useState(emptyTask)
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [resourceForm, setResourceForm] = useState(emptyResource)
  const [userForm, setUserForm] = useState(emptyUser)
  const [assigneeSearch, setAssigneeSearch] = useState('')
  const [assigneeResults, setAssigneeResults] = useState([])
  const [selectedAssignee, setSelectedAssignee] = useState(null)

  const userRoleNum = Number(localStorage.getItem('userRole') || 0)

  useEffect(() => {
    if (userRoleNum < 2) {
      toast.error('Admin access required')
      navigate('/dashboard')
      return
    }

    fetchData(activeTab)
  }, [activeTab, navigate, userRoleNum])

  const fetchData = async (tab = activeTab) => {
    setLoading(true)
    try {
      if (tab === 'tasks') {
        const [taskRes, userRes] = await Promise.all([
          taskService.getAllTasks(1, 100),
          userService.getAllUsers(1, 100)
        ])
        if (taskRes.code === 200) setTasks(taskRes.tasks || [])
        if (userRes.code === 200) {
          setUsers(userRes.users || [])
          setAssigneeResults(userRes.users || [])
        }
      }

      if (tab === 'resources') {
        const response = await resourceService.getAllResources()
        if (response.code === 200) setResources(response.resources || [])
      }

      if (tab === 'users') {
        const response = await userService.getAllUsers(1, 100)
        if (response.code === 200) setUsers(response.users || [])
      }

      if (tab === 'bookings') {
        const response = await bookingService.getAllBookings()
        if (response.code === 200) setBookings(response.bookings || [])
      }
    } catch (error) {
      toast.error('Could not load admin data')
    } finally {
      setLoading(false)
    }
  }

  const handleAssigneeSearch = async (value) => {
    setAssigneeSearch(value)
    setSelectedAssignee(null)
    setTaskForm({ ...taskForm, assignedto: '' })

    try {
      const response = await userService.searchUsersByEmail(value)
      if (response.code === 200) {
        setAssigneeResults(response.users || [])
      }
    } catch (error) {
      toast.error('Could not search users')
    }
  }

  const selectAssignee = (user) => {
    const id = getUserId(user)
    setSelectedAssignee(user)
    setAssigneeSearch(user.email || '')
    setTaskForm({ ...taskForm, assignedto: id })
  }

  const handleTaskSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      ...taskForm,
      assignedto: Number(taskForm.assignedto),
      priority: Number(taskForm.priority),
      status: Number(taskForm.status),
      createdby: Number(taskForm.createdby || 1)
    }

    const assigneeExists = users.some((user) => Number(getUserId(user)) === payload.assignedto)

    if (!payload.title.trim() || !payload.description.trim() || !payload.assignedto) {
      toast.error('Title, description, and assigned user are required')
      return
    }

    if (!assigneeExists) {
      toast.error('Select a user from the email search results')
      return
    }

    try {
      const response = editingTaskId
        ? await taskService.updateTask(editingTaskId, payload)
        : await taskService.addTask(payload)

      if (response.code === 200) {
        toast.success(editingTaskId ? 'Task updated' : 'Task created')
        resetTaskForm()
        await fetchData('tasks')
      } else {
        toast.error(response.message || 'Task save failed')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Task save failed')
    }
  }

  const editTask = (task) => {
    const assignee = users.find((user) => Number(getUserId(user)) === Number(task.assignedto))
    setEditingTaskId(task._id)
    setSelectedAssignee(assignee || null)
    setAssigneeSearch(assignee?.email || String(task.assignedto || ''))
    setTaskForm({
      title: task.title || '',
      description: task.description || '',
      assignedto: task.assignedto || '',
      priority: task.priority ?? 2,
      deadline: task.deadline || '',
      status: task.status ?? 0,
      createdby: task.createdby || 1
    })
  }

  const resetTaskForm = () => {
    setEditingTaskId(null)
    setTaskForm(emptyTask)
    setAssigneeSearch('')
    setSelectedAssignee(null)
  }

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return

    const response = await taskService.deleteTask(id)
    if (response.code === 200) {
      toast.success('Task deleted')
      await fetchData('tasks')
    } else {
      toast.error(response.message || 'Delete failed')
    }
  }

  const handleResourceSubmit = async (event) => {
    event.preventDefault()
    const response = await resourceService.addResource(resourceForm)
    if (response.code === 200) {
      toast.success('Resource added')
      setResourceForm(emptyResource)
      await fetchData('resources')
    } else {
      toast.error(response.message || 'Resource save failed')
    }
  }

  const deleteResource = async (resource) => {
    const id = resource.resourceId || resource.resource_id
    if (!window.confirm('Delete this resource?')) return

    const response = await resourceService.deleteResource(id)
    if (response.code === 200) {
      toast.success('Resource deleted')
      await fetchData('resources')
    } else {
      toast.error(response.message || 'Delete failed')
    }
  }

  const handleUserSubmit = async (event) => {
    event.preventDefault()
    const response = await userService.addUser(userForm)
    if (response.code === 200) {
      toast.success('User added')
      setUserForm(emptyUser)
      await fetchData('users')
    } else {
      toast.error(response.message || 'User save failed')
    }
  }

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return

    const response = await userService.deleteUser(id)
    if (response.code === 200) {
      toast.success('User deleted')
      await fetchData('users')
    } else {
      toast.error(response.message || 'Delete failed')
    }
  }

  const cancelBooking = async (booking) => {
    const id = booking.bookingId || booking.booking_id
    const response = await bookingService.cancelBooking(id)
    if (response.code === 200) {
      toast.success('Booking cancelled')
      await fetchData('bookings')
    } else {
      toast.error(response.message || 'Cancel failed')
    }
  }

  const statusText = (status) => {
    if (Number(status) === 1) return 'In progress'
    if (Number(status) === 2) return 'Done'
    return 'Open'
  }

  const priorityText = (priority) => {
    if (Number(priority) === 1) return 'High'
    if (Number(priority) === 3) return 'Low'
    return 'Normal'
  }

  const assignedUserText = (assignedto) => {
    const user = users.find((item) => Number(getUserId(item)) === Number(assignedto))
    return user ? getUserLabel(user) : assignedto
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Administration</p>
          <h1>Management panel</h1>
        </div>
        <span className="role-pill">{userRoleNum === 3 ? 'Admin' : 'Manager'}</span>
      </header>

      <nav className="admin-tabs" aria-label="Admin sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {loading ? (
        <div className="admin-empty">Loading...</div>
      ) : (
        <>
          {activeTab === 'tasks' && (
            <section className="admin-grid">
              <form className="admin-form" onSubmit={handleTaskSubmit}>
                <h2>{editingTaskId ? 'Edit task' : 'New task'}</h2>
                <label>
                  Title
                  <input value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
                </label>
                <label>
                  Description
                  <textarea rows="4" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />
                </label>
                <label>
                  Assign by email
                  <input
                    type="search"
                    value={assigneeSearch}
                    onChange={(e) => handleAssigneeSearch(e.target.value)}
                    placeholder="Search user email"
                  />
                </label>
                <div className="assignee-results">
                  {assigneeResults.length === 0 ? (
                    <p>No users found</p>
                  ) : (
                    assigneeResults.slice(0, 6).map((user) => {
                      const id = getUserId(user)
                      const isSelected = Number(taskForm.assignedto) === Number(id)
                      return (
                        <button
                          key={id}
                          type="button"
                          className={isSelected ? 'selected' : ''}
                          onClick={() => selectAssignee(user)}
                        >
                          <span>{user.email}</span>
                          <small>{user.fullname || `User ${id}`}</small>
                        </button>
                      )
                    })
                  )}
                </div>
                {selectedAssignee && <p className="selected-assignee">Assigned to {getUserLabel(selectedAssignee)}</p>}
                <div className="form-row">
                  <label>
                    Priority
                    <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}>
                      <option value="1">High</option>
                      <option value="2">Normal</option>
                      <option value="3">Low</option>
                    </select>
                  </label>
                  <label>
                    Status
                    <select value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}>
                      <option value="0">Open</option>
                      <option value="1">In progress</option>
                      <option value="2">Done</option>
                    </select>
                  </label>
                </div>
                <label>
                  Deadline
                  <input type="date" value={taskForm.deadline} onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })} />
                </label>
                <div className="button-row">
                  {editingTaskId && <button type="button" className="btn secondary" onClick={resetTaskForm}>Cancel</button>}
                  <button type="submit" className="btn primary">{editingTaskId ? 'Update task' : 'Add task'}</button>
                </div>
              </form>

              <div className="table-panel">
                <h2>Tasks</h2>
                <AdminTable headers={['Title', 'Assigned', 'Priority', 'Status', 'Deadline', 'Actions']}>
                  {tasks.map((task) => (
                    <tr key={task._id}>
                      <td>{task.title}</td>
                      <td>{assignedUserText(task.assignedto)}</td>
                      <td>{priorityText(task.priority)}</td>
                      <td>{statusText(task.status)}</td>
                      <td>{task.deadline || '-'}</td>
                      <td className="actions">
                        <button type="button" className="link-button" onClick={() => editTask(task)}>Edit</button>
                        <button type="button" className="link-button danger" onClick={() => deleteTask(task._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </AdminTable>
              </div>
            </section>
          )}

          {activeTab === 'resources' && (
            <section className="admin-grid">
              <form className="admin-form" onSubmit={handleResourceSubmit}>
                <h2>Add resource</h2>
                <label>Name<input value={resourceForm.resource_name} onChange={(e) => setResourceForm({ ...resourceForm, resource_name: e.target.value })} /></label>
                <label>Type<input value={resourceForm.resource_type} onChange={(e) => setResourceForm({ ...resourceForm, resource_type: e.target.value })} /></label>
                <label>Description<textarea rows="3" value={resourceForm.description} onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })} /></label>
                <div className="form-row">
                  <label>Total<input type="number" min="1" value={resourceForm.total_quantity} onChange={(e) => setResourceForm({ ...resourceForm, total_quantity: e.target.value })} /></label>
                  <label>Available<input type="number" min="0" value={resourceForm.available_quantity} onChange={(e) => setResourceForm({ ...resourceForm, available_quantity: e.target.value })} /></label>
                </div>
                <button type="submit" className="btn primary">Add resource</button>
              </form>

              <div className="table-panel">
                <h2>Resources</h2>
                <AdminTable headers={['Name', 'Type', 'Total', 'Available', 'Actions']}>
                  {resources.map((resource) => (
                    <tr key={resource.resourceId || resource.resource_id}>
                      <td>{resource.resourceName || resource.resource_name}</td>
                      <td>{resource.resourceType || resource.resource_type}</td>
                      <td>{resource.totalQuantity || resource.total_quantity}</td>
                      <td>{resource.availableQuantity ?? resource.available_quantity}</td>
                      <td className="actions"><button type="button" className="link-button danger" onClick={() => deleteResource(resource)}>Delete</button></td>
                    </tr>
                  ))}
                </AdminTable>
              </div>
            </section>
          )}

          {activeTab === 'users' && (
            <section className="admin-grid">
              <form className="admin-form" onSubmit={handleUserSubmit}>
                <h2>Add user</h2>
                <label>Full name<input value={userForm.fullname} onChange={(e) => setUserForm({ ...userForm, fullname: e.target.value })} /></label>
                <label>Email<input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} /></label>
                <label>Phone<input value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} /></label>
                <label>Password<input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} /></label>
                <label>
                  Role
                  <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: Number(e.target.value) })}>
                    <option value="1">User</option>
                    <option value="2">Manager</option>
                    <option value="3">Admin</option>
                  </select>
                </label>
                <button type="submit" className="btn primary">Add user</button>
              </form>

              <div className="table-panel">
                <h2>Users</h2>
                <AdminTable headers={['Name', 'Email', 'Phone', 'Role', 'Actions']}>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.fullname}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.role === 3 ? 'Admin' : user.role === 2 ? 'Manager' : 'User'}</td>
                      <td className="actions"><button type="button" className="link-button danger" onClick={() => deleteUser(user.id)}>Delete</button></td>
                    </tr>
                  ))}
                </AdminTable>
              </div>
            </section>
          )}

          {activeTab === 'bookings' && (
            <section className="table-panel wide">
              <h2>Bookings</h2>
              <AdminTable headers={['ID', 'User', 'Resource', 'Quantity', 'Status', 'Actions']}>
                {bookings.map((booking) => (
                  <tr key={booking.bookingId || booking.booking_id}>
                    <td>{booking.bookingId || booking.booking_id}</td>
                    <td>{booking.userId || booking.user_id}</td>
                    <td>{booking.resourceId || booking.resource_id}</td>
                    <td>{booking.quantity}</td>
                    <td>{booking.status === 1 ? 'Confirmed' : booking.status === 2 ? 'Cancelled' : 'Completed'}</td>
                    <td className="actions">
                      {booking.status === 1 && <button type="button" className="link-button" onClick={() => cancelBooking(booking)}>Cancel</button>}
                    </td>
                  </tr>
                ))}
              </AdminTable>
            </section>
          )}
        </>
      )}
    </main>
  )
}

const AdminTable = ({ headers, children }) => (
  <div className="admin-table-wrap">
    <table className="admin-table">
      <thead>
        <tr>
          {headers.map((header) => <th key={header}>{header}</th>)}
        </tr>
      </thead>
      <tbody>
        {React.Children.count(children) > 0 ? children : (
          <tr>
            <td colSpan={headers.length} className="empty-cell">No records found</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)

export default AdminPanel
