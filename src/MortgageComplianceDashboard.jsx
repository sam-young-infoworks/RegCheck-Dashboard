import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Shield,
  ChevronDown,
  ChevronRight,
  Upload,
} from "lucide-react";

/**
 * MortgageComplianceDashboard - Display component for mortgage compliance data
 * @param {Array} loans - Array of loan objects with compliance results
 * @param {Array} policySets - Federal policy definitions
 * @param {Array} statePolicySets - State policy definitions
 */
const MortgageComplianceDashboard = ({
  loans = [],
  policySets = [],
  statePolicySets = [],
}) => {
  const [filters, setFilters] = useState({
    branch: "",
    mlo: "",
    amortizationType: [],
    loanTerm: [],
    loanType: [],
    purpose: [],
    occupancy: [],
  });
  const [openDropdown, setOpenDropdown] = useState(null);
  const [expandedPolicy, setExpandedPolicy] = useState(null);
  const [showLoanTable, setShowLoanTable] = useState(false);
  const [loanTableSearchTerm, setLoanTableSearchTerm] = useState("");
  const [modalData, setModalData] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [branchModalData, setBranchModalData] = useState(null);

  const availableBranches = useMemo(() => {
    const branches = new Set(loans.map((loan) => loan.branchId));
    return Array.from(branches).sort();
  }, [loans]);

  const branchToMLOMapping = useMemo(() => {
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
  }, [loans]);

  const availableMLOs = useMemo(() => {
    if (filters.branch) {
      return branchToMLOMapping[filters.branch] || [];
    }
    const mlos = new Set(loans.map((loan) => loan.mloNmlsId));
    return Array.from(mlos).sort();
  }, [loans, filters.branch, branchToMLOMapping]);

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      if (filters.branch && loan.branchId !== filters.branch) return false;
      if (filters.mlo && loan.mloNmlsId !== filters.mlo) return false;
      if (
        filters.amortizationType.length > 0 &&
        !filters.amortizationType.includes(loan.amortizationType)
      )
        return false;
      if (
        filters.loanTerm.length > 0 &&
        !filters.loanTerm.includes(loan.loanTerm.toString())
      )
        return false;
      if (
        filters.loanType.length > 0 &&
        !filters.loanType.includes(loan.loanType)
      )
        return false;
      if (filters.purpose.length > 0 && !filters.purpose.includes(loan.purpose))
        return false;
      if (
        filters.occupancy.length > 0 &&
        !filters.occupancy.includes(loan.occupancy)
      )
        return false;
      return true;
    });
  }, [loans, filters]);

  const displayedLoans = useMemo(() => {
    if (!loanTableSearchTerm) return filteredLoans;
    return filteredLoans.filter((loan) =>
      loan.id.toLowerCase().includes(loanTableSearchTerm.toLowerCase()),
    );
  }, [filteredLoans, loanTableSearchTerm]);

  const portfolioStats = useMemo(() => {
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
  }, [loans]);

  const policyStats = useMemo(() => {
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
  }, [filteredLoans, policySets]);

  const statePolicyStats = useMemo(() => {
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
  }, [filteredLoans, statePolicySets]);

  const branchStats = useMemo(() => {
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
  }, [loans]);

  const policyBranchHeatmapData = useMemo(() => {
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
  }, [loans, availableBranches, policySets, statePolicySets]);

  const getHeatmapColor = (failRate) => {
    const rate = parseFloat(failRate);
    if (rate <= 0.5) return "#10b981"; // Green
    if (rate <= 1.0) return "#84cc16"; // Light green
    if (rate <= 1.5) return "#fbbf24"; // Yellow
    if (rate <= 2.0) return "#fb923c"; // Orange
    if (rate <= 2.5) return "#f87171"; // Light red
    return "#ef4444"; // Red
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pass":
        return "text-emerald-600 bg-emerald-100";
      case "warn":
        return "text-amber-600 bg-amber-100";
      case "fail":
        return "text-red-600 bg-red-100";
      default:
        return "text-slate-600 bg-slate-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-4 h-4" />;
      case "warn":
        return <AlertTriangle className="w-4 h-4" />;
      case "fail":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleFilterChange = (category, value) => {
    if (category === "branch") {
      setFilters((prev) => {
        const newFilters = { ...prev, branch: value };
        // Reset MLO if it's not in the new branch
        if (value && branchToMLOMapping[value]) {
          if (prev.mlo && !branchToMLOMapping[value].includes(prev.mlo)) {
            newFilters.mlo = "";
          }
        }
        return newFilters;
      });
    } else if (category === "mlo") {
      setFilters((prev) => ({ ...prev, mlo: value }));
    } else {
      // Handle multi-select filters
      setFilters((prev) => {
        const current = prev[category];
        const updated = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [category]: updated };
      });
    }
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const openModal = (policyName, ruleName, status, isState = false) => {
    const loans = filteredLoans.filter((loan) => {
      if (ruleName) {
        if (isState) {
          return (
            loan.stateRuleResults[policyName] &&
            loan.stateRuleResults[policyName][ruleName] === status
          );
        } else {
          return (
            loan.ruleResults[policyName] &&
            loan.ruleResults[policyName][ruleName] === status
          );
        }
      } else {
        if (isState) {
          return loan.statePolicyResults[policyName] === status;
        } else {
          return loan.policyResults[policyName] === status;
        }
      }
    });
    setModalData({
      title: ruleName
        ? `${policyName} - ${ruleName} (${status})`
        : `${policyName} (${status})`,
      loans,
      status,
    });
  };

  const handleLoanClick = (loanId) => {
    console.log("Loan clicked:", loanId);
    setModalData(null);
    setShowLoanTable(true);
    setLoanTableSearchTerm(loanId);

    setTimeout(() => {
      const element = document.getElementById(`loan-${loanId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.style.backgroundColor = "#bfdbfe";
        setTimeout(() => {
          element.style.backgroundColor = "";
        }, 3000);
      }
    }, 300);
  };

  const closeModal = () => {
    setModalData(null);
  };

  const handleBranchBarClick = (branchName) => {
    const branchLoans =
      branchName === "All Branches"
        ? loans
        : loans.filter((loan) => loan.branchId === branchName);

    const mloStats = {};
    branchLoans.forEach((loan) => {
      if (!mloStats[loan.mloNmlsId]) {
        mloStats[loan.mloNmlsId] = {
          total: 0,
          failed: 0,
          warned: 0,
          passed: 0,
        };
      }
      mloStats[loan.mloNmlsId].total++;
      if (loan.overallStatus === "fail") mloStats[loan.mloNmlsId].failed++;
      else if (loan.overallStatus === "warn") mloStats[loan.mloNmlsId].warned++;
      else mloStats[loan.mloNmlsId].passed++;
    });

    const mloData = Object.keys(mloStats)
      .map((mloId) => ({
        mloId,
        total: mloStats[mloId].total,
        failed: mloStats[mloId].failed,
        warned: mloStats[mloId].warned,
        passed: mloStats[mloId].passed,
        failRate:
          mloStats[mloId].total > 0
            ? ((mloStats[mloId].failed / mloStats[mloId].total) * 100).toFixed(
                1,
              )
            : "0",
        warnRate:
          mloStats[mloId].total > 0
            ? ((mloStats[mloId].warned / mloStats[mloId].total) * 100).toFixed(
                1,
              )
            : "0",
        passRate:
          mloStats[mloId].total > 0
            ? ((mloStats[mloId].passed / mloStats[mloId].total) * 100).toFixed(
                1,
              )
            : "0",
      }))
      .sort((a, b) => b.total - a.total);

    setBranchModalData({
      branchName,
      mloData,
      totalLoans: branchLoans.length,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <Shield className="w-10 h-10 text-blue-600" />
                Mortgage Compliance Dashboard - Iowa
              </h1>
              <p className="text-slate-600 text-lg">
                Automated regulatory audit analysis across{" "}
                {portfolioStats.total} loan files
              </p>
            </div>
            <div>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setUploadedImage(event.target.result);
                      alert("Image uploaded successfully!");
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <button
                onClick={() => document.getElementById("imageUpload").click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload Document Image
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Branch Compliance Overview
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={branchStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#64748b"
                  domain={[0, 100]}
                  type="number"
                  allowDataOverflow={false}
                  label={{
                    value: "Percentage (%)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#64748b" },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-slate-300 rounded-lg shadow-lg">
                          <p className="font-semibold text-slate-900">
                            {data.name}
                          </p>
                          <p className="text-sm text-red-600">
                            Fail: {data.failRate}% ({data.failCount} loans)
                          </p>
                          <p className="text-sm text-amber-600">
                            Warn: {data.warnRate}% ({data.warnCount} loans)
                          </p>
                          <p className="text-sm text-slate-600">
                            Total: {data.total} loans
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="failRate"
                  stackId="a"
                  fill="#ef4444"
                  name="Fail %"
                  cursor="pointer"
                  onClick={(data) => handleBranchBarClick(data.name)}
                  label={(props) => {
                    const { x, y, width, height } = props;
                    const data = branchStats[props.index];
                    if (data && data.failCount > 0 && height > 20) {
                      return (
                        <text
                          x={x + width / 2}
                          y={y + height / 2}
                          fill="white"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          {data.failCount}
                        </text>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="warnRate"
                  stackId="a"
                  fill="#f59e0b"
                  name="Warning %"
                  cursor="pointer"
                  onClick={(data) => handleBranchBarClick(data.name)}
                  label={(props) => {
                    const { x, y, width, height } = props;
                    const data = branchStats[props.index];
                    if (data && data.warnCount > 0 && height > 20) {
                      return (
                        <text
                          x={x + width / 2}
                          y={y + height / 2}
                          fill="white"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          {data.warnCount}
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 mb-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Policy Failure Rate Heatmap by Branch
              </h3>
              <p className="text-slate-600 text-sm">
                Failure percentage for each policy across all branches. Darker
                red indicates higher failure rates.
              </p>
            </div>

            <div className="overflow-x-auto">
              <svg
                width={Math.max(
                  1400,
                  150 + policyBranchHeatmapData.branches.length * 100,
                )}
                height={policyBranchHeatmapData.data.length * 45 + 100}
              >
                {/* Column headers */}
                {policyBranchHeatmapData.branches.map((branch, i) => (
                  <g key={branch}>
                    <text
                      x={150 + i * 100 + 50}
                      y={40}
                      textAnchor="middle"
                      className="text-xs font-bold fill-slate-700"
                    >
                      {branch}
                    </text>
                  </g>
                ))}

                {/* Federal label */}
                <text
                  x={5}
                  y={65}
                  className="text-xs font-bold fill-emerald-700"
                >
                  FEDERAL
                </text>

                {/* Section divider line and State label - between federal and state */}
                <line
                  x1={0}
                  y1={60 + policySets.length * 45}
                  x2={150 + policyBranchHeatmapData.branches.length * 100}
                  y2={60 + policySets.length * 45}
                  stroke="#94a3b8"
                  strokeWidth="2"
                />
                <text
                  x={5}
                  y={60 + policySets.length * 45 + 15}
                  className="text-xs font-bold fill-amber-700"
                >
                  STATE
                </text>

                {/* Heatmap cells */}
                {policyBranchHeatmapData.data.map((row, rowIdx) => (
                  <g key={row.policyName}>
                    {/* Row label */}
                    <text
                      x={140}
                      y={65 + rowIdx * 45 + 22}
                      textAnchor="end"
                      className={`text-xs font-semibold ${row.isState ? "fill-amber-700" : "fill-emerald-700"}`}
                    >
                      {row.policyName}
                    </text>

                    {/* Cells */}
                    {policyBranchHeatmapData.branches.map((branch, colIdx) => {
                      const cellData = row[branch];
                      const failRate = parseFloat(cellData.failRate);
                      return (
                        <g key={`${row.policyName}-${branch}`}>
                          <rect
                            x={150 + colIdx * 100}
                            y={60 + rowIdx * 45}
                            width={98}
                            height={43}
                            fill={getHeatmapColor(cellData.failRate)}
                            className="hover:opacity-80 cursor-pointer transition-opacity"
                            stroke="#e2e8f0"
                            strokeWidth="1"
                          />
                          <text
                            x={150 + colIdx * 100 + 49}
                            y={60 + rowIdx * 45 + 22}
                            textAnchor="middle"
                            className="text-xs font-bold fill-white pointer-events-none"
                          >
                            {failRate.toFixed(1)}%
                          </text>
                          <text
                            x={150 + colIdx * 100 + 49}
                            y={60 + rowIdx * 45 + 35}
                            textAnchor="middle"
                            className="text-[10px] fill-white pointer-events-none opacity-90"
                          >
                            ({cellData.failCount}/{cellData.total})
                          </text>
                        </g>
                      );
                    })}
                  </g>
                ))}
              </svg>
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm font-semibold text-slate-700">
                Failure Rate:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { color: "#10b981", label: "0-0.5%" },
                  { color: "#84cc16", label: "0.5-1%" },
                  { color: "#fbbf24", label: "1-1.5%" },
                  { color: "#fb923c", label: "1.5-2%" },
                  { color: "#f87171", label: "2-2.5%" },
                  { color: "#ef4444", label: "2.5%+" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-slate-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600">
                <span className="font-semibold text-emerald-700">
                  Federal Policies
                </span>{" "}
                are shown first, followed by{" "}
                <span className="font-semibold text-amber-700">
                  State Policies (Iowa)
                </span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200 mb-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-slate-700">
                Branch/MLO Filters:
              </span>

              <select
                value={filters.branch}
                onChange={(e) => handleFilterChange("branch", e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-300 hover:border-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer text-sm"
              >
                <option value="">All Branches</option>
                {availableBranches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>

              <select
                value={filters.mlo}
                onChange={(e) => handleFilterChange("mlo", e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-300 hover:border-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer text-sm"
              >
                <option value="">All MLOs</option>
                {availableMLOs.map((mlo) => (
                  <option key={mlo} value={mlo}>
                    {mlo}
                  </option>
                ))}
              </select>

              {(filters.branch || filters.mlo) && (
                <button
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      branch: "",
                      mlo: "",
                    }));
                    setOpenDropdown(null);
                  }}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-semibold"
                >
                  Clear Branch & MLO
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200 mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-slate-700">
                Loan Attribute Filters:
              </span>

              <div className="relative">
                <button
                  onClick={() => toggleDropdown("amortizationType")}
                  className="px-4 py-2 pr-8 rounded-lg border border-slate-300 hover:border-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer min-w-[180px] text-left flex items-center justify-between"
                >
                  <span className="text-sm">
                    Amortization Type{" "}
                    {filters.amortizationType.length > 0 &&
                      `(${filters.amortizationType.length})`}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                {openDropdown === "amortizationType" && (
                  <div className="absolute top-full mt-1 left-0 bg-white border border-slate-300 rounded-lg shadow-lg z-10 min-w-[180px]">
                    {["Fixed", "ARM", "Interest Only"].map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.amortizationType.includes(type)}
                          onChange={() =>
                            handleFilterChange("amortizationType", type)
                          }
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">{type}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => toggleDropdown("loanTerm")}
                  className="px-4 py-2 pr-8 rounded-lg border border-slate-300 hover:border-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer min-w-[150px] text-left flex items-center justify-between"
                >
                  <span className="text-sm">
                    Loan Term{" "}
                    {filters.loanTerm.length > 0 &&
                      `(${filters.loanTerm.length})`}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                {openDropdown === "loanTerm" && (
                  <div className="absolute top-full mt-1 left-0 bg-white border border-slate-300 rounded-lg shadow-lg z-10 min-w-[150px]">
                    {["15", "20", "30"].map((term) => (
                      <label
                        key={term}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.loanTerm.includes(term)}
                          onChange={() => handleFilterChange("loanTerm", term)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">
                          {term} Years
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => toggleDropdown("loanType")}
                  className="px-4 py-2 pr-8 rounded-lg border border-slate-300 hover:border-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer min-w-[150px] text-left flex items-center justify-between"
                >
                  <span className="text-sm">
                    Loan Type{" "}
                    {filters.loanType.length > 0 &&
                      `(${filters.loanType.length})`}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                {openDropdown === "loanType" && (
                  <div className="absolute top-full mt-1 left-0 bg-white border border-slate-300 rounded-lg shadow-lg z-10 min-w-[150px]">
                    {["Conventional", "FHA", "VA", "USDA"].map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.loanType.includes(type)}
                          onChange={() => handleFilterChange("loanType", type)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">{type}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => toggleDropdown("purpose")}
                  className="px-4 py-2 pr-8 rounded-lg border border-slate-300 hover:border-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer min-w-[150px] text-left flex items-center justify-between"
                >
                  <span className="text-sm">
                    Purpose{" "}
                    {filters.purpose.length > 0 &&
                      `(${filters.purpose.length})`}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                {openDropdown === "purpose" && (
                  <div className="absolute top-full mt-1 left-0 bg-white border border-slate-300 rounded-lg shadow-lg z-10 min-w-[150px]">
                    {["Purchase", "Refinance", "Cash-Out Refi"].map(
                      (purpose) => (
                        <label
                          key={purpose}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filters.purpose.includes(purpose)}
                            onChange={() =>
                              handleFilterChange("purpose", purpose)
                            }
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-700">
                            {purpose}
                          </span>
                        </label>
                      ),
                    )}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => toggleDropdown("occupancy")}
                  className="px-4 py-2 pr-8 rounded-lg border border-slate-300 hover:border-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer min-w-[150px] text-left flex items-center justify-between"
                >
                  <span className="text-sm">
                    Occupancy{" "}
                    {filters.occupancy.length > 0 &&
                      `(${filters.occupancy.length})`}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                {openDropdown === "occupancy" && (
                  <div className="absolute top-full mt-1 left-0 bg-white border border-slate-300 rounded-lg shadow-lg z-10 min-w-[150px]">
                    {["Owner", "Non-Owner", "Investment"].map((occupancy) => (
                      <label
                        key={occupancy}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.occupancy.includes(occupancy)}
                          onChange={() =>
                            handleFilterChange("occupancy", occupancy)
                          }
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">
                          {occupancy}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {(filters.amortizationType.length > 0 ||
                filters.loanTerm.length > 0 ||
                filters.loanType.length > 0 ||
                filters.purpose.length > 0 ||
                filters.occupancy.length > 0) && (
                <button
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      amortizationType: [],
                      loanTerm: [],
                      loanType: [],
                      purpose: [],
                      occupancy: [],
                    }));
                    setOpenDropdown(null);
                  }}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-semibold"
                >
                  Clear Loan Attributes
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 mb-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            Federal Policy Compliance Status
          </h3>
          <div className="space-y-2">
            {policyStats.map((policy) => (
              <div key={policy.name} id={`policy-${policy.name}`}>
                <div
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors cursor-pointer ${
                    expandedPolicy === policy.name
                      ? "bg-slate-200"
                      : "bg-slate-50 hover:bg-slate-100"
                  }`}
                  onClick={() =>
                    setExpandedPolicy(
                      expandedPolicy === policy.name ? null : policy.name,
                    )
                  }
                >
                  <div className="flex items-center gap-3 flex-1">
                    {policy.rules.length > 0 &&
                      (expandedPolicy === policy.name ? (
                        <ChevronDown className="w-5 h-5 text-slate-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                      ))}
                    <span className="font-semibold text-slate-900">
                      {policy.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(policy.name, null, "pass", false);
                      }}
                      className="flex items-center gap-2 hover:bg-emerald-50 px-2 py-1 rounded transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-slate-700">
                        {policy.passed}
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(policy.name, null, "warn", false);
                      }}
                      className="flex items-center gap-2 hover:bg-amber-50 px-2 py-1 rounded transition-colors"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-semibold text-slate-700">
                        {policy.warned}
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(policy.name, null, "fail", false);
                      }}
                      className="flex items-center gap-2 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                    >
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-semibold text-slate-700">
                        {policy.failed}
                      </span>
                    </button>
                    <div className="w-32">
                      <div className="flex items-center justify-end gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-emerald-500"
                            style={{ width: `${policy.passRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-slate-900 w-12 text-right">
                          {policy.passRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {expandedPolicy === policy.name && policy.rules.length > 0 && (
                  <div className="ml-8 mt-2 space-y-2 pb-2">
                    {policy.rules.map((rule) => {
                      const ruleData = policy.ruleStats[rule];
                      const rulePassRate =
                        policy.total > 0
                          ? ((ruleData.passed / policy.total) * 100).toFixed(1)
                          : "0";
                      return (
                        <div
                          key={rule}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                            <span className="text-sm font-medium text-slate-700">
                              {rule}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() =>
                                openModal(policy.name, rule, "pass", false)
                              }
                              className="flex items-center gap-2 hover:bg-emerald-50 px-2 py-1 rounded transition-colors"
                            >
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span className="text-xs font-semibold text-slate-600">
                                {ruleData.passed}
                              </span>
                            </button>
                            <button
                              onClick={() =>
                                openModal(policy.name, rule, "warn", false)
                              }
                              className="flex items-center gap-2 hover:bg-amber-50 px-2 py-1 rounded transition-colors"
                            >
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              <span className="text-xs font-semibold text-slate-600">
                                {ruleData.warned}
                              </span>
                            </button>
                            <button
                              onClick={() =>
                                openModal(policy.name, rule, "fail", false)
                              }
                              className="flex items-center gap-2 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                            >
                              <AlertCircle className="w-3 h-3 text-red-600" />
                              <span className="text-xs font-semibold text-slate-600">
                                {ruleData.failed}
                              </span>
                            </button>
                            <div className="w-24">
                              <div className="flex items-center justify-end gap-2">
                                <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                                  <div
                                    className="h-1.5 rounded-full bg-emerald-500"
                                    style={{ width: `${rulePassRate}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-bold text-slate-700 w-10 text-right">
                                  {rulePassRate}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 mb-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            State Policy Compliance Status - Iowa (IA)
          </h3>
          <div className="space-y-2">
            {statePolicyStats.map((policy) => (
              <div key={policy.name} id={`state-policy-${policy.name}`}>
                <div
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors cursor-pointer ${
                    expandedPolicy === `state-${policy.name}`
                      ? "bg-slate-200"
                      : "bg-slate-50 hover:bg-slate-100"
                  }`}
                  onClick={() =>
                    setExpandedPolicy(
                      expandedPolicy === `state-${policy.name}`
                        ? null
                        : `state-${policy.name}`,
                    )
                  }
                >
                  <div className="flex items-center gap-3 flex-1">
                    {policy.rules.length > 0 &&
                      (expandedPolicy === `state-${policy.name}` ? (
                        <ChevronDown className="w-5 h-5 text-slate-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                      ))}
                    <span className="font-semibold text-slate-900">
                      {policy.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(policy.name, null, "pass", true);
                      }}
                      className="flex items-center gap-2 hover:bg-emerald-50 px-2 py-1 rounded transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-slate-700">
                        {policy.passed}
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(policy.name, null, "warn", true);
                      }}
                      className="flex items-center gap-2 hover:bg-amber-50 px-2 py-1 rounded transition-colors"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-semibold text-slate-700">
                        {policy.warned}
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(policy.name, null, "fail", true);
                      }}
                      className="flex items-center gap-2 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                    >
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-semibold text-slate-700">
                        {policy.failed}
                      </span>
                    </button>
                    <div className="w-32">
                      <div className="flex items-center justify-end gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-emerald-500"
                            style={{ width: `${policy.passRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-slate-900 w-12 text-right">
                          {policy.passRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {expandedPolicy === `state-${policy.name}` &&
                  policy.rules.length > 0 && (
                    <div className="ml-8 mt-2 space-y-2 pb-2">
                      {policy.rules.map((rule) => {
                        const ruleData = policy.ruleStats[rule];
                        const rulePassRate =
                          policy.total > 0
                            ? ((ruleData.passed / policy.total) * 100).toFixed(
                                1,
                              )
                            : "0";
                        return (
                          <div
                            key={rule}
                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                              <span className="text-sm font-medium text-slate-700">
                                {rule}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() =>
                                  openModal(policy.name, rule, "pass", true)
                                }
                                className="flex items-center gap-2 hover:bg-emerald-50 px-2 py-1 rounded transition-colors"
                              >
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                <span className="text-xs font-semibold text-slate-600">
                                  {ruleData.passed}
                                </span>
                              </button>
                              <button
                                onClick={() =>
                                  openModal(policy.name, rule, "warn", true)
                                }
                                className="flex items-center gap-2 hover:bg-amber-50 px-2 py-1 rounded transition-colors"
                              >
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                <span className="text-xs font-semibold text-slate-600">
                                  {ruleData.warned}
                                </span>
                              </button>
                              <button
                                onClick={() =>
                                  openModal(policy.name, rule, "fail", true)
                                }
                                className="flex items-center gap-2 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                              >
                                <AlertCircle className="w-3 h-3 text-red-600" />
                                <span className="text-xs font-semibold text-slate-600">
                                  {ruleData.failed}
                                </span>
                              </button>
                              <div className="w-24">
                                <div className="flex items-center justify-end gap-2">
                                  <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                                    <div
                                      className="h-1.5 rounded-full bg-emerald-500"
                                      style={{ width: `${rulePassRate}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs font-bold text-slate-700 w-10 text-right">
                                    {rulePassRate}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900">
              Loan File Details
            </h3>
            <button
              onClick={() => setShowLoanTable(!showLoanTable)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              {showLoanTable ? "Hide Table" : "Show Table"}
            </button>
          </div>

          {showLoanTable && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search by Loan ID..."
                value={loanTableSearchTerm}
                onChange={(e) => setLoanTableSearchTerm(e.target.value)}
                className="w-full px-4 py-2 mb-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <div className="flex border border-slate-200 rounded mb-2">
                <div
                  className="flex-shrink-0 bg-slate-100 border-r-2 border-slate-400"
                  style={{ width: "830px" }}
                ></div>
                <div
                  className="flex-1 overflow-x-auto"
                  onScroll={(e) => {
                    const bottomScroll =
                      document.getElementById("loan-table-scroll");
                    if (bottomScroll) {
                      bottomScroll.scrollLeft = e.target.scrollLeft;
                    }
                  }}
                >
                  <div style={{ width: "5000px", height: "1px" }}></div>
                </div>
              </div>

              <div
                id="loan-table-scroll"
                className="overflow-x-auto border border-slate-200 rounded-lg"
                style={{ position: "relative" }}
                onScroll={(e) => {
                  const topScrollContainer =
                    e.target.parentElement.querySelector(
                      ".flex > div:last-child",
                    );
                  if (topScrollContainer) {
                    topScrollContainer.scrollLeft = e.target.scrollLeft;
                  }
                }}
              >
                <table
                  className="w-full border-collapse"
                  style={{ position: "relative" }}
                >
                  <thead className="bg-slate-100">
                    <tr className="border-b border-slate-300">
                      <th
                        rowSpan="2"
                        style={{
                          position: "sticky",
                          left: 0,
                          zIndex: 50,
                          width: "100px",
                          minWidth: "100px",
                          maxWidth: "100px",
                        }}
                        className="px-3 py-3 text-left text-xs font-bold text-slate-700 border-r border-slate-300 bg-slate-100"
                      >
                        Loan ID
                      </th>
                      <th
                        rowSpan="2"
                        style={{
                          position: "sticky",
                          left: "100px",
                          zIndex: 50,
                          width: "90px",
                          minWidth: "90px",
                          maxWidth: "90px",
                        }}
                        className="px-3 py-3 text-left text-xs font-bold text-slate-700 border-r border-slate-300 bg-slate-100"
                      >
                        Branch ID
                      </th>
                      <th
                        rowSpan="2"
                        style={{
                          position: "sticky",
                          left: "190px",
                          zIndex: 50,
                          width: "90px",
                          minWidth: "90px",
                          maxWidth: "90px",
                        }}
                        className="px-3 py-3 text-left text-xs font-bold text-slate-700 border-r border-slate-300 bg-slate-100"
                      >
                        MLO NMLS
                      </th>
                      <th
                        rowSpan="2"
                        style={{
                          position: "sticky",
                          left: "280px",
                          zIndex: 50,
                          width: "80px",
                          minWidth: "80px",
                          maxWidth: "80px",
                        }}
                        className="px-3 py-3 text-left text-xs font-bold text-slate-700 border-r border-slate-300 bg-slate-100"
                      >
                        Type
                      </th>
                      <th
                        rowSpan="2"
                        style={{
                          position: "sticky",
                          left: "360px",
                          zIndex: 50,
                          width: "60px",
                          minWidth: "60px",
                          maxWidth: "60px",
                        }}
                        className="px-3 py-3 text-left text-xs font-bold text-slate-700 border-r border-slate-300 bg-slate-100"
                      >
                        Term
                      </th>
                      <th
                        rowSpan="2"
                        style={{
                          position: "sticky",
                          left: "420px",
                          zIndex: 50,
                          width: "80px",
                          minWidth: "80px",
                          maxWidth: "80px",
                        }}
                        className="px-3 py-3 text-left text-xs font-bold text-slate-700 border-r border-slate-300 bg-slate-100"
                      >
                        Amort
                      </th>
                      <th
                        rowSpan="2"
                        style={{
                          position: "sticky",
                          left: "500px",
                          zIndex: 50,
                          width: "100px",
                          minWidth: "100px",
                          maxWidth: "100px",
                        }}
                        className="px-3 py-3 text-left text-xs font-bold text-slate-700 border-r border-slate-300 bg-slate-100"
                      >
                        Purpose
                      </th>
                      <th
                        rowSpan="2"
                        style={{
                          position: "sticky",
                          left: "600px",
                          zIndex: 50,
                          width: "110px",
                          minWidth: "110px",
                          maxWidth: "110px",
                        }}
                        className="px-3 py-3 text-left text-xs font-bold text-slate-700 border-r border-slate-300 bg-slate-100"
                      >
                        Occupancy
                      </th>
                      <th
                        rowSpan="2"
                        style={{
                          position: "sticky",
                          left: "710px",
                          zIndex: 50,
                          width: "120px",
                          minWidth: "120px",
                          maxWidth: "120px",
                          boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                        }}
                        className="px-3 py-3 text-left text-xs font-bold text-slate-700 border-r-2 border-slate-400 bg-slate-100"
                      >
                        Amount
                      </th>
                      <th
                        rowSpan="2"
                        className="px-3 py-3 text-center text-xs font-bold text-slate-700 border-r-2 border-slate-400 bg-blue-50"
                      >
                        Overall
                      </th>
                      <th
                        colSpan={policySets.reduce(
                          (sum, p) => sum + (p.rules.length || 1),
                          0,
                        )}
                        className="px-3 py-2 text-center text-xs font-bold text-slate-700 border-r-2 border-slate-400 bg-emerald-50"
                      >
                        Federal Policies
                      </th>
                      <th
                        colSpan={statePolicySets.reduce(
                          (sum, p) => sum + (p.rules.length || 1),
                          0,
                        )}
                        className="px-3 py-2 text-center text-xs font-bold text-slate-700 border-r border-slate-300 bg-amber-50"
                      >
                        State Policies (Iowa)
                      </th>
                    </tr>
                    <tr className="border-b-2 border-slate-400">
                      {policySets.map((policy, policyIndex) =>
                        policy.rules.map((rule, idx) => (
                          <th
                            key={`${policy.name}-${rule}`}
                            className={`px-2 py-2 text-center text-xs font-semibold text-slate-600 border-r border-slate-300 ${policyIndex === 0 && idx === 0 ? "border-l-2 border-l-slate-400" : ""}`}
                            style={{ minWidth: "80px" }}
                            title={`${policy.name} - ${rule}`}
                          >
                            <div className="font-bold text-emerald-700">
                              {policy.name}
                            </div>
                            <div className="text-slate-600">{rule}</div>
                          </th>
                        )),
                      )}
                      {statePolicySets.map((policy, policyIdx) =>
                        policy.rules.map((rule, idx) => (
                          <th
                            key={`state-${policy.name}-${rule}`}
                            className={`px-2 py-2 text-center text-xs font-semibold text-slate-600 border-r border-slate-300 ${policyIdx === 0 && idx === 0 ? "border-l-2 border-l-slate-400" : ""}`}
                            style={{ minWidth: "80px" }}
                            title={`${policy.state} - ${policy.name} - ${rule}`}
                          >
                            <div className="font-bold text-amber-700">
                              {policy.name}
                            </div>
                            <div className="text-slate-600">{rule}</div>
                          </th>
                        )),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {displayedLoans.slice(0, 50).map((loan) => (
                      <tr
                        key={loan.id}
                        id={`loan-${loan.id}`}
                        className="group hover:bg-slate-50 transition-colors"
                      >
                        <td
                          style={{
                            position: "sticky",
                            left: 0,
                            zIndex: 40,
                            width: "100px",
                            minWidth: "100px",
                            maxWidth: "100px",
                          }}
                          className="px-3 py-2 text-xs font-semibold text-slate-900 whitespace-nowrap border-r border-slate-200 bg-white group-hover:bg-slate-50"
                        >
                          {loan.id}
                        </td>
                        <td
                          style={{
                            position: "sticky",
                            left: "100px",
                            zIndex: 40,
                            width: "90px",
                            minWidth: "90px",
                            maxWidth: "90px",
                          }}
                          className="px-3 py-2 text-xs text-slate-700 whitespace-nowrap border-r border-slate-200 bg-white group-hover:bg-slate-50"
                        >
                          {loan.branchId}
                        </td>
                        <td
                          style={{
                            position: "sticky",
                            left: "190px",
                            zIndex: 40,
                            width: "90px",
                            minWidth: "90px",
                            maxWidth: "90px",
                          }}
                          className="px-3 py-2 text-xs text-slate-700 whitespace-nowrap border-r border-slate-200 bg-white group-hover:bg-slate-50"
                        >
                          {loan.mloNmlsId}
                        </td>
                        <td
                          style={{
                            position: "sticky",
                            left: "280px",
                            zIndex: 40,
                            width: "80px",
                            minWidth: "80px",
                            maxWidth: "80px",
                          }}
                          className="px-3 py-2 text-xs text-slate-700 whitespace-nowrap border-r border-slate-200 bg-white group-hover:bg-slate-50"
                        >
                          {loan.loanType}
                        </td>
                        <td
                          style={{
                            position: "sticky",
                            left: "360px",
                            zIndex: 40,
                            width: "60px",
                            minWidth: "60px",
                            maxWidth: "60px",
                          }}
                          className="px-3 py-2 text-xs text-slate-700 whitespace-nowrap border-r border-slate-200 bg-white group-hover:bg-slate-50"
                        >
                          {loan.loanTerm}y
                        </td>
                        <td
                          style={{
                            position: "sticky",
                            left: "420px",
                            zIndex: 40,
                            width: "80px",
                            minWidth: "80px",
                            maxWidth: "80px",
                          }}
                          className="px-3 py-2 text-xs text-slate-700 whitespace-nowrap border-r border-slate-200 bg-white group-hover:bg-slate-50"
                        >
                          {loan.amortizationType}
                        </td>
                        <td
                          style={{
                            position: "sticky",
                            left: "500px",
                            zIndex: 40,
                            width: "100px",
                            minWidth: "100px",
                            maxWidth: "100px",
                          }}
                          className="px-3 py-2 text-xs text-slate-700 whitespace-nowrap border-r border-slate-200 bg-white group-hover:bg-slate-50"
                        >
                          {loan.purpose}
                        </td>
                        <td
                          style={{
                            position: "sticky",
                            left: "600px",
                            zIndex: 40,
                            width: "110px",
                            minWidth: "110px",
                            maxWidth: "110px",
                          }}
                          className="px-3 py-2 text-xs text-slate-700 whitespace-nowrap border-r border-slate-200 bg-white group-hover:bg-slate-50"
                        >
                          {loan.occupancy}
                        </td>
                        <td
                          style={{
                            position: "sticky",
                            left: "710px",
                            zIndex: 40,
                            width: "120px",
                            minWidth: "120px",
                            maxWidth: "120px",
                            boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                          }}
                          className="px-3 py-2 text-xs text-slate-700 whitespace-nowrap border-r-2 border-slate-300 bg-white group-hover:bg-slate-50"
                        >
                          ${loan.amount.toLocaleString()}
                        </td>
                        <td className="px-2 py-2 text-center border-r-2 border-slate-300">
                          <span
                            className={`inline-block w-3 h-3 rounded-full ${
                              loan.overallStatus === "pass"
                                ? "bg-emerald-500"
                                : loan.overallStatus === "warn"
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                            title={loan.overallStatus}
                          ></span>
                        </td>
                        {policySets.map((policy) =>
                          policy.rules.map((rule) => {
                            const ruleStatus =
                              loan.ruleResults[policy.name]?.[rule] ||
                              "unknown";
                            return (
                              <td
                                key={`${loan.id}-${policy.name}-${rule}`}
                                className="px-2 py-2 text-center border-r border-slate-200"
                              >
                                <span
                                  className={`inline-block w-3 h-3 rounded-full ${
                                    ruleStatus === "pass"
                                      ? "bg-emerald-500"
                                      : ruleStatus === "warn"
                                        ? "bg-amber-500"
                                        : ruleStatus === "fail"
                                          ? "bg-red-500"
                                          : "bg-slate-300"
                                  }`}
                                  title={ruleStatus}
                                ></span>
                              </td>
                            );
                          }),
                        )}
                        {statePolicySets.map((policy) =>
                          policy.rules.map((rule) => {
                            const ruleStatus =
                              loan.stateRuleResults[policy.name]?.[rule] ||
                              "unknown";
                            return (
                              <td
                                key={`${loan.id}-state-${policy.name}-${rule}`}
                                className="px-2 py-2 text-center border-r border-slate-200"
                              >
                                <span
                                  className={`inline-block w-3 h-3 rounded-full ${
                                    ruleStatus === "pass"
                                      ? "bg-emerald-500"
                                      : ruleStatus === "warn"
                                        ? "bg-amber-500"
                                        : ruleStatus === "fail"
                                          ? "bg-red-500"
                                          : "bg-slate-300"
                                  }`}
                                  title={ruleStatus}
                                ></span>
                              </td>
                            );
                          }),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {displayedLoans.length > 50 && (
                <p className="text-sm text-slate-600 mt-4 text-center">
                  Showing first 50 of {displayedLoans.length} loans
                </p>
              )}
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Legend:
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-xs text-slate-600">Pass</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="text-xs text-slate-600">Warning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="text-xs text-slate-600">Fail</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {modalData && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden"
              style={{ maxHeight: "calc(100vh - 2rem)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
                <h2 className="text-2xl font-bold text-slate-900 pr-4">
                  {modalData.title}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-6 h-6 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-6 bg-blue-50 border-b border-slate-200">
                <p className="text-lg">
                  <span className="font-semibold text-slate-700">
                    Total Loans:{" "}
                  </span>
                  <span className="font-bold text-blue-600 text-xl">
                    {modalData.loans.length}
                  </span>
                </p>
              </div>

              <div
                className="overflow-auto"
                style={{ maxHeight: "calc(100vh - 20rem)" }}
              >
                {modalData.loans.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-lg">
                    No loans found with this status
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-slate-200 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-300 bg-slate-200">
                          Loan ID
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-300 bg-slate-200">
                          Branch ID
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-300 bg-slate-200">
                          MLO NMLS
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-300 bg-slate-200">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-300 bg-slate-200">
                          Term
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-300 bg-slate-200">
                          Amortization
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-300 bg-slate-200">
                          Purpose
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-300 bg-slate-200">
                          Occupancy
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-300 bg-slate-200">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-300 bg-slate-200">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {modalData.loans.map((loan) => (
                        <tr
                          key={loan.id}
                          className="border-b border-slate-200 hover:bg-slate-50"
                        >
                          <td className="px-4 py-3 text-sm whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleLoanClick(loan.id)}
                                style={{
                                  color: "#2563eb",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                  background: "none",
                                  border: "none",
                                  padding: 0,
                                }}
                                onMouseEnter={(e) =>
                                  (e.target.style.color = "#1d4ed8")
                                }
                                onMouseLeave={(e) =>
                                  (e.target.style.color = "#2563eb")
                                }
                              >
                                {loan.id}
                              </button>
                              <button
                                onClick={() => {
                                  if (uploadedImage) {
                                    setCurrentImageUrl(uploadedImage);
                                    setImageModalOpen(true);
                                  } else {
                                    alert(
                                      'Please upload a document image first using the "Upload Document Image" button at the top of the dashboard.',
                                    );
                                  }
                                }}
                                className="p-1 hover:bg-red-50 rounded transition-colors"
                                title="View PDF"
                              >
                                <svg
                                  className="w-4 h-4 text-red-600"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18.5,9L13,3.5V9H18.5M6,20V4H11V10H18V20H6M7,11H9V18H7V11M10,11H12A2,2 0 0,1 14,13V15A2,2 0 0,1 12,17H10V11M12,15V13H11V15H12M15,11H17V13H19V15H17V18H15V11Z" />
                                </svg>
                              </button>
                              <button
                                onClick={() =>
                                  console.log("Logo clicked for", loan.id)
                                }
                                className="p-1 hover:bg-blue-50 rounded transition-colors"
                                title="Open in RegCheck"
                              >
                                <svg
                                  className="w-4 h-4"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M12 2L3 7L12 12L21 7L12 2Z"
                                    fill="#1e40af"
                                  />
                                  <path
                                    d="M3 17L12 22L21 17L12 12L3 17Z"
                                    fill="#f97316"
                                  />
                                  <path
                                    d="M12 2L3 7V17L12 12V2Z"
                                    fill="#1e40af"
                                    fillOpacity="0.8"
                                  />
                                  <path
                                    d="M12 2L21 7V17L12 12V2Z"
                                    fill="#1e40af"
                                    fillOpacity="0.6"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                            {loan.branchId}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                            {loan.mloNmlsId}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                            {loan.loanType}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                            {loan.loanTerm}y
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                            {loan.amortizationType}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                            {loan.purpose}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                            {loan.occupancy}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                            ${loan.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 whitespace-nowrap ${getStatusColor(modalData.status)}`}
                            >
                              {getStatusIcon(modalData.status)}
                              {modalData.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="flex items-center justify-end p-4 border-t border-slate-200 bg-slate-50">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {imageModalOpen && currentImageUrl && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-75 p-4"
            onClick={() => {
              setImageModalOpen(false);
              setCurrentImageUrl(null);
            }}
          >
            <div
              className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-6xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-xl font-bold text-slate-900">
                  Document Image
                </h2>
                <button
                  onClick={() => {
                    setImageModalOpen(false);
                    setCurrentImageUrl(null);
                  }}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  aria-label="Close image"
                >
                  <svg
                    className="w-6 h-6 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div
                className="overflow-auto"
                style={{ maxHeight: "calc(90vh - 80px)" }}
              >
                <img
                  src={currentImageUrl}
                  alt="Document"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        )}

        {branchModalData && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={() => setBranchModalData(null)}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden"
              style={{ maxHeight: "calc(100vh - 2rem)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
                <h2 className="text-2xl font-bold text-slate-900 pr-4">
                  {branchModalData.branchName} - Loan Officers
                </h2>
                <button
                  onClick={() => setBranchModalData(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-6 h-6 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-6 bg-blue-50 border-b border-slate-200">
                <p className="text-lg">
                  <span className="font-semibold text-slate-700">
                    Total Loans:{" "}
                  </span>
                  <span className="font-bold text-blue-600 text-xl">
                    {branchModalData.totalLoans}
                  </span>
                  <span className="ml-4 font-semibold text-slate-700">
                    Loan Officers:{" "}
                  </span>
                  <span className="font-bold text-blue-600 text-xl">
                    {branchModalData.mloData.length}
                  </span>
                </p>
              </div>

              <div
                className="overflow-auto"
                style={{ maxHeight: "calc(100vh - 20rem)" }}
              >
                {branchModalData.mloData.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-lg">
                    No loan officers found
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-slate-200 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">
                          MLO NMLS ID
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-bold text-slate-700">
                          Total Loans
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-bold text-slate-700">
                          Passed
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-bold text-slate-700">
                          Warnings
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-bold text-slate-700">
                          Failed
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-bold text-slate-700">
                          Pass Rate
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-bold text-slate-700">
                          Warn Rate
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-bold text-slate-700">
                          Fail Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {branchModalData.mloData.map((mlo) => (
                        <tr
                          key={mlo.mloId}
                          className="border-b border-slate-200 hover:bg-slate-50"
                        >
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => {
                                setBranchModalData(null);
                                setFilters((prev) => ({
                                  ...prev,
                                  branch:
                                    branchModalData.branchName !==
                                    "All Branches"
                                      ? branchModalData.branchName
                                      : "",
                                  mlo: mlo.mloId,
                                }));
                              }}
                              className="font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                            >
                              {mlo.mloId}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-slate-700">
                            {mlo.total}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-emerald-600 font-semibold">
                            {mlo.passed}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-amber-600 font-semibold">
                            {mlo.warned}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-red-600 font-semibold">
                            {mlo.failed}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-slate-700">
                            {mlo.passRate}%
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-slate-700">
                            {mlo.warnRate}%
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-slate-700">
                            {mlo.failRate}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="flex items-center justify-end p-4 border-t border-slate-200 bg-slate-50">
                <button
                  onClick={() => setBranchModalData(null)}
                  className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MortgageComplianceDashboard;
