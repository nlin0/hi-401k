export default function ContributionLimitWarning({ salary, contributionValue, type, ytdContributions, paychecksPerYear = 26 }) {
  // 2024 IRS limits (would be updated yearly in production)
  const IRS_ANNUAL_LIMIT_2024 = 23000; // $23,000 for 2024 for those under 50
  const IRS_CATCH_UP_LIMIT = 7650; // Additional $7,650 for 50+
  const currentYear = 2024;
  
  if (!salary) return null;
  
  // Calculate annual contribution based on current setting
  const annualContribution = type === "percentage" 
    ? salary * (contributionValue / 100)
    : contributionValue * paychecksPerYear;

  const projectedAnnualContribution = annualContribution;
  const projectedYearEnd = (ytdContributions || 0) + projectedAnnualContribution;
  
  const isOverLimit = projectedYearEnd > IRS_ANNUAL_LIMIT_2024;
  const isNearLimit = projectedYearEnd > IRS_ANNUAL_LIMIT_2024 * 0.9; // Within 90% of limit
  const remainingCapacity = Math.max(0, IRS_ANNUAL_LIMIT_2024 - (ytdContributions || 0));
  const maxContribution = remainingCapacity;

  // Calculate max percentage that would hit the limit
  const maxPercentageForLimit = salary > 0 
    ? Math.min(100, (maxContribution / salary) * 100)
    : 0;

  // Only show warning if approaching or exceeding limit (to avoid cluttering UI)
  if (!isOverLimit && !isNearLimit) return null;

  return (
    <div className={`mt-4 p-4 rounded-lg border ${
      isOverLimit 
        ? "bg-red-50 border-red-300" 
        : isNearLimit 
        ? "bg-yellow-50 border-yellow-300"
        : "bg-blue-50 border-[var(--hi-primary-blue)]"
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
          <h4 className={`font-semibold mb-1 ${
            isOverLimit ? "text-red-800" : "text-yellow-800"
          }`}>
            {isOverLimit ? "Contribution Limit Exceeded" : "Approaching Contribution Limit"}
          </h4>
          <p className={`text-sm ${isOverLimit ? "text-red-700" : "text-yellow-700"} mb-2`}>
            {isOverLimit ? (
              <>
                Your projected year-end contribution of <strong>${Math.round(projectedYearEnd).toLocaleString()}</strong> exceeds the 2024 IRS limit of <strong>${IRS_ANNUAL_LIMIT_2024.toLocaleString()}</strong>. The plan will automatically stop contributions when you reach the limit.
              </>
            ) : (
              <>
                Your projected year-end contribution of <strong>${Math.round(projectedYearEnd).toLocaleString()}</strong> is approaching the 2024 IRS limit of <strong>${IRS_ANNUAL_LIMIT_2024.toLocaleString()}</strong>. You can contribute up to <strong>${Math.round(maxContribution).toLocaleString()}</strong> more this year.
              </>
            )}
          </p>
          {!isOverLimit && maxPercentageForLimit > 0 && (
            <p className="text-xs text-yellow-600">
              Maximum percentage to stay within limit: <strong>{maxPercentageForLimit.toFixed(1)}%</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

