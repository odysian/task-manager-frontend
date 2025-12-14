import axios from 'axios';
import { useState } from 'react';
import LoginForm from './components/LoginForm';
import TaskDashboard from './components/TaskDashboard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

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
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>My Tasks</h1>
        <button
          onClick={handleLogout}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      <TaskDashboard />
    </div>
  );
}

export default App;
