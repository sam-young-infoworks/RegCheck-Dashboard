import React from "react";
import { getHeatmapColor } from "../utils/statusHelpers";

const PolicyBranchHeatmap = ({
  heatmapData,
  policySets,
  statePolicySets,
  onCellClick,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 mb-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Policy Failure Rate Heatmap by Branch
        </h3>
        <p className="text-slate-600 text-sm">
          Failure percentage for each policy across all branches. Darker red
          indicates higher failure rates.
        </p>
      </div>

      <div className="overflow-x-auto">
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
                  className="text-xs fill-slate-600"
                  fontWeight={isAllBranches ? "800" : "600"}
                >
                  {isAllBranches ? branch.toUpperCase() : branch}
                </text>
              </g>
            );
          })}

          {/* Federal label */}
          <text x={5} y={65} className="text-xs font-bold fill-emerald-700">
            FEDERAL
          </text>

          {/* Section divider line and State label */}
          <line
            x1={0}
            y1={60 + policySets.length * 45}
            x2={150 + heatmapData.branches.length * 100}
            y2={60 + policySets.length * 45}
            stroke="#94a3b8"
            strokeWidth="2"
          />
          <text
            x={5}
            y={60 + policySets.length * 45 + 15}
            className="text-xs font-bold fill-amber-700"
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
                className={`text-xs font-semibold ${row.isState ? "fill-amber-700" : "fill-emerald-700"}`}
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
                      className="hover:opacity-80 cursor-pointer transition-opacity"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      onClick={() =>
                        onCellClick(branch, row.policyName, row.isState)
                      }
                    />
                    <text
                      x={150 + colIdx * 100 + 49}
                      y={60 + rowIdx * 45 + 22}
                      textAnchor="middle"
                      className="text-xs font-bold fill-white pointer-events-none"
                    >
                      {failRate.toFixed(1)}%
                    </text>
                    <text
                      x={150 + colIdx * 100 + 49}
                      y={60 + rowIdx * 45 + 35}
                      textAnchor="middle"
                      className="text-[10px] fill-white pointer-events-none opacity-90"
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
      <div className="mt-6 flex items-center gap-4">
        <span className="text-sm font-semibold text-slate-700">
          Failure Rate:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { color: "#10b981", label: "0-0.5%" },
            { color: "#84cc16", label: "0.5-1%" },
            { color: "#fbbf24", label: "1-1.5%" },
            { color: "#fb923c", label: "1.5-2%" },
            { color: "#f87171", label: "2-2.5%" },
            { color: "#ef4444", label: "2.5%+" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-slate-50 rounded-lg">
        <p className="text-xs text-slate-600">
          <span className="font-semibold text-emerald-700">
            Federal Policies
          </span>{" "}
          are shown first, followed by{" "}
          <span className="font-semibold text-amber-700">
            State Policies (Iowa)
          </span>
        </p>
      </div>
    </div>
  );
};

export default PolicyBranchHeatmap;
