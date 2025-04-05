import React, { useState } from "react";
import "./Trainlist.css"; // External CSS for styling

import { FaCalendarAlt } from "react-icons/fa";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { FaWifi, FaBed, FaWheelchair } from "react-icons/fa";

const TrainBooking = () => {

  const [selectedDate, setSelectedDate] = useState(new Date(2024, 7, 18)); // Initial date (Aug 18, 2024)

  const changeDate = (days) => {
    setSelectedDate((prevDate) => new Date(prevDate.setDate(prevDate.getDate() + days)));
  };

  const generateDates = () => {
    return Array.from({ length: 4 }, (_, i) => {
      const newDate = new Date(selectedDate);
      newDate.setDate(selectedDate.getDate() + i);
      return newDate;
    });
  };

  const trains = [
    {
              name: "TRIVANDRUM MAIL (12623)",
              departure: { time: "08:45", day: "Sun", station: "MAS", location: "Chennai" },
              arrival: { time: "16:45", day: "Sun", station: "CBE", location: "Coimbatore" },
              duration: "8 Hours",
              fare: "₹1678",
              status: "AVAILABLE",
              classes: ["Sleeper", "3A", "2A","1A"]
            },
            {
              name: "Coromandel Express (13623)",
              departure: { time: "06:55", day: "Mon", station: "MAS", location: "Chennai" },
              arrival: { time: "12:45", day: "Mon", station: "CBE", location: "Coimbatore" },
              duration: "7 Hours 15 Mins",
              fare: "₹2378",
              status: "PQWL16/WL48",
              classes: ["Sleeper", "3A", "2A","1A"]
            }
          ];



          const [selectedTime, setSelectedTime] = useState("6AM - 12 Noon");
  const [selectedStations, setSelectedStations] = useState(["MGR CHENNAI CTL - MAS", "COIMBATORE JN - CBE"]);

  const timeSlots = ["Before 6AM", "6AM - 12 Noon", "12 Noon - 6 PM", "After 6PM"];
  const amenities = [
    { icon: <FaWifi />, label: "WiFi" },
    { icon: <FaWheelchair />, label: "Accessible" },
    { icon: <FaBed />, label: "Sleeping" },
  ];
  const fromStations = [
    "MGR CHENNAI CTL - MAS",
    "CHENNAI EGMORE - MS",
    "CHENNAI CHETPAT - MSC",
    "CHENNAI PARK - MPK",
    "CHENNAI FORT - MSF",
    "CHENNAI BEACH - MSB",
  ];
  const toStations = ["COIMBATORE NRTH - CBF", "COIMBATORE JN - CBE"];

  const handleStationChange = (station) => {
    setSelectedStations((prev) =>
      prev.includes(station) ? prev.filter((s) => s !== station) : [...prev, station]
    );
  };




  const timeSlotsperiod = [
    { label: "00:00 - 06:00", period: "Early Morning" },
    { label: "06:00 - 12:00", period: "Morning" },
    { label: "12:00 - 18:00", period: "Mid Day" },
    { label: "18:00 - 24:00", period: "Night" },
  ];

  const [selectedDeparture, setSelectedDeparture] = useState([]);
  const [selectedArrival, setSelectedArrival] = useState([]);
  const [departureRange, setDepartureRange] = useState([0, 24]);
  const [arrivalRange, setArrivalRange] = useState([0, 24]);

  const handleSelectAll = (type) => {
    if (type === "departure") {
      setSelectedDeparture(timeSlots.map((slot) => slot.label));
    } else {
      setSelectedArrival(timeSlots.map((slot) => slot.label));
    }
  };

  const handleDeselectAll = (type) => {
    if (type === "departure") {
      setSelectedDeparture([]);
    } else {
      setSelectedArrival([]);
    }
  };

  const toggleSelection = (type, slot) => {
    if (type === "departure") {
      setSelectedDeparture((prev) =>
        prev.includes(slot)
          ? prev.filter((s) => s !== slot)
          : [...prev, slot]
      );
    } else {
      setSelectedArrival((prev) =>
        prev.includes(slot)
          ? prev.filter((s) => s !== slot)
          : [...prev, slot]
      );
    }
  };
        
          
            
              

  return (
    <div className="container">
        <header className="header">
                <h1>Train Booking</h1>
              </header>
        
              <section className="search-bar">
                <input type="text" placeholder="From: Chennai" />
                <input type="text" placeholder="To: Coimbatore" />
                <input type="date" />
                <select type="text" placeholder="Class" >
                  <option value="all">All Classes</option>
                  <option value="sleeper">Sleeper</option>
                  <option value="1A">1A</option>
                  <option value="2A">2A</option>
                  <option value="3A">3A</option>               
                  <option value="Chair Car">Chair Car</option>               
                </select>
                <select type="text" placeholder="Quota" >
                  <option value="general">General</option>
                  <option value="Tatkal">Tatkal</option>
                  <option value="PTatkal">Premium Tatkal</option>
                  <option value="ladies">Ladies</option>
                  <option value="lb-sc">Lower Berth/Senior Citizen</option>
                  <option value="duty">Duty Pass</option>               
                  <option value="pwd">Person with Disability</option>               
                </select>
                
                <button className="search-button">Modify Search</button>
              </section>

              
      
      {/* <div className="date-box">
        <button className="arrow-btn" onClick={() => changeDate(-1)}>
          <MdKeyboardArrowLeft size={24} color="white" />
        </button>
        <FaCalendarAlt size={16} color="white" />
        <span className="date-text">
          {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit", year: "numeric" })}
        </span>
        <button className="arrow-btn" onClick={() => changeDate(1)}>
          <MdKeyboardArrowRight size={24} color="white" />
        </button>
      </div> */}

      <div className="pageside">

    <div className="leftside">
    <div className="filter-container">
      <h3>Preferred Time Zone</h3>
      <div className="time-filters">
        {timeSlots.map((slot) => (
          <label key={slot} className="checkbox-label">
            <input
              type="checkbox"
              checked={selectedTime === slot}
              onChange={() => setSelectedTime(slot)}
            />
            {slot}
          </label>
        ))}
      </div>

      {/* <h3>Amenities</h3>
      <div className="amenities">
        {amenities.map((amenity, index) => (
          <div key={index} className="amenity">
            {amenity.icon}
          </div>
        ))}
      </div> */}

<div className="time-filter-container">
      {/* Departure Time Section */}
      <div className="time-section">
        <div className="header2">
          <h3>DEPARTURE TIME</h3>
          <button onClick={() => handleSelectAll("departure")}>Select All</button>
        </div>
        <div className="time-boxes">
          {timeSlotsperiod.map((slot) => (
            <div
              key={slot.label}
              className={`time-slot ${
                selectedDeparture.includes(slot.label) ? "selected" : ""
              }`}
              onClick={() => toggleSelection("departure", slot.label)}
            >
              <span>{slot.label}</span>
              <span className="period">{slot.period}</span>
            </div>
          ))}
        </div>
        <input
          type="range"
          min="0"
          max="24"
          value={departureRange[1]}
          className="slider"
          onChange={(e) => setDepartureRange([0, e.target.value])}
        />
        <div className="range-labels">
          <span>00:00 Hrs</span>
          <span>24:00 Hrs</span>
        </div>
      </div>

      {/* Arrival Time Section */}
      <div className="time-section">
        <div className="header2">
          <h3>ARRIVAL TIME</h3>
          <button onClick={() => handleSelectAll("arrival")}>Select All</button>
        </div>
        <div className="time-boxes">
          {timeSlotsperiod.map((slot) => (
            <div
              key={slot.label}
              className={`time-slot ${
                selectedArrival.includes(slot.label) ? "selected" : ""
              }`}
              onClick={() => toggleSelection("arrival", slot.label)}
            >
              <span>{slot.label}</span>
              <span className="period">{slot.period}</span>
            </div>
          ))}
        </div>
        <input
          type="range"
          min="0"
          max="24"
          value={arrivalRange[1]}
          className="slider"
          onChange={(e) => setArrivalRange([0, e.target.value])}
        />
        <div className="range-labels">
          <span>00:00 Hrs</span>
          <span>24:00 Hrs</span>
        </div>
      </div>
    </div>

      <h3>From Stations</h3>
      <div className="stations">
        {fromStations.map((station) => (
          <label key={station} className="checkbox-label">
            <input
              type="checkbox"
              checked={selectedStations.includes(station)}
              onChange={() => handleStationChange(station)}
            />
            {station}
          </label>
        ))}
      </div>


      <h3>To Stations</h3>
      <div className="stations">
        {toStations.map((station) => (
          <label key={station} className="checkbox-label">
            <input
              type="checkbox"
              checked={selectedStations.includes(station)}
              onChange={() => handleStationChange(station)}
            />
            {station}
          </label>
        ))}
      </div>
    </div>
    </div>

    <div className="rightside">

    <p className="results-info">10 of 10 results shown</p>

      <div className="train-info"></div>


      <div className="date-selector">
        <FaCalendarAlt size={18} className="calendar-icon" />
        <button className="arrow-btn" onClick={() => changeDate(-1)}>
          <MdKeyboardArrowLeft size={22} />
        </button>

        {/* {generateDates().map((date, index) => (
          <div key={index} className={date-item ${...index === 0 ? "selected" : ""}}>
            <span className="day">{date.toLocaleDateString("en-US", { weekday: "long" })}</span>
            <span className="date">{date.toLocaleDateString("en-US", { day: "2-digit", month: "short" })}</span>
          </div>
        ))}; */}

{generateDates().map((date, index) => (
  <div key={index} className={`date-item ${index === 0 ? "selected" : ""}`}>
    <span className="day">{date.toLocaleDateString("en-US", { weekday: "long" })}</span>
    <span className="date">{date.toLocaleDateString("en-US", { day: "2-digit", month: "short" })}</span>
  </div>
))}


        <button className="arrow-btn" onClick={() => changeDate(1)}>
          <MdKeyboardArrowRight size={22} />
        </button>
      </div>

          


      {trains.map((train, index) => (
        <div className="train-card" key={index}>
          {/* Train Name and Number */}
          <div className="train-info">
            <span className="train-name">{train.name}</span>
            <br />
            <span className="train-number">Train No: {train.number}</span>
          </div>

          {/* Departure */}
          <div className="time-info">
            <span className="train-time">{train.departure.time}, <span className="train-day">{train.departure.day}</span></span>
            
            <br />
            <br />
            <span className="train-station">{train.departure.station}, <span className="train-location">{train.departure.location}</span></span>
            <br />
            
          </div>

          {/* Duration with Red Line */}

          <div className="linendur">

          <div className="train-duration">{train.duration}</div>

          <div className="train-duration-line"></div>
          

          </div>

          {/* Arrival */}
          
            <div className="datetime">
            <span className="train-time">{train.arrival.time}, <span className="train-day">{train.arrival.day}</span></span>
           
            
            <br />
           
            <br />
            
            <span className="train-station">{train.arrival.station}, <span className="train-location">{train.arrival.location}</span></span>
            <br />
            
          </div>

          {/* Class Selection */}
          <div className="class-selection">
            <select>
              {train.classes.map((cls, i) => (
                <option key={i}>{cls}</option>
              ))}
            </select>
          </div>

          <div className="train-price">
            <h3>AVAILABALE-20</h3>
          </div>

          <div className="train-price">
            <h2>₹ 1620</h2>
          </div>

          {/* Availability Button */}
          <button className="availability-button">Availability</button>
        </div>
      
      ))}
      </div>
      </div>
    </div>
  );
};

export default TrainBooking;