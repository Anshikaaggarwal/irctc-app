import BookingPage from "./bookingpage";
import "./styles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TrainBooking from "./train-chart/Trainlist";
import SeatSelection from "./seat-selection/SeatSelection";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookingPage />} /> {/* Default home page */}
        <Route path="/trainbooking" element={<TrainBooking />} />
        <Route path="/seats" element={<SeatSelection />} />
        {/* <Route path="*" element={<NotFound />} />  */}
      </Routes>
    </Router>
  );
  
}

export default App;