import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useStore } from './store';
import { Sun, Moon, LogOut, User } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import DeckView from './pages/DeckView';
import ReviewSession from './pages/ReviewSession';
import Login from './pages/Login';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const user = useStore(state => state.user);
  const loadingAuth = useStore(state => state.loadingAuth);

  if (loadingAuth) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
}

function App() {
  const initialize = useStore(state => state.initialize);
  const theme = useStore(state => state.theme);
  const toggleTheme = useStore(state => state.toggleTheme);
  const user = useStore(state => state.user);
  const logout = useStore(state => state.logout);

  useEffect(() => {
    const cleanup = initialize();
    return cleanup;
  }, [initialize]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      <div className="app-container">
        <nav className="nav">
          <Link to="/" className="logo">Memora</Link>
          <div className="flex items-center gap-4">
            <button
              className="btn p-2 rounded-full border-glass-border hover:bg-card-hover"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {user && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <User size={16} />
                  <span className="text-secondary">{user.email}</span>
                </div>
                <button
                  className="btn btn-secondary p-2"
                  onClick={logout}
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/deck/:deckId" element={<ProtectedRoute><DeckView /></ProtectedRoute>} />
          <Route path="/review/:deckId" element={<ProtectedRoute><ReviewSession /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
