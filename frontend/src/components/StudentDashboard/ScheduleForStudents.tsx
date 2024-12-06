import {
    Calendar,
    Clock,
    Search,
    Plus,
    X,
    Edit2,
    Trash2,
    Loader,
  } from "lucide-react";
  import React, { useEffect, useState } from "react";
  import axios from "axios";
  
  const ScheduleForStudents = ({ studentId }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [newAppointment, setNewAppointment] = useState({
      date: "",
      time: "",
      notes: "",
      therapistId: "",
    });
  
    // Fetch Appointments
    useEffect(() => {
      const fetchAppointments = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:5000/api/appointments/student/${studentId}`
          );
          const appointmentsData = response.data.data || [];
          setAppointments(appointmentsData);
        } catch (err) {
          setError("Failed to load appointments.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAppointments();
    }, [studentId]);
  
    // Schedule Appointment
    const handleSchedule = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `http://localhost:5000/api/appointments/schedule`,
          {
            studentId,
            therapistId: newAppointment.therapistId,
            appointmentDate: `${newAppointment.date}T${newAppointment.time}`,
            notes: newAppointment.notes,
          }
        );
        setAppointments((prev) => [...prev, response.data.data]);
        setShowModal(false);
        setNewAppointment({
          date: "",
          time: "",
          notes: "",
          therapistId: "",
        });
      } catch (err) {
        setError("Failed to schedule appointment.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    // Delete Appointment
    const handleDelete = async (id) => {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/appointments/${id}`);
        setAppointments((prev) => prev.filter((app) => app.id !== id));
        setShowDeleteConfirm(false);
      } catch (err) {
        setError("Failed to delete appointment.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    // Filter Appointments
    const filteredAppointments = appointments.filter((app) => {
      const therapistName = `${app.therapist_first_name} ${app.therapist_last_name}`.toLowerCase();
      const matchesSearch =
        therapistName.includes(searchQuery.toLowerCase()) ||
        app.notes?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate =
        new Date(app.appointment_date).toDateString() ===
        selectedDate.toDateString();
      return matchesSearch && matchesDate;
    });
  
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">
              Appointment Dashboard
            </h1>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                New Appointment
              </button>
            </div>
          </header>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Current Appointments
                </h2>
  
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center py-12">{error}</div>
                ) : filteredAppointments.length === 0 ? (
                  <div className="text-gray-500 text-center py-12">
                    No appointments found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {`${appointment.therapist_first_name} ${appointment.therapist_last_name}`}
                          </h3>
                          <div className="text-sm text-gray-500 mt-1">
                            {appointment.notes}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar className="h-4 w-4" />
                            {appointment.appointment_date.split("T")[0]}
                            <Clock className="h-4 w-4 ml-2" />
                            {appointment.appointment_date.split("T")[1]}
                          </div>
                        </div>
  
                        <div className="flex gap-2 mt-4 md:mt-0">
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowModal(true);
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowDeleteConfirm(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
  
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
                <h2 className="text-lg font-semibold mb-4">Schedule Appointment</h2>
                {/* Add schedule appointment form here */}
              </div>
            </div>
          )}
        </div>
      </main>
    );
  };
  
  export default ScheduleForStudents;
  