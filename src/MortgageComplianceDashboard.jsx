import React, { useState, useMemo } from "react";
import DashboardHeader from "./components/DashboardHeader";
import BranchMLOFilters from "./components/BranchMLOFilters";
import LoanAttributeFilters from "./components/LoanAttributeFilters";
import BranchComplianceChart from "./components/BranchComplianceChart";
import PolicyBranchHeatmap from "./components/PolicyBranchHeatmap";
import PolicyComplianceSection from "./components/PolicyComplianceSection";
import LoanDetailsTable from "./components/LoanDetailsTable";
import LoanListModal from "./components/LoanListModal";
import ImageModal from "./components/ImageModal";
import BranchMLOModal from "./components/BranchMLOModal";
import {
  calculatePortfolioStats,
  calculatePolicyStats,
  calculateStatePolicyStats,
  calculateBranchStats,
  calculatePolicyBranchHeatmap,
  getAvailableBranches,
  getBranchToMLOMapping,
  getAvailableMLOs,
} from "./utils/calculations";
import { filterLoans, filterLoansBySearch } from "./utils/filters";

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
  const [expandedPolicies, setExpandedPolicies] = useState(new Set());
  const [showLoanTable, setShowLoanTable] = useState(false);
  const [loanTableSearchTerm, setLoanTableSearchTerm] = useState("");
  const [modalData, setModalData] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [branchModalData, setBranchModalData] = useState(null);

  const availableBranches = useMemo(() => getAvailableBranches(loans), [loans]);

  const branchToMLOMapping = useMemo(
    () => getBranchToMLOMapping(loans),
    [loans],
  );

  const availableMLOs = useMemo(
    () => getAvailableMLOs(loans, filters.branch, branchToMLOMapping),
    [loans, filters.branch, branchToMLOMapping],
  );

  const filteredLoans = useMemo(
    () => filterLoans(loans, filters),
    [loans, filters],
  );

  const displayedLoans = useMemo(
    () => filterLoansBySearch(filteredLoans, loanTableSearchTerm),
    [filteredLoans, loanTableSearchTerm],
  );

  const portfolioStats = useMemo(() => calculatePortfolioStats(loans), [loans]);

  const policyStats = useMemo(
    () => calculatePolicyStats(filteredLoans, policySets),
    [filteredLoans, policySets],
  );

  const statePolicyStats = useMemo(
    () => calculateStatePolicyStats(filteredLoans, statePolicySets),
    [filteredLoans, statePolicySets],
  );

  const branchStats = useMemo(() => calculateBranchStats(loans), [loans]);

  const policyBranchHeatmapData = useMemo(
    () =>
      calculatePolicyBranchHeatmap(
        loans,
        availableBranches,
        policySets,
        statePolicySets,
      ),
    [loans, availableBranches, policySets, statePolicySets],
  );

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
    } else if (Array.isArray(value)) {
      // Handle direct array assignment for clearing filters
      setFilters((prev) => ({ ...prev, [category]: value }));
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

  const handleTogglePolicy = (policyKey) => {
    setExpandedPolicies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(policyKey)) {
        newSet.delete(policyKey);
      } else {
        newSet.add(policyKey);
      }
      return newSet;
    });
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

  const handleMLOClick = (branchName, mloId) => {
    setBranchModalData(null);
    setFilters((prev) => ({
      ...prev,
      branch: branchName !== "All Branches" ? branchName : "",
      mlo: mloId,
    }));
  };

  const handleHeatmapCellClick = (branchName, policyName, isState) => {
    setFilters((prev) => ({
      ...prev,
      branch: branchName !== "All Branches" ? branchName : "",
    }));

    // Open only the corresponding policy accordion, close all others
    const policyKey = isState ? `state-${policyName}` : policyName;
    setExpandedPolicies(new Set([policyKey]));

    // Scroll to the policy section after a brief delay
    setTimeout(() => {
      const elementId = isState
        ? `state-policy-${policyName}`
        : `policy-${policyName}`;
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleOpenImageModal = (imageUrl) => {
    setCurrentImageUrl(imageUrl);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setCurrentImageUrl(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-[1600px] mx-auto">
        <DashboardHeader portfolioStats={portfolioStats} />

        <BranchComplianceChart
          branchStats={branchStats}
          onBranchBarClick={handleBranchBarClick}
        />

        <PolicyBranchHeatmap
          heatmapData={policyBranchHeatmapData}
          policySets={policySets}
          statePolicySets={statePolicySets}
          onCellClick={handleHeatmapCellClick}
        />

        <BranchMLOFilters
          filters={filters}
          availableBranches={availableBranches}
          availableMLOs={availableMLOs}
          onFilterChange={handleFilterChange}
        />

        <LoanAttributeFilters
          filters={filters}
          openDropdown={openDropdown}
          onFilterChange={handleFilterChange}
          onToggleDropdown={toggleDropdown}
        />

        <PolicyComplianceSection
          policyStats={policyStats}
          expandedPolicies={expandedPolicies}
          onTogglePolicy={handleTogglePolicy}
          onOpenModal={openModal}
          isState={false}
        />

        <PolicyComplianceSection
          policyStats={statePolicyStats}
          expandedPolicies={expandedPolicies}
          onTogglePolicy={handleTogglePolicy}
          onOpenModal={openModal}
          isState={true}
        />

        <LoanDetailsTable
          displayedLoans={displayedLoans}
          policySets={policySets}
          statePolicySets={statePolicySets}
          showLoanTable={showLoanTable}
          loanTableSearchTerm={loanTableSearchTerm}
          onToggleTable={() => setShowLoanTable(!showLoanTable)}
          onSearchChange={setLoanTableSearchTerm}
        />

        <LoanListModal
          modalData={modalData}
          onClose={closeModal}
          onLoanClick={handleLoanClick}
          onOpenImageModal={handleOpenImageModal}
        />

        <ImageModal
          isOpen={imageModalOpen}
          imageUrl={currentImageUrl}
          onClose={handleCloseImageModal}
        />

        <BranchMLOModal
          branchModalData={branchModalData}
          onClose={() => setBranchModalData(null)}
          onMLOClick={handleMLOClick}
        />
      </div>
    </div>
  );
};

export default MortgageComplianceDashboard;
