# Mortgage Compliance Dashboard - Architecture

## Overview

The application has been refactored to separate data concerns from presentation, following React best practices.

## Architecture

### Data Layer

- **`/src/data/policyDefinitions.js`** - Contains federal and state policy definitions
- **`/src/services/loanDataService.js`** - Mock data generation service that simulates API calls

### Business Logic Layer

- **`/src/hooks/useLoanData.js`** - Custom hook that handles data fetching and state management

### Presentation Layer

- **`/src/App.jsx`** - Container component that fetches data and handles loading/error states
- **`/src/MortgageComplianceDashboard.jsx`** - Pure presentation component that displays data

## Data Flow

```
App.jsx
  ↓
useLoanData() hook
  ↓
loanDataService.fetchLoanData()
  ↓
MortgageComplianceDashboard (receives loans, policySets, statePolicySets as props)
```

## Component Responsibilities

### App.jsx

- Fetches loan data using the `useLoanData` hook
- Handles loading and error states
- Passes data down to the dashboard component

### MortgageComplianceDashboard.jsx

- **Pure presentation component** - only displays data, doesn't fetch it
- Receives `loans`, `policySets`, and `statePolicySets` as props
- Manages UI state (filters, modals, etc.)
- Computes derived data (statistics, filtered views)

### useLoanData Hook

- Encapsulates data fetching logic
- Returns `{ loans, loading, error }`
- Handles async operations and error handling

### loanDataService

- Simulates API calls to fetch loan data
- In production, this would make real HTTP requests to a backend
- `generateMockLoans()` - Generates mock loan data based on policy definitions
- `fetchLoanData()` - Async function that simulates network delay

## Future Enhancements

### Real API Integration

Replace the mock service with real API calls:

```javascript
// src/services/loanDataService.js
export const fetchLoanData = async () => {
  const response = await fetch("/api/loans");
  if (!response.ok) {
    throw new Error("Failed to fetch loan data");
  }
  return response.json();
};
```

### Testing Benefits

The separated architecture makes testing easier:

```javascript
// Test the dashboard with mock data
<MortgageComplianceDashboard
  loans={mockLoans}
  policySets={mockPolicies}
  statePolicySets={mockStatePolicies}
/>
```

### Caching and Optimization

Add data caching to the service layer:

```javascript
// Add React Query or SWR for automatic caching
const { data, isLoading, error } = useQuery("loans", fetchLoanData);
```

## Benefits of This Architecture

1. **Separation of Concerns** - Data fetching is separate from presentation
2. **Reusability** - Dashboard can be used with different data sources
3. **Testability** - Components can be tested independently
4. **Maintainability** - Changes to data layer don't affect UI
5. **Scalability** - Easy to add new data sources or modify existing ones
