import { useState } from "react";
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
    setEditedYTD({
      salary: ytd.salary,
      paychecks_per_year: ytd.paychecks_per_year,
      ytd_contributions: ytd.ytd_contributions,
      employer_match_rate: ytd.employer_match_rate,
      employer_match_cap: ytd.employer_match_cap,
    });
    setIsEditing(false);
  };

  return (
    <div className="mt-6 p-4 rounded-lg bg-[var(--hi-white)] border border-[var(--hi-neutral-mid)] shadow-sm">
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
              value={editedYTD.salary}
              onChange={(e) => setEditedYTD({ ...editedYTD, salary: Number(e.target.value) })}
              className="w-full border border-[var(--hi-neutral-mid)] p-2 rounded-lg focus:border-[var(--hi-primary-blue)] focus:ring-2 focus:ring-[var(--hi-primary-blue)] focus:ring-opacity-20"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--hi-dark-navy)] mb-1">Paychecks per Year</label>
            <input
              type="number"
              value={editedYTD.paychecks_per_year}
              onChange={(e) => setEditedYTD({ ...editedYTD, paychecks_per_year: Number(e.target.value) })}
              className="w-full border border-[var(--hi-neutral-mid)] p-2 rounded-lg focus:border-[var(--hi-primary-blue)] focus:ring-2 focus:ring-[var(--hi-primary-blue)] focus:ring-opacity-20"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--hi-dark-navy)] mb-1">YTD Contributions</label>
            <input
              type="number"
              value={editedYTD.ytd_contributions}
              onChange={(e) => setEditedYTD({ ...editedYTD, ytd_contributions: Number(e.target.value) })}
              className="w-full border border-[var(--hi-neutral-mid)] p-2 rounded-lg focus:border-[var(--hi-primary-blue)] focus:ring-2 focus:ring-[var(--hi-primary-blue)] focus:ring-opacity-20"
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
              className="px-4 py-2 bg-[var(--hi-neutral-mid)] text-[var(--hi-white)] rounded-lg hover:opacity-90 transition"
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
        </div>
      )}
    </div>
  );
}
