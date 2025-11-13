import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Settings, BarChart } from 'lucide-react';
import AuthSystem, { UserInfo, useAuth, ProtectedRoute } from './components/AuthSystem';
import QuizApp from './components/QuizApp';
import AdminPanel from './components/AdminPanel';
 
const App = () => {
  const { user, loading, login, logout, isAdmin, isUser, isGuest } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
        <div className="text-white text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthSystem onLogin={login} />;
  }

  const NavigationBar = () => {
    const menuItems = [
      { id: 'home', label: 'Home', icon: Home, roles: ['admin', 'user', 'guest'] },
      { id: 'quiz', label: 'Ikuti Quiz', icon: BookOpen, roles: ['admin', 'user', 'guest'] },
      { id: 'admin', label: 'Admin Panel', icon: Settings, roles: ['admin'] },
      { id: 'stats', label: 'Statistik', icon: BarChart, roles: ['admin', 'user'] }
    ];

    return (
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <div className="text-xl font-bold text-indigo-600">
                Quiz App
              </div>
              <div className="hidden md:flex gap-2">
                {menuItems
                  .filter(item => item.roles.includes(user.role))
                  .map(item => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        currentPage === item.id
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}
              </div>
            </div>
            <UserInfo user={user} onLogout={logout} />
          </div>
        </div>
      </nav>
    );
  };

  const HomePage = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Selamat Datang, {user.name}! 👋
            </h1>
            <p className="text-xl text-gray-600">
              {isAdmin() && "Kelola soal quiz dan pantau peserta"}
              {isUser() && "Tingkatkan pengetahuan Anda dengan quiz interaktif"}
              {isGuest() && "Coba quiz gratis tanpa perlu registrasi"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2"
                 onClick={() => setCurrentPage('quiz')}>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Ikuti Quiz</h3>
              <p className="text-gray-600">
                Uji pengetahuan Anda dengan berbagai topik quiz yang tersedia
              </p>
              <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all">
                Mulai Sekarang →
              </button>
            </div>

            {isAdmin() && (
              <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2"
                   onClick={() => setCurrentPage('admin')}>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Admin Panel</h3>
                <p className="text-gray-600">
                  Kelola soal quiz, tambah, edit, atau hapus konten
                </p>
                <button className="mt-4 w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-all">
                  Kelola Soal →
                </button>
              </div>
            )}

            {(isAdmin() || isUser()) && (
              <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2"
                   onClick={() => setCurrentPage('stats')}>
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <BarChart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Statistik</h3>
                <p className="text-gray-600">
                  {isAdmin() ? "Lihat performa semua peserta quiz" : "Lihat hasil dan progress quiz Anda"}
                </p>
                <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all">
                  Lihat Data →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const StatisticsPage = () => {
    const [quizHistory, setQuizHistory] = useState([]);

    useEffect(() => {
      const history = localStorage.getItem(`quiz_history_${user.username}`);
      if (history) {
        setQuizHistory(JSON.parse(history));
      }
    }, []);

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            📊 Statistik {isAdmin() ? 'Semua Peserta' : 'Quiz Anda'}
          </h1>

          {quizHistory.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <BarChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                Belum ada riwayat quiz. Mulai ikuti quiz untuk melihat statistik!
              </p>
              <button
                onClick={() => setCurrentPage('quiz')}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
              >
                Ikuti Quiz Sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {quizHistory.map((record, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{record.topic}</h3>
                      <p className="text-sm text-gray-600">{record.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-indigo-600">
                        {record.score}/{record.total}
                      </div>
                      <div className="text-sm text-gray-600">
                        {Math.round((record.score / record.total) * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage />;
      
      case 'quiz':
        return <QuizApp user={user} />;
      
      case 'admin':
        return (
          <ProtectedRoute allowedRoles={['admin']} user={user}>
            <AdminPanel />
          </ProtectedRoute>
        );
      
      case 'stats':
        return (
          <ProtectedRoute allowedRoles={['admin', 'user']} user={user}>
            <StatisticsPage />
          </ProtectedRoute>
        );
      
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      {renderPage()}
    </div>
  );
};

export default App;
