import { useState } from 'react';
import api from './api';
import LoginForm from './components/LoginForm';
import TaskDashboard from './components/TaskDashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
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

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Pass the logout handler to the dashboard */}
        <TaskDashboard onLogout={handleLogout} />
      </div>
    </div>
  );
}

export default App;
