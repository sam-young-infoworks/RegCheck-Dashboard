import React from "react";
import { Shield, Upload } from "lucide-react";

const DashboardHeader = ({ portfolioStats, onImageUpload }) => {
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
        <div>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className="hidden"
            onChange={onImageUpload}
          />
          <button
            onClick={() => document.getElementById("imageUpload").click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Upload Document Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
