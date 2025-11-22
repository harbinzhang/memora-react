import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useStore } from './store';
import { Sun, Moon } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import DeckView from './pages/DeckView';
import ReviewSession from './pages/ReviewSession';

function App() {
  const initialize = useStore(state => state.initialize);
  const theme = useStore(state => state.theme);
  const toggleTheme = useStore(state => state.toggleTheme);

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
              className="btn p-2 rounded-full border-glass-border hover:bg-bg-secondary"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {/* Add user profile or settings here later */}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/deck/:deckId" element={<DeckView />} />
          <Route path="/review/:deckId" element={<ReviewSession />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
