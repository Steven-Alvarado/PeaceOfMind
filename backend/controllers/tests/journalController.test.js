const {
    createJournalEntry,
    updateJournalEntry,
    getJournalById,
    getJournalsByUserId,
    deleteJournalEntry,
  } = require('../../models/journalsModel');
  
  const {
    createJournal,
    updateJournal,
    getJournal,
    getJournals,
    deleteJournal,
  } = require('../journalController');
  
  jest.mock('../../models/journalsModel');
 
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
  
  describe('Journal Controllers', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('createJournal', () => {
      it('should create a journal entry and return 201', async () => {
        const req = mockReq();
        req.body = { userId: 1, mood: 'happy', content: 'This is a test journal.' };
        const res = mockRes();
  
        const mockJournal = { id: 1, userId: 1, mood: 'happy', content: 'This is a test journal.' };
        createJournalEntry.mockResolvedValue(mockJournal);
  
        await createJournal(req, res);
  
        expect(createJournalEntry).toHaveBeenCalledWith(1, 'happy', 'This is a test journal.');
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Journal entry created successfully', journal: mockJournal });
      });
  
      it('should return 400 if required fields are missing', async () => {
        const req = mockReq();
        req.body = { mood: 'happy' };
        const res = mockRes();
  
        await createJournal(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
      });
  
      it('should return 500 if creation fails', async () => {
        const req = mockReq();
        req.body = { userId: 1, mood: 'happy', content: 'This is a test journal.' };
        const res = mockRes();
  
        createJournalEntry.mockRejectedValue(new Error('Database error'));
  
        await createJournal(req, res);
  
        expect(createJournalEntry).toHaveBeenCalledWith(1, 'happy', 'This is a test journal.');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create journal entry' });
      });
    });
  
    describe('updateJournal', () => {
      it('should update a journal entry and return 200', async () => {
        const req = mockReq();
        req.params.id = 1;
        req.body = { mood: 'neutral', content: 'Updated journal content.' };
        const res = mockRes();
  
        const mockUpdatedJournal = { id: 1, mood: 'neutral', content: 'Updated journal content.' };
        updateJournalEntry.mockResolvedValue(mockUpdatedJournal);
  
        await updateJournal(req, res);
  
        expect(updateJournalEntry).toHaveBeenCalledWith(1, 'neutral', 'Updated journal content.');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Journal entry updated successfully', journal: mockUpdatedJournal });
      });
  
      it('should return 400 if required fields are missing', async () => {
        const req = mockReq();
        req.params.id = 1;
        req.body = { mood: 'neutral' };
        const res = mockRes();
  
        await updateJournal(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
      });
  
      it('should return 500 if update fails', async () => {
        const req = mockReq();
        req.params.id = 1;
        req.body = { mood: 'neutral', content: 'Updated journal content.' };
        const res = mockRes();
  
        updateJournalEntry.mockRejectedValue(new Error('Database error'));
  
        await updateJournal(req, res);
  
        expect(updateJournalEntry).toHaveBeenCalledWith(1, 'neutral', 'Updated journal content.');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update journal entry' });
      });
    });
  
    describe('getJournal', () => {
      it('should return a journal entry for a valid ID', async () => {
        const req = mockReq();
        req.params.id = 1;
        const res = mockRes();
  
        const mockJournal = { id: 1, mood: 'happy', content: 'Sample content' };
        getJournalById.mockResolvedValue(mockJournal);
  
        await getJournal(req, res);
  
        expect(getJournalById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ journal: mockJournal });
      });
  
      it('should return 404 if journal entry is not found', async () => {
        const req = mockReq();
        req.params.id = 1;
        const res = mockRes();
  
        getJournalById.mockResolvedValue(null);
  
        await getJournal(req, res);
  
        expect(getJournalById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Journal entry not found' });
      });
  
      it('should return 500 if fetching journal entry fails', async () => {
        const req = mockReq();
        req.params.id = 1;
        const res = mockRes();
  
        getJournalById.mockRejectedValue(new Error('Database error'));
  
        await getJournal(req, res);
  
        expect(getJournalById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch journal entry' });
      });
    });
  
    describe('getJournals', () => {
      it('should return all journals for a valid user ID', async () => {
        const req = mockReq();
        req.params.userId = 1;
        const res = mockRes();
  
        const mockJournals = [{ id: 1, mood: 'happy' }, { id: 2, mood: 'sad' }];
        getJournalsByUserId.mockResolvedValue(mockJournals);
  
        await getJournals(req, res);
  
        expect(getJournalsByUserId).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ journals: mockJournals });
      });
  
      it('should return 404 if no journals are found', async () => {
        const req = mockReq();
        req.params.userId = 1;
        const res = mockRes();
  
        getJournalsByUserId.mockResolvedValue([]);
  
        await getJournals(req, res);
  
        expect(getJournalsByUserId).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'No journals found for this user' });
      });
  
      it('should return 500 if fetching journals fails', async () => {
        const req = mockReq();
        req.params.userId = 1;
        const res = mockRes();
  
        getJournalsByUserId.mockRejectedValue(new Error('Database error'));
  
        await getJournals(req, res);
  
        expect(getJournalsByUserId).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch journals' });
      });
    });
  
    describe('deleteJournal', () => {
      it('should delete a journal entry and return 200', async () => {
        const req = mockReq();
        req.params.id = 1;
        const res = mockRes();
  
        const mockDeletedJournal = { id: 1 };
        deleteJournalEntry.mockResolvedValue(mockDeletedJournal);
  
        await deleteJournal(req, res);
  
        expect(deleteJournalEntry).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Journal entry deleted successfully.', id: mockDeletedJournal.id });
      });
  
      it('should return 404 if journal entry is not found', async () => {
        const req = mockReq();
        req.params.id = 1;
        const res = mockRes();
  
        deleteJournalEntry.mockResolvedValue(null);
  
        await deleteJournal(req, res);
  
        expect(deleteJournalEntry).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Journal entry not found.' });
      });
  
      it('should return 500 if deletion fails', async () => {
        const req = mockReq();
        req.params.id = 1;
        const res = mockRes();
  
        deleteJournalEntry.mockRejectedValue(new Error('Database error'));
  
        await deleteJournal(req, res);
  
        expect(deleteJournalEntry).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Failed to delete journal entry.' });
      });
    });
  });
  