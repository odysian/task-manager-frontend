import { useEffect, useState } from 'react';
import api from './api';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import TaskDashboard from './components/TaskDashboard';
import VerifyEmailPage from './pages/VerifyEmailPage'; // ← NEW IMPORT

function App() {
  // Check URL for verification token on mount
  const [verificationToken, setVerificationToken] = useState(null);

  const [currentView, setCurrentView] = useState(
    localStorage.getItem('token') ? 'dashboard' : 'login'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // NEW: Check URL for token parameter on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      setVerificationToken(token);
      setCurrentView('verify');
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', {
        username: username,
        password: password,
      });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('username', username);
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
      await api.post('/auth/register', {
        username: regUsername,
        password: regPassword,
        email: regEmail,
      });

      const response = await api.post('/auth/login', {
        username: regUsername,
        password: regPassword,
      });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('username', regUsername);
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
    localStorage.removeItem('username');
    setUsername('');
    setPassword('');
    setCurrentView('login');
  };

  // NEW: Handle verification completion
  const handleVerificationComplete = () => {
    // Clear token from URL
    window.history.replaceState({}, document.title, '/');

    // If user is logged in, go to dashboard
    // Otherwise, go to login
    if (localStorage.getItem('token')) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('login');
    }
  };

  // NEW: Show verification page if we have a token
  if (currentView === 'verify') {
    return (
      <VerifyEmailPage
        token={verificationToken}
        onComplete={handleVerificationComplete}
      />
    );
  }

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
