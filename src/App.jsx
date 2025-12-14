import axios from 'axios';
import { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleLogin = async () => {
    try {
      // Try sending as JSON instead
      const response = await axios.post(`${API_URL}/auth/login`, {
        username: username,
        password: password,
      });

      localStorage.setItem('token', response.data.access_token);
      setIsLoggedIn(true);
      setError('');
    } catch (err) {
      console.log(
        'Error details:',
        JSON.stringify(err.response?.data, null, 2)
      );
      setError(
        'Login failed: ' + (err.response?.data?.detail || 'Unknown error')
      );
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data.tasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/tasks`,
        {
          title: newTaskTitle,
          priority: 'medium',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks([...tasks, response.data]);
      setNewTaskTitle('');
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const toggleTask = async (taskId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/tasks/${taskId}`,
        {
          completed: !currentStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !currentStatus } : task
        )
      );
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };
  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks();
    }
  }, [isLoggedIn]);

  // If not logged in, show login form
  if (!isLoggedIn) {
    return (
      <LoginForm
        username={username}
        password={password}
        error={error}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onLogin={handleLogin}
      />
    );
  }

  // If logged in, show this
  return (
    <div style={{ padding: '20px' }}>
      <h1>My Tasks</h1>
      <button
        onClick={() => {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setTasks([]);
        }}
      >
        Logout
      </button>

      <TaskForm
        newTaskTitle={newTaskTitle}
        onTaskTitleChange={setNewTaskTitle}
        onAddTask={addTask}
      />

      <TaskList
        tasks={tasks}
        loading={loading}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />
    </div>
  );
}

export default App;
