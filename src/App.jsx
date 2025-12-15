import { useState } from 'react';
import api from './api';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import TaskDashboard from './components/TaskDashboard';

function App() {
  const [currentView, setCurrentView] = useState(
    localStorage.getItem('token') ? 'dashboard' : 'login'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', {
        username: username,
        password: password,
      });

      localStorage.setItem('token', response.data.access_token);
      setCurrentView('dashboard');
      setError('');
    } catch (err) {
      console.log('Login Error:', err.response?.data);
      setError(
        'Login failed: ' + (err.response?.data?.detail || 'Unknown error')
      );
    }
  };

  const handleRegister = async (regUsername, regPassword, regEmail) => {
    try {
      // 1. Create User
      await api.post('/auth/register', {
        username: regUsername,
        password: regPassword,
        email: regEmail,
      });

      // 2. Auto Login
      const response = await api.post('/auth/login', {
        username: regUsername,
        password: regPassword,
      });

      localStorage.setItem('token', response.data.access_token);
      setCurrentView('dashboard');
      setError('');
    } catch (err) {
      console.error('Registration failed:', err);
      setError(
        'Registration failed: ' +
          (err.response?.data?.detail || 'Unknown error')
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername('');
    setPassword('');
    setCurrentView('login');
  };

  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-200 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <TaskDashboard onLogout={handleLogout} />
        </div>
      </div>
    );
  }

  if (currentView === 'register') {
    return (
      <RegisterForm
        onRegister={handleRegister}
        onSwitchToLogin={() => {
          setError('');
          setCurrentView('login');
        }}
        error={error}
      />
    );
  }

  return (
    <LoginForm
      username={username}
      password={password}
      error={error}
      onUsernameChange={setUsername}
      onPasswordChange={setPassword}
      onLogin={handleLogin}
      onSwitchToRegister={() => {
        setError('');
        setCurrentView('register');
      }}
    />
  );
}

export default App;
