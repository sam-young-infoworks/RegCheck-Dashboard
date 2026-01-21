import React from "react";
import MortgageComplianceDashboard from "./MortgageComplianceDashboard";
import { useLoanData } from "./hooks/useLoanData";
import { federalPolicies, statePolicies } from "./data/policyDefinitions";

function App() {
  const { loans, loading, error } = useLoanData(federalPolicies, statePolicies);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading compliance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg border border-red-200 max-w-md">
          <div className="text-red-600 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
            <p className="text-slate-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MortgageComplianceDashboard
      loans={loans}
      policySets={federalPolicies}
      statePolicySets={statePolicies}
    />
  );
}

export default App;
