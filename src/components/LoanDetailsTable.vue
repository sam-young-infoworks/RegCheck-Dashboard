<template>
  <section class="panel-card panel-card--table">
    <div class="panel-card__header panel-card__header--table">
      <div>
        <p class="filter-card__eyebrow">Loan File Details</p>
        <h2 class="panel-card__title">Loan File Details</h2>
      </div>
      <button
        type="button"
        class="secondary-button"
        @click="$emit('toggle-table')"
      >
        {{ showLoanTable ? "Hide Table" : "Show Table" }}
      </button>
    </div>

    <div v-if="showLoanTable" class="table-shell">
      <input
        :value="loanTableSearchTerm"
        type="text"
        class="table-search"
        placeholder="Search by Loan ID..."
        @input="$emit('search-change', $event.target.value)"
      />

      <div class="loan-table-scroll">
        <table class="loan-table">
          <thead>
            <tr>
              <th
                rowspan="2"
                class="loan-table__sticky loan-table__sticky--loan"
              >
                Loan ID
              </th>
              <th
                rowspan="2"
                class="loan-table__sticky loan-table__sticky--branch"
              >
                Branch ID
              </th>
              <th
                rowspan="2"
                class="loan-table__sticky loan-table__sticky--mlo"
              >
                MLO NMLS
              </th>
              <th
                rowspan="2"
                class="loan-table__sticky loan-table__sticky--type"
              >
                Type
              </th>
              <th
                rowspan="2"
                class="loan-table__sticky loan-table__sticky--term"
              >
                Term
              </th>
              <th
                rowspan="2"
                class="loan-table__sticky loan-table__sticky--amort"
              >
                Amort
              </th>
              <th
                rowspan="2"
                class="loan-table__sticky loan-table__sticky--purpose"
              >
                Purpose
              </th>
              <th
                rowspan="2"
                class="loan-table__sticky loan-table__sticky--occupancy"
              >
                Occupancy
              </th>
              <th
                rowspan="2"
                class="loan-table__sticky loan-table__sticky--amount"
              >
                Amount
              </th>
              <th rowspan="2">Overall</th>
              <th :colspan="federalRuleCount">Federal Policies</th>
              <th :colspan="stateRuleCount">State Policies (Iowa)</th>
            </tr>
            <tr>
              <template v-for="policy in policySets" :key="policy.name">
                <th
                  v-for="rule in policy.rules"
                  :key="`${policy.name}-${rule}`"
                  class="loan-table__rule-header"
                >
                  <div>{{ policy.name }}</div>
                  <small>{{ rule }}</small>
                </th>
              </template>
              <template
                v-for="policy in statePolicySets"
                :key="`state-${policy.name}`"
              >
                <th
                  v-for="rule in policy.rules"
                  :key="`state-${policy.name}-${rule}`"
                  class="loan-table__rule-header loan-table__rule-header--state"
                >
                  <div>{{ policy.name }}</div>
                  <small>{{ rule }}</small>
                </th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="loan in displayedLoans.slice(0, 50)"
              :id="`loan-${loan.id}`"
              :key="loan.id"
            >
              <td class="loan-table__sticky loan-table__sticky--loan">
                {{ loan.id }}
              </td>
              <td class="loan-table__sticky loan-table__sticky--branch">
                {{ loan.branchId }}
              </td>
              <td class="loan-table__sticky loan-table__sticky--mlo">
                {{ loan.mloNmlsId }}
              </td>
              <td class="loan-table__sticky loan-table__sticky--type">
                {{ loan.loanType }}
              </td>
              <td class="loan-table__sticky loan-table__sticky--term">
                {{ loan.loanTerm }}y
              </td>
              <td class="loan-table__sticky loan-table__sticky--amort">
                {{ loan.amortizationType }}
              </td>
              <td class="loan-table__sticky loan-table__sticky--purpose">
                {{ loan.purpose }}
              </td>
              <td class="loan-table__sticky loan-table__sticky--occupancy">
                {{ loan.occupancy }}
              </td>
              <td class="loan-table__sticky loan-table__sticky--amount">
                ${{ loan.amount.toLocaleString() }}
              </td>
              <td><span :class="statusDotClass(loan.overallStatus)"></span></td>
              <template
                v-for="policy in policySets"
                :key="`${loan.id}-${policy.name}`"
              >
                <td
                  v-for="rule in policy.rules"
                  :key="`${loan.id}-${policy.name}-${rule}`"
                >
                  <span
                    :class="
                      statusDotClass(
                        loan.ruleResults[policy.name]?.[rule] || 'unknown',
                      )
                    "
                  ></span>
                </td>
              </template>
              <template
                v-for="policy in statePolicySets"
                :key="`${loan.id}-state-${policy.name}`"
              >
                <td
                  v-for="rule in policy.rules"
                  :key="`${loan.id}-state-${policy.name}-${rule}`"
                >
                  <span
                    :class="
                      statusDotClass(
                        loan.stateRuleResults[policy.name]?.[rule] || 'unknown',
                      )
                    "
                  ></span>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="displayedLoans.length > 50" class="table-caption">
        Showing first 50 of {{ displayedLoans.length }} loans
      </p>

      <div class="table-legend">
        <span><i class="status-dot status-dot--pass"></i> Pass</span>
        <span><i class="status-dot status-dot--warn"></i> Warning</span>
        <span><i class="status-dot status-dot--fail"></i> Fail</span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "LoanDetailsTable",
  props: {
    displayedLoans: {
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
    showLoanTable: {
      type: Boolean,
      default: false,
    },
    loanTableSearchTerm: {
      type: String,
      default: "",
    },
  },
  emits: ["toggle-table", "search-change"],
  computed: {
    federalRuleCount() {
      return this.policySets.reduce(
        (sum, policy) => sum + (policy.rules.length || 1),
        0,
      );
    },
    stateRuleCount() {
      return this.statePolicySets.reduce(
        (sum, policy) => sum + (policy.rules.length || 1),
        0,
      );
    },
  },
  methods: {
    statusDotClass(status) {
      if (status === "pass") return "status-dot status-dot--pass";
      if (status === "warn") return "status-dot status-dot--warn";
      if (status === "fail") return "status-dot status-dot--fail";
      return "status-dot status-dot--unknown";
    },
  },
};
</script>
