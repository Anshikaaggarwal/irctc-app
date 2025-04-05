"use client"

import { useState } from "react"
import { CheckCircle, Info, UserIcon as Male, UserIcon as Female } from "lucide-react"

export default function SeatMap() {
  const SEAT_STATUS = {
    AVAILABLE: "available",
    SELECTED: "selected",
    OCCUPIED_MALE: "occupied-male",
    OCCUPIED_FEMALE: "occupied-female",
  }

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

  const generateInitialSeatStatus = () => {
    const statusMap = {}
    initialSeatLayout.forEach((row) => {
      row.forEach((seatNumber) => {
        if (seatNumber) {
          const random = Math.random()
          if (random < 0.15) {
            statusMap[seatNumber] = SEAT_STATUS.OCCUPIED_MALE
          } else if (random < 0.3) {
            statusMap[seatNumber] = SEAT_STATUS.OCCUPIED_FEMALE
          } else {
            statusMap[seatNumber] = SEAT_STATUS.AVAILABLE
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

  const [occupiedSeatsInfo, setOccupiedSeatsInfo] = useState(() => {
    const info = {}
    const initialStatus = generateInitialSeatStatus()
    Object.entries(initialStatus).forEach(([seatNumber, status]) => {
      if (status === SEAT_STATUS.OCCUPIED_MALE) {
        info[seatNumber] = { name: `Passenger ${seatNumber}`, gender: "male" }
      } else if (status === SEAT_STATUS.OCCUPIED_FEMALE) {
        info[seatNumber] = { name: `Passenger ${seatNumber}`, gender: "female" }
      }
    })
    return info
  })

  const sectionLabels = {
    bottom: ["LOWER", "MIDDLE", "UPPER"],
    right: ["SIDE LOWER", "SIDE UPPER"],
  }

  const handleSeatClick = (seatNumber) => {
    const currentStatus = seatStatus[seatNumber]
    if (currentStatus === SEAT_STATUS.OCCUPIED_MALE || currentStatus === SEAT_STATUS.OCCUPIED_FEMALE) return

    if (currentStatus === SEAT_STATUS.SELECTED) {
      setSeatStatus((prev) => {
        const updated = { ...prev }
        updated[seatNumber] = SEAT_STATUS.AVAILABLE
        return updated
      })
      setSelectedSeat(null)
      return
    }

    if (selectedSeat) {
      setSeatStatus((prev) => {
        const updated = { ...prev }
        updated[selectedSeat] = SEAT_STATUS.AVAILABLE
        return updated
      })
    }

    setSeatStatus((prev) => {
      const updated = { ...prev }
      updated[seatNumber] = SEAT_STATUS.SELECTED
      return updated
    })
    setSelectedSeat(seatNumber)
    setIsConfirmed(false)
  }

  const handleConfirm = () => {
    if (selectedSeat && passengerName.trim()) {
      setSeatStatus((prev) => {
        const updated = { ...prev }
        updated[selectedSeat] =
          passengerGender === "male" ? SEAT_STATUS.OCCUPIED_MALE : SEAT_STATUS.OCCUPIED_FEMALE
        return updated
      })

      setOccupiedSeatsInfo((prev) => ({
        ...prev,
        [selectedSeat]: { name: passengerName, gender: passengerGender },
      }))

      setIsConfirmed(true)
    }
  }

  const getSeatStyle = (status, seatNumber) => {
    switch (status) {
      case SEAT_STATUS.AVAILABLE:
        return {
          className: "bg-amber-400 hover:bg-amber-300 cursor-pointer",
          icon: null,
        }
      case SEAT_STATUS.SELECTED:
        return {
          className: "bg-green-500 hover:bg-green-400 cursor-pointer",
          icon: null,
        }
      case SEAT_STATUS.OCCUPIED_MALE:
        return {
          className: "bg-blue-400 cursor-not-allowed",
          icon: <Male className="w-3 h-3 text-blue-800 absolute top-0.5 right-0.5" />,
        }
      case SEAT_STATUS.OCCUPIED_FEMALE:
        return {
          className: "bg-pink-400 cursor-not-allowed",
          icon: <Female className="w-3 h-3 text-pink-800 absolute top-0.5 right-0.5" />,
        }
      default:
        return {
          className: "bg-amber-400",
          icon: null,
        }
    }
  }

  const [hoveredSeat, setHoveredSeat] = useState(null)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mb-6">
        <h1 className="text-2xl font-bold mb-4">Select Your Seat</h1>

        {isConfirmed ? (
          <div className="bg-green-100 p-4 rounded-lg mb-4">
            <div className="flex items-center mb-2">
              <CheckCircle className="text-green-600 mr-2" />
              <h2 className="text-lg font-semibold text-green-800">Booking Confirmed!</h2>
            </div>
            <p className="mb-1">
              <span className="font-medium">Passenger:</span> {passengerName}
            </p>
            <p className="mb-1">
              <span className="font-medium">Gender:</span> {passengerGender === "male" ? "Male" : "Female"}
            </p>
            <p>
              <span className="font-medium">Seat Number:</span> {selectedSeat}
            </p>
            <button
              onClick={() => {
                setIsConfirmed(false)
                setSeatStatus((prev) => {
                  const updated = { ...prev }
                  updated[selectedSeat] = SEAT_STATUS.SELECTED
                  return updated
                })
              }}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Edit Booking
            </button>
          </div>
        ) : (
          <div className="mb-4">
            <div className="mb-3">
              <label htmlFor="passengerName" className="block text-sm font-medium mb-1">
                Passenger Name
              </label>
              <input
                type="text"
                id="passengerName"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-400 focus:outline-none"
                placeholder="Enter passenger name"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Gender</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={passengerGender === "male"}
                    onChange={() => setPassengerGender("male")}
                    className="mr-1.5"
                  />
                  <Male className="w-4 h-4 text-blue-600 mr-1" />
                  Male
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={passengerGender === "female"}
                    onChange={() => setPassengerGender("female")}
                    className="mr-1.5"
                  />
                  <Female className="w-4 h-4 text-pink-600 mr-1" />
                  Female
                </label>
              </div>
            </div>

            {selectedSeat && (
              <div className="mt-2 text-sm">
                Selected Seat: <span className="font-bold">{selectedSeat}</span>
              </div>
            )}
          </div>
        )}

        {/* Seat legend */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-amber-400 rounded-sm mr-1"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-sm mr-1"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-400 rounded-sm mr-1"></div>
            <Male className="w-3 h-3 text-blue-800 mr-1" />
            <span>Male</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-pink-400 rounded-sm mr-1"></div>
            <Female className="w-3 h-3 text-pink-800 mr-1" />
            <span>Female</span>
          </div>
        </div>

        {hoveredSeat && occupiedSeatsInfo[hoveredSeat] && (
          <div className="bg-gray-800 text-white p-2 rounded text-xs mb-3">
            <p>
              <strong>Seat {hoveredSeat}:</strong> {occupiedSeatsInfo[hoveredSeat].name}
            </p>
            <p>Gender: {occupiedSeatsInfo[hoveredSeat].gender === "male" ? "Male" : "Female"}</p>
          </div>
        )}
      </div>

      <div className="relative bg-gray-200 border border-gray-400 rounded-lg p-4 w-[280px]">
        <div className="absolute top-0 left-4 right-4 h-1 bg-gray-400"></div>

        <div className="pt-4 pb-8">
          {initialSeatLayout.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex justify-between mb-2">
              {row.map((seatNumber, seatIndex) => (
                <div key={`seat-${rowIndex}-${seatIndex}`} className="relative">
                  {seatNumber ? (
                    <div
                      className={`w-10 h-8 flex items-center justify-center 
                                border border-amber-500 rounded-sm 
                                text-xs font-semibold shadow-md transition-colors relative
                                ${getSeatStyle(seatStatus[seatNumber], seatNumber).className}
                                ${seatIndex === 4 ? "ml-4" : ""}`}
                      onClick={() => handleSeatClick(seatNumber)}
                      onMouseEnter={() => setHoveredSeat(seatNumber)}
                      onMouseLeave={() => setHoveredSeat(null)}
                    >
                      {seatNumber}
                      {getSeatStyle(seatStatus[seatNumber], seatNumber).icon}
                    </div>
                  ) : (
                    <div className="w-10 h-8"></div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4">
          {sectionLabels.bottom.map((label, index) => (
            <div key={`bottom-label-${index}`} className="text-[8px] font-bold rotate-90 origin-center">
              {label}
            </div>
          ))}
        </div>

        <div className="absolute right-0 top-1/3 flex flex-col items-end pr-1">
          <div className="text-[8px] font-bold mb-20">{sectionLabels.right[0]}</div>
          <div className="text-[8px] font-bold">{sectionLabels.right[1]}</div>
        </div>
      </div>

      {!isConfirmed && (
        <div className="mt-6">
          <button
            onClick={handleConfirm}
            disabled={!selectedSeat || !passengerName.trim()}
            className={`px-6 py-2 rounded-md font-medium ${
              selectedSeat && passengerName.trim()
                ? "bg-amber-500 hover:bg-amber-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } transition-colors`}
          >
            Confirm Selection
          </button>
        </div>
      )}

      <div className="mt-4 flex items-center text-sm text-gray-600">
        <Info className="w-4 h-4 mr-1" />
        <span>Hover over an occupied seat to see passenger details</span>
      </div>
    </div>
  )
}

