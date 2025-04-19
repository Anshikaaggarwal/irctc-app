"use client"
import { useState } from "react"
import { UserIcon } from "lucide-react"
import "./3AC.css"

export default function SeatMap() {
  const AVAILABLE = "available"
  const SELECTED = "selected"
  const OCCUPIED_MALE = "occupied-male"
  const OCCUPIED_FEMALE = "occupied-female"

  const initialSeatLayout = [
    [1, 2, 3, null, 7],
    [4, 5, 6, null, 8],
    [9, 10, 11, null, 15],
    [12, 13, 14, null, 16],
    [17, 18, 19, null, 23],
    [20, 21, 22, null, 24],
    [25, 26, 27, null, 31],
    [28, 29, 30, null, 32],
    [33, 34, 35, null, 39],
    [36, 37, 38, null, 40],
    [41, 42, 43, null, 47],
    [44, 45, 46, null, 48],
    [49, 50, 51, null, 55],
    [52, 53, 54, null, 56],
    [57, 58, 59, null, 63],
    [60, 61, 62, null, 64],
    [65, 66, 67, null, 71],
    [68, 69, 70, null, 72],
  ]

  function getSeatType(seatNumber) {
    if (!seatNumber) return "N/A"
    if ([1, 4, 9, 12, 17, 20, 25, 28, 33, 36, 41, 44, 49, 52, 57, 60, 65, 68].includes(seatNumber)) return "LOWER"
    if ([2, 5, 10, 13, 18, 21, 26, 29, 34, 37, 42, 45, 50, 53, 58, 61, 66, 69].includes(seatNumber)) return "MIDDLE"
    if ([3, 6, 11, 14, 19, 22, 27, 30, 35, 38, 43, 46, 51, 54, 59, 62, 67, 70].includes(seatNumber)) return "UPPER"
    if ([7, 15, 23, 31, 39, 47, 55, 63, 71].includes(seatNumber)) return "SIDE LOWER"
    if ([8, 16, 24, 32, 40, 48, 56, 64, 72].includes(seatNumber)) return "SIDE UPPER"
    return "UNKNOWN"
  }

  function generateInitialSeatStatus() {
    const statusMap = {}
    initialSeatLayout.forEach((row) => {
      row.forEach((seatNumber) => {
        if (seatNumber) {
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

  function getSeatStyle(seatNumber, status) {
    let baseClass = ""
    if (status === AVAILABLE) baseClass = "seat-available"
    if (status === SELECTED) baseClass = "seat-selected"
    if (status === OCCUPIED_MALE) baseClass = "seat-occupied-male"
    if (status === OCCUPIED_FEMALE) baseClass = "seat-occupied-female"

    let extraClass = ""
    if (highlightType !== "none" && getSeatType(seatNumber) === highlightType) {
      extraClass = " seat-highlighted"
    }

    let icon = null
    if (status === OCCUPIED_MALE) {
      icon = <UserIcon className="seat-icon seat-icon-male" />
    } else if (status === OCCUPIED_FEMALE) {
      icon = <UserIcon className="seat-icon seat-icon-female" />
    }

    return { className: `${baseClass}${extraClass}`, icon }
  }

  return (
    <div className="seat-map-container">
      {/* {hoveredSeat && (
        <div className="seat-tooltip" style={{ top: tooltipPos.y - 40, left: tooltipPos.x + 10 }}>
          <p>
            Seat {hoveredSeat} - {getSeatType(hoveredSeat)}
          </p>
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
            />{" "}
            Male
          </label>
          <label className="female-label">
            <input
              type="radio"
              value="female"
              checked={passengerGender === "female"}
              onChange={() => setPassengerGender("female")}
            />{" "}
            Female
          </label>
        </div>
        {selectedSeat && (
          <p className="selected-seat-info">
            Selected Seat: {selectedSeat} ({getSeatType(selectedSeat)})
          </p>
        )}
        <button
          className={`confirm-button ${!selectedSeat || !passengerName.trim() ? "disabled" : ""}`}
          disabled={!selectedSeat || !passengerName.trim()}
          onClick={handleConfirm}
        >
          Confirm
        </button>

        {isConfirmed && (
          <div className="confirmation-message">
            Booking Confirmed for {passengerName} ({passengerGender}) - Seat {selectedSeat} ({getSeatType(selectedSeat)})
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
            <option value="MIDDLE">MIDDLE</option>
            <option value="UPPER">UPPER</option>
            <option value="SIDE LOWER">SIDE LOWER</option>
            <option value="SIDE UPPER">SIDE UPPER</option>
          </select>
        </div>
      </div>

      <div className="seat-grid">
        {initialSeatLayout.map((row, i) => (
          <div key={i}>
            <div className="seat-row">
              {row.map((seatNumber, j) => (
                <div key={j} className="seat-cell">
                  {seatNumber ? (
                    <div
                      className={`seat ${getSeatStyle(seatNumber, seatStatus[seatNumber]).className}`}
                      onClick={() => handleSeatClick(seatNumber)}
                      onMouseEnter={(e) => {
                        setHoveredSeat(seatNumber)
                        setTooltipPos({ x: e.clientX, y: e.clientY })
                      }}
                      onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}
                      onMouseLeave={() => setHoveredSeat(null)}
                    >
                      <div className="seat-number">
                        {seatNumber}
                        <br />
                        <span className="seat-type">{getSeatType(seatNumber)}</span>
                      </div>
                      {getSeatStyle(seatNumber, seatStatus[seatNumber]).icon}
                    </div>
                  ) : (
                    <div className="seat-empty" />
                  )}
                </div>
              ))}
            </div>
            {(i + 1) % 2 === 0 && <hr className="seat-divider" />}
          </div>
        ))}
      </div>
    </div>
  )
}
