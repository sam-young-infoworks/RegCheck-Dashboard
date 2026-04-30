<template>
  <section class="filter-card">
    <div class="filter-card__header">
      <p class="filter-card__eyebrow">Branch + MLO</p>
      <h2 class="filter-card__title">Pipeline Assignment</h2>
    </div>

    <div class="filter-row">
      <label class="field-group">
        <span class="field-label">Branch</span>
        <select
          :value="filters.branch"
          class="field-control"
          @change="$emit('filter-change', 'branch', $event.target.value)"
        >
          <option value="">All Branches</option>
          <option
            v-for="branch in availableBranches"
            :key="branch"
            :value="branch"
          >
            {{ branch }}
          </option>
        </select>
      </label>

      <label class="field-group">
        <span class="field-label">MLO</span>
        <select
          :value="filters.mlo"
          class="field-control"
          @change="$emit('filter-change', 'mlo', $event.target.value)"
        >
          <option value="">All MLOs</option>
          <option v-for="mlo in availableMLOs" :key="mlo" :value="mlo">
            {{ mlo }}
          </option>
        </select>
      </label>

      <button
        v-if="filters.branch || filters.mlo"
        type="button"
        class="secondary-button"
        @click="handleClear"
      >
        Clear Branch + MLO
      </button>
    </div>
  </section>
</template>

<script>
export default {
  name: "BranchMLOFilters",
  props: {
    filters: {
      type: Object,
      required: true,
    },
    availableBranches: {
      type: Array,
      default: () => [],
    },
    availableMLOs: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["filter-change"],
  methods: {
    handleClear() {
      this.$emit("filter-change", "branch", "");
      this.$emit("filter-change", "mlo", "");
    },
  },
};
</script>
