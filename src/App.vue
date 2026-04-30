<template>
  <div class="app-shell">
    <div v-if="loading" class="state-card state-card--loading">
      <div class="spinner" aria-hidden="true"></div>
      <p>Loading compliance data...</p>
    </div>

    <div v-else-if="error" class="state-card state-card--error">
      <h1>Unable to Load Data</h1>
      <p>{{ error }}</p>
    </div>

    <MortgageComplianceDashboard
      v-else
      :loans="loans"
      :policy-sets="federalPolicies"
      :state-policy-sets="statePolicies"
    />
  </div>
</template>

<script>
import MortgageComplianceDashboard from "./MortgageComplianceDashboard.vue";
import { federalPolicies, statePolicies } from "./data/policyDefinitions";
import { useLoanData } from "./composables/useLoanData";

export default {
  name: "App",
  components: {
    MortgageComplianceDashboard,
  },
  setup() {
    const { loans, loading, error } = useLoanData(
      federalPolicies,
      statePolicies,
    );

    return {
      error,
      federalPolicies,
      loading,
      loans,
      statePolicies,
    };
  },
};
</script>
