export default function ContributionLimitWarning({ salary, contributionValue, type, ytdContributions, paychecksPerYear = 26 }) {
  // irs contribution limits for 2025
  const IRS_LIMIT_2025 = 23000;
  const IRS_CATCH_UP = 7500; // additional for age 50+
  const userAge = 30;

  if (!salary) return null;

  // calculate projected annual contribution
  const annualContrib = type === "percentage"
    ? salary * (contributionValue / 100)
    : contributionValue * paychecksPerYear;

  // project year-end total (ytd + remaining year contributions)
  const projYearEnd = (ytdContributions || 0) + annualContrib;
  const limit = userAge >= 50 ? IRS_LIMIT_2025 + IRS_CATCH_UP : IRS_LIMIT_2025;

  // check if over or approaching limit
  const isOverLimit = projYearEnd > limit;
  const isNearLimit = projYearEnd > limit * 0.9; // within 90% of limit
  const remaining = Math.max(0, limit - (ytdContributions || 0));
  const maxPct = salary > 0 ? Math.min(100, (remaining / salary) * 100) : 0;

  // only show warning if over or near limit
  if (!isOverLimit && !isNearLimit) return null;

  return (
    <div className={`mt-4 p-4 rounded-lg border ${isOverLimit
      ? "bg-red-50 border-red-300"
      : isNearLimit
        ? "bg-yellow-50 border-yellow-300"
        : "bg-[var(--hi-light-blue)] border-[var(--hi-navy)]"
      }`}>
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 mt-0.5">
          {isOverLimit ? (
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold mb-1 ${isOverLimit ? "text-red-800" : "text-yellow-800"
            }`}>
            {isOverLimit ? "Contribution Limit Exceeded" : "Approaching Contribution Limit"}
          </h4>
          <p className={`text-sm ${isOverLimit ? "text-red-700" : "text-yellow-700"} mb-2`}>
            {isOverLimit ? (
              <>
                Your projected year-end contribution of <strong>${Math.round(projYearEnd).toLocaleString()}</strong> exceeds the 2025 IRS limit of <strong>${limit.toLocaleString()}</strong>. The plan will automatically stop contributions when you reach the limit.
              </>
            ) : (
              <>
                Your projected year-end contribution of <strong>${Math.round(projYearEnd).toLocaleString()}</strong> is approaching the 2025 IRS limit of <strong>${limit.toLocaleString()}</strong>. You can contribute up to <strong>${Math.round(remaining).toLocaleString()}</strong> more this year.
              </>
            )}
          </p>
          {!isOverLimit && maxPct > 0 && (
            <p className="text-xs text-yellow-600">
              Maximum percentage to stay within limit: <strong>{maxPct.toFixed(1)}%</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

