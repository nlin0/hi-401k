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
  const [type, setType] = useState("percentage");
  const [value, setValue] = useState(5);
  const [ytd, setYTD] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [savedContribution, setSavedContribution] = useState(null);

  // Load initial data
  useEffect(() => {
    fetchContribution().then((data) => {
      setType(data.type);
      setValue(data.value);
      setSavedContribution({ type: data.type, value: data.value });
    });

    fetchYTD().then((data) => setYTD(data));
  }, []);

  // SAVE handler
  async function handleSave() {
    setLoading(true);

    await saveContribution({ type, value });
    // Update saved contribution after successful save
    setSavedContribution({ type, value });

    setLoading(false);

    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }

  // Handle type change with value conversion
  function handleTypeChange(newType) {
    if (newType === type) return; // No change

    const paychecksPerYear = ytd?.paychecks_per_year || 26;
    const salary = ytd?.salary || 100000; // Fallback to default salary

    if (type === "percentage" && newType === "dollar") {
      // Converting from percentage to dollar
      // Calculate dollar amount per paycheck from percentage
      const annualContribution = salary * (value / 100);
      const perPaycheckAmount = annualContribution / paychecksPerYear;
      setValue(Math.round(perPaycheckAmount));
    } else if (type === "dollar" && newType === "percentage") {
      // Converting from dollar to percentage
      // Calculate percentage from dollar amount per paycheck
      const annualContribution = value * paychecksPerYear;
      const percentage = salary > 0 ? (annualContribution / salary) * 100 : 0;
      // Clamp to reasonable range (0-100%)
      const clampedPercentage = Math.max(0, Math.min(100, Math.round(percentage * 10) / 10));
      setValue(clampedPercentage);
    }

    setType(newType);
  }

  // ⭐ RESET handler (ASYNC + loading)
  async function handleReset() {
    setLoading(true);

    const defaultType = "percentage";
    const defaultValue = 5;

    // Update UI immediately
    setType(defaultType);
    setValue(defaultValue);

    // Persist to backend
    await saveContribution({
      type: defaultType,
      value: defaultValue,
    });
    // Update saved contribution after successful reset
    setSavedContribution({ type: defaultType, value: defaultValue });

    setLoading(false);

    // Show toast
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }

  return (
    <div className="min-h-screen bg-[var(--hi-neutral-light)]">
      {/* Header with Logo */}
      <div className="bg-[var(--hi-white)] border-b border-[var(--hi-neutral-mid)] shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Fake Logo */}
              <div className="w-12 h-12 bg-[var(--hi-primary-blue)] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">HI</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--hi-dark-navy)]">
                  Manage Your 401(k)
                </h1>
                <p className="text-sm text-[var(--hi-neutral-mid)] mt-0.5">
                  Adjust your contribution settings and see your retirement projection
                </p>
              </div>
            </div>
            {/* Current Contribution Indicator - always visible, shows saved values */}
            <div className="md:flex-shrink-0 w-full md:w-auto">
              <CurrentContributionIndicator
                type={savedContribution?.type || type}
                value={savedContribution?.value ?? value}
                salary={ytd?.salary}
                paychecksPerYear={ytd?.paychecks_per_year}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* TWO-COLUMN RESPONSIVE LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* LEFT COLUMN: Contribution settings */}
          <div>
            <ContributionTypeSelector type={type} setType={handleTypeChange} />
            <ContributionInput
              type={type}
              value={value}
              setValue={setValue}
              salary={ytd?.salary}
              paychecksPerYear={ytd?.paychecks_per_year}
            />

            {/* Contribution Limit Warning */}
            <ContributionLimitWarning
              salary={ytd?.salary}
              contributionValue={value}
              type={type}
              ytdContributions={ytd?.ytd_contributions}
              paychecksPerYear={ytd?.paychecks_per_year}
            />

            {/* ACTION BUTTONS */}
            <SaveButton onSave={handleSave} loading={loading} />
            <ResetButton onReset={handleReset} loading={loading} />

            {/* Monthly Breakdown */}
            <MonthlyBreakdownCard
              salary={ytd?.salary}
              contributionValue={value}
              type={type}
              paychecksPerYear={ytd?.paychecks_per_year}
            />

            {/* Tax Savings - moved to left column */}
            <TaxSavingsCard
              salary={ytd?.salary}
              contributionValue={value}
              type={type}
              paychecksPerYear={ytd?.paychecks_per_year}
            />
          </div>

          {/* RIGHT COLUMN: Benefits & Match */}
          <div>
            {/* Retirement Projection - shows long-term impact */}
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

            {/* YTD Panel - moved underneath employer match */}
            <YTDPanel ytd={ytd} onUpdate={(updatedYTD) => setYTD(updatedYTD)} />
          </div>
        </div>

        {/* Toast notification */}
        <Toast message="Contribution settings saved!" show={toastVisible} />
      </div>
    </div>
  );
}
