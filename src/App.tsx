import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PlayPage from './pages/PlayPage';
import AdminPage from './pages/AdminPage';

// github page: https://lietzsche.github.io/narrative-app/
function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/play" element={<PlayPage />} />
            <Route path="/admin" element={<AdminPage />} />
        </Routes>
    );
}

export default App;