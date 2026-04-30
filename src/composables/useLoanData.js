import { onMounted, ref } from "vue";
import { fetchLoanData } from "../services/loanDataService";

export const useLoanData = (policyDefinitions, statePolicyDefinitions) => {
  const loans = ref([]);
  const loading = ref(true);
  const error = ref(null);

  const loadData = async () => {
    try {
      loading.value = true;
      error.value = null;
      loans.value = await fetchLoanData(
        policyDefinitions,
        statePolicyDefinitions,
      );
    } catch (err) {
      error.value = err.message || "Failed to load loan data";
      console.error("Error loading loan data:", err);
    } finally {
      loading.value = false;
    }
  };

  onMounted(loadData);

  return {
    error,
    loading,
    loans,
    loadData,
  };
};
