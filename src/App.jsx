import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useStore } from './store';
import Dashboard from './pages/Dashboard';
import DeckView from './pages/DeckView';
import ReviewSession from './pages/ReviewSession';

function App() {
  const initialize = useStore(state => state.initialize);

  useEffect(() => {
    const cleanup = initialize();
    return cleanup;
  }, [initialize]);

  return (
    <Router>
      <div className="app-container">
        <nav className="nav">
          <Link to="/" className="logo">Memora</Link>
          <div>
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
