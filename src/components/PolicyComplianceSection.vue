<template>
  <section class="panel-card" :id="sectionId">
    <div class="panel-card__header">
      <p class="filter-card__eyebrow">{{ isState ? "State" : "Federal" }}</p>
      <h2 class="panel-card__title">
        {{ isState ? "State Policies - Iowa (IA)" : "Federal Policies" }}
      </h2>
    </div>

    <div class="policy-list">
      <article
        v-for="policy in policyStats"
        :id="policyAnchorId(policy.name)"
        :key="policy.name"
        class="policy-card"
      >
        <button
          type="button"
          class="policy-card__header"
          :class="{ 'policy-card__header--expanded': isExpanded(policy.name) }"
          @click="$emit('toggle-policy', policyKey(policy.name))"
        >
          <div class="policy-card__title-wrap">
            <component
              :is="isExpanded(policy.name) ? ChevronDown : ChevronRight"
              class="policy-card__chevron"
            />
            <span class="policy-card__title">{{ policy.name }}</span>
          </div>

          <div class="policy-card__metrics">
            <button
              type="button"
              class="policy-stat-button policy-stat-button--pass"
              @click.stop="
                $emit('open-modal', policy.name, null, 'pass', isState)
              "
            >
              <CheckCircle class="policy-stat-button__icon" />
              <span>{{ policy.passed }}</span>
            </button>
            <button
              type="button"
              class="policy-stat-button policy-stat-button--warn"
              @click.stop="
                $emit('open-modal', policy.name, null, 'warn', isState)
              "
            >
              <AlertTriangle class="policy-stat-button__icon" />
              <span>{{ policy.warned }}</span>
            </button>
            <button
              type="button"
              class="policy-stat-button policy-stat-button--fail"
              @click.stop="
                $emit('open-modal', policy.name, null, 'fail', isState)
              "
            >
              <AlertCircle class="policy-stat-button__icon" />
              <span>{{ policy.failed }}</span>
            </button>
            <div class="progress-cluster">
              <div class="progress-track">
                <div
                  class="progress-bar"
                  :style="{ width: `${policy.passRate}%` }"
                ></div>
              </div>
              <strong>{{ policy.passRate }}%</strong>
            </div>
          </div>
        </button>

        <div
          v-if="isExpanded(policy.name) && policy.rules.length > 0"
          class="policy-card__rules"
        >
          <article
            v-for="rule in policy.rules"
            :key="`${policy.name}-${rule}`"
            class="rule-card"
          >
            <div class="rule-card__title-wrap">
              <span class="rule-card__dot"></span>
              <span>{{ rule }}</span>
            </div>
            <div class="rule-card__metrics">
              <button
                type="button"
                class="policy-stat-button policy-stat-button--pass policy-stat-button--compact"
                @click="$emit('open-modal', policy.name, rule, 'pass', isState)"
              >
                <CheckCircle class="policy-stat-button__icon" />
                <span>{{ policy.ruleStats[rule].passed }}</span>
              </button>
              <button
                type="button"
                class="policy-stat-button policy-stat-button--warn policy-stat-button--compact"
                @click="$emit('open-modal', policy.name, rule, 'warn', isState)"
              >
                <AlertTriangle class="policy-stat-button__icon" />
                <span>{{ policy.ruleStats[rule].warned }}</span>
              </button>
              <button
                type="button"
                class="policy-stat-button policy-stat-button--fail policy-stat-button--compact"
                @click="$emit('open-modal', policy.name, rule, 'fail', isState)"
              >
                <AlertCircle class="policy-stat-button__icon" />
                <span>{{ policy.ruleStats[rule].failed }}</span>
              </button>
              <div class="progress-cluster progress-cluster--compact">
                <div class="progress-track progress-track--compact">
                  <div
                    class="progress-bar"
                    :style="{ width: `${rulePassRate(policy, rule)}%` }"
                  ></div>
                </div>
                <strong>{{ rulePassRate(policy, rule) }}%</strong>
              </div>
            </div>
          </article>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-vue-next";

export default {
  name: "PolicyComplianceSection",
  components: {
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    ChevronDown,
    ChevronRight,
  },
  props: {
    policyStats: {
      type: Array,
      default: () => [],
    },
    expandedPolicies: {
      type: Array,
      default: () => [],
    },
    isState: {
      type: Boolean,
      default: false,
    },
    sectionId: {
      type: String,
      default: "",
    },
  },
  emits: ["toggle-policy", "open-modal"],
  methods: {
    policyKey(policyName) {
      return this.isState ? `state-${policyName}` : policyName;
    },
    policyAnchorId(policyName) {
      return this.isState
        ? `state-policy-${policyName}`
        : `policy-${policyName}`;
    },
    isExpanded(policyName) {
      return this.expandedPolicies.includes(this.policyKey(policyName));
    },
    rulePassRate(policy, rule) {
      const ruleData = policy.ruleStats[rule];
      return policy.total > 0
        ? ((ruleData.passed / policy.total) * 100).toFixed(1)
        : "0";
    },
  },
};
</script>
