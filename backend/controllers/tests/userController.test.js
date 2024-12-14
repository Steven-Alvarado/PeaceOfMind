const {
    fetchAllUsers,
    fetchUserById,
    fetchUserAudit,
    fetchUserEmail,
  } = require("../usersController");
  
  const {
    getAllUsers,
    getUserById,
    getUserAuditHistory,
    getEmailById,
  } = require("../../models/usersModel");
  
  jest.mock("../../models/usersModel");
  
  const mockReq = () => ({ body: {}, params: {}, query: {} });
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };
  
  describe("User Controller", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe("fetchAllUsers", () => {
      it("should return all users", async () => {
        const req = mockReq();
        const res = mockRes();
  
        const mockUsers = [{ id: 1, name: "John Doe" }, { id: 2, name: "Jane Doe" }];
        getAllUsers.mockResolvedValue(mockUsers);
  
        await fetchAllUsers(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUsers);
      });
  
      it("should return 500 if an error occurs", async () => {
        const req = mockReq();
        const res = mockRes();
  
        getAllUsers.mockRejectedValue(new Error("Database error"));
  
        await fetchAllUsers(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Database query failed" });
      });
    });
  
    describe("fetchUserById", () => {
      it("should return a user by ID", async () => {
        const req = mockReq();
        req.params.id = "1";
        const res = mockRes();
  
        const mockUser = { id: 1, name: "John Doe", profile_picture_url: null };
        getUserById.mockResolvedValue(mockUser);
  
        await fetchUserById(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          ...mockUser,
          profile_picture_url: "/uploads/default-profile.png",
        });
      });
  
      it("should return 400 for invalid user ID", async () => {
        const req = mockReq();
        req.params.id = "abc";
        const res = mockRes();
  
        await fetchUserById(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid user ID" });
      });
  
      it("should return 404 if user is not found", async () => {
        const req = mockReq();
        req.params.id = "1";
        const res = mockRes();
  
        getUserById.mockResolvedValue(null);
  
        await fetchUserById(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
      });
  
      it("should return 500 if an error occurs", async () => {
        const req = mockReq();
        req.params.id = "1";
        const res = mockRes();
  
        getUserById.mockRejectedValue(new Error("Database error"));
  
        await fetchUserById(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Database query failed" });
      });
    });
  
    describe("fetchUserAudit", () => {
      it("should return audit history for a valid user ID", async () => {
        const req = mockReq();
        req.params.id = "1";
        const res = mockRes();
  
        const mockAuditHistory = [{ action: "Login", timestamp: "2023-01-01" }];
        getUserAuditHistory.mockResolvedValue(mockAuditHistory);
  
        await fetchUserAudit(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockAuditHistory);
      });
  
      it("should return 400 for invalid user ID", async () => {
        const req = mockReq();
        req.params.id = "abc";
        const res = mockRes();
  
        await fetchUserAudit(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid user ID" });
      });
  
      it("should return 404 if no audit history is found", async () => {
        const req = mockReq();
        req.params.id = "1";
        const res = mockRes();
  
        getUserAuditHistory.mockResolvedValue([]);
  
        await fetchUserAudit(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "No audit history found for this user" });
      });
  
      it("should return 500 if an error occurs", async () => {
        const req = mockReq();
        req.params.id = "1";
        const res = mockRes();
  
        getUserAuditHistory.mockRejectedValue(new Error("Database error"));
  
        await fetchUserAudit(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Database query failed" });
      });
    });
  
    describe("fetchUserEmail", () => {
      it("should return the user's email", async () => {
        const req = mockReq();
        req.params.id = "1";
        const res = mockRes();
  
        const mockEmail = { email: "johndoe@example.com" };
        getEmailById.mockResolvedValue(mockEmail);
  
        await fetchUserEmail(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockEmail);
      });
  
      it("should return 400 for invalid user ID", async () => {
        const req = mockReq();
        req.params.id = "abc";
        const res = mockRes();
  
        await fetchUserEmail(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid user ID" });
      });
  
      
  
      it("should return 500 if an error occurs", async () => {
        const req = mockReq();
        req.params.id = "1";
        const res = mockRes();
  
        getEmailById.mockRejectedValue(new Error("Database error"));
  
        await fetchUserEmail(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Database query failed" });
      });
    });
  });
  