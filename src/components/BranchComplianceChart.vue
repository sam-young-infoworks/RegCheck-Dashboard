<template>
  <section class="chart-card">
    <div class="chart-card__header">
      <div>
        <p class="filter-card__eyebrow">Branch Compliance</p>
        <h2 class="chart-card__title">Branch Compliance Overview</h2>
      </div>
      <p class="chart-card__copy">
        Click a stacked bar to focus a branch summary while the modal workflow
        is still being ported.
      </p>
    </div>

    <div class="chart-shell">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </section>
</template>

<script>
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Title,
  Tooltip,
);

export default {
  name: "BranchComplianceChart",
  components: {
    Bar,
  },
  props: {
    branchStats: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["branch-click"],
  computed: {
    chartData() {
      return {
        labels: this.branchStats.map((branch) =>
          branch.name === "All Branches"
            ? branch.name.toUpperCase()
            : branch.name,
        ),
        datasets: [
          {
            label: "Fail %",
            data: this.branchStats.map((branch) => branch.failRate),
            backgroundColor: "#c5393f",
            borderRadius: 8,
            borderSkipped: false,
            branchMeta: this.branchStats.map((branch) => ({
              failCount: branch.failCount,
              name: branch.name,
              total: branch.total,
              warnCount: branch.warnCount,
              warnRate: branch.warnRate,
            })),
          },
          {
            label: "Warn %",
            data: this.branchStats.map((branch) => branch.warnRate),
            backgroundColor: "#d08a17",
            borderRadius: 8,
            borderSkipped: false,
            branchMeta: this.branchStats.map((branch) => ({
              failCount: branch.failCount,
              name: branch.name,
              total: branch.total,
              warnCount: branch.warnCount,
              warnRate: branch.warnRate,
            })),
          },
        ],
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: "index",
        },
        onClick: (_event, elements) => {
          if (!elements.length) {
            return;
          }

          const branch = this.branchStats[elements[0].index];
          if (branch) {
            this.$emit("branch-click", branch.name);
          }
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 14,
              color: "#526277",
              usePointStyle: true,
            },
          },
          tooltip: {
            backgroundColor: "rgba(255,255,255,0.98)",
            bodyColor: "#122033",
            borderColor: "#d6deea",
            borderWidth: 1,
            cornerRadius: 12,
            padding: 12,
            titleColor: "#122033",
            callbacks: {
              label: (context) => {
                const meta = context.dataset.branchMeta[context.dataIndex];

                if (context.dataset.label === "Fail %") {
                  return `Fail: ${context.formattedValue}% (${meta.failCount} loans)`;
                }

                return `Warn: ${context.formattedValue}% (${meta.warnCount} loans)`;
              },
              afterBody: (items) => {
                if (!items.length) {
                  return [];
                }

                const meta = items[0].dataset.branchMeta[items[0].dataIndex];
                return [`Total: ${meta.total} loans`];
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            max: 100,
            grid: {
              color: "rgba(214, 222, 234, 0.8)",
            },
            ticks: {
              color: "#526277",
              callback: (value) => `${value}%`,
            },
            title: {
              display: true,
              text: "Percentage (%)",
              color: "#526277",
            },
          },
          y: {
            stacked: true,
            grid: {
              display: false,
            },
            ticks: {
              color: "#526277",
              font: (context) => {
                const label = context.tick.label;

                if (label === "ALL BRANCHES") {
                  return {
                    size: 12,
                    weight: "700",
                  };
                }

                return {
                  size: 12,
                  weight: "500",
                };
              },
            },
          },
        },
      };
    },
  },
};
</script>
