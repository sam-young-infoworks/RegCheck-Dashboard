<template>
  <main class="dashboard-shell">
    <section class="hero-card">
      <DashboardHeader :portfolio-stats="portfolioStats" />
      <p class="hero-copy">
        The dashboard is now using live Vue filter state against the existing
        loan dataset. This slice establishes the interaction model the chart,
        policy sections, table, and modal flows will reuse.
      </p>
      <div class="metric-grid">
        <article class="metric-card">
          <span class="metric-label">Displayed Loans</span>
          <strong class="metric-value">{{ filteredLoans.length }}</strong>
        </article>
        <article class="metric-card">
          <span class="metric-label">Pass Rate</span>
          <strong class="metric-value"
            >{{ filteredPortfolioStats.passRate }}%</strong
          >
        </article>
        <article class="metric-card">
          <span class="metric-label">Filters Active</span>
          <strong class="metric-value">{{ activeFilterCount }}</strong>
        </article>
      </div>
    </section>

    <section class="filter-layout">
      <BranchMLOFilters
        :filters="filters"
        :available-branches="availableBranches"
        :available-m-l-os="availableMLOs"
        @filter-change="handleFilterChange"
      />

      <LoanAttributeFilters
        :filters="filters"
        :open-dropdown="openDropdown"
        @filter-change="handleFilterChange"
        @toggle-dropdown="toggleDropdown"
      />
    </section>

    <section class="chart-layout">
      <BranchComplianceChart
        :branch-stats="branchStats"
        @branch-click="handleBranchClick"
      />
      <PolicyBranchHeatmap
        :heatmap-data="policyBranchHeatmapData"
        :policy-sets="policySets"
        :state-policy-sets="statePolicySets"
        @cell-click="handleHeatmapCellClick"
      />
    </section>

    <section class="status-panel">
      <div>
        <h2>Current Filter Snapshot</h2>
        <p>
          This is the first live interaction layer from the React dashboard.
          Branch and attribute filters now derive the same filtered population
          that later visualizations will consume.
        </p>
      </div>
      <div class="snapshot-grid">
        <article class="snapshot-card">
          <span class="snapshot-card__label">Branch Scope</span>
          <strong>{{ filters.branch || "All Branches" }}</strong>
        </article>
        <article class="snapshot-card">
          <span class="snapshot-card__label">MLO Scope</span>
          <strong>{{ filters.mlo || "All MLOs" }}</strong>
        </article>
        <article class="snapshot-card">
          <span class="snapshot-card__label">Federal Policies</span>
          <strong>{{ policySets.length }}</strong>
        </article>
        <article class="snapshot-card">
          <span class="snapshot-card__label">State Policies</span>
          <strong>{{ statePolicySets.length }}</strong>
        </article>
      </div>
      <ul class="pill-list">
        <li
          v-for="pill in activeFilterPills"
          :key="pill"
          class="pill-list__item"
        >
          {{ pill }}
        </li>
        <li
          v-if="activeFilterPills.length === 0"
          class="pill-list__item pill-list__item--muted"
        >
          No filters active
        </li>
      </ul>
    </section>

    <section id="policy-compliance-results" class="section-heading-block">
      <p class="filter-card__eyebrow">Compliance Results</p>
      <h2 class="section-heading-block__title">
        Policy Compliance Testing Results
      </h2>
    </section>

    <PolicyComplianceSection
      section-id="federal-policy-section"
      :policy-stats="policyStats"
      :expanded-policies="expandedPolicies"
      :is-state="false"
      @toggle-policy="handleTogglePolicy"
      @open-modal="openModal"
    />

    <PolicyComplianceSection
      section-id="state-policy-section"
      :policy-stats="statePolicyStats"
      :expanded-policies="expandedPolicies"
      :is-state="true"
      @toggle-policy="handleTogglePolicy"
      @open-modal="openModal"
    />

    <LoanDetailsTable
      :displayed-loans="displayedLoans"
      :policy-sets="policySets"
      :state-policy-sets="statePolicySets"
      :show-loan-table="showLoanTable"
      :loan-table-search-term="loanTableSearchTerm"
      @toggle-table="showLoanTable = !showLoanTable"
      @search-change="handleSearchChange"
    />

    <LoanListModal
      :modal-data="modalData"
      @close="closeModal"
      @loan-click="handleLoanClick"
      @open-image-modal="handleOpenImageModal"
    />

    <ImageModal
      :is-open="imageModalOpen"
      :image-url="currentImageUrl"
      @close="handleCloseImageModal"
    />

    <BranchMLOModal
      :branch-modal-data="branchModalData"
      @close="branchModalData = null"
      @mlo-click="handleMLOClick"
    />
  </main>
</template>

