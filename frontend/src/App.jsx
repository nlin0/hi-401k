import { useEffect, useState } from "react";
import {
  fetchContribution,
  saveContribution,
  fetchYTD,
} from "./api/contribution";

import ContributionTypeSelector from "./components/ContributionTypeSelector";
import ContributionInput from "./components/ContributionInput";
import YTDPanel from "./components/YTDPanel";
import SaveButton from "./components/SaveButton";
import ResetButton from "./components/ResetButton";
import ContributionLimitWarning from "./components/ContributionLimitWarning";
import TaxSavingsCard from "./components/TaxSavingsCard";
import MonthlyBreakdownCard from "./components/MonthlyBreakdownCard";
import ContributionBreakdownChart from "./components/ContributionBreakdownChart";
import ProjectionCard from "./components/ProjectionCard";
import CurrentContributionIndicator from "./components/CurrentContributionIndicator";
import Toast from "./components/Toast";

export default function App() {
  // states
  const [type, setType] = useState("percentage");
  const [value, setValue] = useState(8); // contribution value (either % or $ amount)
  const [ytd, setYTD] = useState(null);
  const [loading, setLoading] = useState(false);  // loading status during api calls
  const [showToast, setShowToast] = useState(false);
  const [saved, setSaved] = useState(null); // saved contribution (used for header indicator)

  // load initial data from backend on mount
  useEffect(() => {
    fetchContribution().then((data) => {
      setType(data.type);
      setValue(data.value);
      setSaved({ type: data.type, value: data.value });
    });

    fetchYTD().then((data) => setYTD(data));
  }, []);

  // save contribution settings to backend
  async function handleSave() {
    setLoading(true);
    await saveContribution({ type, value });
    setSaved({ type, value });
    setLoading(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }

  function handleTypeChange(newType) {
    if (newType === type) return;

    const ppYear = ytd?.paychecks_per_year || 26;
    const salary = ytd?.salary || 100000;

    // convert between percentage and dollar when switching types
    if (type === "percentage" && newType === "dollar") {
      const annualContrib = salary * (value / 100);
      const perPaycheck = annualContrib / ppYear;
      setValue(Math.round(perPaycheck));
    }
    // calculate percentage of salary
    else if (type === "dollar" && newType === "percentage") {
      const annualContrib = value * ppYear;
      const pct = salary > 0 ? (annualContrib / salary) * 100 : 0;
      const clampedPct = Math.max(0, Math.min(100, Math.round(pct * 10) / 10));
      setValue(clampedPct);
    }

    setType(newType);
  }

  // revert to last saved contribution pulled from backend
  function handleReset() {
    if (!saved) return;
    setType(saved.type);
    setValue(saved.value);
  }

  const hasUnsavedChanges =
    saved && (saved.type !== type || saved.value !== value);

  return (
    <div className="min-h-screen bg-[var(--hi-neutral-light)]">
      <div className="bg-[var(--hi-white)] border-b border-[var(--hi-gray-border)] shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--hi-dark-navy)] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">HI</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--hi-dark-navy)]">
                  Manage Your 401(k)
                </h1>
                <p className="text-sm text-[var(--hi-neutral-mid)] mt-0.5">
                  Modify contributions, and view retirement plan
                </p>
              </div>
            </div>
            <div className="md:flex-shrink-0 w-full md:w-auto">
              <CurrentContributionIndicator
                type={saved?.type || type}
                value={saved?.value ?? value}
                salary={ytd?.salary}
                paychecksPerYear={ytd?.paychecks_per_year}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <ContributionTypeSelector type={type} setType={handleTypeChange} />
            <ContributionInput
              type={type}
              value={value}
              setValue={setValue}
              salary={ytd?.salary}
              paychecksPerYear={ytd?.paychecks_per_year}
            />
            <ContributionLimitWarning
              salary={ytd?.salary}
              contributionValue={value}
              type={type}
              ytdContributions={ytd?.ytd_contributions}
              paychecksPerYear={ytd?.paychecks_per_year}
            />
            <SaveButton onSave={handleSave} loading={loading} />
            <ResetButton
              onReset={handleReset}
              disabled={!hasUnsavedChanges || loading}
            />
            <MonthlyBreakdownCard
              salary={ytd?.salary}
              contributionValue={value}
              type={type}
              paychecksPerYear={ytd?.paychecks_per_year}
            />
            <TaxSavingsCard
              salary={ytd?.salary}
              contributionValue={value}
              type={type}
              paychecksPerYear={ytd?.paychecks_per_year}
            />
          </div>

          <div>
            <ProjectionCard
              salary={ytd?.salary}
              contributionValue={value}
              type={type}
              paychecksPerYear={ytd?.paychecks_per_year}
            />
            <ContributionBreakdownChart
              salary={ytd?.salary}
              contributionValue={value}
              type={type}
              employerMatchRate={ytd?.employer_match_rate}
              employerMatchCap={ytd?.employer_match_cap}
              paychecksPerYear={ytd?.paychecks_per_year}
            />
            <YTDPanel ytd={ytd} onUpdate={(updatedYTD) => setYTD(updatedYTD)} />
          </div>
        </div>

        <Toast message="Contribution settings saved!" show={showToast} />
      </div>
    </div>
  );
}
