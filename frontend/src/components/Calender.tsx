import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // For selecting dates and times
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

const AppointmentScheduler = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Fetch available slots from the backend
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await axios.get("/api/appointments/available-slots");
        setAvailableSlots(response.data);
      } catch (error) {
        toast.error("Failed to fetch available slots");
      }
    };
    fetchAvailableSlots();
  }, []);

  // Handle slot selection
  const handleSlotSelect = (info) => {
    setSelectedSlot(info.event.start);
  };

  // Book the selected appointment
  const bookAppointment = async () => {
    if (!selectedSlot) {
      toast.warn("Please select a slot to book an appointment");
      return;
    }

    try {
      const response = await axios.post("/api/appointments", {
        appointmentDate: selectedSlot,
      });
      toast.success("Appointment booked successfully!");
    } catch (error) {
      toast.error("Failed to book the appointment");
    }
  };

  return (
    <div className="appointment-scheduler">
      <h2>Book an Appointment</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={availableSlots.map((slot) => ({
          title: "Available",
          start: slot.start,
          end: slot.end,
          color: "green",
        }))}
        selectable={true}
        selectMirror={true}
        dateClick={handleSlotSelect}
      />
      <div className="actions">
        {selectedSlot && (
          <p>
            Selected Slot:{" "}
            {new Date(selectedSlot).toLocaleString("en-US", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </p>
        )}
        <button onClick={bookAppointment}>Book Appointment</button>
      </div>
    </div>
  );
};

export default AppointmentScheduler;
