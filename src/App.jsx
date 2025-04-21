import BookingPage from "./bookingpage";
import "./styles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TrainBooking from "./train-chart/Trainlist";

import SeatMap from "./seat-allocation/3AC";
import SecondACMap from "./seat-allocation/2AC";
import FirstACMap from "./seat-allocation/1AC";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookingPage />} /> {/* Default home page */}
        <Route path="/trainbooking" element={<TrainBooking />} />
        <Route path="/1ac" element={<FirstACMap />} />
        <Route path="/2ac" element={<SecondACMap />} />
        <Route path="/3ac" element={<SeatMap />} />
        {/* <Route path="*" element={<NotFound />} />  */}
      </Routes>
    </Router>
  );
  
}

export default App;