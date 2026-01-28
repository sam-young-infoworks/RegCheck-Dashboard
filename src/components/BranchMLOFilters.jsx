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
      <div
        id="branch-mlo-filters"
        className="bg-white rounded-xl p-4 shadow-md border border-slate-200 mb-4"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-slate-700">
            Branch/MLO Filters:
          </span>

          <select
            value={filters.branch}
            onChange={(e) => onFilterChange("branch", e.target.value)}
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
            onChange={(e) => onFilterChange("mlo", e.target.value)}
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
              onClick={handleClear}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-semibold"
            >
              Clear Branch & MLO
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default BranchMLOFilters;
