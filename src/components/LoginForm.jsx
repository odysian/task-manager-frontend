import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

function LoginForm({
  username,
  password,
  error,
  onUsernameChange,
  onPasswordChange,
  onLogin,
  onSwitchToRegister,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputClasses =
    'w-full p-3 rounded bg-zinc-900 border border-zinc-700 text-white ' +
    'focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 ' +
    'focus:outline-none transition-all placeholder-zinc-600';

  return (
    // Outer Container: Keeps the form centered on the screen
    <div className="grid place-items-center h-screen bg-zinc-950 px-4">
      <div className="w-full max-w-md p-4">
        {/* Header / Logo Section */}
        <div className="text-center mb-10">
          <div className="mb-4">
            <span className="text-5xl text-emerald-500 filter drop-shadow-[0_0_10px_rgba(16,185,129,.9)]">
              ⟡
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-emerald-50 mb-2">
            FAROS
          </h1>
          <p className="text-sm text-emerald-500 font-medium tracking-wide">
            Navigate your backlog
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-950/30 border border-red-900/50 rounded text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* The Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              {' '}
              {/* Container for positioning */}
              <input
                type={showPassword ? 'text' : 'password'} // Toggles type
                placeholder="••••••••"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onLogin()}
                className={`${inputClasses} pr-10`} // Added pr-10 (padding-right) so text doesn't hit the icon
              />
              <button
                type="button" // Important: prevents form submission
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              >
                {/* Switch icon based on state */}
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            onClick={onLogin}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.99] mt-4"
          >
            Sign In
          </button>
        </div>

        {/* Switch to Register */}
        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline transition-all cursor-pointer"
            >
              Sign Up
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-zinc-500 text-xs font-mono">
            © 2025 Faros Manager
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
