import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function RetirementProjectionChart({ salary, contributionValue, type, paychecksPerYear = 26 }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!salary || !svgRef.current) return;

    const drawChart = () => {
      // Clear previous chart
      d3.select(svgRef.current).selectAll("*").remove();

      // Compact chart for column layout
      const containerWidth = svgRef.current.parentElement?.clientWidth || 400;
      const width = Math.max(350, containerWidth - 48); // Account for padding
      const height = 280;
      const margin = { top: 20, right: 60, bottom: 40, left: 60 };

      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .style("overflow", "visible");

      const currentAge = 30;
      const retireAge = 65;
      const years = retireAge - currentAge;
      const annualReturn = 0.07;
      const salaryGrowth = 0.03;

      // Calculate annual contribution
      const annualContribution = type === "percentage"
        ? salary * (contributionValue / 100)
        : contributionValue * paychecksPerYear;

      const contributionGrowth = type === "percentage" ? salaryGrowth : 0;

      // Calculate projection for each year
      function futureValueOfGrowingContributions(C0, r, g, n) {
        if (g === r) {
          return C0 * n * Math.pow(1 + r, n);
        }
        return C0 * ((Math.pow(1 + r, n) - Math.pow(1 + g, n)) / (r - g));
      }

      const data = [];
      let currentBalance = 0;

      for (let age = currentAge; age <= retireAge; age++) {
        const yearsElapsed = age - currentAge;

        // Calculate balance at this age
        if (yearsElapsed === 0) {
          currentBalance = 0;
        } else {
          // Balance = previous balance * (1 + return) + this year's contribution
          const yearContribution = annualContribution * Math.pow(1 + contributionGrowth, yearsElapsed);
          currentBalance = currentBalance * (1 + annualReturn) + yearContribution;
        }

        data.push({ age, balance: currentBalance });
      }

      // Scales
      const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.age))
        .range([margin.left, width - margin.right]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.balance)])
        .nice()
        .range([height - margin.bottom, margin.top]);

      // Line generator
      const line = d3
        .line()
        .x(d => xScale(d.age))
        .y(d => yScale(d.balance))
        .curve(d3.curveMonotoneX);

      // Draw line
      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#0059FF")
        .attr("stroke-width", 3)
        .attr("d", line);

      // Draw area under curve
      const area = d3
        .area()
        .x(d => xScale(d.age))
        .y0(height - margin.bottom)
        .y1(d => yScale(d.balance))
        .curve(d3.curveMonotoneX);

      svg
        .append("path")
        .datum(data)
        .attr("fill", "#0059FF")
        .attr("fill-opacity", 0.1)
        .attr("d", area);

      // X Axis
      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickFormat(d => `${d}`))
        .selectAll("text")
        .style("fill", "#6B7280")
        .style("font-size", "12px");

      svg
        .append("text")
        .attr("transform", `translate(${width / 2},${height - 5})`)
        .style("text-anchor", "middle")
        .style("fill", "#6B7280")
        .style("font-size", "12px")
        .text("Age");

      // Y Axis
      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale).tickFormat(d => `$${d3.format(".0s")(d)}`))
        .selectAll("text")
        .style("fill", "#6B7280")
        .style("font-size", "12px");

      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 15)
        .attr("x", -height / 2)
        .style("text-anchor", "middle")
        .style("fill", "#6B7280")
        .style("font-size", "12px")
        .text("Projected Balance");

      // Add dots at key milestones
      const milestones = [35, 40, 45, 50, 55, 60, 65];
      milestones.forEach(age => {
        const point = data.find(d => d.age === age);
        if (point) {
          svg
            .append("circle")
            .attr("cx", xScale(point.age))
            .attr("cy", yScale(point.balance))
            .attr("r", 4)
            .attr("fill", "#0059FF")
            .attr("stroke", "#FFFFFF")
            .attr("stroke-width", 2);
        }
      });

      // Add final balance annotation - positioned to the left to avoid cutoff
      const finalBalance = data[data.length - 1].balance;
      const annotationX = xScale(retireAge) - 20; // Position to the left of the final point
      svg
        .append("text")
        .attr("x", annotationX)
        .attr("y", yScale(finalBalance))
        .attr("text-anchor", "end") // Right-align the text
        .style("fill", "#0059FF")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text(`$${Math.round(finalBalance).toLocaleString()}`);

      // Create invisible overlay for hover detection
      const overlay = svg
        .append("rect")
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr("width", width - margin.left - margin.right)
        .attr("height", height - margin.top - margin.bottom)
        .attr("fill", "transparent")
        .style("cursor", "crosshair");

      // Create tooltip - using relative positioning within the chart container
      const container = d3.select(svgRef.current.parentElement);
      // Remove existing tooltip if any
      container.selectAll('div.tooltip').remove();
      const tooltip = container
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "rgba(10, 30, 64, 0.95)")
        .style("color", "#FFFFFF")
        .style("padding", "8px 12px")
        .style("border-radius", "6px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("z-index", "1000")
        .style("box-shadow", "0 4px 6px rgba(0,0,0,0.1)")
        .style("white-space", "nowrap");

      // Add hover circle that follows mouse
      const hoverCircle = svg
        .append("circle")
        .attr("r", 5)
        .attr("fill", "#0059FF")
        .attr("stroke", "#FFFFFF")
        .attr("stroke-width", 2)
        .style("opacity", 0)
        .style("pointer-events", "none");

      // Add vertical line for hover
      const hoverLine = svg
        .append("line")
        .attr("stroke", "#0059FF")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "3,3")
        .style("opacity", 0)
        .style("pointer-events", "none");

      // Mouse move handler
      overlay.on("mousemove", function (event) {
        const [mouseX] = d3.pointer(event, this);
        const age = Math.round(xScale.invert(mouseX));

        // Find closest data point
        const bisect = d3.bisector(d => d.age).left;
        const index = bisect(data, age, 1);
        const a = data[index - 1];
        const b = data[index] || a;
        const point = age - a.age > b.age - age ? b : a;

        if (point && point.age >= currentAge && point.age <= retireAge) {
          const xPos = xScale(point.age);
          const yPos = yScale(point.balance);

          // Update hover elements
          hoverCircle
            .attr("cx", xPos)
            .attr("cy", yPos)
            .style("opacity", 1);

          hoverLine
            .attr("x1", xPos)
            .attr("x2", xPos)
            .attr("y1", margin.top)
            .attr("y2", height - margin.bottom)
            .style("opacity", 0.5);

          // Calculate tooltip position relative to container
          const containerRect = svgRef.current.parentElement.getBoundingClientRect();
          const svgRect = svgRef.current.getBoundingClientRect();

          // Determine if we should show tooltip on left or right side
          // If we're past 60% of the chart width, show on left to prevent cutoff
          const tooltipWidth = 150; // Approximate tooltip width
          const chartWidth = width - margin.left - margin.right;
          const relativeXPos = xPos - margin.left;
          const showOnLeft = relativeXPos > chartWidth * 0.6;

          let tooltipX;
          if (showOnLeft) {
            // Position to the left of the point
            tooltipX = svgRect.left + xPos - tooltipWidth - 15 - containerRect.left;
            // Make sure it doesn't go off the left edge
            if (tooltipX < 10) {
              tooltipX = 10;
            }
          } else {
            // Position to the right of the point
            tooltipX = svgRect.left + xPos + 15 - containerRect.left;
            // Make sure it doesn't go off the right edge
            const maxX = containerRect.width - tooltipWidth - 10;
            if (tooltipX > maxX) {
              tooltipX = maxX;
            }
          }

          const tooltipY = svgRect.top + yPos - 40 - containerRect.top;

          // Update tooltip
          tooltip
            .style("visibility", "visible")
            .html(`
              <div><strong>Age:</strong> ${point.age}</div>
              <div><strong>Balance:</strong> $${Math.round(point.balance).toLocaleString()}</div>
            `)
            .style("left", `${tooltipX}px`)
            .style("top", `${tooltipY}px`);
        }
      });

      overlay.on("mouseleave", function () {
        hoverCircle.style("opacity", 0);
        hoverLine.style("opacity", 0);
        tooltip.style("visibility", "hidden");
      });
    };

    // Initial draw
    drawChart();

    // Handle window resize
    const handleResize = () => {
      drawChart();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      const tooltip = d3.select(svgRef.current?.parentElement).select('div');
      if (!tooltip.empty()) {
        tooltip.remove();
      }
    };

  }, [salary, contributionValue, type, paychecksPerYear]);

  if (!salary) return null;

  return (
    <div className="mt-6 p-4 rounded-lg bg-[var(--hi-white)] border border-[var(--hi-neutral-mid)] shadow-sm relative">
      <h3 className="font-semibold text-[var(--hi-dark-navy)] mb-3 text-lg">
        Retirement Savings Projection
      </h3>

      <div className="w-full overflow-x-auto relative flex justify-center">
        <svg ref={svgRef} className="w-full max-w-full"></svg>
      </div>
      <p className="text-xs text-[var(--hi-neutral-mid)] mt-2 text-center">
        Hover to see balance at each age • Assumes 7% annual return
      </p>
    </div>
  );
}

