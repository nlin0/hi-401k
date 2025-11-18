import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function ContributionBreakdownChart({ salary, contributionValue, type, employerMatchRate, employerMatchCap, paychecksPerYear = 26 }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!salary || !svgRef.current || !employerMatchRate) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Smaller chart for visualization
    const width = 180;
    const height = 180;
    const radius = Math.min(width, height) / 2 - 15;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Calculate contributions
    const annualEmployeeContribution = type === "percentage"
      ? salary * (contributionValue / 100)
      : contributionValue * paychecksPerYear;

    const contributionPercentage = salary > 0 
      ? (annualEmployeeContribution / salary) * 100 
      : 0;

    const matchCapPercentage = employerMatchCap || 6;
    const eligibleSalaryForMatch = Math.min(contributionPercentage, matchCapPercentage);
    const employerMatchPercentage = (eligibleSalaryForMatch / 100) * employerMatchRate;
    const annualEmployerMatch = salary * employerMatchPercentage;

    const data = [
      { label: "Your Contribution", value: annualEmployeeContribution, color: "#0059FF" },
      { label: "Employer Match", value: annualEmployerMatch, color: "#0A1E40" }
    ].filter(d => d.value > 0);

    if (data.length === 0) return;

    // Pie generator
    const pie = d3.pie().value(d => d.value).sort(null);
    const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius);

    // Draw arcs
    const arcs = svg
      .selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", d => d.data.color)
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 2)
      .on("mouseover", function(event, d) {
        d3.select(this).transition().duration(200).attr("transform", `scale(1.05)`);
      })
      .on("mouseout", function(event, d) {
        d3.select(this).transition().duration(200).attr("transform", `scale(1)`);
      });

    // Labels - smaller font for smaller chart
    const labelArc = d3.arc().innerRadius(radius * 0.7).outerRadius(radius * 0.7);

    arcs
      .append("text")
      .attr("transform", d => `translate(${labelArc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .style("fill", "#FFFFFF")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .text(d => {
        const percentage = ((d.data.value / d3.sum(data, d => d.value)) * 100).toFixed(0);
        return `${percentage}%`;
      });

  }, [salary, contributionValue, type, employerMatchRate, employerMatchCap, paychecksPerYear]);

  if (!salary || !employerMatchRate) return null;
  
  // Calculate contributions for display
  const annualEmployeeContribution = type === "percentage"
    ? salary * (contributionValue / 100)
    : contributionValue * paychecksPerYear;

  const contributionPercentage = salary > 0 
    ? (annualEmployeeContribution / salary) * 100 
    : 0;

  const matchCapPercentage = employerMatchCap || 6;
  const eligibleSalaryForMatch = Math.min(contributionPercentage, matchCapPercentage);
  const employerMatchPercentage = (eligibleSalaryForMatch / 100) * employerMatchRate;
  const annualEmployerMatch = salary * employerMatchPercentage;
  
  const totalAnnualContribution = annualEmployeeContribution + annualEmployerMatch;
  const freeMoney = annualEmployerMatch;
  
  // Calculate if they're leaving money on the table
  const maxMatchAvailable = salary * (matchCapPercentage / 100) * employerMatchRate;
  const leavingOnTable = maxMatchAvailable - annualEmployerMatch;
  const isMaximizingMatch = contributionPercentage >= matchCapPercentage;

  return (
    <div className="p-6 rounded-lg bg-[var(--hi-white)] border border-[var(--hi-neutral-mid)] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[var(--hi-dark-navy)] text-lg">
          Employer Match
        </h3>
        {isMaximizingMatch ? (
          <span className="px-3 py-1 text-xs font-semibold bg-[var(--hi-primary-blue)] text-[var(--hi-white)] rounded-full">
            Maximized
          </span>
        ) : (
          <span className="px-3 py-1 text-xs font-semibold bg-[var(--hi-neutral-mid)] text-[var(--hi-white)] rounded-full">
            Not Maximized
          </span>
        )}
      </div>

      {/* Horizontal Legend */}
      <div className="flex items-center justify-center gap-6 mb-4 pb-4 border-b border-[var(--hi-neutral-mid)]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#0059FF]"></div>
          <span className="text-sm text-[var(--hi-dark-navy)]">Your Contribution</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#0A1E40]"></div>
          <span className="text-sm text-[var(--hi-dark-navy)]">Employer Match</span>
        </div>
      </div>

      {/* Chart and details side by side */}
      <div className="flex items-start gap-6 mb-4">
        {/* Small chart visualization */}
        <div className="flex-shrink-0">
          <svg ref={svgRef}></svg>
        </div>

        {/* Employer match details */}
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--hi-neutral-mid)]">Your Contribution:</span>
            <span className="font-semibold text-[var(--hi-dark-navy)]">${Math.round(annualEmployeeContribution).toLocaleString()}/year</span>
            {type === "dollar" && (
              <span className="text-xs text-[var(--hi-neutral-mid)] ml-2">
                ({contributionPercentage.toFixed(1)}% of salary)
              </span>
            )}
          </div>
          <div className="flex justify-between items-center flex-wrap gap-1">
            <span className="text-sm text-[var(--hi-neutral-mid)]">Employer Match ({employerMatchRate * 100}% match, up to {matchCapPercentage}%):</span>
            <span className="font-semibold text-[var(--hi-primary-blue)]">+${Math.round(annualEmployerMatch).toLocaleString()}/year</span>
          </div>
          <div className="border-t border-[var(--hi-neutral-mid)] pt-2 flex justify-between items-center">
            <span className="text-sm font-semibold text-[var(--hi-dark-navy)]">Total Contribution:</span>
            <span className="text-lg font-bold text-[var(--hi-primary-blue)]">${Math.round(totalAnnualContribution).toLocaleString()}/year</span>
          </div>
        </div>
      </div>

      {!isMaximizingMatch && leavingOnTable > 0 && (
        <div className="mt-3 p-3 bg-blue-50 border border-[var(--hi-primary-blue)] rounded">
          <p className="text-xs text-[var(--hi-dark-navy)]">
            <strong>Tip:</strong> Increase your contribution to {matchCapPercentage}% of salary ({Math.round(salary * matchCapPercentage / 100).toLocaleString()}/year) to maximize your employer match. 
            You're leaving <strong>${Math.round(leavingOnTable).toLocaleString()}/year</strong> in free money on the table!
          </p>
        </div>
      )}

      {isMaximizingMatch && (
        <p className="text-xs text-[var(--hi-primary-blue)] mt-2">
          ✅ You're maximizing your employer match! That's <strong>${Math.round(freeMoney).toLocaleString()}/year</strong> in free money.
        </p>
      )}
    </div>
  );
}

