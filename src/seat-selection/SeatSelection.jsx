// import React, { useState } from "react";
// import "./styles.css";

// const SeatSelection = () => {
//   const [userType, setUserType] = useState(null);
//   const [selectedCoach, setSelectedCoach] = useState(null);
//   const [selectedSeat, setSelectedSeat] = useState(null);

//   const seats = {
//     "1AC": [
//       { id: 1, type: "female", occupied: false },
//       { id: 2, type: "male", occupied: false },
//     ],
//     "2AC": [
//       { id: 3, type: "divyang", occupied: false },
//       { id: 4, type: "elderly", occupied: false },
//       { id: 5, type: "available", occupied: false },
//       { id: 6, type: "female", occupied: true },
//     ],
//     "3AC": [
//       { id: 7, type: "available", occupied: false },
//       { id: 8, type: "male", occupied: true },
//       { id: 9, type: "available", occupied: false },
//     ],
//   };

//   const handleSeatSelect = (seat) => {
//     if (!seat.occupied) {
//       setSelectedSeat(seat.id);
//     }
//   };

//   return (
//     <div className="seat-selection">
//       <h2>Select Your Seat</h2>
//       <div className="user-selection">
//         <button onClick={() => setUserType("male")}>Male</button>
//         <button onClick={() => setUserType("female")}>Female</button>
//         <button onClick={() => setUserType("divyang")}>Divyang</button>
//         <button onClick={() => setUserType("elderly")}>Elderly</button>
//       </div>

//       {userType && (
//         <div className="coach-selection">
//           <button 
//             className={selectedCoach === "1AC" ? "selected-coach" : ""} 
//             onClick={() => setSelectedCoach("1AC")}
//           >
//             1AC
//           </button>
//           <button 
//             className={selectedCoach === "2AC" ? "selected-coach" : ""} 
//             onClick={() => setSelectedCoach("2AC")}
//           >
//             2AC
//           </button>
//           <button 
//             className={selectedCoach === "3AC" ? "selected-coach" : ""} 
//             onClick={() => setSelectedCoach("3AC")}
//           >
//             3AC
//           </button>
//         </div>
//       )}

//       {selectedCoach && (
//         <div className="coach">
//           <h3>{selectedCoach} Coach</h3>
//           <div className="seat-container">
//             {seats[selectedCoach].map((seat) => (
//               <div
//                 key={seat.id}
//                 className={`seat ${seat.occupied ? "occupied" : "available"} 
//                   ${seat.type === "female" ? "female-seat" : ""} 
//                   ${seat.type === "divyang" ? "divyang-seat" : ""} 
//                   ${selectedSeat === seat.id ? "selected" : ""}`}
//                 onClick={() => handleSeatSelect(seat)}
//               >
//                 <span className="seat-icon">🪑</span>
//                 {seat.id}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SeatSelection;


import React, { useState } from "react";
import  "./SeatSelection.css"

const SeatSelection = () => {
  const [passenger, setPassenger] = useState({
    name: "",
    age: "",
    gender: "",
    concession: "",
    coach: "",
    seat: null,
  });

  const seats = {
    "1AC": [
      { id: 1, type: "female", occupied: false },
      { id: 2, type: "male", occupied: false },
    ],
    "2AC": [
      { id: 3, type: "divyang", occupied: false },
      { id: 4, type: "elderly", occupied: false },
      { id: 5, type: "available", occupied: false },
      { id: 6, type: "female", occupied: true },
    ],
    "3AC": [
      { id: 7, type: "available", occupied: false },
      { id: 8, type: "male", occupied: true },
      { id: 9, type: "available", occupied: false },
    ],
  };

  const handleSeatSelect = (seat) => {
    if (!seat.occupied) {
      setPassenger((prev) => ({ ...prev, seat: seat.id }));
    }
  };

  return (
    <div className="seat-selection">
      <h2>Passenger Information</h2>
      <form className="passenger-form">
        <label>Name:
          <input
            type="text"
            value={passenger.name}
            onChange={(e) => setPassenger({ ...passenger, name: e.target.value })}
          />
        </label>
        <label>Age:
          <input
            type="number"
            value={passenger.age}
            onChange={(e) => setPassenger({ ...passenger, age: e.target.value })}
          />
        </label>
        <label>Gender:
          <select
            value={passenger.gender}
            onChange={(e) => setPassenger({ ...passenger, gender: e.target.value })}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label>Concession:
          <select
            value={passenger.concession}
            onChange={(e) => setPassenger({ ...passenger, concession: e.target.value })}
          >
            <option value="">None</option>
            <option value="divyang">Divyang</option>
            <option value="elderly">Elderly</option>
          </select>
        </label>
      </form>

      <h3>Select Coach</h3>
      <div className="coach-selection">
        {Object.keys(seats).map((coach) => (
          <label key={coach}>
            <input
              type="radio"
              name="coach"
              value={coach}
              checked={passenger.coach === coach}
              onChange={(e) => setPassenger({ ...passenger, coach: e.target.value })}
            />
            {coach}
          </label>
        ))}
      </div>

      {passenger.coach && (
        <div className="coach">
          <h3>{passenger.coach} Coach</h3>
          <div className="seat-container">
            {seats[passenger.coach].map((seat) => (
              <div
                key={seat.id}
                className={`seat ${seat.occupied ? "occupied" : "available"} 
                  ${seat.type === "female" ? "female-seat" : ""} 
                  ${seat.type === "divyang" ? "divyang-seat" : ""} 
                  ${passenger.seat === seat.id ? "selected" : ""}`}
                onClick={() => handleSeatSelect(seat)}
              >
                <span className="seat-icon">🪑</span>
                {seat.id}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;
