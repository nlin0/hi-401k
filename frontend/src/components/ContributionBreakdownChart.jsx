import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function ContributionBreakdownChart({ salary, contributionValue, type, employerMatchRate, employerMatchCap, paychecksPerYear = 26 }) {
  // ref for d3 svg element
  const svgRef = useRef(null);

  // render d3 pie chart for contribution breakdown
  useEffect(() => {
    if (!salary || !svgRef.current || !employerMatchRate) return;
    d3.select(svgRef.current).selectAll("*").remove();
    const width = 180;
    const height = 180;
    const radius = Math.min(width, height) / 2 - 15;

    // create svg and center it
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // calculate employee and employer contributions for chart
    const annualEmployeeContribution = type === "percentage"
      ? salary * (contributionValue / 100)
      : contributionValue * paychecksPerYear;

    const contributionPercentage = salary > 0
      ? (annualEmployeeContribution / salary) * 100
      : 0;

    // calculate employer match (match only applies up to cap percentage)
    const matchCapPercentage = employerMatchCap || 6;
    const eligibleSalaryForMatch = Math.min(contributionPercentage, matchCapPercentage);
    const employerMatchPercentage = (eligibleSalaryForMatch / 100) * employerMatchRate;
    const annualEmployerMatch = salary * employerMatchPercentage;

    // prepare data for pie chart (filter out zero values)
    const data = [
      { label: "Your Contribution", value: annualEmployeeContribution, color: "#01b7aa" },
      { label: "Employer Match", value: annualEmployerMatch, color: "#022a4d" }
    ].filter(d => d.value > 0);

    if (data.length === 0) return;

    // configure d3 pie and arc generators (donut chart)
    const pie = d3.pie().value(d => d.value).sort(null);
    const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius);
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
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(200).attr("transform", `scale(1.05)`);
      })
      .on("mouseout", function (event, d) {
        d3.select(this).transition().duration(200).attr("transform", `scale(1)`);
      });

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

  // calculate contributions for display text (duplicated from chart calc above)
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

  // check if user is maximizing employer match
  const maxMatchAvailable = salary * (matchCapPercentage / 100) * employerMatchRate;
  const leavingOnTable = maxMatchAvailable - annualEmployerMatch;
  const isMaximizingMatch = contributionPercentage >= matchCapPercentage;

  return (
    <div className="mt-6 p-6 rounded-lg bg-[var(--hi-white)] border border-[var(--hi-gray-border)] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[var(--hi-dark-navy)] text-lg">
          Employer Match
        </h3>
        {isMaximizingMatch ? (
          <span className="px-3 py-1 text-xs font-semibold bg-[var(--hi-primary-blue)] text-[var(--hi-white)] rounded-full">
            Maximized
          </span>
        ) : (
          <span className="px-3 py-1 text-xs font-semibold bg-[var(--hi-gray-border)] text-[var(--hi-navy)] rounded-full">
            Not Maximized
          </span>
        )}
      </div>

      <div className="flex items-center gap-6 mb-4">
        {/* PIE CHART HERE */}
        <div className="flex-shrink-0">
          <svg ref={svgRef}></svg>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-center gap-4">
            <span className="text-sm text-[var(--hi-neutral-mid)] flex-shrink-0">Your Contribution:</span>
            <div className="flex flex-col items-end gap-1">
              <span className="font-semibold text-[var(--hi-primary-blue)] text-right">${Math.round(annualEmployeeContribution).toLocaleString()}/year</span>
              {type === "dollar" && (
                <span className="text-xs text-[var(--hi-neutral-mid)] text-right">
                  ({contributionPercentage.toFixed(1)}% of salary)
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center gap-4">
            <div className="text-sm text-[var(--hi-neutral-mid)] flex-shrink-0">
              <div>Employer Match</div>
              <div>({employerMatchRate * 100}% match, up to {matchCapPercentage}%)</div>
            </div>
            <span className="font-semibold text-[var(--hi-primary-blue)] text-right">+${Math.round(annualEmployerMatch).toLocaleString()}/year</span>
          </div>
          <div className="border-t border-[var(--hi-gray-border)] pt-2 flex justify-between items-center gap-4">
            <span className="text-sm font-semibold text-[var(--hi-dark-navy)] flex-shrink-0">Total Contribution:</span>
            <span className="text-lg font-bold text-[var(--hi-navy)] text-right">${Math.round(totalAnnualContribution).toLocaleString()}/year</span>
          </div>
        </div>
      </div>

      {/* LEGEND IS HERE */}
      <div className="flex items-center justify-center gap-6 mb-4 pb-4 border-b border-[var(--hi-gray-border)]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#01b7aa]"></div>
          <span className="text-sm text-[var(--hi-dark-navy)]">Your Contribution</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#022a4d]"></div>
          <span className="text-sm text-[var(--hi-dark-navy)]">Employer Match</span>
        </div>
      </div>

      {!isMaximizingMatch && leavingOnTable > 0 && (
        <div className="mt-3 p-3 bg-[var(--hi-light-blue)] border border-[var(--hi-primary-blue)] rounded">
          <p className="text-xs text-[var(--hi-dark-navy)]">
            <strong>Tip:</strong> Increase your contribution to {matchCapPercentage}% of salary ({Math.round(salary * matchCapPercentage / 100).toLocaleString()}/year) to maximize your employer match.
            You're leaving <strong>${Math.round(leavingOnTable).toLocaleString()}/year</strong> of free money on the table!
          </p>
        </div>
      )}

      {isMaximizingMatch && (
        <p className="text-xs text-[var(--hi-primary-blue)] mt-2">
          Yay! You're maximizing your employer match! That's <strong>${Math.round(freeMoney).toLocaleString()}/year</strong> in free money.
        </p>
      )}
    </div>
  );
}

