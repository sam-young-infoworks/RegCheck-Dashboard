<template>
  <div v-if="modalData" class="modal-overlay" @click="$emit('close')">
    <div class="modal-card modal-card--wide" @click.stop>
      <header class="modal-card__header">
        <h2>{{ modalData.title }}</h2>
        <button
          type="button"
          class="modal-close-button"
          @click="$emit('close')"
        >
          ×
        </button>
      </header>

      <div class="modal-card__summary">
        <span>Total Loans</span>
        <strong>{{ modalData.loans.length }}</strong>
      </div>

      <div class="modal-card__content">
        <div v-if="modalData.loans.length === 0" class="empty-state">
          No loans found with this status.
        </div>
        <table v-else class="data-table">
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Branch ID</th>
              <th>MLO NMLS</th>
              <th>Type</th>
              <th>Term</th>
              <th>Amortization</th>
              <th>Purpose</th>
              <th>Occupancy</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="loan in modalData.loans" :key="loan.id">
              <td>
                <div class="loan-link-cluster">
                  <button
                    type="button"
                    class="loan-link-button"
                    @click="$emit('loan-click', loan.id)"
                  >
                    {{ loan.id }}
                  </button>
                  <button
                    type="button"
                    class="icon-chip"
                    title="View PDF"
                    @click="$emit('open-image-modal', sampleDocument)"
                  >
                    PDF
                  </button>
                  <button
                    type="button"
                    class="icon-chip icon-chip--brand"
                    title="Open in RegCheck"
                    @click="$emit('open-image-modal', sampleDocument)"
                  >
                    RC
                  </button>
                </div>
              </td>
              <td>{{ loan.branchId }}</td>
              <td>{{ loan.mloNmlsId }}</td>
              <td>{{ loan.loanType }}</td>
              <td>{{ loan.loanTerm }}y</td>
              <td>{{ loan.amortizationType }}</td>
              <td>{{ loan.purpose }}</td>
              <td>{{ loan.occupancy }}</td>
              <td>${{ loan.amount.toLocaleString() }}</td>
              <td>
                <span :class="getStatusColor(modalData.status)">
                  <component
                    :is="statusIcon(modalData.status)"
                    class="status-badge__icon"
                  />
                  {{ modalData.status }}
                </span>
              </td>
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
import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-vue-next";
import sampleDocument from "../assets/sample-pdf.jpg";
import { getStatusColor } from "../utils/statusHelpers";

export default {
  name: "LoanListModal",
  props: {
    modalData: {
      type: Object,
      default: null,
    },
  },
  emits: ["close", "loan-click", "open-image-modal"],
  methods: {
    getStatusColor,
    statusIcon(status) {
      if (status === "pass") return CheckCircle;
      if (status === "warn") return AlertTriangle;
      return AlertCircle;
    },
  },
  data() {
    return {
      sampleDocument,
    };
  },
};
</script>
