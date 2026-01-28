import React, { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const LoanAttributeFilters = ({
  filters,
  openDropdown,
  onFilterChange,
  onToggleDropdown,
}) => {
  const containerRef = useRef(null);

  const hasActiveFilters =
    filters.amortizationType.length > 0 ||
    filters.loanTerm.length > 0 ||
    filters.loanType.length > 0 ||
    filters.purpose.length > 0 ||
    filters.occupancy.length > 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && containerRef.current) {
        // Find all dropdown containers
        const dropdownElements =
          containerRef.current.querySelectorAll(".relative");
        let clickedInsideAnyDropdown = false;

        dropdownElements.forEach((dropdownEl) => {
          if (dropdownEl.contains(event.target)) {
            clickedInsideAnyDropdown = true;
          }
        });

        // Close if clicked outside all dropdowns but inside the container, or completely outside
        if (
          !clickedInsideAnyDropdown ||
          !containerRef.current.contains(event.target)
        ) {
          onToggleDropdown(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown, onToggleDropdown]);

  const handleClear = () => {
    onFilterChange("amortizationType", []);
    onFilterChange("loanTerm", []);
    onFilterChange("loanType", []);
    onFilterChange("purpose", []);
    onFilterChange("occupancy", []);
  };

  const FilterDropdown = ({ name, label, options }) => {
    const dropdownRef = useRef(null);

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => onToggleDropdown(name)}
          className="filter-dropdown-button"
        >
          <span className="text-sm">
            {label} {filters[name].length > 0 && `(${filters[name].length})`}
          </span>
          <ChevronDown className="w-4 h-4 filter-dropdown-icon" />
        </button>
        {openDropdown === name && (
          <div className="filter-dropdown-menu">
            {options.map((option) => (
              <label key={option.value} className="filter-dropdown-option">
                <input
                  type="checkbox"
                  checked={filters[name].includes(option.value)}
                  onChange={() => onFilterChange(name, option.value)}
                  className="filter-dropdown-checkbox"
                />
                <span className="filter-dropdown-label">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="filter-container" ref={containerRef}>
      <div className="filter-wrapper">
        <span className="filter-label">Loan Attribute Filters:</span>

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
          <button onClick={handleClear} className="filter-clear-button">
            Clear Loan Attributes
          </button>
        )}
      </div>
    </div>
  );
};

export default LoanAttributeFilters;
