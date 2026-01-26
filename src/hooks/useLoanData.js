import { useState, useEffect } from "react";
import { fetchLoanData } from "../services/loanDataService";

/**
 * Custom hook to fetch and manage loan compliance data
 * @param {Array} policyDefinitions - Federal policy definitions
 * @param {Array} statePolicyDefinitions - State policy definitions
 * @returns {Object} { loans, loading, error }
 */
export const useLoanData = (policyDefinitions, statePolicyDefinitions) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLoanData(
          policyDefinitions,
          statePolicyDefinitions,
        );
        setLoans(data);
      } catch (err) {
        setError(err.message || "Failed to load loan data");
        console.error("Error loading loan data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [policyDefinitions, statePolicyDefinitions]);

  return { loans, loading, error };
};
