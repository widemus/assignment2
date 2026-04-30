"use client"
import { useState } from 'react'

// regex pattern for the mobile phone number
const numberPattern = /^08[3-9]\d{7}$/

// data for movie showtimes and display names
const movieTimeSlots = {
    "movie1": ["10:00 AM", "1:00 PM", "4:00 PM"],
    "movie2": ["11:00 AM", "2:00 PM", "5:00 PM"],
    "movie3": ["12:00 PM", "3:00 PM", "6:00 PM"],
}
const movieNames = {
    "movie1": "Movie 1",
    "movie2": "Movie 2",
    "movie3": "Movie 3",
}
const moviesDate = "01/04/2026"

export default function BookingForm() {
    // state variables to control form inputs and display messages
    const [selectedMovie, setSelectedMovie] = useState("")
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")

    // state variables for displaying feedback to the user
    const [error, setError] = useState("")
    const [confirmedBooking, setConfirmedBooking] = useState(null)

    // handles form submission, performs validation, and sets confirmation state
    const handleSubmit = (e) => {
        e.preventDefault();

        // validate that all fields are filled
        if (!selectedMovie || !selectedTimeSlot || !phoneNumber) {
            setError("Please fill in all fields.")
            return;
        }
        // validate phone number
        if (!numberPattern.test(phoneNumber)) {
            setError("Please enter a valid phone number.")
            return;
        }

        // clear any previous errors and save the booking copy to prevent changes after confirmation
        setError("")
        setConfirmedBooking({
            movie: selectedMovie,
            timeSlot: selectedTimeSlot,
            phone: phoneNumber,
        })
    }
    
    return (
        <form className="form" onSubmit={handleSubmit}>
            <h1 className="heading">Book<br />Tickets</h1>
            
            <div className="field">
                <label className="label">Film</label>
                <div className="selectWrapper">
                    {/* controlled select for movies */}
                    <select className="select" value={selectedMovie} onChange={(e) => setSelectedMovie(e.target.value)}>
                        <option value="">Select a Movie</option>
                        <option value="movie1">Movie 1</option>
                        <option value="movie2">Movie 2</option>
                        <option value="movie3">Movie 3</option>
                    </select>
                </div>
            </div>
            
            <div className="field">
                <label className="label">Showtime</label>
                <div className="selectWrapper">
                    {/* controlled select for showtimes, disabled if no movie is selected */}
                    <select className="select" disabled={!selectedMovie} value={selectedTimeSlot} onChange={(e) => setSelectedTimeSlot(e.target.value)}>
                        <option value="">Select a Time Slot</option>
                        {movieTimeSlots[selectedMovie]?.map((time) => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="field">
                <label className="label">Phone Number</label>
                {/* controlled text input for phone number */}
                <input type="text" className="input" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="08X XXX XXXX" />
            </div>

            {/* submit button, disabled once a booking is confirmed */}
            <button type="submit" className="button" disabled={confirmedBooking !== null}>Book Tickets</button>
            
            {/* conditional rendering for error and confirmation messages */}
            {error && <p className="error">{error}</p>}
            {confirmedBooking && 
                <p className="confirmation">
                    <span className="confirmationHighlight">
                        {movieNames[confirmedBooking.movie]} &mdash; {moviesDate} &mdash; {confirmedBooking.timeSlot}
                    </span>
                    <br />
                    Your booking is confirmed. A text has been sent to {confirmedBooking.phone}.
                </p>
            }
        </form>
    )
}
