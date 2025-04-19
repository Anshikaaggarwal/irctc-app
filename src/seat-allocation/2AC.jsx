"use client"
import { useState } from "react"
import { UserIcon } from "lucide-react"
import "./2AC.css"

export default function SecondACMap() {
  const AVAILABLE = "available"
  const SELECTED = "selected"
  const OCCUPIED_MALE = "occupied-male"
  const OCCUPIED_FEMALE = "occupied-female"

  const initialSeatLayout = [
    [1, 2, null, 5],
    [3, 4, null, 6],
    [7, 8, null, 11],
    [9, 10, null, 12],
    [13, 14, null, 17],
    [15, 16, null, 18],
    [19, 20, null, 23],
    [21, 22, null, 24],
    [25, 26, null, 29],
    [27, 28, null, 30],
    [31, 32, null, 35],
    [33, 34, null, 36],
    [37, 38, null, 41],
    [39, 40, null, 42],
    [43, 44, null, 47],
    [45, 46, null, 48],
  ]

  function getSeatType(seatNumber) {
    if (!seatNumber) return "N/A"
    if ([1, 3, 7, 9, 13, 15, 19, 21, 25, 27, 31, 33, 37, 39, 43, 45].includes(seatNumber)) return "LOWER"
    if ([2, 4, 8, 10, 14, 16, 20, 22, 26, 28, 32, 34, 38, 40, 44, 46].includes(seatNumber)) return "UPPER"
    if ([5, 11, 17, 23, 29, 35, 41, 47].includes(seatNumber)) return "SIDE LOWER"
    if ([6, 12, 18, 24, 30, 36, 42, 48].includes(seatNumber)) return "SIDE UPPER"
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
      <h1 className="coach-title">2nd AC Coach</h1>

      {/* {hoveredSeat && (
        <div className="seat-tooltip" style={{ top: tooltipPos.y + 10, left: tooltipPos.x + 10 }}>
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
