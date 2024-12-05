import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const InvoicingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payModalOpen, setPayModalOpen] = useState(false);
  interface Invoice {
    id: number;
    created_at: string;
    due_date: string;
    therapist_first_name: string;
    therapist_last_name: string;
    amount_paid: number;
    amount_due: number;
    status: string;
  }
  
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState("");

  const invoicesPerPage = 9;

  useEffect(() => {
    if (!isOpen || !user) return;

    const fetchInvoices = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(`/api/invoices/student/${user?.id}`);
        setInvoices(response.data.invoices);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError("Failed to load invoices. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [isOpen, user]);

  const handlePay = async () => {
    if (!selectedInvoice || isNaN(Number(payAmount)) || Number(payAmount) <= 0) {
      setError("Invalid payment amount.");
      return;
    }

    if (Number(payAmount) > selectedInvoice.amount_due) {
      setError("Payment exceeds amount owed.");
      return;
    }

    try {
      await axios.put(`/api/invoices/${selectedInvoice.id}/pay`, { amountPaid: Number(payAmount) });
      setPayModalOpen(false);
      setSelectedInvoice(null);
      setPayAmount("");

      const response = await axios.get(`/api/invoices/student/${user?.id}`);
      setInvoices(response.data.invoices);
    } catch (err) {
      console.error("Error processing payment:", err);
      setError("Failed to process payment. Please try again.");
    }
  };

  const filteredInvoices =
    filter === "all"
      ? invoices
      : invoices.filter((invoice: any) => invoice.status === filter);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-blue-100 p-6 rounded-lg shadow-lg w-4/5 h-4/5 max-w-6xl flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-[#5E9ED9] font-bold">Invoices</h2>
          <button
            className="text-black px-2 rounded hover:text-gray-900"
            onClick={onClose}
          >
            X
          </button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <select
            className="p-2 border text-center border-[#5E9ED9] rounded"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="partial">Partially Paid</option>
            <option value="unpaid">Unpaid</option>
            
          </select>
        </div>

        {/* Main Content */}
        <div className="flex-grow overflow-auto">
          {loading ? (
            <p>Loading invoices...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredInvoices.length === 0 ? (
            <p className="text-center text-gray-500">No invoices found.</p>
          ) : (
            <>
              <table className="w-full border-collapse border border-[#5E9ED9] bg-white">
                <thead>
                  <tr className="bg-[#5E9ED9] text-center text-white">
                    <th className="border border-[#5E9ED9] p-2">Date Created</th>
                    <th className="border border-[#5E9ED9] p-2">Date Due</th>
                    <th className="border border-[#5E9ED9] p-2">Therapist Name</th>
                    <th className="border border-[#5E9ED9] p-2">Amount Paid</th>
                    <th className="border border-[#5E9ED9] p-2">Amount Owed</th>
                    <th className="border border-[#5E9ED9] p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInvoices.map((invoice: any) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="border border-x-gray-100 text-center border-y-[#5E9ED9] p-2">
                        {invoice.created_at
                          ? new Date(invoice.created_at).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="border border-x-gray-100 text-center border-y-[#5E9ED9] p-2">
                        {invoice.due_date
                          ? new Date(invoice.due_date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="border border-x-gray-100 text-center border-y-[#5E9ED9] p-2">
                        {invoice.therapist_first_name} {invoice.therapist_last_name}
                      </td>
                      <td className="border border-x-gray-100 text-center border-y-[#5E9ED9] p-2">
                        ${Number(invoice.amount_paid || 0).toFixed(2)}
                      </td>
                      <td className="border border-x-gray-100 text-center border-y-[#5E9ED9] p-2">
                        ${Number(invoice.amount_due || 0).toFixed(2)}
                      </td>
                      <td className="border border-x-gray-100 text-center border-y-[#5E9ED9] p-2.5">
                        {invoice.status === "unpaid" ? (
                          <button
                            className="bg-red-500 text-white px-4 py-1 rounded w-20 h-10"
                            onClick={() => {
                              setPayModalOpen(true);
                              setSelectedInvoice(invoice);
                            }}
                          >
                            Pay
                          </button>
                        ) : invoice.status === "partial" ? (
                          <button
                            className="bg-yellow-500 text-white px-4 py-1 rounded w-20 h-10"
                            onClick={() => {
                              setPayModalOpen(true);
                              setSelectedInvoice(invoice);
                            }}
                          >
                            Partial
                          </button>
                        ) : (
                          <div className="justify-center flex">
                            <span className="bg-green-500 text-white px-4 py-1 rounded w-20 h-10 flex items-center justify-center">
                              Paid
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center space-x-3 pt-8 mb-5 items-center border-t mt-4 border-[#5E9ED9]">
          <button
            className="px-4 py-2 bg-white roundedfont-bold"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            ←
          </button>
          <span className="text-[#5E9ED9] font-bold">
            Page {currentPage} of{" "}
            {Math.ceil(filteredInvoices.length / invoicesPerPage)}
          </span>
          <button
            className="px-4 py-2 bg-white rounded front-bold"
            onClick={handleNextPage}
            disabled={
              currentPage ===
              Math.ceil(filteredInvoices.length / invoicesPerPage)
            }
          >
            →
          </button>
        </div>
      </div>

      {payModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Pay Invoice</h2>
            <p>
              <strong>Amount Owed:</strong> $
              {Number(selectedInvoice.amount_due || 0).toFixed(2)}
            </p>
            <p>
              <strong>Amount Paid:</strong> $
              {Number(selectedInvoice.amount_paid || 0).toFixed(2)}
            </p>
            <input
              type="number"
              className="p-2 border rounded w-full mt-4"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              placeholder="Enter amount to pay"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}

            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => {
                  setPayModalOpen(false);
                  setSelectedInvoice(null);
                  setPayAmount("");
                  setError("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handlePay}
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicingModal;