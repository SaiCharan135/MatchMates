import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './store/GameContext';

// Components
import Navbar from './components/Navbar';
import ChatDrawer from './components/ChatDrawer';
import ToastContainer from './components/ToastContainer';
import ReactionOverlay from './components/ReactionOverlay';

// Pages
import Home from './pages/Home';
import CreateGame from './pages/CreateGame';
import JoinGame from './pages/JoinGame';
import Lobby from './pages/Lobby';
import GameBoard from './pages/GameBoard';
import Results from './pages/Results';
import HowToPlay from './pages/HowToPlay';
import Profile from './pages/Profile';
import GameHistory from './pages/GameHistory';
import Leaderboard from './pages/Leaderboard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Router>
      <GameProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreateGame />} />
              <Route path="/join" element={<JoinGame />} />
              <Route path="/lobby/:roomCode" element={<Lobby />} />
              <Route path="/game/:roomCode" element={<GameBoard />} />
              <Route path="/results/:roomCode" element={<Results />} />
              <Route path="/how-to-play" element={<HowToPlay />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/history" element={<GameHistory />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <ToastContainer />
          <ReactionOverlay />
          <ChatDrawer />
        </div>
      </GameProvider>
    </Router>
  );
}
