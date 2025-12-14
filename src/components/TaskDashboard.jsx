import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const ITEMS_PER_PAGE = 10;

function TaskDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const abortControllerRef = useRef(null);

  const [filters, setFilters] = useState({
    search: '',
    priority: '',
    status: '',
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    tags: '',
  });

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const newController = new AbortController();
    abortControllerRef.current = newController;
    try {
      const token = localStorage.getItem('token');

      const params = {
        limit: ITEMS_PER_PAGE,
        skip: (page - 1) * ITEMS_PER_PAGE,
      };
      if (filters.search) params.search = filters.search;
      if (filters.priority) params.priority = filters.priority;
      if (filters.status === 'completed') params.completed = true;
      if (filters.status === 'pending') params.completed = false;

      const response = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
        params: params,
        signal: newController.signal,
      });

      setTasks(response.data.tasks);
      setTotalPages(response.data.pages);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled:', err.message);
        return;
      }
      console.error('Failed to fetch tasks:', err);
    } finally {
      if (abortControllerRef.current === newController) {
        setLoading(false);
      }
    }
  }, [filters, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  const handleFormChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const addTask = async () => {
    if (!formData.title.trim()) return;

    try {
      const token = localStorage.getItem('token');

      const taskData = {
        title: formData.title,
        description: formData.description || undefined,
        priority: formData.priority,
        due_date: formData.due_date || undefined,
        tags: formData.tags
          ? formData.tags.split(',').map((tag) => tag.trim())
          : [],
      };

      const response = await axios.post(`${API_URL}/tasks`, taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks([...tasks, response.data]);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        due_date: '',
        tags: '',
      });
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

  return (
    <div>
      <TaskForm
        formData={formData}
        onFormChange={handleFormChange}
        onAddTask={addTask}
      />

      <hr
        style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }}
      />

      {/* New Filter Bar UI */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          padding: '15px',
          border: '1px solid #444',
          borderRadius: '8px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #555',
            backgroundColor: '#333',
            color: 'white',
            minWidth: '200px',
          }}
        />

        <select
          value={filters.priority}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, priority: e.target.value }))
          }
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #555',
            backgroundColor: '#333',
            color: 'white',
          }}
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #555',
            backgroundColor: '#333',
            color: 'white',
          }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <button
          onClick={() => setFilters({ search: '', priority: '', status: '' })}
          style={{
            padding: '8px 15px',
            cursor: 'pointer',
            backgroundColor: '#333',
            border: '1px solid #555',
            borderRadius: '4px',
            color: 'white',
          }}
        >
          Reset
        </button>
      </div>

      <TaskList
        tasks={tasks}
        loading={loading}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          alignItems: 'center;',
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
          style={{
            padding: '8px 15px',
            backgroundColor: '#333',
            border: '1px solid #555',
            color: 'white',
            borderRadius: '4px',
            opacity: page === 1 ? 0.5 : 1,
            cursor: page === 1 ? 'not-allowed' : 'pointer',
          }}
        >
          Previous
        </button>

        <span style={{ color: '#aaa' }}>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || loading}
          style={{
            padding: '8px 15px',
            backgroundColor: '#333',
            border: '1px solid #555',
            color: 'white',
            borderRadius: '4px',
            opacity: page === totalPages ? 0.5 : 1,
            cursor: page === totalPages ? 'not-allowed' : 'pointer',
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default TaskDashboard;
