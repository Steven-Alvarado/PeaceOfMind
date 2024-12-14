const {
    createConversation,
    getConversationsByUser,
    getConversationDetails,
  } = require("../conversationsController");
  
  const {
    createConversationModel,
    getConversationsByUserModel,
    getConversationDetailsModel,
  } = require("../../models/conversationsModel");
  
  jest.mock("../../models/conversationsModel");
  
  const mockReq = () => ({ body: {}, params: {}, query: {} });
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };
  
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  
  describe("Conversations Controller", () => {
    describe("createConversation", () => {
      it("should return 400 if student_id or therapist_id is missing", async () => {
        const req = mockReq();
        req.body = { student_id: null, therapist_id: null };
        const res = mockRes();
  
        await createConversation(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          error: "Student ID and Therapist ID are required.",
        });
      });
  
      it("should create a new conversation and return 201", async () => {
        const req = mockReq();
        req.body = { student_id: 1, therapist_id: 2 };
        const res = mockRes();
  
        createConversationModel.mockResolvedValue({ id: 1, student_id: 1, therapist_id: 2 });
  
        await createConversation(req, res);
  
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          message: "Conversation created or updated.",
          conversation: { id: 1, student_id: 1, therapist_id: 2 },
        });
      });
  
      it("should return 409 if conversation already exists", async () => {
        const req = mockReq();
        req.body = { student_id: 1, therapist_id: 2 };
        const res = mockRes();
  
        createConversationModel.mockResolvedValue(null);
  
        await createConversation(req, res);
  
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
          error: "Conversation already exists.",
        });
      });
  
      it("should return 500 if creating conversation fails", async () => {
        const req = mockReq();
        req.body = { student_id: 1, therapist_id: 2 };
        const res = mockRes();
  
        createConversationModel.mockRejectedValue(new Error("Database error"));
  
        await createConversation(req, res);
  
        expect(console.error).toHaveBeenCalledWith(
          "Error creating conversation:",
          expect.any(Error)
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          error: "Failed to create conversation.",
        });
      });
    });
  
    describe("getConversationsByUser", () => {
      it("should return 400 if role is invalid", async () => {
        const req = mockReq();
        req.params.userId = 1;
        req.query.role = "invalidRole";
        const res = mockRes();
  
        await getConversationsByUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          error: "Role must be 'student' or 'therapist'.",
        });
      });
  
      it("should return conversations for a valid user and role", async () => {
        const req = mockReq();
        req.params.userId = 1;
        req.query.role = "student";
        const res = mockRes();
  
        const mockConversations = [
          { id: 1, student_id: 1, therapist_id: 2 },
          { id: 2, student_id: 1, therapist_id: 3 },
        ];
  
        getConversationsByUserModel.mockResolvedValue(mockConversations);
  
        await getConversationsByUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockConversations);
      });
  
      it("should return 500 if fetching conversations fails", async () => {
        const req = mockReq();
        req.params.userId = 1;
        req.query.role = "student";
        const res = mockRes();
  
        getConversationsByUserModel.mockRejectedValue(new Error("Database error"));
  
        await getConversationsByUser(req, res);
  
        expect(console.error).toHaveBeenCalledWith(
          "Error fetching conversations:",
          expect.any(Error)
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          error: "Failed to fetch conversations.",
        });
      });
    });
  
    describe("getConversationDetails", () => {
      it("should return 404 if conversation is not found", async () => {
        const req = mockReq();
        req.params.conversationId = 1;
        const res = mockRes();
  
        getConversationDetailsModel.mockResolvedValue(null);
  
        await getConversationDetails(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          error: "Conversation not found.",
        });
      });
  
      it("should return conversation details for a valid ID", async () => {
        const req = mockReq();
        req.params.conversationId = 1;
        const res = mockRes();
  
        const mockConversation = { id: 1, student_id: 1, therapist_id: 2 };
  
        getConversationDetailsModel.mockResolvedValue(mockConversation);
  
        await getConversationDetails(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockConversation);
      });
  
      it("should return 500 if fetching conversation details fails", async () => {
        const req = mockReq();
        req.params.conversationId = 1;
        const res = mockRes();
  
        getConversationDetailsModel.mockRejectedValue(new Error("Database error"));
  
        await getConversationDetails(req, res);
  
        expect(console.error).toHaveBeenCalledWith(
          "Error fetching conversation details:",
          expect.any(Error)
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          error: "Failed to fetch conversation details.",
        });
      });
    });
  });
  