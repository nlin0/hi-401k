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
import ProjectionCard from "./components/ProjectionCard";
import ContributionLimitWarning from "./components/ContributionLimitWarning";
import TaxSavingsCard from "./components/TaxSavingsCard";
import MonthlyBreakdownCard from "./components/MonthlyBreakdownCard";
import RetirementProjectionChart from "./components/RetirementProjectionChart";
import ContributionBreakdownChart from "./components/ContributionBreakdownChart";
import EmployerMatchCard from "./components/EmployerMatchCard";
import ContributionLimitProgress from "./components/ContributionLimitProgress";
import AnnualSummaryCard from "./components/AnnualSummaryCard";
import Toast from "./components/Toast";

export default function App() {
  const [type, setType] = useState("percentage");
  const [value, setValue] = useState(5);
  const [ytd, setYTD] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // Load initial data
  useEffect(() => {
    fetchContribution().then((data) => {
      setType(data.type);
      setValue(data.value);
    });

    fetchYTD().then((data) => setYTD(data));
  }, []);

  // SAVE handler
  async function handleSave() {
    setLoading(true);

    await saveContribution({ type, value });

    setLoading(false);

    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }

  // Handle type change with value conversion
  function handleTypeChange(newType) {
    if (newType === type) return; // No change

    const paychecksPerYear = 26;
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

    setLoading(false);

    // Show toast
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-[var(--hi-dark-navy)]">
        401(k) Contribution Settings
      </h1>

      {/* FULL-WIDTH VISUALIZATIONS AT TOP */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RetirementProjectionChart
          salary={ytd?.salary}
          contributionValue={value}
          type={type}
        />

        <div>
          <ContributionBreakdownChart
            salary={ytd?.salary}
            contributionValue={value}
            type={type}
            employerMatchRate={ytd?.employer_match_rate}
            employerMatchCap={ytd?.employer_match_cap}
          />

          {/* Employer Match Card - below the chart */}
          <EmployerMatchCard
            salary={ytd?.salary}
            contributionValue={value}
            type={type}
            employerMatchRate={ytd?.employer_match_rate}
            employerMatchCap={ytd?.employer_match_cap}
          />
        </div>
      </div>

      {/* TWO-COLUMN RESPONSIVE LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* LEFT COLUMN: Contribution settings */}
        <div>
          <ContributionTypeSelector type={type} setType={handleTypeChange} />
          <ContributionInput type={type} value={value} setValue={setValue} salary={ytd?.salary} />

          {/* Contribution Limit Progress */}
          <ContributionLimitProgress
            salary={ytd?.salary}
            contributionValue={value}
            type={type}
            ytdContributions={ytd?.ytd_contributions}
          />

          {/* Contribution Limit Warning */}
          <ContributionLimitWarning
            salary={ytd?.salary}
            contributionValue={value}
            type={type}
            ytdContributions={ytd?.ytd_contributions}
          />

          {/* Monthly Breakdown */}
          <MonthlyBreakdownCard
            salary={ytd?.salary}
            contributionValue={value}
            type={type}
          />

          {/* ACTION BUTTONS */}
          <SaveButton onSave={handleSave} loading={loading} />
          <ResetButton onReset={handleReset} loading={loading} />
        </div>

        {/* RIGHT COLUMN: Projections & Benefits */}
        <div>
          <AnnualSummaryCard
            salary={ytd?.salary}
            contributionValue={value}
            type={type}
            employerMatchRate={ytd?.employer_match_rate}
            employerMatchCap={ytd?.employer_match_cap}
          />

          <ProjectionCard
            salary={ytd?.salary}
            contributionValue={value}
            type={type}
          />

          {/* Tax Savings */}
          <TaxSavingsCard
            salary={ytd?.salary}
            contributionValue={value}
            type={type}
          />
        </div>
      </div>

      {/* FULL-WIDTH YTD PANEL */}
      <YTDPanel ytd={ytd} onUpdate={(updatedYTD) => setYTD(updatedYTD)} />

      {/* Toast notification */}
      <Toast message="Contribution settings saved!" show={toastVisible} />
    </div>
  );
}
