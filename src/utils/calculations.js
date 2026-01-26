/**
 * Calculate portfolio statistics
 */
export const calculatePortfolioStats = (loans) => {
  const total = loans.length;
  const passed = loans.filter((l) => l.overallStatus === "pass").length;
  const warned = loans.filter((l) => l.overallStatus === "warn").length;
  const failed = loans.filter((l) => l.overallStatus === "fail").length;

  return {
    total,
    passed,
    warned,
    failed,
    passRate: total > 0 ? ((passed / total) * 100).toFixed(1) : "0",
    warnRate: total > 0 ? ((warned / total) * 100).toFixed(1) : "0",
    failRate: total > 0 ? ((failed / total) * 100).toFixed(1) : "0",
  };
};

/**
 * Calculate policy statistics from filtered loans
 */
export const calculatePolicyStats = (filteredLoans, policySets) => {
  return policySets.map((policy) => {
    let passed = 0;
    let warned = 0;
    let failed = 0;

    const ruleStats = {};

    policy.rules.forEach((rule) => {
      ruleStats[rule] = { passed: 0, warned: 0, failed: 0 };
    });

    filteredLoans.forEach((loan) => {
      const result = loan.policyResults[policy.name];
      if (result === "pass") passed++;
      else if (result === "warn") warned++;
      else failed++;

      if (loan.ruleResults[policy.name]) {
        policy.rules.forEach((rule) => {
          const ruleResult = loan.ruleResults[policy.name][rule];
          if (ruleResult === "pass") ruleStats[rule].passed++;
          else if (ruleResult === "warn") ruleStats[rule].warned++;
          else if (ruleResult === "fail") ruleStats[rule].failed++;
        });
      }
    });

    const total = filteredLoans.length;

    return {
      name: policy.name,
      rules: policy.rules,
      ruleStats,
      passed,
      warned,
      failed,
      total,
      passRate: total > 0 ? ((passed / total) * 100).toFixed(1) : "0",
      failRate: total > 0 ? ((failed / total) * 100).toFixed(1) : "0",
      warnRate: total > 0 ? ((warned / total) * 100).toFixed(1) : "0",
    };
  });
};

/**
 * Calculate state policy statistics from filtered loans
 */
export const calculateStatePolicyStats = (filteredLoans, statePolicySets) => {
  return statePolicySets.map((policy) => {
    let passed = 0;
    let warned = 0;
    let failed = 0;

    const ruleStats = {};

    policy.rules.forEach((rule) => {
      ruleStats[rule] = { passed: 0, warned: 0, failed: 0 };
    });

    filteredLoans.forEach((loan) => {
      const result = loan.statePolicyResults[policy.name];
      if (result === "pass") passed++;
      else if (result === "warn") warned++;
      else failed++;

      if (loan.stateRuleResults[policy.name]) {
        policy.rules.forEach((rule) => {
          const ruleResult = loan.stateRuleResults[policy.name][rule];
          if (ruleResult === "pass") ruleStats[rule].passed++;
          else if (ruleResult === "warn") ruleStats[rule].warned++;
          else if (ruleResult === "fail") ruleStats[rule].failed++;
        });
      }
    });

    const total = filteredLoans.length;

    return {
      name: policy.name,
      state: policy.state,
      stateAbbr: policy.stateAbbr,
      rules: policy.rules,
      ruleStats,
      passed,
      warned,
      failed,
      total,
      passRate: total > 0 ? ((passed / total) * 100).toFixed(1) : "0",
      failRate: total > 0 ? ((failed / total) * 100).toFixed(1) : "0",
      warnRate: total > 0 ? ((warned / total) * 100).toFixed(1) : "0",
    };
  });
};

/**
 * Calculate branch statistics
 */
export const calculateBranchStats = (loans) => {
  const branches = {};

  loans.forEach((loan) => {
    if (!branches[loan.branchId]) {
      branches[loan.branchId] = { total: 0, failed: 0, warned: 0 };
    }
    branches[loan.branchId].total++;
    if (loan.overallStatus === "fail") branches[loan.branchId].failed++;
    else if (loan.overallStatus === "warn") branches[loan.branchId].warned++;
  });

  const branchData = Object.keys(branches)
    .sort()
    .map((branchId) => ({
      name: branchId,
      failRate:
        branches[branchId].total > 0
          ? parseFloat(
              (
                (branches[branchId].failed / branches[branchId].total) *
                100
              ).toFixed(1),
            )
          : 0,
      warnRate:
        branches[branchId].total > 0
          ? parseFloat(
              (
                (branches[branchId].warned / branches[branchId].total) *
                100
              ).toFixed(1),
            )
          : 0,
      failCount: branches[branchId].failed,
      warnCount: branches[branchId].warned,
      total: branches[branchId].total,
    }));

  const totalFailed = loans.filter((l) => l.overallStatus === "fail").length;
  const totalWarned = loans.filter((l) => l.overallStatus === "warn").length;
  const totalLoans = loans.length;

  return [
    {
      name: "All Branches",
      failRate:
        totalLoans > 0
          ? parseFloat(((totalFailed / totalLoans) * 100).toFixed(1))
          : 0,
      warnRate:
        totalLoans > 0
          ? parseFloat(((totalWarned / totalLoans) * 100).toFixed(1))
          : 0,
      failCount: totalFailed,
      warnCount: totalWarned,
      total: totalLoans,
    },
    ...branchData,
  ];
};

/**
 * Calculate policy branch heatmap data
 */
export const calculatePolicyBranchHeatmap = (
  loans,
  availableBranches,
  policySets,
  statePolicySets,
) => {
  const branchNames = ["All Branches", ...availableBranches];
  const allPolicies = [
    ...policySets.map((p) => ({ ...p, isState: false })),
    ...statePolicySets.map((p) => ({ ...p, isState: true })),
  ];

  const heatmapData = allPolicies.map((policy) => {
    const rowData = { policyName: policy.name, isState: policy.isState };

    branchNames.forEach((branchName) => {
      const branchLoans =
        branchName === "All Branches"
          ? loans
          : loans.filter((loan) => loan.branchId === branchName);

      let failed = 0;
      let total = branchLoans.length;

      branchLoans.forEach((loan) => {
        const result = policy.isState
          ? loan.statePolicyResults[policy.name]
          : loan.policyResults[policy.name];
        if (result === "fail") failed++;
      });

      rowData[branchName] = {
        failCount: failed,
        total: total,
        failRate: total > 0 ? ((failed / total) * 100).toFixed(1) : "0",
      };
    });

    return rowData;
  });

  return { data: heatmapData, branches: branchNames };
};

/**
 * Get available branches from loans
 */
export const getAvailableBranches = (loans) => {
  const branches = new Set(loans.map((loan) => loan.branchId));
  return Array.from(branches).sort();
};

/**
 * Get branch to MLO mapping
 */
export const getBranchToMLOMapping = (loans) => {
  const mapping = {};
  loans.forEach((loan) => {
    if (!mapping[loan.branchId]) {
      mapping[loan.branchId] = new Set();
    }
    mapping[loan.branchId].add(loan.mloNmlsId);
  });
  Object.keys(mapping).forEach((branch) => {
    mapping[branch] = Array.from(mapping[branch]).sort();
  });
  return mapping;
};

/**
 * Get available MLOs based on selected branch
 */
export const getAvailableMLOs = (loans, selectedBranch, branchToMLOMapping) => {
  if (selectedBranch) {
    return branchToMLOMapping[selectedBranch] || [];
  }
  const mlos = new Set(loans.map((loan) => loan.mloNmlsId));
  return Array.from(mlos).sort();
};
