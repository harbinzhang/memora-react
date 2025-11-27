import { useEffect, lazy, Suspense, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useStore } from './store';
import { Sun, Moon, LogOut, User, ChevronDown, Settings } from 'lucide-react';
import { ToastProvider } from './contexts/ToastContext';

// Lazy load route components for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DeckView = lazy(() => import('./pages/DeckView'));
const ReviewSession = lazy(() => import('./pages/ReviewSession'));
const Login = lazy(() => import('./pages/Login'));
const AddCard = lazy(() => import('./pages/AddCard'));

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const cleanup = initialize();
    return cleanup;
  }, [initialize]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <ToastProvider>
      <Router>
        <div className="app-container">
          <nav className="nav">
            <Link to="/" className="logo">Memora</Link>
            <div className="flex items-center gap-4">
              <button
                className="btn p-3 rounded-full border-glass-border hover:bg-card-hover"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-glass-border hover:border-primary/30 bg-card/50 hover:bg-card transition-all group"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/10 group-hover:border-primary/20 transition-colors">
                      <User size={16} className="text-primary" />
                    </div>
                    <ChevronDown size={14} className={`text-secondary transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-card border border-glass-border rounded-lg shadow-2xl overflow-hidden z-50 backdrop-blur-xl animate-scale-in origin-top-right account-menu-panel">
                      <div className="px-4 pt-6 pb-4 border-b border-glass-border account-menu-header" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <p className="text-base font-semibold text-primary truncate capitalize text-center">
                          {user.displayName || user.email?.split('@')[0]}
                        </p>
                      </div>

                      <div className="p-2">
                        <button
                          className="w-full flex items-center gap-3 px-3 py-3.5 text-base rounded-lg transition-colors text-left group text-secondary hover:text-primary menu-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Settings size={18} className="group-hover:text-primary transition-colors" />
                          <span className="font-medium">Settings</span>
                        </button>

                        <div className="h-px bg-glass-border my-1.5 mx-2" />

                        <button
                          className="w-full flex items-center gap-3 px-3 py-3.5 text-base rounded-lg transition-colors text-left group text-secondary hover:text-danger menu-item-danger"
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                          }}
                        >
                          <LogOut size={18} className="group-hover:text-danger transition-colors" />
                          <span className="font-medium whitespace-nowrap">Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>

          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-secondary">Loading...</div>
            </div>
          }>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/deck/:deckId" element={<ProtectedRoute><DeckView /></ProtectedRoute>} />
              <Route path="/review/:deckId" element={<ProtectedRoute><ReviewSession /></ProtectedRoute>} />
              <Route path="/add" element={<ProtectedRoute><AddCard /></ProtectedRoute>} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
