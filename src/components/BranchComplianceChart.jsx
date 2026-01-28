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
    <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 mb-6">
      <h3 className="text-xl font-bold text-slate-900 mb-4">
        Branch Compliance Overview
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={branchStats}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            stroke="#64748b"
            style={{ fontSize: "12px" }}
            tick={(props) => {
              const { x, y, payload } = props;
              const isAllBranches = payload.value === "All Branches";
              return (
                <text
                  x={x}
                  y={y}
                  dy={16}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="12px"
                  fontWeight={isAllBranches ? "800" : "normal"}
                >
                  {isAllBranches ? payload.value.toUpperCase() : payload.value}
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
              style: { fill: "#64748b" },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border border-slate-300 rounded-lg shadow-lg">
                    <p className="font-semibold text-slate-900">{data.name}</p>
                    <p className="text-sm text-red-600">
                      Fail: {data.failRate}% ({data.failCount} loans)
                    </p>
                    <p className="text-sm text-amber-600">
                      Warn: {data.warnRate}% ({data.warnCount} loans)
                    </p>
                    <p className="text-sm text-slate-600">
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
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="12"
                    fontWeight="bold"
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
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="12"
                    fontWeight="bold"
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
  );
};

export default BranchComplianceChart;
