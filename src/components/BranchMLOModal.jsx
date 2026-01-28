import React, { useState, useMemo } from "react";

const BranchMLOModal = ({ branchModalData, onClose, onMLOClick }) => {
  const [sortColumn, setSortColumn] = useState("total");
  const [sortDirection, setSortDirection] = useState("desc");

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const sortedMloData = useMemo(() => {
    if (!branchModalData?.mloData) return [];

    const sorted = [...branchModalData.mloData].sort((a, b) => {
      let aVal, bVal;

      switch (sortColumn) {
        case "mloId":
          aVal = a.mloId;
          bVal = b.mloId;
          break;
        case "total":
          aVal = a.total;
          bVal = b.total;
          break;
        case "passed":
          aVal = a.passed;
          bVal = b.passed;
          break;
        case "warned":
          aVal = a.warned;
          bVal = b.warned;
          break;
        case "failed":
          aVal = a.failed;
          bVal = b.failed;
          break;
        case "passRate":
          aVal = parseFloat(a.passRate);
          bVal = parseFloat(b.passRate);
          break;
        case "warnRate":
          aVal = parseFloat(a.warnRate);
          bVal = parseFloat(b.warnRate);
          break;
        case "failRate":
          aVal = parseFloat(a.failRate);
          bVal = parseFloat(b.failRate);
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [branchModalData?.mloData, sortColumn, sortDirection]);

  const SortIcon = ({ column }) => {
    if (sortColumn !== column) {
      return (
        <svg
          className="w-4 h-4 ml-1 text-slate-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M5 12l5 5 5-5H5zm10-4L10 3 5 8h10z" />
        </svg>
      );
    }
    return sortDirection === "asc" ? (
      <svg
        className="w-4 h-4 ml-1 text-blue-600"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M5 12l5 5 5-5H5z" opacity="0.3" />
        <path d="M15 8L10 3 5 8h10z" />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 ml-1 text-blue-600"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M15 8L10 3 5 8h10z" opacity="0.3" />
        <path d="M5 12l5 5 5-5H5z" />
      </svg>
    );
  };

  if (!branchModalData) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden"
        style={{ maxHeight: "calc(100vh - 2rem)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
          <h2 className="text-2xl font-bold text-slate-900 pr-4">
            {branchModalData.branchName} - Loan Officers
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
              {branchModalData.totalLoans}
            </span>
            <span className="ml-4 font-semibold text-slate-700">
              Loan Officers:{" "}
            </span>
            <span className="font-bold text-blue-600 text-xl">
              {branchModalData.mloData.length}
            </span>
          </p>
        </div>

        <div
          className="overflow-auto"
          style={{ maxHeight: "calc(100vh - 20rem)" }}
        >
          {branchModalData.mloData.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-lg">
              No loan officers found
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-200 sticky top-0">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-sm font-bold text-slate-700 cursor-pointer hover:bg-slate-300 transition-colors"
                    onClick={() => handleSort("mloId")}
                  >
                    <div className="flex items-center">
                      MLO NMLS ID
                      <SortIcon column="mloId" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-slate-700 cursor-pointer hover:bg-slate-300 transition-colors"
                    onClick={() => handleSort("total")}
                  >
                    <div className="flex items-center justify-center">
                      Total Loans
                      <SortIcon column="total" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-slate-700 cursor-pointer hover:bg-slate-300 transition-colors"
                    onClick={() => handleSort("passed")}
                  >
                    <div className="flex items-center justify-center">
                      Passed
                      <SortIcon column="passed" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-slate-700 cursor-pointer hover:bg-slate-300 transition-colors"
                    onClick={() => handleSort("warned")}
                  >
                    <div className="flex items-center justify-center">
                      Warnings
                      <SortIcon column="warned" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-slate-700 cursor-pointer hover:bg-slate-300 transition-colors"
                    onClick={() => handleSort("failed")}
                  >
                    <div className="flex items-center justify-center">
                      Failed
                      <SortIcon column="failed" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-slate-700 cursor-pointer hover:bg-slate-300 transition-colors"
                    onClick={() => handleSort("passRate")}
                  >
                    <div className="flex items-center justify-center">
                      Pass Rate
                      <SortIcon column="passRate" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-slate-700 cursor-pointer hover:bg-slate-300 transition-colors"
                    onClick={() => handleSort("warnRate")}
                  >
                    <div className="flex items-center justify-center">
                      Warn Rate
                      <SortIcon column="warnRate" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-slate-700 cursor-pointer hover:bg-slate-300 transition-colors"
                    onClick={() => handleSort("failRate")}
                  >
                    <div className="flex items-center justify-center">
                      Fail Rate
                      <SortIcon column="failRate" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {sortedMloData.map((mlo) => (
                  <tr
                    key={mlo.mloId}
                    className="border-b border-slate-200 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() =>
                          onMLOClick(branchModalData.branchName, mlo.mloId)
                        }
                        className="font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        {mlo.mloId}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-slate-700">
                      {mlo.total}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-emerald-600 font-semibold">
                      {mlo.passed}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-amber-600 font-semibold">
                      {mlo.warned}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-red-600 font-semibold">
                      {mlo.failed}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-slate-700">
                      {mlo.passRate}%
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-slate-700">
                      {mlo.warnRate}%
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-slate-700">
                      {mlo.failRate}%
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

export default BranchMLOModal;
