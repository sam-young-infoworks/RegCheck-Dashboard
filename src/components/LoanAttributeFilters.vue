<template>
  <section ref="containerRef" class="filter-card">
    <div class="filter-card__header">
      <p class="filter-card__eyebrow">Loan Attributes</p>
      <h2 class="filter-card__title">Refine the Population</h2>
    </div>

    <div class="dropdown-grid">
      <div
        v-for="dropdown in dropdownDefinitions"
        :key="dropdown.name"
        class="dropdown-shell"
      >
        <button
          type="button"
          class="dropdown-trigger"
          @click="$emit('toggle-dropdown', dropdown.name)"
        >
          <span>
            {{ dropdown.label }}
            <span v-if="filters[dropdown.name].length > 0">
              ({{ filters[dropdown.name].length }})
            </span>
          </span>
          <ChevronDown class="dropdown-trigger__icon" />
        </button>

        <div v-if="openDropdown === dropdown.name" class="dropdown-menu">
          <label
            v-for="option in dropdown.options"
            :key="option.value"
            class="dropdown-option"
          >
            <input
              type="checkbox"
              :checked="filters[dropdown.name].includes(option.value)"
              @change="$emit('filter-change', dropdown.name, option.value)"
            />
            <span>{{ option.label }}</span>
          </label>
        </div>
      </div>
    </div>

    <button
      v-if="hasActiveFilters"
      type="button"
      class="secondary-button"
      @click="handleClear"
    >
      Clear Loan Attributes
    </button>
  </section>
</template>

<script>
import { ChevronDown } from "lucide-vue-next";

export default {
  name: "LoanAttributeFilters",
  components: {
    ChevronDown,
  },
  props: {
    filters: {
      type: Object,
      required: true,
    },
    openDropdown: {
      type: String,
      default: null,
    },
  },
  emits: ["filter-change", "toggle-dropdown"],
  data() {
    return {
      dropdownDefinitions: [
        {
          name: "amortizationType",
          label: "Amortization Type",
          options: [
            { value: "Fixed", label: "Fixed" },
            { value: "ARM", label: "ARM" },
            { value: "Interest Only", label: "Interest Only" },
          ],
        },
        {
          name: "loanTerm",
          label: "Loan Term",
          options: [
            { value: "15", label: "15 Years" },
            { value: "20", label: "20 Years" },
            { value: "30", label: "30 Years" },
          ],
        },
        {
          name: "loanType",
          label: "Loan Type",
          options: [
            { value: "Conventional", label: "Conventional" },
            { value: "FHA", label: "FHA" },
            { value: "VA", label: "VA" },
            { value: "USDA", label: "USDA" },
          ],
        },
        {
          name: "purpose",
          label: "Purpose",
          options: [
            { value: "Purchase", label: "Purchase" },
            { value: "Refinance", label: "Refinance" },
            { value: "Cash-Out Refi", label: "Cash-Out Refi" },
          ],
        },
        {
          name: "occupancy",
          label: "Occupancy",
          options: [
            { value: "Owner", label: "Owner" },
            { value: "Non-Owner", label: "Non-Owner" },
            { value: "Investment", label: "Investment" },
          ],
        },
      ],
    };
  },
  computed: {
    hasActiveFilters() {
      return (
        this.filters.amortizationType.length > 0 ||
        this.filters.loanTerm.length > 0 ||
        this.filters.loanType.length > 0 ||
        this.filters.purpose.length > 0 ||
        this.filters.occupancy.length > 0
      );
    },
  },
  mounted() {
    document.addEventListener("mousedown", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  },
  methods: {
    handleClear() {
      this.$emit("filter-change", "amortizationType", []);
      this.$emit("filter-change", "loanTerm", []);
      this.$emit("filter-change", "loanType", []);
      this.$emit("filter-change", "purpose", []);
      this.$emit("filter-change", "occupancy", []);
    },
    handleClickOutside(event) {
      if (!this.openDropdown) {
        return;
      }

      if (
        this.$refs.containerRef &&
        !this.$refs.containerRef.contains(event.target)
      ) {
        this.$emit("toggle-dropdown", null);
      }
    },
  },
};
</script>
