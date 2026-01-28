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
    <div id="branch-mlo-filters" className="filter-wrapper">
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
  );
};

export default BranchMLOFilters;
