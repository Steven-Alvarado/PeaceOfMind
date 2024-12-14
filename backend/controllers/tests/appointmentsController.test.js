const {
    scheduleAppointment,
    getAppointment,
    getStudentAppointments,
    getTherapistAppointments,
    updateAppointment,
    cancelAppointment,
  } = require("../../controllers/appointmentsController");
  
  const {
    createAppointment,
    getAppointmentById,
    getAppointmentsByStudent,
    getAppointmentsByTherapist,
    updateAppointmentStatus,
    deleteAppointment,
  } = require("../../models/appointmentsModel");
  
  jest.mock("../../models/appointmentsModel");
  
  const mockReq = () => ({ body: {}, params: {} });
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };
  
  describe("Appointments Controller", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe("scheduleAppointment", () => {
      it("should return 400 if required fields are missing", async () => {
        const req = mockReq();
        const res = mockRes();
        await scheduleAppointment(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: "Missing required fields",
        });
      });
  
      it("should return 201 and create an appointment", async () => {
        const req = mockReq();
        req.body = {
          student_id: 1,
          therapist_id: 2,
          appointment_date: "2024-12-15",
          status: "confirmed",
          notes: "First session",
        };
        const res = mockRes();
  
        createAppointment.mockResolvedValue(req.body);
  
        await scheduleAppointment(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: "Appointment successfully recorded",
          data: req.body,
        });
      });
  
      it("should return 500 if database query fails", async () => {
        const req = mockReq();
        req.body = {
          student_id: 1,
          therapist_id: 2,
          appointment_date: "2024-12-15",
          status: "confirmed",
          notes: "First session",
        };
        const res = mockRes();
  
        createAppointment.mockRejectedValue(new Error("Database error"));
  
        await scheduleAppointment(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: "Database query failed",
        });
      });
    });
  
    describe("getAppointment", () => {
      it("should return 400 if ID is invalid", async () => {
        const req = mockReq();
        req.params.id = "abc";
        const res = mockRes();
  
        await getAppointment(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: "Invalid appointment ID",
        });
      });
  
      it("should return 404 if appointment is not found", async () => {
        const req = mockReq();
        req.params.id = 1;
        const res = mockRes();
  
        getAppointmentById.mockResolvedValue(null);
  
        await getAppointment(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: "Appointment not found",
        });
      });
  
      it("should return 200 and the appointment data", async () => {
        const req = mockReq();
        req.params.id = 1;
        const res = mockRes();
        const mockAppointment = { id: 1, status: "confirmed" };
  
        getAppointmentById.mockResolvedValue(mockAppointment);
  
        await getAppointment(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: mockAppointment,
        });
      });
    });
  
    describe("updateAppointment", () => {
      it("should return 400 if ID is invalid", async () => {
        const req = mockReq();
        req.params.id = "abc";
        req.body.status = "completed";
        const res = mockRes();
  
        await updateAppointment(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: "Invalid appointment ID",
        });
      });
  
      it("should return 404 if appointment is not found", async () => {
        const req = mockReq();
        req.params.id = 1;
        req.body.status = "completed";
        const res = mockRes();
  
        updateAppointmentStatus.mockResolvedValue(null);
  
        await updateAppointment(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: "Appointment not found",
        });
      });
  
      it("should return 200 and update the appointment status", async () => {
        const req = mockReq();
        req.params.id = 1;
        req.body.status = "completed";
        const res = mockRes();
        const mockUpdatedAppointment = { id: 1, status: "completed" };
  
        updateAppointmentStatus.mockResolvedValue(mockUpdatedAppointment);
  
        await updateAppointment(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: "Appointment status successfully updated",
          data: mockUpdatedAppointment,
        });
      });
    });
  
    describe("cancelAppointment", () => {
      it("should return 400 if ID is invalid", async () => {
        const req = mockReq();
        req.params.id = "abc";
        const res = mockRes();
  
        await cancelAppointment(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: "Invalid appointment ID",
        });
      });
  
      it("should return 404 if appointment is not found", async () => {
        const req = mockReq();
        req.params.id = 1;
        const res = mockRes();
  
        deleteAppointment.mockResolvedValue(null);
  
        await cancelAppointment(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: "Appointment not found",
        });
      });
  
      it("should return 200 and delete the appointment", async () => {
        const req = mockReq();
        req.params.id = 1;
        const res = mockRes();
        const mockDeletedAppointment = { id: 1 };
  
        deleteAppointment.mockResolvedValue(mockDeletedAppointment);
  
        await cancelAppointment(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: mockDeletedAppointment,
        });
      });
    });
  });
  