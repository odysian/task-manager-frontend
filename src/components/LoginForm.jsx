function LoginForm({
  username,
  password,
  error,
  onUsernameChange,
  onPasswordChange,
  onLogin,
}) {
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Task Manager Login</h1>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onLogin()}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <button onClick={onLogin}>Login</button>
    </div>
  );
}

export default LoginForm;
