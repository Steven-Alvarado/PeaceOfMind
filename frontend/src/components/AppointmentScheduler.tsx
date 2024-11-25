import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";

const AppointmentScheduler = ({ user }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get(`/api/therapists/${user.id}/availability`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAvailableSlots(response.data.slots);
      } catch (error) {
        console.error("Failed to fetch slots:", error);
      }
    };
    fetchSlots();
  }, [user.id]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleAppointmentBooking = async () => {
    try {
      await axios.post(
        "/api/appointments",
        {
          student_id: user.id,
          therapist_id: selectedSlot.therapist_id,
          appointment_date: selectedSlot.date,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      alert("Appointment booked successfully!");
    } catch (error) {
      console.error("Failed to book appointment:", error);
    }
  };

  return (
    <div>
      <h1>Schedule Appointment</h1>
      <Calendar onChange={setSelectedDate} value={selectedDate} />
      <div>
        <h2>Available Slots</h2>
        {availableSlots
          .filter((slot) => slot.date === selectedDate.toISOString().split("T")[0])
          .map((slot) => (
            <button key={slot.id} onClick={() => handleSlotSelect(slot)}>
              {slot.time}
            </button>
          ))}
      </div>
      {selectedSlot && (
        <div>
          <h2>Confirm Appointment</h2>
          <p>Date: {selectedSlot.date}</p>
          <p>Time: {selectedSlot.time}</p>
          <button onClick={handleAppointmentBooking}>Book Appointment</button>
        </div>
      )}
    </div>
  );
};

export default AppointmentScheduler;
