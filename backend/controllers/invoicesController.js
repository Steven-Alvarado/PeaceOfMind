const { 
    getAllInvoices, 
    getInvoicesByStudentId, 
    getInvoiceById, 
    createInvoice, 
    payInvoice, 
    updateInvoice, 
    getInvoicesByTherapistId,
    deleteInvoice 
  } = require('../models/invoicesModel');
  
  // Retrieve all invoices
  const handleGetAllInvoices = async (req, res) => {
    try {
      const invoices = await getAllInvoices();
      res.status(200).json({ invoices });
    } catch (error) {
      console.error("Error retrieving invoices:", error);
      res.status(500).json({ error: "Failed to retrieve invoices" });
    }
  };
  
  // Retrieve invoices for a specific student
  const handleGetInvoicesByStudentId = async (req, res) => {
    const { id: studentId } = req.params;
  
    // Validate student ID
    if (!studentId || isNaN(Number(studentId))) {
      return res.status(400).json({ error: "Valid Student ID is required" });
    }
  
    try {
      const invoices = await getInvoicesByStudentId(studentId);
  
      // Return empty array if no invoices are found
      if (invoices.length === 0) {
        return res.status(200).json({ invoices: [], message: "No invoices found for this student" });
      }
  
      res.status(200).json({ invoices });
    } catch (error) {
      console.error(`Error retrieving invoices for student ID ${studentId}:`, error);
      res.status(500).json({ error: "Failed to retrieve student invoices" });
    }
  };

  // Retrieve invoices for a specific therapist
  const handleGetInvoicesByTherapistId = async (req, res) => {
    const { id: therapistId } = req.params;

    if (!therapistId || isNaN(Number(therapistId))) {
        return res.status(400).json({ error: "Valid Therapist ID is required" });
    }

    try {
        const invoices = await getInvoicesByTherapistId(therapistId);
        res.status(200).json({ invoices });
    } catch (error) {
        console.error(`Error retrieving invoices for therapist ID ${therapistId}:`, error);
        res.status(500).json({ error: "Failed to retrieve therapist invoices" });
    }
  };
  
  // Retrieve a specific invoice by ID
  const handleGetInvoiceById = async (req, res) => {
    const { id: invoiceId } = req.params;
  
    // Validate invoice ID
    if (!invoiceId) {
      return res.status(400).json({ error: "Invoice ID is required" });
    }
  
    try {
      const invoice = await getInvoiceById(invoiceId);
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      res.status(200).json({ invoice });
    } catch (error) {
      console.error("Error retrieving invoice:", error);
      res.status(500).json({ error: "Failed to retrieve invoice" });
    }
  };
  
  // Create a new invoice
  const handleCreateInvoice = async (req, res) => {
    const { studentId, therapistId, amountDue, dueDate } = req.body;
  
    // Validate required fields
    if (!studentId || !therapistId || !amountDue || !dueDate) {
      return res.status(400).json({ 
        error: "StudentId, therapistId, amountDue, and dueDate are required" 
      });
    }
  
    try {
      const invoice = await createInvoice(studentId, therapistId, amountDue, dueDate);
      res.status(201).json({ 
        message: "Invoice created successfully", 
        invoice 
      });
    } catch (error) {
      console.error("Error creating invoice:", error);
      res.status(500).json({ error: "Failed to create invoice" });
    }
  };
  
  // Process invoice payment
  const handlePayInvoice = async (req, res) => {
    const { id: invoiceId } = req.params;
    const { amountPaid } = req.body;
  
    // Validate required fields
    if (!invoiceId || amountPaid === undefined || amountPaid <= 0) {
      return res.status(400).json({ 
        error: "Valid invoice ID and payment amount are required" 
      });
    }
  
    try {
      const invoice = await payInvoice(invoiceId, amountPaid);
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      res.status(200).json({ 
        message: "Payment processed successfully", 
        invoice 
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ error: "Failed to process payment" });
    }
  };
  
  // Update invoice details
  const handleUpdateInvoice = async (req, res) => {
    const { id: invoiceId } = req.params;
    const updateData = req.body;
  
    // Validate invoice ID
    if (!invoiceId) {
      return res.status(400).json({ error: "Invoice ID is required" });
    }
  
    try {
      const invoice = await updateInvoice(invoiceId, updateData);
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      res.status(200).json({ 
        message: "Invoice updated successfully", 
        invoice 
      });
    } catch (error) {
      console.error("Error updating invoice:", error);
      res.status(500).json({ error: "Failed to update invoice" });
    }
  };
  
  // Delete an invoice
  const handleDeleteInvoice = async (req, res) => {
    const { id: invoiceId } = req.params;
  
    // Validate invoice ID
    if (!invoiceId) {
      return res.status(400).json({ error: "Invoice ID is required" });
    }
  
    try {
      const deletedInvoice = await deleteInvoice(invoiceId);
      
      if (!deletedInvoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      res.status(200).json({ 
        message: "Invoice deleted successfully", 
        invoice: deletedInvoice 
      });
    } catch (error) {
      console.error("Error deleting invoice:", error);
      res.status(500).json({ error: "Failed to delete invoice" });
    }
  };
  
  module.exports = {
    getAllInvoices: handleGetAllInvoices,
    getInvoicesByStudentId: handleGetInvoicesByStudentId,
    getInvoiceById: handleGetInvoiceById,
    createInvoice: handleCreateInvoice,
    payInvoice: handlePayInvoice,
    updateInvoice: handleUpdateInvoice,
    getInvoicesByTherapistId: handleGetInvoicesByTherapistId,
    deleteInvoice: handleDeleteInvoice
  };