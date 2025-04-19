"use client"
import { useState } from "react"
import { UserIcon } from "lucide-react"
import "./1AC.css"

export default function FirstACMap() {
  const AVAILABLE = "available"
  const SELECTED = "selected"
  const OCCUPIED_MALE = "occupied-male"
  const OCCUPIED_FEMALE = "occupied-female"

//   const initialSeatLayout = [
//     [[1, "LOWER"], [2, "UPPER"], null, [5, "LOWER"]],
//     [[3, "LOWER"], [4, "UPPER"], null, [6, "UPPER"]],
//     [[7, "LOWER"], [8, "UPPER"], null, [11, "LOWER"]],
//     [[9, "LOWER"], [10, "UPPER"], null, [12, "UPPER"]],
//     [[13, "LOWER"], [14, "UPPER"], null, [17, "LOWER"]],
//     [[15, "LOWER"], [16, "UPPER"], null, [18, "UPPER"]],
//     [[19, "LOWER"], [20, "UPPER"], null, [23, "LOWER"]],
//     [[21, "LOWER"], [22, "UPPER"], null, [24, "UPPER"]],
//     [[25, "LOWER"], [26, "UPPER"], null, [29, "LOWER"]],
//     [[27, "LOWER"], [28, "UPPER"], null, [30, "UPPER"]],
//     [[31, "LOWER"], [32, "UPPER"], null, [35, "LOWER"]],
//     [[33, "LOWER"], [34, "UPPER"], null, [36, "UPPER"]],
//   ]
  const initialSeatLayout = [
    [[1, "LOWER"], [2, "UPPER"]],
    [[3, "LOWER"], [4, "UPPER"]],
    [[7, "LOWER"], [8, "UPPER"]],
    [[9, "LOWER"], [10, "UPPER"]],
    [[13, "LOWER"], [14, "UPPER"]],
    [[15, "LOWER"], [16, "UPPER"]],
    [[19, "LOWER"], [20, "UPPER"]],
    [[21, "LOWER"], [22, "UPPER"]],
    [[25, "LOWER"], [26, "UPPER"]],
    [[27, "LOWER"], [28, "UPPER"]],
    [[31, "LOWER"], [32, "UPPER"]],
    [[33, "LOWER"], [34, "UPPER"]],
  ]

  function generateInitialSeatStatus() {
    const statusMap = {}
    initialSeatLayout.forEach((row) => {
      row.forEach((seatData) => {
        if (seatData) {
          const seatNumber = seatData[0]
          const random = Math.random()
          if (random < 0.15) {
            statusMap[seatNumber] = OCCUPIED_MALE
          } else if (random < 0.3) {
            statusMap[seatNumber] = OCCUPIED_FEMALE
          } else {
            statusMap[seatNumber] = AVAILABLE
          }
        }
      })
    })
    return statusMap
  }

  const [seatStatus, setSeatStatus] = useState(generateInitialSeatStatus())
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [passengerName, setPassengerName] = useState("")
  const [passengerGender, setPassengerGender] = useState("male")
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [hoveredSeat, setHoveredSeat] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [highlightType, setHighlightType] = useState("none")

  function handleSeatClick(seatNumber) {
    const currentStatus = seatStatus[seatNumber]
    if (currentStatus === OCCUPIED_MALE || currentStatus === OCCUPIED_FEMALE) return

    setSeatStatus((prev) => {
      const newStatus = { ...prev }
      if (selectedSeat) newStatus[selectedSeat] = AVAILABLE
      newStatus[seatNumber] = SELECTED
      return newStatus
    })
    setSelectedSeat(seatNumber)
    setIsConfirmed(false)
  }

  function handleConfirm() {
    if (selectedSeat && passengerName.trim()) {
      setSeatStatus((prev) => {
        const newStatus = { ...prev }
        newStatus[selectedSeat] = passengerGender === "male" ? OCCUPIED_MALE : OCCUPIED_FEMALE
        return newStatus
      })
      setIsConfirmed(true)
    }
  }

  function getSeatStyle(seatData, status) {
    if (!seatData) return { className: "", icon: null }

    const seatNumber = seatData[0]
    const seatType = seatData[1]

    let baseClass = ""
    if (status === AVAILABLE) baseClass = "seat-available"
    if (status === SELECTED) baseClass = "seat-selected"
    if (status === OCCUPIED_MALE) baseClass = "seat-occupied-male"
    if (status === OCCUPIED_FEMALE) baseClass = "seat-occupied-female"

    const typeClass = seatType === "LOWER" ? " seat-lower" : " seat-upper"

    let extraClass = ""
    if (highlightType !== "none" && seatType === highlightType) {
      extraClass = " seat-highlighted"
    }

    let icon = null
    if (status === OCCUPIED_MALE) {
      icon = <UserIcon className="seat-icon seat-icon-male" />
    } else if (status === OCCUPIED_FEMALE) {
      icon = <UserIcon className="seat-icon seat-icon-female" />
    }

    return { className: `${baseClass}${typeClass}${extraClass}`, icon }
  }

  return (
    <div className="seat-map-container">
      <h1 className="coach-title">1st AC Coach</h1>

      {/* {hoveredSeat && (
        <div className="seat-tooltip" style={{ top: tooltipPos.y + 10, left: tooltipPos.x + 10 }}>
          <p>Seat {hoveredSeat[0]} - {hoveredSeat[1]}</p>
        </div>
      )} */}

      <div className="form-container">
        <h2 className="form-title">Select Your Seat</h2>
        <input
          className="form-input"
          placeholder="Passenger name"
          value={passengerName}
          onChange={(e) => setPassengerName(e.target.value)}
        />
        <div className="gender-selection">
          <label>
            <input
              type="radio"
              value="male"
              checked={passengerGender === "male"}
              onChange={() => setPassengerGender("male")}
            /> Male
          </label>
          <label className="female-label">
            <input
              type="radio"
              value="female"
              checked={passengerGender === "female"}
              onChange={() => setPassengerGender("female")}
            /> Female
          </label>
        </div>
        {selectedSeat && <p className="selected-seat-info">Selected Seat: {selectedSeat}</p>}
        <button
          className={`confirm-button ${!selectedSeat || !passengerName.trim() ? "disabled" : ""}`}
          disabled={!selectedSeat || !passengerName.trim()}
          onClick={handleConfirm}
        >
          Confirm
        </button>

        {isConfirmed && (
          <div className="confirmation-message">
            Booking Confirmed for {passengerName} ({passengerGender}) - Seat {selectedSeat}
          </div>
        )}

        <div className="highlight-container">
          <label className="highlight-label">Highlight by type:</label>
          <select
            value={highlightType}
            onChange={(e) => setHighlightType(e.target.value)}
            className="highlight-select"
          >
            <option value="none">None</option>
            <option value="LOWER">LOWER</option>
            <option value="UPPER">UPPER</option>
          </select>
        </div>
      </div>

      <div className="first-ac-container">
        <div className="first-ac-coach">
          {initialSeatLayout.map((row, i) => (
            <div key={i} className="first-ac-row">
              <div className="first-ac-compartment">
                {row.map((seatData, j) => {
                  if (j === 2) {
                    return (
                      <div key={j} className="first-ac-corridor">
                        {i >= 6 && i <= 9 && (
                          <div className="corridor-label">
                            {i === 6 && "E"}
                            {i === 7 && "L"}
                            {i === 8 && "S"}
                            {i === 9 && "-"}
                          </div>
                        )}
                      </div>
                    )
                  }

                  const seatNumber = seatData?.[0]
                  const seatStyle = seatData ? getSeatStyle(seatData, seatStatus[seatNumber]) : {}

                  return (
                    <div key={j} className="first-ac-seat-cell">
                      {seatData ? (
                        <div
                          className={`first-ac-seat ${seatStyle.className}`}
                          onClick={() => handleSeatClick(seatNumber)}
                          onMouseEnter={(e) => {
                            setHoveredSeat(seatData)
                            setTooltipPos({ x: e.clientX, y: e.clientY })
                          }}
                          onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}
                          onMouseLeave={() => setHoveredSeat(null)}
                        >
                          <div className="first-ac-seat-number">{seatNumber}</div>
                          {seatStyle.icon}
                        </div>
                      ) : (
                        <div className="first-ac-seat-empty" />
                      )}
                    </div>
                  )
                })}
              </div>
              {(i + 1) % 2 === 0 && <hr className="first-ac-divider" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


