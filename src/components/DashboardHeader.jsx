import React from "react";
import { Shield } from "lucide-react";

const DashboardHeader = ({ portfolioStats }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Shield className="w-10 h-10 text-blue-600" />
            Mortgage Compliance Dashboard - Iowa
          </h1>
          <p className="text-slate-600 text-lg">
            Automated regulatory audit analysis across {portfolioStats.total}{" "}
            loan files
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
