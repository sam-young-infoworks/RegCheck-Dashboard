/**
 * Get color classes for a given status
 */
export const getStatusColor = (status) => {
  switch (status) {
    case "pass":
      return "status-badge status-badge--pass";
    case "warn":
      return "status-badge status-badge--warn";
    case "fail":
      return "status-badge status-badge--fail";
    default:
      return "status-badge status-badge--neutral";
  }
};

/**
 * Get background color for heatmap based on fail rate
 */
export const getHeatmapColor = (failRate) => {
  const rate = parseFloat(failRate);
  if (rate <= 0.5) return "#10b981"; // Green
  if (rate <= 1.0) return "#84cc16"; // Light green
  if (rate <= 1.5) return "#fbbf24"; // Yellow
  if (rate <= 2.0) return "#fb923c"; // Orange
  if (rate <= 2.5) return "#f87171"; // Light red
  return "#ef4444"; // Red
};
