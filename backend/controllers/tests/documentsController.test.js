const {
    docCreated,
    checkDocument,
    checkGetDocForUser,
    updateDocument,
    checkDocumentAuditHistory,
  } = require("../documentsController");
  
  const {
    createDocument,
    getDocumentById,
    getAllDocumentsForUser,
    updateDocumentById,
    getAuditHistoryByUserId,
  } = require("../../models/documentsModel");
  
  jest.mock("../../models/documentsModel");
  
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
  
  describe("Documents Controller", () => {
    describe("docCreated", () => {
      it("should create a document and return 201", async () => {
        const req = mockReq();
        req.body = { user_id: 1, document_type: "journal", document_content: "Sample content" };
        const res = mockRes();
  
        createDocument.mockResolvedValue({ id: 1, user_id: 1, document_type: "journal", document_content: "Sample content" });
  
        await docCreated(req, res);
  
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ id: 1, user_id: 1, document_type: "journal", document_content: "Sample content" });
      });
  
      it("should return 500 if creating a document fails", async () => {
        const req = mockReq();
        req.body = { user_id: 1, document_type: "journal", document_content: "Sample content" };
        const res = mockRes();
  
        createDocument.mockRejectedValue(new Error("Database error"));
  
        await docCreated(req, res);
  
        expect(console.error).toHaveBeenCalledWith(expect.any(Error));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "An error occurred while creating the document" });
      });
    });
  
    describe("checkDocument", () => {
      it("should return a document for a valid ID", async () => {
        const req = mockReq();
        req.params.id = 1;
        const res = mockRes();
  
        getDocumentById.mockResolvedValue({ id: 1, document_type: "journal", document_content: "Sample content" });
  
        await checkDocument(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 1, document_type: "journal", document_content: "Sample content" });
      });
  
      it("should return 404 if document is not found", async () => {
        const req = mockReq();
        req.params.id = 1;
        const res = mockRes();
  
        getDocumentById.mockResolvedValue(null);
  
        await checkDocument(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Document not found" });
      });
  
      it("should return 500 if fetching document fails", async () => {
        const req = mockReq();
        req.params.id = 1;
        const res = mockRes();
  
        getDocumentById.mockRejectedValue(new Error("Database error"));
  
        await checkDocument(req, res);
  
        expect(console.error).toHaveBeenCalledWith(expect.any(Error));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "An error occurred while retrieving the document" });
      });
    });
  
    describe("checkGetDocForUser", () => {
      it("should return documents for a valid user", async () => {
        const req = mockReq();
        req.params.userId = 1;
        const res = mockRes();
  
        const mockDocuments = [
          { id: 1, document_type: "journal", document_content: "Content 1" },
          { id: 2, document_type: "survey", document_content: "Content 2" },
        ];
  
        getAllDocumentsForUser.mockResolvedValue(mockDocuments);
  
        await checkGetDocForUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockDocuments);
      });
  
      it("should return 500 if fetching documents fails", async () => {
        const req = mockReq();
        req.params.userId = 1;
        const res = mockRes();
  
        getAllDocumentsForUser.mockRejectedValue(new Error("Database error"));
  
        await checkGetDocForUser(req, res);
  
        expect(console.error).toHaveBeenCalledWith(expect.any(Error));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "An error occurred while retrieving documents" });
      });
    });
  
    describe("updateDocument", () => {
      it("should update a document and return 200", async () => {
        const req = mockReq();
        req.params.id = 1;
        req.body = { document_type: "journal", document_content: "Updated content" };
        const res = mockRes();
  
        updateDocumentById.mockResolvedValue({ id: 1, document_type: "journal", document_content: "Updated content" });
  
        await updateDocument(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 1, document_type: "journal", document_content: "Updated content" });
      });
  
      it("should return 404 if document is not found", async () => {
        const req = mockReq();
        req.params.id = 1;
        req.body = { document_type: "journal", document_content: "Updated content" };
        const res = mockRes();
  
        updateDocumentById.mockResolvedValue(null);
  
        await updateDocument(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Document not found" });
      });
  
      it("should return 500 if updating document fails", async () => {
        const req = mockReq();
        req.params.id = 1;
        req.body = { document_type: "journal", document_content: "Updated content" };
        const res = mockRes();
  
        updateDocumentById.mockRejectedValue(new Error("Database error"));
  
        await updateDocument(req, res);
  
        expect(console.error).toHaveBeenCalledWith(expect.any(Error));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "An error occurred while updating the document" });
      });
    });
  
    describe("checkDocumentAuditHistory", () => {
      it("should return audit history for a valid user", async () => {
        const req = mockReq();
        req.params.id = 1;
        const res = mockRes();
  
        const mockAuditHistory = [
          { id: 1, action: "created", timestamp: "2023-01-01T00:00:00Z" },
          { id: 2, action: "updated", timestamp: "2023-01-02T00:00:00Z" },
        ];
  
        getAuditHistoryByUserId.mockResolvedValue(mockAuditHistory);
  
        await checkDocumentAuditHistory(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockAuditHistory);
      });
  
      it("should return 404 if no audit history is found", async () => {
        const req = mockReq();
        req.params.id = 1;
        const res = mockRes();
  
        getAuditHistoryByUserId.mockResolvedValue([]);
  
        await checkDocumentAuditHistory(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "No audit history found for this user" });
      });
  
      it("should return 500 if fetching audit history fails", async () => {
        const req = mockReq();
        req.params.id = 1;
        const res = mockRes();
  
        getAuditHistoryByUserId.mockRejectedValue(new Error("Database error"));
  
        await checkDocumentAuditHistory(req, res);
  
        expect(console.error).toHaveBeenCalledWith(expect.any(Error));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "An error occurred while retrieving the document audit history" });
      });
    });
  });
  