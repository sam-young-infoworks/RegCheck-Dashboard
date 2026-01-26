/**
 * Filter loans based on selected filters
 */
export const filterLoans = (loans, filters) => {
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
};

/**
 * Filter loans by search term
 */
export const filterLoansBySearch = (loans, searchTerm) => {
  if (!searchTerm) return loans;
  return loans.filter((loan) =>
    loan.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );
};
