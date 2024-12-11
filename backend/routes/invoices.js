const express = require('express');
const router = express.Router();
const { 
  getAllInvoices, 
  getInvoicesByStudentId, 
  getInvoiceById, 
  createInvoice, 
  payInvoice, 
  updateInvoice,
  getInvoicesByTherapistId, 
  deleteInvoice 
} = require('../controllers/invoicesController');

router.get('/', getAllInvoices);
router.get('/student/:id', getInvoicesByStudentId);
router.get('/:id', getInvoiceById);
router.post('/', createInvoice);
router.put('/:id/pay', payInvoice);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);
router.get('/therapist/:id', getInvoicesByTherapistId);

module.exports = router;
