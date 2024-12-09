import {
  Calendar,
  Clock,
  Search,
  X,
  Loader,
  Plus,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfilePicture from "../ProfilePicture";
interface SchedulingForTherapistsProps {
  therapistId: number;
  isOpen: boolean;
  onClose: () => void;
}

const SchedulingForTherapists: React.FC<SchedulingForTherapistsProps> = ({
  therapistId,
  isOpen,
  onClose,
}) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewAppointmentForm, setShowNewAppointmentForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    studentId: "",
    date: "",
    time: "",
    notes: "",
  });
  const [assignedStudents, setAssignedStudents] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 3;
  const [studentDetails, setStudentDetails] = useState<Record<number, any>>({});


  useEffect(() => {
    if (!isOpen) return;

    const fetchAppointmentsAndStudents = async () => {
      setLoading(true);
      try {
        // Fetch Appointments
        const appointmentsResponse = await axios.get(
          `http://localhost:5000/api/appointments/therapist/${therapistId}`
        );
        const fetchedAppointments = appointmentsResponse.data.data || [];
        setAppointments(fetchedAppointments);
  
        // Fetch Assigned Students
        const studentsResponse = await axios.get(
          `http://localhost:5000/api/relationships/therapist/${therapistId}`
        );
        const fetchedRelationships = studentsResponse.data.relationships || [];
        const activeStudents = fetchedRelationships.filter(
          (relationship) =>
            relationship.status === "active" || relationship.status === "switched"
        );
        const formattedStudents = activeStudents.map((student) => ({
          id: student.student_id,
          first_name: student.student_first_name,
          last_name: student.student_last_name,
        }));
        setAssignedStudents(formattedStudents);
      } catch (err) {
        setError("Failed to load appointments or assigned students.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAppointmentsAndStudents();
  }, [isOpen, therapistId]);

  const handleSchedule = async () => {
    if (!newAppointment.studentId) {
      alert("Please select a student.");
      return;
    }

    setLoading(true);
    try {
      const appointmentPayload = {
        student_id: Number(newAppointment.studentId),
        therapist_id: therapistId,
        appointment_date: `${newAppointment.date}T${newAppointment.time}:00Z`,
        status: "pending",
        notes: newAppointment.notes,
      };

      const response = await axios.post(
        `http://localhost:5000/api/appointments/schedule`,
        appointmentPayload
      );

      const createdAppointment = response.data.data;

      // Fetch student details
      const studentResponse = await axios.get(
        `http://localhost:5000/api/users/${createdAppointment.student_id}`
      );
      const student = studentResponse.data;

      // Combine student details with the created appointment
      const appointmentWithStudentDetails = {
        ...createdAppointment,
        student_first_name: student.first_name,
        student_last_name: student.last_name,
      };

      // Update the appointments list
      setAppointments((prev) => [...prev, appointmentWithStudentDetails]);

      // Reset form and close modal
      setShowNewAppointmentForm(false);
      setNewAppointment({ studentId: "", date: "", time: "", notes: "" });
    } catch (err) {
      setError("Failed to schedule appointment.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatAppointmentTime = (appointmentDate: string) => {
    const date = new Date(appointmentDate);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const handleUpdateStatus = async (appointmentId: number, newStatus: string) => {
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}`,
        { status: newStatus }
      );
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      setError("Failed to update appointment status.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: number) => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:5000/api/appointments/${appointmentId}`
      );
      setAppointments((prev) => prev.filter((app) => app.id !== appointmentId));
    } catch (err) {
      setError("Failed to cancel appointment.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    const studentName = `${app.student_first_name} ${app.student_last_name}`.toLowerCase();
    return (
      studentName.includes(searchQuery.toLowerCase()) ||
      app.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  const timeslots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-4/5 h-4/5 max-w-6xl max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <X className="h-6 w-6" />
        </button>
        <header className="flex justify-between items-center mb-4 px-16 pt-4 gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Your Appointments
          </h1>
          <div className="flex gap-4 items-center -ml-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search appointments..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E9ED9]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowNewAppointmentForm((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 bg-[#5E9ED9] text-white rounded-lg hover:bg-[#4b8bc4] transition"
            >
              <Plus className="h-5 w-5" />
              New Appointment
            </button>
          </div>
        </header>

        <div className="px-6 pb-4 overflow-y-auto h-[calc(100%-160px)]">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-[#5E9ED9]" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-gray-500 text-center py-12">
              No appointments found
            </div>
          ) : (
            <ul className="space-y-4">
              {currentAppointments.map((appointment) => (
                <li
                  key={appointment.id}
                  className="border p-4 rounded-lg shadow-sm hover:bg-gray-50 transition flex items-center gap-4"
                >
                  {/* Profile Picture */}
                  <ProfilePicture
                    userRole="student"
                    userId={appointment.student_id}
                    className="w-16 h-16 rounded-full shadow-md"
                  />

                  <div className="flex-1">
                    {/* Student Name and Email */}
                    <h2 className="text-lg font-medium text-gray-900">
                      {`${appointment.student_first_name} ${appointment.student_last_name}`}
                    </h2>
                    <p className="text-sm text-gray-600">{appointment.student_email}</p>

                    {/* Appointment Details */}
                    <p className="text-sm text-gray-600 mt-1">
                      {appointment.notes || "No additional notes provided."}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                      <Calendar className="h-4 w-4" />
                      {appointment.appointment_date.split("T")[0]}
                      <Clock className="h-4 w-4 ml-2" />
                      {formatAppointmentTime(appointment.appointment_date)}
                      <span
                        className={`ml-4 px-2 py-1 rounded ${appointment.status === "pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : appointment.status === "confirmed"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                          }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col justify-end gap-2">
                    <button
                      onClick={() => handleUpdateStatus(appointment.id, "confirmed")}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </div>

                </li>
              ))}
            </ul>

          )}
        </div>

        <div className="flex justify-between items-center px-6 py-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of{" "}
            {Math.ceil(filteredAppointments.length / appointmentsPerPage)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                prev < Math.ceil(filteredAppointments.length / appointmentsPerPage)
                  ? prev + 1
                  : prev
              )
            }
            disabled={
              currentPage ===
              Math.ceil(filteredAppointments.length / appointmentsPerPage)
            }
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {showNewAppointmentForm && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex justify-center items-center p-6">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Schedule a New Appointment
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Student
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-200 p-2"
                    value={newAppointment.studentId}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        studentId: e.target.value,
                      }))
                    }
                  >
                    <option value="">Choose a student</option>
                    {assignedStudents.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.first_name} {student.last_name}
                      </option>
                    ))}
                  </select>
                </div>;
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-gray-200 p-2"
                    value={newAppointment.date}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Time
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-200 p-2"
                    value={newAppointment.time}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        time: e.target.value,
                      }))
                    }
                  >
                    <option value="">Choose a time</option>
                    {timeslots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-gray-200 p-2"
                    rows={3}
                    placeholder="Add notes (optional)"
                    value={newAppointment.notes}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                  ></textarea>
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={() => setShowNewAppointmentForm(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSchedule}
                    disabled={loading}
                    className="px-4 py-2 bg-[#5E9ED9] text-white rounded-lg hover:bg-[#4b8bc4] transition disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader className="h-5 w-5 animate-spin" />
                    ) : (
                      "Schedule"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulingForTherapists;
