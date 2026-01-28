import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BranchComplianceChart = ({ branchStats, onBranchBarClick }) => {
  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Branch Compliance Overview</h3>
      </div>
      <div className="chart-responsive-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={branchStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              tick={(props) => {
                const { x, y, payload } = props;
                const isAllBranches = payload.value === "All Branches";
                return (
                  <text
                    x={x}
                    y={y}
                    dy={16}
                    textAnchor="middle"
                    className={
                      isAllBranches
                        ? "chart-axis-label-all-branches"
                        : "chart-axis-label"
                    }
                  >
                    {isAllBranches
                      ? payload.value.toUpperCase()
                      : payload.value}
                  </text>
                );
              }}
            />
            <YAxis
              stroke="#64748b"
              domain={[0, 100]}
              type="number"
              allowDataOverflow={false}
              label={{
                value: "Percentage (%)",
                angle: -90,
                position: "insideLeft",
                fill: "#64748b",
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="chart-tooltip-container">
                      <p className="chart-tooltip-title">{data.name}</p>
                      <p className="chart-tooltip-item chart-tooltip-item-fail">
                        Fail: {data.failRate}% ({data.failCount} loans)
                      </p>
                      <p className="chart-tooltip-item chart-tooltip-item-warn">
                        Warn: {data.warnRate}% ({data.warnCount} loans)
                      </p>
                      <p className="chart-tooltip-item chart-tooltip-item-total">
                        Total: {data.total} loans
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="failRate"
              stackId="a"
              fill="#ef4444"
              name="Fail %"
              cursor="pointer"
              onClick={(data) => onBranchBarClick(data.name)}
              label={(props) => {
                const { x, y, width, height } = props;
                const data = branchStats[props.index];
                if (data && data.failCount > 0 && height > 20) {
                  return (
                    <text
                      x={x + width / 2}
                      y={y + height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="chart-bar-label"
                    >
                      {data.failCount}
                    </text>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="warnRate"
              stackId="a"
              fill="#f59e0b"
              name="Warning %"
              cursor="pointer"
              onClick={(data) => onBranchBarClick(data.name)}
              label={(props) => {
                const { x, y, width, height } = props;
                const data = branchStats[props.index];
                if (data && data.warnCount > 0 && height > 20) {
                  return (
                    <text
                      x={x + width / 2}
                      y={y + height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="chart-bar-label"
                    >
                      {data.warnCount}
                    </text>
                  );
                }
                return null;
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BranchComplianceChart;
