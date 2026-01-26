import React from "react";
import { CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { getStatusColor } from "../utils/statusHelpers";

const getStatusIcon = (status) => {
  switch (status) {
    case "pass":
      return <CheckCircle className="w-4 h-4" />;
    case "warn":
      return <AlertTriangle className="w-4 h-4" />;
    case "fail":
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const LoanListModal = ({
  modalData,
  onClose,
  onLoanClick,
  uploadedImage,
  onOpenImageModal,
}) => {
  if (!modalData) return null;

  const handleLoanLinkClick = (loanId) => {
    onLoanClick(loanId);
  };

  const handlePdfClick = () => {
    if (uploadedImage) {
      onOpenImageModal(uploadedImage);
    } else {
      alert(
        'Please upload a document image first using the "Upload Document Image" button at the top of the dashboard.',
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden"
        style={{ maxHeight: "calc(100vh - 2rem)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
          <h2 className="text-2xl font-bold text-slate-900 pr-4">
            {modalData.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 bg-blue-50 border-b border-slate-200">
          <p className="text-lg">
            <span className="font-semibold text-slate-700">Total Loans: </span>
            <span className="font-bold text-blue-600 text-xl">
              {modalData.loans.length}
            </span>
          </p>
        </div>

        <div
          className="overflow-auto"
          style={{ maxHeight: "calc(100vh - 20rem)" }}
        >
          {modalData.loans.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-lg">
              No loans found with this status
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-200 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-300 bg-slate-200">
                    Loan ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-300 bg-slate-200">
                    Branch ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-300 bg-slate-200">
                    MLO NMLS
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-300 bg-slate-200">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-300 bg-slate-200">
                    Term
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-300 bg-slate-200">
                    Amortization
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-300 bg-slate-200">
                    Purpose
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-300 bg-slate-200">
                    Occupancy
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-300 bg-slate-200">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-300 bg-slate-200">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {modalData.loans.map((loan) => (
                  <tr
                    key={loan.id}
                    className="border-b border-slate-200 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLoanLinkClick(loan.id)}
                          style={{
                            color: "#2563eb",
                            fontWeight: "600",
                            cursor: "pointer",
                            textDecoration: "underline",
                            background: "none",
                            border: "none",
                            padding: 0,
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.color = "#1d4ed8")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.color = "#2563eb")
                          }
                        >
                          {loan.id}
                        </button>
                        <button
                          onClick={handlePdfClick}
                          className="p-1 hover:bg-red-50 rounded transition-colors"
                          title="View PDF"
                        >
                          <svg
                            className="w-4 h-4 text-red-600"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18.5,9L13,3.5V9H18.5M6,20V4H11V10H18V20H6M7,11H9V18H7V11M10,11H12A2,2 0 0,1 14,13V15A2,2 0 0,1 12,17H10V11M12,15V13H11V15H12M15,11H17V13H19V15H17V18H15V11Z" />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            console.log("Logo clicked for", loan.id)
                          }
                          className="p-1 hover:bg-blue-50 rounded transition-colors"
                          title="Open in RegCheck"
                        >
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12 2L3 7L12 12L21 7L12 2Z"
                              fill="#1e40af"
                            />
                            <path
                              d="M3 17L12 22L21 17L12 12L3 17Z"
                              fill="#f97316"
                            />
                            <path
                              d="M12 2L3 7V17L12 12V2Z"
                              fill="#1e40af"
                              fillOpacity="0.8"
                            />
                            <path
                              d="M12 2L21 7V17L12 12V2Z"
                              fill="#1e40af"
                              fillOpacity="0.6"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                      {loan.branchId}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                      {loan.mloNmlsId}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                      {loan.loanType}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                      {loan.loanTerm}y
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                      {loan.amortizationType}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                      {loan.purpose}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                      {loan.occupancy}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                      ${loan.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 whitespace-nowrap ${getStatusColor(modalData.status)}`}
                      >
                        {getStatusIcon(modalData.status)}
                        {modalData.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-end p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanListModal;
