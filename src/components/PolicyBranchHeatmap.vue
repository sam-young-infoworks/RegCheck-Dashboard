<template>
  <section class="panel-card">
    <div class="panel-card__header">
      <p class="filter-card__eyebrow">Policy Heatmap</p>
      <h2 class="panel-card__title">Policy Failure Rate Heatmap by Branch</h2>
      <p class="panel-card__copy">
        Failure percentage for each policy across branches. Click any cell to
        filter by that branch and open the corresponding policy.
      </p>
    </div>

    <div class="heatmap-scroll-container">
      <svg :width="svgWidth" :height="svgHeight">
        <g v-for="(branch, branchIndex) in heatmapData.branches" :key="branch">
          <text
            :x="150 + branchIndex * 100 + 50"
            y="40"
            text-anchor="middle"
            :class="
              branch === 'All Branches'
                ? 'heatmap-column-header heatmap-column-header-all-branches'
                : 'heatmap-column-header'
            "
          >
            {{ branch === "All Branches" ? branch.toUpperCase() : branch }}
          </text>
        </g>

        <text x="5" y="65" class="heatmap-section-label-federal">FEDERAL</text>
        <line
          :x1="0"
          :y1="60 + policySets.length * 45"
          :x2="150 + heatmapData.branches.length * 100"
          :y2="60 + policySets.length * 45"
          class="heatmap-divider-line"
        />
        <text
          :x="5"
          :y="60 + policySets.length * 45 + 15"
          class="heatmap-section-label-state"
        >
          STATE
        </text>

        <g v-for="(row, rowIdx) in heatmapData.data" :key="row.policyName">
          <text
            x="140"
            :y="65 + rowIdx * 45 + 22"
            text-anchor="end"
            :class="
              row.isState
                ? 'heatmap-row-label heatmap-row-label-state'
                : 'heatmap-row-label heatmap-row-label-federal'
            "
          >
            {{ row.policyName }}
          </text>

          <g
            v-for="(branch, colIdx) in heatmapData.branches"
            :key="`${row.policyName}-${branch}`"
          >
            <rect
              :x="150 + colIdx * 100"
              :y="60 + rowIdx * 45"
              width="98"
              height="43"
              rx="4"
              class="heatmap-cell"
              :fill="getHeatmapColor(row[branch].failRate)"
              @click="$emit('cell-click', branch, row.policyName, row.isState)"
            />
            <text
              :x="150 + colIdx * 100 + 49"
              :y="60 + rowIdx * 45 + 22"
              text-anchor="middle"
              class="heatmap-cell-text-primary"
            >
              {{ formatRate(row[branch].failRate) }}%
            </text>
            <text
              :x="150 + colIdx * 100 + 49"
              :y="60 + rowIdx * 45 + 35"
              text-anchor="middle"
              class="heatmap-cell-text-secondary"
            >
              ({{ row[branch].failCount }}/{{ row[branch].total }})
            </text>
          </g>
        </g>
      </svg>
    </div>

    <div class="heatmap-legend">
      <span class="heatmap-legend-title">Failure Rate:</span>
      <div class="heatmap-legend-items">
        <div
          v-for="item in legendItems"
          :key="item.label"
          class="heatmap-legend-item"
        >
          <span
            class="heatmap-legend-color-box"
            :style="{ backgroundColor: item.color }"
          ></span>
          <span class="heatmap-legend-label">{{ item.label }}</span>
        </div>
      </div>
    </div>

    <small class="heatmap-info-text">
      <span class="heatmap-info-text-federal">Federal Policies</span> are shown
      first, followed by
      <span class="heatmap-info-text-state">State Policies (Iowa)</span>
    </small>
  </section>
</template>

<script>
import { getHeatmapColor } from "../utils/statusHelpers";

export default {
  name: "PolicyBranchHeatmap",
  props: {
    heatmapData: {
      type: Object,
      required: true,
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
  emits: ["cell-click"],
  data() {
    return {
      legendItems: [
        { color: "#10b981", label: "0-0.5%" },
        { color: "#84cc16", label: "0.5-1%" },
        { color: "#fbbf24", label: "1-1.5%" },
        { color: "#fb923c", label: "1.5-2%" },
        { color: "#f87171", label: "2-2.5%" },
        { color: "#ef4444", label: "2.5%+" },
      ],
    };
  },
  computed: {
    svgWidth() {
      return Math.max(1400, 150 + this.heatmapData.branches.length * 100);
    },
    svgHeight() {
      return this.heatmapData.data.length * 45 + 100;
    },
  },
  methods: {
    getHeatmapColor,
    formatRate(value) {
      return Number.parseFloat(value).toFixed(1);
    },
  },
};
</script>
