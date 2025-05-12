import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoomList from './pages/RoomList';
import ReservationsPage from './pages/ReservationsPage';
function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<RoomList />} />
          <Route path="/reservations" element={<ReservationsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
