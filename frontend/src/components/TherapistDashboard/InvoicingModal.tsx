import React, { useState, useEffect } from "react";
import axios from "axios";

import { useAuth } from "../../hooks/useAuth";

import { FaTrash } from "react-icons/fa";

interface Invoice {
  id: number;
  due_date: string;
  studentId: number;
  therpaistId: number;
  amountDue: number;
  amountDate: number;

  student_id: number;
  created_at: string;
  student_first_name: string;
  student_last_name: string;
  amount_due: number;
  amount_paid: number;
  status: "unpaid" | "partial" | "paid";
}

interface InvoicingModalProps {
  isOpen: boolean;
  onClose: () => void;
  therapistId: number | null;
}

const InvoicingModal: React.FC<InvoicingModalProps> = ({ isOpen, onClose, therapistId }) => {
  const { user } = useAuth();

  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [patients, setPatients] = useState<{ id: number; name: string }[]>([]);

  const invoicesPerPage = 9;

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchPatients();
      fetchInvoices();
    }
  }, [isOpen, user?.id]);
  
  useEffect(() => {
    if (isOpen && therapistId) {
      fetchPatients();
      fetchInvoices();
    }
  }, [isOpen, therapistId]);
  
  const fetchPatients = async () => {
    try {
      const { data } = await axios.get(`/api/relationships/therapist/${therapistId}`);
      const relationships = data.relationships || [];
      setPatients(
        relationships.map((rel: { student_id: number; student_first_name: string; student_last_name: string }) => ({
          id: rel.student_id,
          name: `${rel.student_first_name} ${rel.student_last_name}`,
        }))
      );
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchInvoices = async () => {
    if (!user) return;
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get(`/api/invoices`, {
        params: { userId: user.id },
      });
      if (response.data?.invoices?.length) {
        setInvoices(response.data.invoices);
      } else {
        setInvoices([]);
        setErrorMessage("No invoices found for this user.");
      }
    } catch (error) {
      console.error("Error retrieving invoices:", error);
      setErrorMessage("An error occurred while fetching invoices.");
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async (
    studentId: number,
    amountDue: number,
    dueDate: string
  ) => {
    if (!therapistId) {
      console.error("Therapist ID is required to create an invoice.");
      return;
    }
  
    try {
      await axios.post(`/api/invoices`, {
        studentId,
        therapistId,
        amountDue,
        dueDate,
      });
      fetchInvoices();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error creating invoice:", error.response?.data || error.message);
      } else {
        console.error("Error creating invoice:", error);
      }
    }
  };

  const deleteInvoice = async (invoiceId: number) => {
    try {
      await axios.delete(`/api/invoices/${invoiceId}`);
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== invoiceId));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete invoice:", error);
    }
  };

  const filteredInvoices =
    filter === "all"
      ? invoices
      : invoices.filter((invoice) => invoice.status === filter);

  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * invoicesPerPage,
    currentPage * invoicesPerPage
  );

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredInvoices.length / invoicesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const CreateInvoiceModal: React.FC<{
    onClose: () => void;
    onCreateInvoice: (studentId: number, amountDue: number, dueDate: string) => void;
    patients: { id: number; name: string }[];
  }> = ({ onClose, onCreateInvoice, patients }) => {
    const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
    const [amountDue, setAmountDue] = useState<number | null>(null);
    const [dueDate, setDueDate] = useState<string>("");
  
    const handleCreate = () => {
      if (selectedStudent && amountDue && dueDate) {
        onCreateInvoice(selectedStudent, amountDue, dueDate);
        onClose();
      } else {
        console.error("All fields are required to create an invoice.");
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
          <div className="flex justify-between items-center">
            <h2 className="text-xl text-[#5E9ED9] font-bold">Create Invoice</h2>
            <button
              className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
              onClick={onClose}
            >
              X
            </button>
          </div>
          <div className="space-y-4 mt-5">
            <select
              value={selectedStudent || ""}
              onChange={(e) => setSelectedStudent(Number(e.target.value))}
              className="p-2 border rounded w-full"
            >
              <option value="" disabled>
                Select Patient
              </option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount Due"
              value={amountDue || ""}
              onChange={(e) => setAmountDue(Number(e.target.value))}
              className="p-2 border rounded w-full mb-2"
            />
            <input
              type="date"
              placeholder="Due Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="p-2 border rounded w-full mb-2"
            />
          </div>
          <div className="justify-center flex mt-2">
            <button
              className="bg-[#5E9ED9] text-white px-4 py-2 rounded mt-4"
              onClick={handleCreate}
            >
              Send Invoice
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-blue-100 p-6 rounded-lg shadow-lg w-4/5 h-4/5 max-w-6xl max-h-[90vh] flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl text-[#5E9ED9] font-bold">Invoices</h2>
            <button
              className="text-black px-2 rounded hover:text-gray-900"
              onClick={onClose}
            >
              X
            </button>
          </div>
  
          {loading ? (
            <div className="text-center">Loading invoices...</div>
          ) : errorMessage ? (
            <div className="text-center text-red-500">{errorMessage}</div>
          ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <select
                className="p-2 border border-[#5E9ED9] rounded"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="unpaid">Unpaid</option>
                <option value="partially paid">Partially Paid</option>
                <option value="paid">Paid</option>
              </select>
            </div>
  
            <div className="overflow-y-auto flex-grow">
              <table className="w-full border-collapse border border-[#5E9ED9] bg-white">
                <thead className="bg-[#5E9ED9] text-white">
                  <tr>
                    <th className="border border-[#5E9ED9] px-4 py-2">Date Assigned</th>
                    <th className="border border-[#5E9ED9] px-4 py-2">Due Date</th>
                    <th className="border border-[#5E9ED9] px-4 py-2">Patient's Name</th>
                    <th className="border border-[#5E9ED9] px-4 py-2">Amount Paid</th>
                    <th className="border border-[#5E9ED9] px-4 py-2">Amount Due</th>
                    <th className="border border-[#5E9ED9] px-4 py-2">Status</th>
                    <th className="border border-[#5E9ED9] px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-100">
                      <td className="border border-x-gray-100 text-center border-y-[#5E9ED9] px-4 py-2">
                        {invoice.created_at
                          ? new Date(invoice.created_at).toLocaleDateString()
                          : "Invalid Date"}
                      </td>
                      <td className="border border-x-gray-100 text-center border-y-[#5E9ED9] px-4 py-2">
                        {invoice.due_date
                          ? new Date(invoice.due_date).toLocaleDateString()
                          : "Invalid Date"}
                      </td>
                      <td className="border border-x-gray-100 border-y-[#5E9ED9] px-4 py-2">
                        {invoice.student_first_name || "Unknown"}{" "}
                        {invoice.student_last_name || "Unknown"}
                      </td>
                      <td className="border border-x-gray-100 text-center border-y-[#5E9ED9] px-4 py-2">
                        ${invoice.amount_paid
                          ? parseFloat(invoice.amount_paid.toString()).toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="border border-x-gray-100 text-center border-y-[#5E9ED9] px-4 py-2">
                        ${invoice.amount_due
                          ? parseFloat(invoice.amount_due.toString()).toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="border border-x-gray-100 text-center border-y-[#5E9ED9] p-2.5">
                        {invoice.status === "unpaid" ? (
                          <span
                            className="bg-red-500 text-white px-4 py-1 rounded w-20 h-10"
                          >
                            Pay
                          </span>
                        ) : invoice.status === "partial" ? (
                          <span
                            className="bg-yellow-500 text-white px-4 py-1 rounded w-20 h-10"
                          >
                            Partial
                          </span>
                        ) : (
                          <div className="justify-center flex">
                            <span className="bg-green-500 text-white px-4 py-1 rounded w-20 h-10 flex items-center justify-center">
                              Paid
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="border border-y-[#5E9ED9] px-4 py-2 text-center">
                        <button
                          className="text-white bg-red-500 px-4 py-2 rounded"
                          onClick={() => {
                            setSelectedInvoiceId(invoice.id);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
          )}
        </div>
  
        <div className="flex justify-center space-x-3 pt-8 mb-5 border-t mt-4 border-[#5E9ED9]">
          <button
            className="px-4 py-2 bg-white rounded"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            ←
          </button>
          <button
            className="px-4 py-2 bg-[#5E9ED9] text-white rounded hover:bg-[#548bbe]"
            onClick={() => setIsCreateInvoiceModalOpen(true)}
          >
            + Create Invoice
          </button>
          <button
            className="px-4 py-2 bg-white rounded"
            onClick={handleNextPage}
            disabled={
              currentPage === Math.ceil(filteredInvoices.length / invoicesPerPage)
            }
          >
            →
          </button>
        </div>
  
        {isCreateInvoiceModalOpen && (
          <CreateInvoiceModal
            onClose={() => setIsCreateInvoiceModalOpen(false)}
            onCreateInvoice={createInvoice}
            patients={patients}
          />
        )}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-10 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
              <p>Are you sure you want to delete this invoice?</p>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => deleteInvoice(selectedInvoiceId!)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicingModal;