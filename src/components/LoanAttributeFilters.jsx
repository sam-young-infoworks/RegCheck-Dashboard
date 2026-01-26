import React from "react";
import { ChevronDown } from "lucide-react";

const LoanAttributeFilters = ({
  filters,
  openDropdown,
  onFilterChange,
  onToggleDropdown,
}) => {
  const hasActiveFilters =
    filters.amortizationType.length > 0 ||
    filters.loanTerm.length > 0 ||
    filters.loanType.length > 0 ||
    filters.purpose.length > 0 ||
    filters.occupancy.length > 0;

  const handleClear = () => {
    onFilterChange("amortizationType", []);
    onFilterChange("loanTerm", []);
    onFilterChange("loanType", []);
    onFilterChange("purpose", []);
    onFilterChange("occupancy", []);
  };

  const FilterDropdown = ({ name, label, options }) => (
    <div className="relative">
      <button
        onClick={() => onToggleDropdown(name)}
        className="px-4 py-2 pr-8 rounded-lg border border-slate-300 hover:border-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer min-w-[150px] text-left flex items-center justify-between"
      >
        <span className="text-sm">
          {label} {filters[name].length > 0 && `(${filters[name].length})`}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>
      {openDropdown === name && (
        <div className="absolute top-full mt-1 left-0 bg-white border border-slate-300 rounded-lg shadow-lg z-10 min-w-[150px]">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters[name].includes(option.value)}
                onChange={() => onFilterChange(name, option.value)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200 mb-6">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-semibold text-slate-700">
          Loan Attribute Filters:
        </span>

        <FilterDropdown
          name="amortizationType"
          label="Amortization Type"
          options={[
            { value: "Fixed", label: "Fixed" },
            { value: "ARM", label: "ARM" },
            { value: "Interest Only", label: "Interest Only" },
          ]}
        />

        <FilterDropdown
          name="loanTerm"
          label="Loan Term"
          options={[
            { value: "15", label: "15 Years" },
            { value: "20", label: "20 Years" },
            { value: "30", label: "30 Years" },
          ]}
        />

        <FilterDropdown
          name="loanType"
          label="Loan Type"
          options={[
            { value: "Conventional", label: "Conventional" },
            { value: "FHA", label: "FHA" },
            { value: "VA", label: "VA" },
            { value: "USDA", label: "USDA" },
          ]}
        />

        <FilterDropdown
          name="purpose"
          label="Purpose"
          options={[
            { value: "Purchase", label: "Purchase" },
            { value: "Refinance", label: "Refinance" },
            { value: "Cash-Out Refi", label: "Cash-Out Refi" },
          ]}
        />

        <FilterDropdown
          name="occupancy"
          label="Occupancy"
          options={[
            { value: "Owner", label: "Owner" },
            { value: "Non-Owner", label: "Non-Owner" },
            { value: "Investment", label: "Investment" },
          ]}
        />

        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-semibold"
          >
            Clear Loan Attributes
          </button>
        )}
      </div>
    </div>
  );
};

export default LoanAttributeFilters;
