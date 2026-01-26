import React from "react";

const LoanDetailsTable = ({
  displayedLoans,
  policySets,
  statePolicySets,
  showLoanTable,
  loanTableSearchTerm,
  onToggleTable,
  onSearchChange,
}) => {
  if (!showLoanTable) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900">
            Loan File Details
          </h3>
          <button
            onClick={onToggleTable}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Show Table
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-900">Loan File Details</h3>
        <button
          onClick={onToggleTable}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Hide Table
        </button>
      </div>

      <div className="mt-4">
        <input
          type="text"
          placeholder="Search by Loan ID..."
          value={loanTableSearchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <div className="flex border border-slate-200 rounded mb-2">
          <div
            className="flex-shrink-0 bg-slate-100 border-r-2 border-slate-400"
            style={{ width: "830px" }}
          ></div>
          <div
            className="flex-1 overflow-x-auto"
            onScroll={(e) => {
              const bottomScroll = document.getElementById("loan-table-scroll");
              if (bottomScroll) {
                bottomScroll.scrollLeft = e.target.scrollLeft;
              }
            }}
          >
            <div style={{ width: "5000px", height: "1px" }}></div>
          </div>
        </div>

        <div
          id="loan-table-scroll"
          className="overflow-x-auto border border-slate-200 rounded-lg"
          style={{ position: "relative" }}
          onScroll={(e) => {
            const topScrollContainer = e.target.parentElement.querySelector(
              ".flex > div:last-child",
            );
            if (topScrollContainer) {
              topScrollContainer.scrollLeft = e.target.scrollLeft;
            }
          }}
        >
          <table
            className="w-full border-collapse"
            style={{ position: "relative" }}
          >
            <thead className="bg-slate-100">
              <tr className="border-b border-slate-300">
                <th
                  rowSpan="2"
                  style={{
                    position: "sticky",
                    left: 0,
                    zIndex: 50,
                    width: "100px",
                    minWidth: "100px",
                    maxWidth: "100px",
                  }}
                  className="px-3 py-3 text-left text-xs font-bold text-slate-700 border-r border-slate-300 bg-slate-100"
                >
                  Loan ID
                </th>
                <th
                  rowSpan="2"
                  style={{
                    position: "sticky",
                    left: "100px",
                    zIndex: 50,
                    width: "90px",
                    minWidth: "90px",
                    maxWidth: "90px",
                  }}
                  className="px-3 py-3 text-left text-xs font-bold text-slate-700 border-r border-slate-300 bg-slate-100"
                >
                  Branch ID
                </th>
                <th
                  rowSpan="2"
                  style={{
                    position: "sticky",
                    left: "190px",
                    zIndex: 50,
                    width: "90px",
                    minWidth: "90px",
                    maxWidth: "90px",
                  }}
                  className="px-3 py-3 text-left text-xs font-bold text-slate-700 border-r border-slate-300 bg-slate-100"
                >
                  MLO NMLS
                </th>
                <th
                  rowSpan="2"
                  style={{
                    position: "sticky",
                    left: "280px",
                    zIndex: 50,
                    width: "80px",
                    minWidth: "80px",
                    maxWidth: "80px",
                  }}
                  className="px-3 py-3 text-left text-xs font-bold text-slate-700 border-r border-slate-300 bg-slate-100"
                >
                  Type
                </th>
                <th
                  rowSpan="2"
                  style={{
                    position: "sticky",
                    left: "360px",
                    zIndex: 50,
                    width: "60px",
                    minWidth: "60px",
                    maxWidth: "60px",
                  }}
                  className="px-3 py-3 text-left text-xs font-bold text-slate-700 border-r border-slate-300 bg-slate-100"
                >
                  Term
                </th>
                <th
                  rowSpan="2"
                  style={{
                    position: "sticky",
                    left: "420px",
                    zIndex: 50,
                    width: "80px",
                    minWidth: "80px",
                    maxWidth: "80px",
                  }}
                  className="px-3 py-3 text-left text-xs font-bold text-slate-700 border-r border-slate-300 bg-slate-100"
                >
                  Amort
                </th>
                <th
                  rowSpan="2"
                  style={{
                    position: "sticky",
                    left: "500px",
                    zIndex: 50,
                    width: "100px",
                    minWidth: "100px",
                    maxWidth: "100px",
                  }}
                  className="px-3 py-3 text-left text-xs font-bold text-slate-700 border-r border-slate-300 bg-slate-100"
                >
                  Purpose
                </th>
                <th
                  rowSpan="2"
                  style={{
                    position: "sticky",
                    left: "600px",
                    zIndex: 50,
                    width: "110px",
                    minWidth: "110px",
                    maxWidth: "110px",
                  }}
                  className="px-3 py-3 text-left text-xs font-bold text-slate-700 border-r border-slate-300 bg-slate-100"
                >
                  Occupancy
                </th>
                <th
                  rowSpan="2"
                  style={{
                    position: "sticky",
                    left: "710px",
                    zIndex: 50,
                    width: "120px",
                    minWidth: "120px",
                    maxWidth: "120px",
                    boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                  }}
                  className="px-3 py-3 text-left text-xs font-bold text-slate-700 border-r-2 border-slate-400 bg-slate-100"
                >
                  Amount
                </th>
                <th
                  rowSpan="2"
                  className="px-3 py-3 text-center text-xs font-bold text-slate-700 border-r-2 border-slate-400 bg-blue-50"
                >
                  Overall
                </th>
                <th
                  colSpan={policySets.reduce(
                    (sum, p) => sum + (p.rules.length || 1),
                    0,
                  )}
                  className="px-3 py-2 text-center text-xs font-bold text-slate-700 border-r-2 border-slate-400 bg-emerald-50"
                >
                  Federal Policies
                </th>
                <th
                  colSpan={statePolicySets.reduce(
                    (sum, p) => sum + (p.rules.length || 1),
                    0,
                  )}
                  className="px-3 py-2 text-center text-xs font-bold text-slate-700 border-r border-slate-300 bg-amber-50"
                >
                  State Policies (Iowa)
                </th>
              </tr>
              <tr className="border-b-2 border-slate-400">
                {policySets.map((policy, policyIndex) =>
                  policy.rules.map((rule, idx) => (
                    <th
                      key={`${policy.name}-${rule}`}
                      className={`px-2 py-2 text-center text-xs font-semibold text-slate-600 border-r border-slate-300 ${policyIndex === 0 && idx === 0 ? "border-l-2 border-l-slate-400" : ""}`}
                      style={{ minWidth: "80px" }}
                      title={`${policy.name} - ${rule}`}
                    >
                      <div className="font-bold text-emerald-700">
                        {policy.name}
                      </div>
                      <div className="text-slate-600">{rule}</div>
                    </th>
                  )),
                )}
                {statePolicySets.map((policy, policyIdx) =>
                  policy.rules.map((rule, idx) => (
                    <th
                      key={`state-${policy.name}-${rule}`}
                      className={`px-2 py-2 text-center text-xs font-semibold text-slate-600 border-r border-slate-300 ${policyIdx === 0 && idx === 0 ? "border-l-2 border-l-slate-400" : ""}`}
                      style={{ minWidth: "80px" }}
                      title={`${policy.state} - ${policy.name} - ${rule}`}
                    >
                      <div className="font-bold text-amber-700">
                        {policy.name}
                      </div>
                      <div className="text-slate-600">{rule}</div>
                    </th>
                  )),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {displayedLoans.slice(0, 50).map((loan) => (
                <tr
                  key={loan.id}
                  id={`loan-${loan.id}`}
                  className="group hover:bg-slate-50 transition-colors"
                >
                  <td
                    style={{
                      position: "sticky",
                      left: 0,
                      zIndex: 40,
                      width: "100px",
                      minWidth: "100px",
                      maxWidth: "100px",
                    }}
                    className="px-3 py-2 text-xs font-semibold text-slate-900 whitespace-nowrap border-r border-slate-200 bg-white group-hover:bg-slate-50"
                  >
                    {loan.id}
                  </td>
                  <td
                    style={{
                      position: "sticky",
                      left: "100px",
                      zIndex: 40,
                      width: "90px",
                      minWidth: "90px",
                      maxWidth: "90px",
                    }}
                    className="px-3 py-2 text-xs text-slate-700 whitespace-nowrap border-r border-slate-200 bg-white group-hover:bg-slate-50"
                  >
                    {loan.branchId}
                  </td>
                  <td
                    style={{
                      position: "sticky",
                      left: "190px",
                      zIndex: 40,
                      width: "90px",
                      minWidth: "90px",
                      maxWidth: "90px",
                    }}
                    className="px-3 py-2 text-xs text-slate-700 whitespace-nowrap border-r border-slate-200 bg-white group-hover:bg-slate-50"
                  >
                    {loan.mloNmlsId}
                  </td>
                  <td
                    style={{
                      position: "sticky",
                      left: "280px",
                      zIndex: 40,
                      width: "80px",
                      minWidth: "80px",
                      maxWidth: "80px",
                    }}
                    className="px-3 py-2 text-xs text-slate-700 whitespace-nowrap border-r border-slate-200 bg-white group-hover:bg-slate-50"
                  >
                    {loan.loanType}
                  </td>
                  <td
                    style={{
                      position: "sticky",
                      left: "360px",
                      zIndex: 40,
                      width: "60px",
                      minWidth: "60px",
                      maxWidth: "60px",
                    }}
                    className="px-3 py-2 text-xs text-slate-700 whitespace-nowrap border-r border-slate-200 bg-white group-hover:bg-slate-50"
                  >
                    {loan.loanTerm}y
                  </td>
                  <td
                    style={{
                      position: "sticky",
                      left: "420px",
                      zIndex: 40,
                      width: "80px",
                      minWidth: "80px",
                      maxWidth: "80px",
                    }}
                    className="px-3 py-2 text-xs text-slate-700 whitespace-nowrap border-r border-slate-200 bg-white group-hover:bg-slate-50"
                  >
                    {loan.amortizationType}
                  </td>
                  <td
                    style={{
                      position: "sticky",
                      left: "500px",
                      zIndex: 40,
                      width: "100px",
                      minWidth: "100px",
                      maxWidth: "100px",
                    }}
                    className="px-3 py-2 text-xs text-slate-700 whitespace-nowrap border-r border-slate-200 bg-white group-hover:bg-slate-50"
                  >
                    {loan.purpose}
                  </td>
                  <td
                    style={{
                      position: "sticky",
                      left: "600px",
                      zIndex: 40,
                      width: "110px",
                      minWidth: "110px",
                      maxWidth: "110px",
                    }}
                    className="px-3 py-2 text-xs text-slate-700 whitespace-nowrap border-r border-slate-200 bg-white group-hover:bg-slate-50"
                  >
                    {loan.occupancy}
                  </td>
                  <td
                    style={{
                      position: "sticky",
                      left: "710px",
                      zIndex: 40,
                      width: "120px",
                      minWidth: "120px",
                      maxWidth: "120px",
                      boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                    }}
                    className="px-3 py-2 text-xs text-slate-700 whitespace-nowrap border-r-2 border-slate-300 bg-white group-hover:bg-slate-50"
                  >
                    ${loan.amount.toLocaleString()}
                  </td>
                  <td className="px-2 py-2 text-center border-r-2 border-slate-300">
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        loan.overallStatus === "pass"
                          ? "bg-emerald-500"
                          : loan.overallStatus === "warn"
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                      title={loan.overallStatus}
                    ></span>
                  </td>
                  {policySets.map((policy) =>
                    policy.rules.map((rule) => {
                      const ruleStatus =
                        loan.ruleResults[policy.name]?.[rule] || "unknown";
                      return (
                        <td
                          key={`${loan.id}-${policy.name}-${rule}`}
                          className="px-2 py-2 text-center border-r border-slate-200"
                        >
                          <span
                            className={`inline-block w-3 h-3 rounded-full ${
                              ruleStatus === "pass"
                                ? "bg-emerald-500"
                                : ruleStatus === "warn"
                                  ? "bg-amber-500"
                                  : ruleStatus === "fail"
                                    ? "bg-red-500"
                                    : "bg-slate-300"
                            }`}
                            title={ruleStatus}
                          ></span>
                        </td>
                      );
                    }),
                  )}
                  {statePolicySets.map((policy) =>
                    policy.rules.map((rule) => {
                      const ruleStatus =
                        loan.stateRuleResults[policy.name]?.[rule] || "unknown";
                      return (
                        <td
                          key={`${loan.id}-state-${policy.name}-${rule}`}
                          className="px-2 py-2 text-center border-r border-slate-200"
                        >
                          <span
                            className={`inline-block w-3 h-3 rounded-full ${
                              ruleStatus === "pass"
                                ? "bg-emerald-500"
                                : ruleStatus === "warn"
                                  ? "bg-amber-500"
                                  : ruleStatus === "fail"
                                    ? "bg-red-500"
                                    : "bg-slate-300"
                            }`}
                            title={ruleStatus}
                          ></span>
                        </td>
                      );
                    }),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {displayedLoans.length > 50 && (
          <p className="text-sm text-slate-600 mt-4 text-center">
            Showing first 50 of {displayedLoans.length} loans
          </p>
        )}
        <div className="mt-4 p-4 bg-slate-50 rounded-lg">
          <p className="text-sm font-semibold text-slate-700 mb-2">Legend:</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-xs text-slate-600">Pass</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-xs text-slate-600">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-xs text-slate-600">Fail</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetailsTable;
