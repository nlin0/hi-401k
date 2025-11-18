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
import DeltaComparisonCard from "./components/DeltaComparisonCard";
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
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-[var(--hi-dark-navy)]">
        401(k) Contribution Settings
      </h1>

      {/* ⭐ TWO-COLUMN RESPONSIVE LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* LEFT COLUMN: Contribution settings */}
        <div>
          <ContributionTypeSelector type={type} setType={setType} />
          <ContributionInput type={type} value={value} setValue={setValue} />
          
          {/* ACTION BUTTONS */}
          <SaveButton onSave={handleSave} loading={loading} />
          <ResetButton onReset={handleReset} loading={loading} />
        </div>

        {/* RIGHT COLUMN: Projections */}
        <div>
          <ProjectionCard
            salary={ytd?.salary}
            contributionValue={value}
            type={type}
          />

          <DeltaComparisonCard
            salary={ytd?.salary}
            contributionValue={value}
            type={type}
          />
        </div>
      </div>

      {/* FULL-WIDTH YTD PANEL */}
      <YTDPanel ytd={ytd} />

      {/* Toast notification */}
      <Toast message="Contribution settings saved!" show={toastVisible} />
    </div>
  );
}
