import axios from 'axios'
import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const handleLogin = async () => {
    try {
      // Try sending as JSON instead
      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          username: username,
          password: password
        }
      )
      
      localStorage.setItem('token', response.data.access_token)
      setIsLoggedIn(true)
      setError('')
    } catch (err) {
      console.log('Error details:', JSON.stringify(err.response?.data, null, 2))
      setError('Login failed: ' + (err.response?.data?.detail || 'Unknown error'))
    }
  }

  const fetchTasks = async () => {
    setLoading(true)
    try{
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setTasks(response.data.tasks)
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    if (!newTaskTitle.trim()) return

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/tasks`,
        {
          title: newTaskTitle,
          priority: 'medium'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setTasks([...tasks, response.data])
      setNewTaskTitle('')
    } catch (err) {
      console.error('Failed to create task:', err)
    }
  }

  const toggleTask = async (taskId, currentStatus) => {
    try {
      const token = localStorage.getItem('token')
      await axios.patch(
        `${API_URL}/tasks/${taskId}`,
        {
          completed: !currentStatus
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setTasks(tasks.map(task =>
        task.id === taskId
        ? { ...task, completed: !currentStatus }
        : task
      ))
    } catch (err) {
      console.error('Failed to toggle task:', err)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks()
    }
  }, [isLoggedIn])

  // If not logged in, show login form
  if (!isLoggedIn) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
        <h1>Task Manager Login</h1>
        
        {error && <div style={{ color: 'red' }}>{error}</div>}
        
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <button onClick={handleLogin}>Login</button>
      </div>
    )
  }

  // If logged in, show this
  return (
    <div style={{ padding: '20px' }}>
      <h1>My Tasks</h1>
      <button onClick={() => {
        localStorage.removeItem('token')
        setIsLoggedIn(false)
        setTasks([])
      }}>
        Logout
      </button>

      <div style = {{ marginTop: '20px', marginBottom: '20px' }}>
        <input type="text"
          placeholder="New task title..."
          value={newTaskTitle}
          onChange={(e) =>setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          style={{ padding: '8px', width: '300px' }}
        />
        <button onClick={addTask} style={{ marginLeft: '10px' }}>
          Add Task
        </button>
      </div>

      {loading && <p>Loading tasks...</p>}

      {!loading && tasks.length === 0 && (
        <p>No tasks found.</p>
      )}

      {!loading && tasks.length > 0 && (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <input type="checkbox"
              checked={task.completed} 
              onChange={() => toggleTask(task.id, task.completed)}
              />
              <span style= {{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.title}
              </span>
              <span style={{ color: '#666', marginLeft: '10px' }}>
                ({task.priority})
              </span>
              {task.title} - {task.priority}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App