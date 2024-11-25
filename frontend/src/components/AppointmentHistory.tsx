import React, { useState, useEffect } from "react";
import axios from "axios";

const AppointmentHistory = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`/api/appointments/student/${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAppointments(response.data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user.id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Appointment History</h1>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>
            <p>Date: {appointment.appointment_date}</p>
            <p>Status: {appointment.status}</p>
            <button onClick={() => alert("Reschedule functionality here")}>Reschedule</button>
            <button onClick={() => alert("Cancel functionality here")}>Cancel</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentHistory;
