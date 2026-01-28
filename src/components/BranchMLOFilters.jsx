import React from "react";

const BranchMLOFilters = ({
  filters,
  availableBranches,
  availableMLOs,
  onFilterChange,
}) => {
  const handleClear = () => {
    onFilterChange("branch", "");
    onFilterChange("mlo", "");
  };

  return (
    <>
      <h2
        id="policy-compliance-results"
        className="text-xl font-bold text-slate-900 mb-4"
      >
        Policy Compliance Testing Results
      </h2>
      <div id="branch-mlo-filters" className="filter-container">
        <div className="filter-wrapper">
          <span className="filter-label">Branch/MLO Filters:</span>

          <select
            value={filters.branch}
            onChange={(e) => onFilterChange("branch", e.target.value)}
            className="filter-select"
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
            onChange={(e) => onFilterChange("mlo", e.target.value)}
            className="filter-select"
          >
            <option value="">All MLOs</option>
            {availableMLOs.map((mlo) => (
              <option key={mlo} value={mlo}>
                {mlo}
              </option>
            ))}
          </select>

          {(filters.branch || filters.mlo) && (
            <button onClick={handleClear} className="filter-clear-button">
              Clear Branch & MLO
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default BranchMLOFilters;
