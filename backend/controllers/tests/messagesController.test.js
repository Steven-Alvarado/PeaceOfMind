const {
    createMessageModel,
    getMessagesByConversationModel,
    markMessageAsReadModel,
    getUnreadMessagesCountModel,
  } = require("../../models/messagesModel");
  
  const {
    createMessage,
    getMessagesByConversation,
    markMessageAsRead,
    getUnreadMessagesCount,
  } = require("../messagesController");
  
  jest.mock("../../models/messagesModel");
 
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  const mockReq = () => ({ body: {}, params: {}, query: {} });
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };
  
  describe("Messages Controller", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe("createMessage", () => {
      it("should create a message and return 201", async () => {
        const req = mockReq();
        req.body = {
          conversation_id: 1,
          sender_id: 2,
          receiver_id: 3,
          message_content: "Hello",
        };
        const res = mockRes();
  
        const mockMessage = {
          id: 1,
          conversation_id: 1,
          sender_id: 2,
          receiver_id: 3,
          message_content: "Hello",
          sent_at: "2023-12-01T12:00:00Z",
        };
        createMessageModel.mockResolvedValue(mockMessage);
  
        await createMessage(req, res);
  
        expect(createMessageModel).toHaveBeenCalledWith(1, 2, 3, "Hello");
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockMessage);
      });
  
      it("should return 400 if required fields are missing", async () => {
        const req = mockReq();
        req.body = { sender_id: 2 };
        const res = mockRes();
  
        await createMessage(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "All fields are required." });
      });
  
      it("should return 500 if message creation fails", async () => {
        const req = mockReq();
        req.body = {
          conversation_id: 1,
          sender_id: 2,
          receiver_id: 3,
          message_content: "Hello",
        };
        const res = mockRes();
  
        createMessageModel.mockRejectedValue(new Error("Database error"));
  
        await createMessage(req, res);
  
        expect(createMessageModel).toHaveBeenCalledWith(1, 2, 3, "Hello");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to send message." });
      });
    });
  
    describe("getMessagesByConversation", () => {
      it("should return messages for a valid conversation ID", async () => {
        const req = mockReq();
        req.params.conversationId = 1;
        const res = mockRes();
  
        const mockMessages = [
          { id: 1, conversation_id: 1, sender_id: 2, message_content: "Hi" },
          { id: 2, conversation_id: 1, sender_id: 3, message_content: "Hello" },
        ];
        getMessagesByConversationModel.mockResolvedValue(mockMessages);
  
        await getMessagesByConversation(req, res);
  
        expect(getMessagesByConversationModel).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockMessages);
      });
  
      it("should return 500 if fetching messages fails", async () => {
        const req = mockReq();
        req.params.conversationId = 1;
        const res = mockRes();
  
        getMessagesByConversationModel.mockRejectedValue(new Error("Database error"));
  
        await getMessagesByConversation(req, res);
  
        expect(getMessagesByConversationModel).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch messages." });
      });
    });
  
    describe("markMessageAsRead", () => {
      it("should mark a message as read and return 200", async () => {
        const req = mockReq();
        req.params.messageId = 1;
        const res = mockRes();
  
        markMessageAsReadModel.mockResolvedValue(true);
  
        await markMessageAsRead(req, res);
  
        expect(markMessageAsReadModel).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Message marked as read." });
      });
  
      it("should return 404 if message is not found", async () => {
        const req = mockReq();
        req.params.messageId = 1;
        const res = mockRes();
  
        markMessageAsReadModel.mockResolvedValue(false);
  
        await markMessageAsRead(req, res);
  
        expect(markMessageAsReadModel).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Message not found." });
      });
  
      it("should return 500 if marking message as read fails", async () => {
        const req = mockReq();
        req.params.messageId = 1;
        const res = mockRes();
  
        markMessageAsReadModel.mockRejectedValue(new Error("Database error"));
  
        await markMessageAsRead(req, res);
  
        expect(markMessageAsReadModel).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to mark message as read." });
      });
    });
  
    describe("getUnreadMessagesCount", () => {
      it("should return the unread messages count for a valid user ID", async () => {
        const req = mockReq();
        req.params.userId = 1;
        const res = mockRes();
  
        getUnreadMessagesCountModel.mockResolvedValue(5);
  
        await getUnreadMessagesCount(req, res);
  
        expect(getUnreadMessagesCountModel).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ unread_count: 5 });
      });
  
      it("should return 500 if fetching unread messages count fails", async () => {
        const req = mockReq();
        req.params.userId = 1;
        const res = mockRes();
  
        getUnreadMessagesCountModel.mockRejectedValue(new Error("Database error"));
  
        await getUnreadMessagesCount(req, res);
  
        expect(getUnreadMessagesCountModel).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch unread messages count." });
      });
    });
  });
  