// Mock data service for loan compliance data
// This simulates what would be an API call to fetch loan data

export const generateMockLoans = (
  policyDefinitions,
  statePolicyDefinitions,
) => {
  const loans = [];
  const amortTypes = ["Fixed", "ARM", "Interest Only"];
  const terms = [15, 20, 30];
  const types = ["Conventional", "FHA", "VA", "USDA"];
  const purposes = ["Purchase", "Refinance", "Cash-Out Refi"];
  const occupancies = ["Owner", "Non-Owner", "Investment"];
  const branches = [
    "Branch_1",
    "Branch_2",
    "Branch_3",
    "Branch_4",
    "Branch_5",
    "Branch_6",
    "Branch_7",
    "Branch_8",
  ];

  const totalMLOs = 56;
  const mloPool = [];
  const mloToBranch = {};

  // Generate MLO pool and assign to branches
  for (let i = 0; i < totalMLOs; i++) {
    const mloId = String(Math.floor(Math.random() * 900000) + 100000);
    const assignedBranch =
      branches[Math.floor(Math.random() * branches.length)];
    mloPool.push(mloId);
    mloToBranch[mloId] = assignedBranch;
  }

  const branchToMLOs = {};
  branches.forEach((branch) => {
    branchToMLOs[branch] = mloPool.filter((mlo) => mloToBranch[mlo] === branch);
  });

  // Generate 2244 loan records
  for (let i = 1; i <= 2244; i++) {
    const policyResults = {};
    const ruleResults = {};
    const statePolicyResults = {};
    const stateRuleResults = {};

    // Process federal policies
    policyDefinitions.forEach((policy) => {
      const policyRuleResults = {};
      let hasFail = false;
      let hasWarn = false;

      policy.rules.forEach((rule) => {
        const rand = Math.random();
        let ruleStatus;
        if (rand < 0.995) {
          ruleStatus = "pass";
        } else if (rand < 0.998) {
          ruleStatus = "warn";
          hasWarn = true;
        } else {
          ruleStatus = "fail";
          hasFail = true;
        }
        policyRuleResults[rule] = ruleStatus;
      });

      if (hasFail) {
        policyResults[policy.name] = "fail";
      } else if (hasWarn) {
        policyResults[policy.name] = "warn";
      } else {
        policyResults[policy.name] = "pass";
      }
      ruleResults[policy.name] = policyRuleResults;
    });

    // Process state policies
    statePolicyDefinitions.forEach((policy) => {
      const policyRuleResults = {};
      let hasFail = false;
      let hasWarn = false;

      policy.rules.forEach((rule) => {
        const rand = Math.random();
        let ruleStatus;
        if (rand < 0.995) {
          ruleStatus = "pass";
        } else if (rand < 0.998) {
          ruleStatus = "warn";
          hasWarn = true;
        } else {
          ruleStatus = "fail";
          hasFail = true;
        }
        policyRuleResults[rule] = ruleStatus;
      });

      if (hasFail) {
        statePolicyResults[policy.name] = "fail";
      } else if (hasWarn) {
        statePolicyResults[policy.name] = "warn";
      } else {
        statePolicyResults[policy.name] = "pass";
      }
      stateRuleResults[policy.name] = policyRuleResults;
    });

    // Determine overall status
    const overallStatus =
      Object.values(policyResults).includes("fail") ||
      Object.values(statePolicyResults).includes("fail")
        ? "fail"
        : Object.values(policyResults).includes("warn") ||
            Object.values(statePolicyResults).includes("warn")
          ? "warn"
          : "pass";

    const branchId = branches[Math.floor(Math.random() * branches.length)];
    const branchMLOs = branchToMLOs[branchId];
    const mloNmlsId =
      branchMLOs.length > 0
        ? branchMLOs[Math.floor(Math.random() * branchMLOs.length)]
        : mloPool[0];

    loans.push({
      id: `LN${String(i).padStart(6, "0")}`,
      branchId: branchId,
      mloNmlsId: mloNmlsId,
      amortizationType:
        amortTypes[Math.floor(Math.random() * amortTypes.length)],
      loanTerm: terms[Math.floor(Math.random() * terms.length)],
      loanType: types[Math.floor(Math.random() * types.length)],
      purpose: purposes[Math.floor(Math.random() * purposes.length)],
      occupancy: occupancies[Math.floor(Math.random() * occupancies.length)],
      amount: Math.floor(Math.random() * 500000) + 100000,
      policyResults,
      ruleResults,
      statePolicyResults,
      stateRuleResults,
      overallStatus,
    });
  }

  return loans;
};

// Simulate async API call
export const fetchLoanData = async (
  policyDefinitions,
  statePolicyDefinitions,
) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return generateMockLoans(policyDefinitions, statePolicyDefinitions);
};
