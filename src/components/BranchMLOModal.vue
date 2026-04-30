<template>
  <div v-if="branchModalData" class="modal-overlay" @click="$emit('close')">
    <div class="modal-card modal-card--wide modal-card--mlo" @click.stop>
      <header class="modal-card__header">
        <h2>{{ branchModalData.branchName }} - Loan Officers</h2>
        <button
          type="button"
          class="modal-close-button"
          @click="$emit('close')"
        >
          ×
        </button>
      </header>

      <div class="modal-card__summary modal-card__summary--dual">
        <span
          >Total Loans <strong>{{ branchModalData.totalLoans }}</strong></span
        >
        <span
          >Loan Officers
          <strong>{{ branchModalData.mloData.length }}</strong></span
        >
      </div>

      <div class="modal-card__content">
        <div v-if="sortedMloData.length === 0" class="empty-state">
          No loan officers found.
        </div>
        <table v-else class="data-table">
          <thead>
            <tr>
              <th v-for="column in columns" :key="column.key">
                <button
                  type="button"
                  class="sort-button"
                  @click="handleSort(column.key)"
                >
                  {{ column.label }}
                  <span class="sort-button__indicator">
                    {{
                      sortColumn === column.key
                        ? sortDirection === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"
                    }}
                  </span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mlo in sortedMloData" :key="mlo.mloId">
              <td>
                <button
                  type="button"
                  class="loan-link-button"
                  @click="
                    $emit('mlo-click', branchModalData.branchName, mlo.mloId)
                  "
                >
                  {{ mlo.mloId }}
                </button>
              </td>
              <td>{{ mlo.total }}</td>
              <td>{{ mlo.passed }}</td>
              <td>{{ mlo.warned }}</td>
              <td>{{ mlo.failed }}</td>
              <td>{{ mlo.passRate }}%</td>
              <td>{{ mlo.warnRate }}%</td>
              <td>{{ mlo.failRate }}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer class="modal-card__footer">
        <button type="button" class="secondary-button" @click="$emit('close')">
          Close
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "BranchMLOModal",
  props: {
    branchModalData: {
      type: Object,
      default: null,
    },
  },
  emits: ["close", "mlo-click"],
  data() {
    return {
      columns: [
        { key: "mloId", label: "MLO NMLS ID" },
        { key: "total", label: "Total Loans" },
        { key: "passed", label: "Passed" },
        { key: "warned", label: "Warnings" },
        { key: "failed", label: "Failed" },
        { key: "passRate", label: "Pass Rate" },
        { key: "warnRate", label: "Warn Rate" },
        { key: "failRate", label: "Fail Rate" },
      ],
      sortColumn: "total",
      sortDirection: "desc",
    };
  },
  computed: {
    sortedMloData() {
      if (!this.branchModalData?.mloData) {
        return [];
      }

      return [...this.branchModalData.mloData].sort((left, right) => {
        const leftValue = ["passRate", "warnRate", "failRate"].includes(
          this.sortColumn,
        )
          ? Number.parseFloat(left[this.sortColumn])
          : left[this.sortColumn];
        const rightValue = ["passRate", "warnRate", "failRate"].includes(
          this.sortColumn,
        )
          ? Number.parseFloat(right[this.sortColumn])
          : right[this.sortColumn];

        if (leftValue < rightValue) {
          return this.sortDirection === "asc" ? -1 : 1;
        }
        if (leftValue > rightValue) {
          return this.sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
    },
  },
  methods: {
    handleSort(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
        return;
      }

      this.sortColumn = column;
      this.sortDirection = "desc";
    },
  },
};
</script>
