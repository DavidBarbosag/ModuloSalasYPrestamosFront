import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoomList from './pages/RoomList';
import ElementList from './pages/ElementList';
import ReservationsPage from './pages/ReservationsPage';
import AvailabilityPage from './pages/AvailabilityPage';
import ReserveRoom from './pages/ReserveRoom';
import Home from './pages/Home';
function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<RoomList />} />
          <Route path="/rooms/reserve" element={<ReserveRoom />} />
          <Route path="/elements" element={<ElementList />} />
            <Route path="/availability" element={<AvailabilityPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
