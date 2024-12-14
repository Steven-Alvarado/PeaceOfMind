const {
    getAllInvoices,
    getInvoicesByStudentId,
    getInvoiceById,
    createInvoice,
    payInvoice,
    updateInvoice,
    deleteInvoice,
  } = require('../../models/invoicesModel');
  
  jest.mock('../../models/invoicesModel');
  
  const mockReq = () => ({ body: {}, params: {}, query: {} });
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };
  
  describe('Invoices Model Functions', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('getAllInvoices', () => {
      it('should return all invoices', async () => {
        const mockInvoices = [{ id: 1 }, { id: 2 }];
        getAllInvoices.mockResolvedValue(mockInvoices);
  
        const result = await getAllInvoices();
  
        expect(getAllInvoices).toHaveBeenCalled();
        expect(result).toEqual(mockInvoices);
      });
  
      it('should throw an error if query fails', async () => {
        getAllInvoices.mockRejectedValue(new Error('Database error'));
  
        await expect(getAllInvoices()).rejects.toThrow('Database error');
      });
    });
  
    describe('getInvoicesByStudentId', () => {
      it('should return invoices for a valid student ID', async () => {
        const mockInvoices = [{ id: 1, studentId: 1 }];
        getInvoicesByStudentId.mockResolvedValue(mockInvoices);
  
        const result = await getInvoicesByStudentId(1);
  
        expect(getInvoicesByStudentId).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockInvoices);
      });
  
      it('should throw an error if query fails', async () => {
        getInvoicesByStudentId.mockRejectedValue(new Error('Database error'));
  
        await expect(getInvoicesByStudentId(1)).rejects.toThrow('Database error');
      });
    });
  
    describe('getInvoiceById', () => {
      it('should return an invoice for a valid ID', async () => {
        const mockInvoice = { id: 1 };
        getInvoiceById.mockResolvedValue(mockInvoice);
  
        const result = await getInvoiceById(1);
  
        expect(getInvoiceById).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockInvoice);
      });
  
      it('should throw an error if query fails', async () => {
        getInvoiceById.mockRejectedValue(new Error('Database error'));
  
        await expect(getInvoiceById(1)).rejects.toThrow('Database error');
      });
    });
  
    describe('createInvoice', () => {
      it('should create and return a new invoice', async () => {
        const mockInvoice = { id: 1, studentId: 1, therapistId: 2, amountDue: 100 };
        createInvoice.mockResolvedValue(mockInvoice);
  
        const result = await createInvoice(1, 2, 100, '2023-12-31');
  
        expect(createInvoice).toHaveBeenCalledWith(1, 2, 100, '2023-12-31');
        expect(result).toEqual(mockInvoice);
      });
  
      it('should throw an error if query fails', async () => {
        createInvoice.mockRejectedValue(new Error('Database error'));
  
        await expect(createInvoice(1, 2, 100, '2023-12-31')).rejects.toThrow('Database error');
      });
    });
  
    describe('payInvoice', () => {
      it('should process a payment and return the updated invoice', async () => {
        const mockInvoice = { id: 1, amountPaid: 100, status: 'paid' };
        payInvoice.mockResolvedValue(mockInvoice);
  
        const result = await payInvoice(1, 100);
  
        expect(payInvoice).toHaveBeenCalledWith(1, 100);
        expect(result).toEqual(mockInvoice);
      });
  
      it('should throw an error if query fails', async () => {
        payInvoice.mockRejectedValue(new Error('Database error'));
  
        await expect(payInvoice(1, 100)).rejects.toThrow('Database error');
      });
    });
  
    describe('updateInvoice', () => {
      it('should update an invoice and return the updated details', async () => {
        const mockInvoice = { id: 1, amountDue: 200 };
        updateInvoice.mockResolvedValue(mockInvoice);
  
        const result = await updateInvoice(1, { amountDue: 200 });
  
        expect(updateInvoice).toHaveBeenCalledWith(1, { amountDue: 200 });
        expect(result).toEqual(mockInvoice);
      });
  
      it('should throw an error if query fails', async () => {
        updateInvoice.mockRejectedValue(new Error('Database error'));
  
        await expect(updateInvoice(1, { amountDue: 200 })).rejects.toThrow('Database error');
      });
    });
  
    describe('deleteInvoice', () => {
      it('should delete an invoice and return the deleted record', async () => {
        const mockInvoice = { id: 1 };
        deleteInvoice.mockResolvedValue(mockInvoice);
  
        const result = await deleteInvoice(1);
  
        expect(deleteInvoice).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockInvoice);
      });
  
      it('should throw an error if query fails', async () => {
        deleteInvoice.mockRejectedValue(new Error('Database error'));
  
        await expect(deleteInvoice(1)).rejects.toThrow('Database error');
      });
    });
  });
  