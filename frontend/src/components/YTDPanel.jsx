import { useState, useEffect } from "react";
import { saveYTD } from "../api/contribution";

export default function YTDPanel({ ytd, onUpdate }) {
  // state for edit mode toggle
  const [isEditing, setIsEditing] = useState(false);
  // state for edited ytd values (separate from prop to allow cancel)
  const [editedYTD, setEditedYTD] = useState({
    salary: ytd?.salary || 100000,
    paychecks_per_year: ytd?.paychecks_per_year || 26,
    ytd_contributions: ytd?.ytd_contributions || 5200,
    employer_match_rate: ytd?.employer_match_rate || 0.50,
    employer_match_cap: ytd?.employer_match_cap || 6,
  });
  // local string state for inputs (allows empty strings while typing)
  const [localValues, setLocalValues] = useState({
    salary: String(editedYTD.salary),
    paychecks_per_year: String(editedYTD.paychecks_per_year),
    ytd_contributions: String(editedYTD.ytd_contributions),
    employer_match_rate: String(editedYTD.employer_match_rate),
    employer_match_cap: String(editedYTD.employer_match_cap),
  });

  // sync local values when editedYTD changes
  useEffect(() => {
    setLocalValues({
      salary: String(editedYTD.salary),
      paychecks_per_year: String(editedYTD.paychecks_per_year),
      ytd_contributions: String(editedYTD.ytd_contributions),
      employer_match_rate: String(editedYTD.employer_match_rate),
      employer_match_cap: String(editedYTD.employer_match_cap),
    });
  }, [editedYTD]);

  // sync editedYTD when ytd prop changes
  useEffect(() => {
    if (ytd) {
      setEditedYTD({
        salary: ytd.salary || 100000,
        paychecks_per_year: ytd.paychecks_per_year || 26,
        ytd_contributions: ytd.ytd_contributions || 5200,
        employer_match_rate: ytd.employer_match_rate || 0.50,
        employer_match_cap: ytd.employer_match_cap || 6,
      });
    }
  }, [ytd]);

  if (!ytd) return null;

  // save edited ytd data to backend and update parent
  const handleSave = async () => {
    await saveYTD(editedYTD);
    setIsEditing(false);
    if (onUpdate) {
      onUpdate(editedYTD);
    }
  };

  // cancel editing and reset to original values
  const handleCancel = () => {
    const resetValues = {
      salary: ytd.salary,
      paychecks_per_year: ytd.paychecks_per_year,
      ytd_contributions: ytd.ytd_contributions,
      employer_match_rate: ytd.employer_match_rate,
      employer_match_cap: ytd.employer_match_cap,
    };
    setEditedYTD(resetValues);
    setLocalValues({
      salary: String(resetValues.salary),
      paychecks_per_year: String(resetValues.paychecks_per_year),
      ytd_contributions: String(resetValues.ytd_contributions),
      employer_match_rate: String(resetValues.employer_match_rate),
      employer_match_cap: String(resetValues.employer_match_cap),
    });
    setIsEditing(false);
  };

  // handle input change (update local string value)
  const handleInputChange = (field, value) => {
    setLocalValues({ ...localValues, [field]: value });
    // update editedYTD if value is valid number
    const numVal = Number(value);
    if (value !== "" && !isNaN(numVal)) {
      setEditedYTD({ ...editedYTD, [field]: numVal });
    }
  };

  // handle input blur (validate and clean up value)
  const handleInputBlur = (field, defaultValue) => {
    const numVal = Number(localValues[field]);
    if (isNaN(numVal) || localValues[field] === "") {
      // restore to current editedYTD value or default
      const currentValue = editedYTD[field] || defaultValue;
      setLocalValues({ ...localValues, [field]: String(currentValue) });
      setEditedYTD({ ...editedYTD, [field]: currentValue });
    } else {
      // ensure editedYTD is updated with valid number
      setLocalValues({ ...localValues, [field]: String(numVal) });
      setEditedYTD({ ...editedYTD, [field]: numVal });
    }
  };

  return (
    <div className="mt-6 p-4 rounded-lg bg-[var(--hi-white)] border border-[var(--hi-gray-border)] shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-[var(--hi-dark-navy)]">
          Year-to-Date Contributions
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-[var(--hi-primary-blue)] hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-[var(--hi-dark-navy)] mb-1">Salary</label>
            <input
              type="number"
              value={localValues.salary}
              onChange={(e) => handleInputChange("salary", e.target.value)}
              onBlur={() => handleInputBlur("salary", 100000)}
              className="w-full border border-[var(--hi-gray-border)] p-2 rounded-lg focus:border-[var(--hi-primary-blue)] focus:ring-2 focus:ring-[var(--hi-primary-blue)] focus:ring-opacity-20"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--hi-dark-navy)] mb-1">Paychecks per Year</label>
            <input
              type="number"
              value={localValues.paychecks_per_year}
              onChange={(e) => handleInputChange("paychecks_per_year", e.target.value)}
              onBlur={() => handleInputBlur("paychecks_per_year", 26)}
              className="w-full border border-[var(--hi-gray-border)] p-2 rounded-lg focus:border-[var(--hi-primary-blue)] focus:ring-2 focus:ring-[var(--hi-primary-blue)] focus:ring-opacity-20"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--hi-dark-navy)] mb-1">YTD Contributions</label>
            <input
              type="number"
              value={localValues.ytd_contributions}
              onChange={(e) => handleInputChange("ytd_contributions", e.target.value)}
              onBlur={() => handleInputBlur("ytd_contributions", 5200)}
              className="w-full border border-[var(--hi-gray-border)] p-2 rounded-lg focus:border-[var(--hi-primary-blue)] focus:ring-2 focus:ring-[var(--hi-primary-blue)] focus:ring-opacity-20"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--hi-dark-navy)] mb-1">Employer Match Rate</label>
            <input
              type="number"
              step="0.01"
              value={localValues.employer_match_rate}
              onChange={(e) => handleInputChange("employer_match_rate", e.target.value)}
              onBlur={() => handleInputBlur("employer_match_rate", 0.50)}
              className="w-full border border-[var(--hi-gray-border)] p-2 rounded-lg focus:border-[var(--hi-primary-blue)] focus:ring-2 focus:ring-[var(--hi-primary-blue)] focus:ring-opacity-20"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--hi-dark-navy)] mb-1">Employer Match Cap (%)</label>
            <input
              type="number"
              value={localValues.employer_match_cap}
              onChange={(e) => handleInputChange("employer_match_cap", e.target.value)}
              onBlur={() => handleInputBlur("employer_match_cap", 6)}
              className="w-full border border-[var(--hi-gray-border)] p-2 rounded-lg focus:border-[var(--hi-primary-blue)] focus:ring-2 focus:ring-[var(--hi-primary-blue)] focus:ring-opacity-20"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[var(--hi-primary-blue)] text-[var(--hi-white)] rounded-lg hover:opacity-90 transition"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-[var(--hi-gray-border)] text-[var(--hi-navy)] rounded-lg hover:opacity-90 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="text-[var(--hi-neutral-mid)] space-y-1">
          <p><strong className="text-[var(--hi-dark-navy)]">Salary:</strong> ${ytd.salary.toLocaleString()}</p>
          <p><strong className="text-[var(--hi-dark-navy)]">Paychecks/year:</strong> {ytd.paychecks_per_year}</p>
          <p><strong className="text-[var(--hi-dark-navy)]">YTD Contributions:</strong> ${ytd.ytd_contributions.toLocaleString()}</p>
          <p><strong className="text-[var(--hi-dark-navy)]">Employer Match:</strong> {(ytd.employer_match_rate * 100).toFixed(0)}% match, up to {ytd.employer_match_cap}%</p>
        </div>
      )}
    </div>
  );
}