<script>
import { nextTick } from "vue";
import BranchComplianceChart from "./components/BranchComplianceChart.vue";
import BranchMLOModal from "./components/BranchMLOModal.vue";
import BranchMLOFilters from "./components/BranchMLOFilters.vue";
import DashboardHeader from "./components/DashboardHeader.vue";
import ImageModal from "./components/ImageModal.vue";
import LoanAttributeFilters from "./components/LoanAttributeFilters.vue";
import LoanDetailsTable from "./components/LoanDetailsTable.vue";
import LoanListModal from "./components/LoanListModal.vue";
import PolicyBranchHeatmap from "./components/PolicyBranchHeatmap.vue";
import PolicyComplianceSection from "./components/PolicyComplianceSection.vue";
import {
  calculateBranchStats,
  calculatePolicyBranchHeatmap,
  calculatePortfolioStats,
  calculatePolicyStats,
  calculateStatePolicyStats,
  getAvailableBranches,
  getAvailableMLOs,
  getBranchToMLOMapping,
} from "./utils/calculations";
import { filterLoans, filterLoansBySearch } from "./utils/filters";

export default {
  name: "MortgageComplianceDashboard",
  components: {
    BranchComplianceChart,
    BranchMLOModal,
    BranchMLOFilters,
    DashboardHeader,
    ImageModal,
    LoanAttributeFilters,
    LoanDetailsTable,
    LoanListModal,
    PolicyBranchHeatmap,
    PolicyComplianceSection,
  },
  props: {
    loans: {
      type: Array,
      default: () => [],
    },
    policySets: {
      type: Array,
      default: () => [],
    },
    statePolicySets: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      filters: {
        branch: "",
        mlo: "",
        amortizationType: [],
        loanTerm: [],
        loanType: [],
        purpose: [],
        occupancy: [],
      },
      openDropdown: null,
      expandedPolicies: [],
      showLoanTable: false,
      loanTableSearchTerm: "",
      modalData: null,
      imageModalOpen: false,
      currentImageUrl: null,
      branchModalData: null,
    };
  },
  computed: {
    portfolioStats() {
      return calculatePortfolioStats(this.loans);
    },
    filteredPortfolioStats() {
      return calculatePortfolioStats(this.filteredLoans);
    },
    availableBranches() {
      return getAvailableBranches(this.loans);
    },
    branchToMLOMapping() {
      return getBranchToMLOMapping(this.loans);
    },
    availableMLOs() {
      return getAvailableMLOs(
        this.loans,
        this.filters.branch,
        this.branchToMLOMapping,
      );
    },
    filteredLoans() {
      return filterLoans(this.loans, this.filters);
    },
    displayedLoans() {
      return filterLoansBySearch(this.filteredLoans, this.loanTableSearchTerm);
    },
    branchStats() {
      return calculateBranchStats(this.loans);
    },
    policyStats() {
      return calculatePolicyStats(this.filteredLoans, this.policySets);
    },
    statePolicyStats() {
      return calculateStatePolicyStats(
        this.filteredLoans,
        this.statePolicySets,
      );
    },
    policyBranchHeatmapData() {
      return calculatePolicyBranchHeatmap(
        this.loans,
        this.availableBranches,
        this.policySets,
        this.statePolicySets,
      );
    },
    activeFilterCount() {
      let count = 0;

      if (this.filters.branch) count += 1;
      if (this.filters.mlo) count += 1;

      return (
        count +
        this.filters.amortizationType.length +
        this.filters.loanTerm.length +
        this.filters.loanType.length +
        this.filters.purpose.length +
        this.filters.occupancy.length
      );
    },
    activeFilterPills() {
      const pills = [];

      if (this.filters.branch) pills.push(`Branch: ${this.filters.branch}`);
      if (this.filters.mlo) pills.push(`MLO: ${this.filters.mlo}`);

      const multiSelectMap = {
        amortizationType: "Amortization",
        loanTerm: "Term",
        loanType: "Type",
        purpose: "Purpose",
        occupancy: "Occupancy",
      };

      Object.entries(multiSelectMap).forEach(([key, label]) => {
        this.filters[key].forEach((value) => {
          pills.push(`${label}: ${value}`);
        });
      });

      return pills;
    },
  },
  methods: {
    handleFilterChange(category, value) {
      if (category === "branch") {
        const nextFilters = {
          ...this.filters,
          branch: value,
        };

        if (
          value &&
          this.filters.mlo &&
          this.branchToMLOMapping[value] &&
          !this.branchToMLOMapping[value].includes(this.filters.mlo)
        ) {
          nextFilters.mlo = "";
        }

        this.filters = nextFilters;
        return;
      }

      if (category === "mlo") {
        this.filters = {
          ...this.filters,
          mlo: value,
        };
        return;
      }

      if (Array.isArray(value)) {
        this.filters = {
          ...this.filters,
          [category]: value,
        };
        return;
      }

      const currentValues = this.filters[category];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      this.filters = {
        ...this.filters,
        [category]: updatedValues,
      };
    },
    toggleDropdown(dropdownName) {
      this.openDropdown =
        this.openDropdown === dropdownName ? null : dropdownName;
    },
    handleBranchClick(branchName) {
      const branchLoans =
        branchName === "All Branches"
          ? this.loans
          : this.loans.filter((loan) => loan.branchId === branchName);

      const mloStats = {};

      branchLoans.forEach((loan) => {
        if (!mloStats[loan.mloNmlsId]) {
          mloStats[loan.mloNmlsId] = {
            total: 0,
            failed: 0,
            warned: 0,
            passed: 0,
          };
        }

        mloStats[loan.mloNmlsId].total += 1;
        if (loan.overallStatus === "fail") mloStats[loan.mloNmlsId].failed += 1;
        else if (loan.overallStatus === "warn")
          mloStats[loan.mloNmlsId].warned += 1;
        else mloStats[loan.mloNmlsId].passed += 1;
      });

      const mloData = Object.keys(mloStats)
        .map((mloId) => ({
          mloId,
          total: mloStats[mloId].total,
          failed: mloStats[mloId].failed,
          warned: mloStats[mloId].warned,
          passed: mloStats[mloId].passed,
          failRate:
            mloStats[mloId].total > 0
              ? (
                  (mloStats[mloId].failed / mloStats[mloId].total) *
                  100
                ).toFixed(1)
              : "0",
          warnRate:
            mloStats[mloId].total > 0
              ? (
                  (mloStats[mloId].warned / mloStats[mloId].total) *
                  100
                ).toFixed(1)
              : "0",
          passRate:
            mloStats[mloId].total > 0
              ? (
                  (mloStats[mloId].passed / mloStats[mloId].total) *
                  100
                ).toFixed(1)
              : "0",
        }))
        .sort((left, right) => right.total - left.total);

      this.branchModalData = {
        branchName,
        mloData,
        totalLoans: branchLoans.length,
      };
    },
    handleTogglePolicy(policyKey) {
      if (this.expandedPolicies.includes(policyKey)) {
        this.expandedPolicies = this.expandedPolicies.filter(
          (key) => key !== policyKey,
        );
        return;
      }

      this.expandedPolicies = [...this.expandedPolicies, policyKey];
    },
    openModal(policyName, ruleName, status, isState = false) {
      const matchingLoans = this.filteredLoans.filter((loan) => {
        if (ruleName) {
          if (isState) {
            return (
              loan.stateRuleResults[policyName] &&
              loan.stateRuleResults[policyName][ruleName] === status
            );
          }

          return (
            loan.ruleResults[policyName] &&
            loan.ruleResults[policyName][ruleName] === status
          );
        }

        return isState
          ? loan.statePolicyResults[policyName] === status
          : loan.policyResults[policyName] === status;
      });

      this.modalData = {
        title: ruleName
          ? `${policyName} - ${ruleName} (${status})`
          : `${policyName} (${status})`,
        loans: matchingLoans,
        status,
      };
    },
    closeModal() {
      this.modalData = null;
    },
    async handleLoanClick(loanId) {
      this.modalData = null;
      this.showLoanTable = true;
      this.loanTableSearchTerm = loanId;

      await nextTick();

      window.setTimeout(() => {
        const element = document.getElementById(`loan-${loanId}`);
        if (!element) {
          return;
        }

        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("loan-table__row--highlight");
        window.setTimeout(() => {
          element.classList.remove("loan-table__row--highlight");
        }, 3000);
      }, 250);
    },
    handleSearchChange(value) {
      this.loanTableSearchTerm = value;
    },
    async handleMLOClick(branchName, mloId) {
      this.branchModalData = null;
      this.filters = {
        ...this.filters,
        branch: branchName !== "All Branches" ? branchName : "",
        mlo: mloId,
      };

      await nextTick();
      const element = document.getElementById("policy-compliance-results");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    async handleHeatmapCellClick(branchName, policyName, isState) {
      this.filters = {
        ...this.filters,
        branch: branchName !== "All Branches" ? branchName : "",
        mlo: "",
      };

      this.expandedPolicies = [isState ? `state-${policyName}` : policyName];

      await nextTick();
      const elementId = isState
        ? `state-policy-${policyName}`
        : `policy-${policyName}`;
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    handleOpenImageModal(imageUrl) {
      this.currentImageUrl = imageUrl;
      this.imageModalOpen = true;
    },
    handleCloseImageModal() {
      this.imageModalOpen = false;
      this.currentImageUrl = null;
    },
  },
};
</script>
