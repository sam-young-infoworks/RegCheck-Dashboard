import React from "react";
import {
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const PolicyComplianceSection = ({
  policyStats,
  expandedPolicies,
  onTogglePolicy,
  onOpenModal,
  isState = false,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 mb-6">
      <h3 className="text-xl font-bold text-slate-900 mb-4">
        {isState ? "State Policies - Iowa (IA)" : "Federal Policies"}
      </h3>
      <div className="space-y-2">
        {policyStats.map((policy) => {
          const policyKey = isState ? `state-${policy.name}` : policy.name;
          const isExpanded = expandedPolicies.has(policyKey);

          return (
            <div
              key={policy.name}
              id={
                isState
                  ? `state-policy-${policy.name}`
                  : `policy-${policy.name}`
              }
            >
              <div
                className={`flex items-center justify-between p-4 rounded-lg transition-colors cursor-pointer ${
                  isExpanded ? "bg-slate-200" : "bg-slate-50 hover:bg-slate-100"
                }`}
                onClick={() => onTogglePolicy(policyKey)}
              >
                <div className="flex items-center gap-3 flex-1">
                  {policy.rules.length > 0 &&
                    (isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-slate-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-600" />
                    ))}
                  <span className="font-semibold text-slate-900">
                    {policy.name}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenModal(policy.name, null, "pass", isState);
                    }}
                    className="flex items-center gap-2 hover:bg-emerald-50 px-2 py-1 rounded transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-slate-700">
                      {policy.passed}
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenModal(policy.name, null, "warn", isState);
                    }}
                    className="flex items-center gap-2 hover:bg-amber-50 px-2 py-1 rounded transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-semibold text-slate-700">
                      {policy.warned}
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenModal(policy.name, null, "fail", isState);
                    }}
                    className="flex items-center gap-2 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-semibold text-slate-700">
                      {policy.failed}
                    </span>
                  </button>
                  <div className="w-32">
                    <div className="flex items-center justify-end gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-emerald-500"
                          style={{ width: `${policy.passRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-slate-900 w-12 text-right">
                        {policy.passRate}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {isExpanded && policy.rules.length > 0 && (
                <div className="ml-8 mt-2 space-y-2 pb-2">
                  {policy.rules.map((rule) => {
                    const ruleData = policy.ruleStats[rule];
                    const rulePassRate =
                      policy.total > 0
                        ? ((ruleData.passed / policy.total) * 100).toFixed(1)
                        : "0";
                    return (
                      <div
                        key={rule}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                          <span className="text-sm font-medium text-slate-700">
                            {rule}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() =>
                              onOpenModal(policy.name, rule, "pass", isState)
                            }
                            className="flex items-center gap-2 hover:bg-emerald-50 px-2 py-1 rounded transition-colors"
                          >
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span className="text-xs font-semibold text-slate-600">
                              {ruleData.passed}
                            </span>
                          </button>
                          <button
                            onClick={() =>
                              onOpenModal(policy.name, rule, "warn", isState)
                            }
                            className="flex items-center gap-2 hover:bg-amber-50 px-2 py-1 rounded transition-colors"
                          >
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span className="text-xs font-semibold text-slate-600">
                              {ruleData.warned}
                            </span>
                          </button>
                          <button
                            onClick={() =>
                              onOpenModal(policy.name, rule, "fail", isState)
                            }
                            className="flex items-center gap-2 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                          >
                            <AlertCircle className="w-3 h-3 text-red-600" />
                            <span className="text-xs font-semibold text-slate-600">
                              {ruleData.failed}
                            </span>
                          </button>
                          <div className="w-24">
                            <div className="flex items-center justify-end gap-2">
                              <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                                <div
                                  className="h-1.5 rounded-full bg-emerald-500"
                                  style={{ width: `${rulePassRate}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-bold text-slate-700 w-10 text-right">
                                {rulePassRate}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PolicyComplianceSection;
