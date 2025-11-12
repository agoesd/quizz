import React, { useState, useEffect } from 'react';
import { Lock, User, UserCog, Users, LogOut, Shield } from 'lucide-react';

// Hardcoded users database
const USERS_DB = {
  admin: {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Administrator'
  },
  user1: {
    username: 'user',
    password: 'user123',
    role: 'user',
    name: 'User Reguler'
  },
  user2: {
    username: 'peserta',
    password: 'peserta123',
    role: 'user',
    name: 'Peserta Quiz'
  }
};

const AuthSystem = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const user = USERS_DB[username];
    
    if (!user) {
      setError('Username tidak ditemukan!');
      return;
    }

    if (user.password !== password) {
      setError('Password salah!');
      return;
    }

    // Login berhasil
    const userData = {
      username: user.username,
      name: user.name,
      role: user.role
    };
    
    // Simpan ke localStorage
    localStorage.setItem('quiz_user', JSON.stringify(userData));
    onLogin(userData);
  };

  const handleGuestLogin = () => {
    const guestData = {
      username: 'guest',
      name: 'Guest User',
      role: 'guest'
    };
    localStorage.setItem('quiz_user', JSON.stringify(guestData));
    onLogin(guestData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Login Quiz App
          </h1>
          <p className="text-gray-600">
            Silakan login untuk mengakses aplikasi
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Masukkan username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Masukkan password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
          >
            Login
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">atau</span>
          </div>
        </div>

        <button
          onClick={handleGuestLogin}
          className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
        >
          <Users className="w-5 h-5" />
          Lanjutkan sebagai Guest
        </button>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-800 mb-3">
            📋 Akun Demo:
          </p>
          <div className="space-y-2 text-sm">
            <div className="bg-white p-2 rounded border border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <UserCog className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-purple-600">Admin</span>
              </div>
              <p className="text-gray-600 text-xs">
                Username: <code className="bg-gray-100 px-1 rounded">admin</code> | 
                Password: <code className="bg-gray-100 px-1 rounded">admin123</code>
              </p>
            </div>
            <div className="bg-white p-2 rounded border border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-600">User Reguler</span>
              </div>
              <p className="text-gray-600 text-xs">
                Username: <code className="bg-gray-100 px-1 rounded">user</code> | 
                Password: <code className="bg-gray-100 px-1 rounded">user123</code>
              </p>
            </div>
            <div className="bg-white p-2 rounded border border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="font-semibold text-gray-600">Guest</span>
              </div>
              <p className="text-gray-600 text-xs">
                Klik tombol "Lanjutkan sebagai Guest"
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>⚠️ Ini adalah aplikasi demo dengan akun hardcoded</p>
        </div>
      </div>
    </div>
  );
};

// Component untuk menampilkan info user yang sedang login
export const UserInfo = ({ user, onLogout }) => {
  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'user': return 'bg-green-100 text-green-700 border-green-300';
      case 'guest': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <UserCog className="w-4 h-4" />;
      case 'user': return <User className="w-4 h-4" />;
      case 'guest': return <Users className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleLabel = (role) => {
    switch(role) {
      case 'admin': return 'Administrator';
      case 'user': return 'User Reguler';
      case 'guest': return 'Guest';
      default: return 'Unknown';
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${getRoleColor(user.role)}`}>
        {getRoleIcon(user.role)}
        <div>
          <div className="text-xs opacity-75">{getRoleLabel(user.role)}</div>
          <div className="font-semibold">{user.name}</div>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );
};

// Hook untuk check authorization
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage untuk user yang sudah login
    const savedUser = localStorage.getItem('quiz_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('quiz_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('quiz_user');
  };

  const isAdmin = () => user?.role === 'admin';
  const isUser = () => user?.role === 'user';
  const isGuest = () => user?.role === 'guest';

  return {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isUser,
    isGuest,
    isAuthenticated: !!user
  };
};

// Protected Route Component
export const ProtectedRoute = ({ children, allowedRoles, user }) => {
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Akses Ditolak</h2>
          <p className="text-gray-600">Silakan login terlebih dahulu</p>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <Shield className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Akses Terbatas</h2>
          <p className="text-gray-600">
            Anda tidak memiliki akses ke halaman ini.
            <br />
            Role Anda: <strong>{user.role}</strong>
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthSystem;
