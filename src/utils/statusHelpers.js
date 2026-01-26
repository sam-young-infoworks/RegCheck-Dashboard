import { CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";

/**
 * Get color classes for a given status
 */
export const getStatusColor = (status) => {
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
