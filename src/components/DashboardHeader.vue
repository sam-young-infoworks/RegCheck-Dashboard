<template>
  <header class="dashboard-header">
    <div>
      <p class="eyebrow">Iowa Portfolio Overview</p>
      <h1 class="dashboard-title">
        <Shield class="dashboard-title__icon" />
        <span>Mortgage Compliance Dashboard - Iowa</span>
      </h1>
      <p class="dashboard-subtitle">
        Automated regulatory audit analysis across {{ portfolioStats.total }}
        loan files
      </p>
    </div>
  </header>
</template>

<script>
import { Shield } from "lucide-vue-next";

export default {
  name: "DashboardHeader",
  components: {
    Shield,
  },
  props: {
    portfolioStats: {
      type: Object,
      required: true,
    },
  },
};
</script>
