import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { taskService } from '../services/api'

const MyTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const currentUserId = Number(localStorage.getItem('userId') || 0)

  const fetchTasks = async () => {
    try {
      const response = await taskService.getAllTasks(1, 100)
      if (response.code === 200) {
        const allTasks = response.tasks || []
        const myTasks = allTasks.filter((task) => Number(task.assignedto) === currentUserId)
        setTasks(myTasks)
      } else {
        setTasks([])
      }
    } catch (error) {
      toast.error('Failed to load your tasks')
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const markCompleted = async (task) => {
    try {
      const payload = {
        ...task,
        assignedto: Number(task.assignedto),
        priority: Number(task.priority ?? 2),
        status: 2,
        createdby: Number(task.createdby || 1),
        deadline: task.deadline || ''
      }

      const response = await taskService.updateTask(task._id, payload)
      if (response.code === 200) {
        toast.success('Task marked completed')
        await fetchTasks()
      } else {
        toast.error(response.message || 'Could not update task')
      }
    } catch (error) {
      toast.error('Error updating task status')
    }
  }

  const statusText = (status) => {
    if (Number(status) === 2) return 'Completed'
    if (Number(status) === 1) return 'In progress'
    return 'Open'
  }

  if (loading) {
    return <main className="page-shell"><div className="admin-empty">Loading your tasks...</div></main>
  }

  return (
    <main className="page-shell">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">Assigned work</p>
          <h1>My Tasks</h1>
          <p>These are the tasks assigned to your account. Mark them complete when done.</p>
        </div>
      </section>

      {tasks.length === 0 ? (
        <section className="quick-panel">
          <p>No tasks assigned to you right now.</p>
        </section>
      ) : (
        <section className="table-panel">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Deadline</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{Number(task.priority) === 1 ? 'High' : Number(task.priority) === 3 ? 'Low' : 'Normal'}</td>
                  <td>{statusText(task.status)}</td>
                  <td>{task.deadline || '-'}</td>
                  <td>
                    {Number(task.status) !== 2 ? (
                      <button type="button" className="btn primary" onClick={() => markCompleted(task)}>Mark complete</button>
                    ) : (
                      <span>Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  )
}

export default MyTasks
