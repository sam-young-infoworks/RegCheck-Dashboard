import React from "react";
import { getHeatmapColor } from "../utils/statusHelpers";

const PolicyBranchHeatmap = ({
  heatmapData,
  policySets,
  statePolicySets,
  onCellClick,
}) => {
  return (
    <div className="heatmap-container">
      <div className="heatmap-header">
        <h3 className="heatmap-title">Policy Failure Rate Heatmap by Branch</h3>
        <p className="heatmap-description">
          Failure percentage for each policy across all branches. Darker red
          indicates higher failure rates. Click any cell to filter by that
          branch.
        </p>
      </div>

      <div className="heatmap-scroll-container">
        <svg
          width={Math.max(1400, 150 + heatmapData.branches.length * 100)}
          height={heatmapData.data.length * 45 + 100}
        >
          {/* Column headers */}
          {heatmapData.branches.map((branch, i) => {
            const isAllBranches = branch === "All Branches";
            return (
              <g key={branch}>
                <text
                  x={150 + i * 100 + 50}
                  y={40}
                  textAnchor="middle"
                  className={
                    isAllBranches
                      ? "heatmap-column-header heatmap-column-header-all-branches"
                      : "heatmap-column-header"
                  }
                >
                  {isAllBranches ? branch.toUpperCase() : branch}
                </text>
              </g>
            );
          })}

          {/* Federal label */}
          <text x={5} y={65} className="heatmap-section-label-federal">
            FEDERAL
          </text>

          {/* Section divider line and State label */}
          <line
            x1={0}
            y1={60 + policySets.length * 45}
            x2={150 + heatmapData.branches.length * 100}
            y2={60 + policySets.length * 45}
            className="heatmap-divider-line"
          />
          <text
            x={5}
            y={60 + policySets.length * 45 + 15}
            className="heatmap-section-label-state"
          >
            STATE
          </text>

          {/* Heatmap cells */}
          {heatmapData.data.map((row, rowIdx) => (
            <g key={row.policyName}>
              {/* Row label */}
              <text
                x={140}
                y={65 + rowIdx * 45 + 22}
                textAnchor="end"
                className={`heatmap-row-label ${row.isState ? "heatmap-row-label-state" : "heatmap-row-label-federal"}`}
              >
                {row.policyName}
              </text>

              {/* Cells */}
              {heatmapData.branches.map((branch, colIdx) => {
                const cellData = row[branch];
                const failRate = parseFloat(cellData.failRate);
                return (
                  <g key={`${row.policyName}-${branch}`}>
                    <rect
                      x={150 + colIdx * 100}
                      y={60 + rowIdx * 45}
                      width={98}
                      height={43}
                      fill={getHeatmapColor(cellData.failRate)}
                      className="heatmap-cell"
                      onClick={() =>
                        onCellClick(branch, row.policyName, row.isState)
                      }
                    />
                    <text
                      x={150 + colIdx * 100 + 49}
                      y={60 + rowIdx * 45 + 22}
                      textAnchor="middle"
                      className="heatmap-cell-text-primary"
                    >
                      {failRate.toFixed(1)}%
                    </text>
                    <text
                      x={150 + colIdx * 100 + 49}
                      y={60 + rowIdx * 45 + 35}
                      textAnchor="middle"
                      className="heatmap-cell-text-secondary"
                    >
                      ({cellData.failCount}/{cellData.total})
                    </text>
                  </g>
                );
              })}
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="heatmap-legend">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="heatmap-legend-title">Failure Rate:</span>
          <div className="heatmap-legend-items">
            {[
              { color: "#10b981", label: "0-0.5%" },
              { color: "#84cc16", label: "0.5-1%" },
              { color: "#fbbf24", label: "1-1.5%" },
              { color: "#fb923c", label: "1.5-2%" },
              { color: "#f87171", label: "2-2.5%" },
              { color: "#ef4444", label: "2.5%+" },
            ].map((item) => (
              <div key={item.label} className="heatmap-legend-item">
                <div
                  className="heatmap-legend-color-box"
                  style={{ backgroundColor: item.color }}
                />
                <span className="heatmap-legend-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="heatmap-info-box">
        <p className="heatmap-info-text">
          <span className="heatmap-info-text-federal">Federal Policies</span>{" "}
          are shown first, followed by{" "}
          <span className="heatmap-info-text-state">State Policies (Iowa)</span>
        </p>
      </div>
    </div>
  );
};

export default PolicyBranchHeatmap;
