import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ContourPlotProps {
  radius: number;
  width: number;
  height: number;
}

const ContourPlot: React.FC<ContourPlotProps> = ({ radius, width, height }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // 1. Setup Grid & Data
    // We map [-2, 2] to the SVG dimensions
    const n = 120; // Grid resolution
    const m = 120;
    const xRange = [-2.2, 2.2];
    const yRange = [-2.2, 2.2];

    const values = new Array(n * m);
    
    // Scale functions
    const xScale = d3.scaleLinear().domain([0, n]).range(xRange);
    const yScale = d3.scaleLinear().domain([0, m]).range(yRange);

    // Populate data: Z = exp(-(x^2 + y^2))
    // This represents the gravity well "outside".
    for (let j = 0; j < m; ++j) {
      for (let i = 0; i < n; ++i) {
        const x = xScale(i);
        const y = yScale(j);
        const r2 = x*x + y*y;
        // The visualization function from the python script
        values[j * n + i] = Math.exp(-r2);
      }
    }

    // 2. Generate Contours
    const thresholds = d3.range(0, 1, 0.05); // Contour levels
    const contours = d3.contours()
      .size([n, m])
      .thresholds(thresholds)(values);

    // 3. Projection to SVG Coords
    // We need to map the grid coordinates [0, n] -> [0, width]
    const path = d3.geoPath(d3.geoIdentity().scale(width / n));

    // 4. Render Contours (The "Fabric" of Space-Time)
    const colorScale = d3.scaleSequential(d3.interpolateViridis).domain([0, 1]);

    const g = svg.append("g");

    g.selectAll("path")
      .data(contours)
      .enter().append("path")
      .attr("d", path)
      .attr("fill", d => colorScale(d.value))
      .attr("stroke", "none")
      .attr("opacity", 0.8);

    // 5. The "Flip" / Event Horizon Mask
    // In the python script, Z is NaN inside r < 1. 
    // Here we visually represent the singularity/horizon by overlaying a void.
    
    // Convert physics radius to pixel radius
    // Logic: The grid spans approx 4.4 units (-2.2 to 2.2). Width is pixels.
    // Scale factor = width / 4.4
    const scaleFactor = width / 4.4;
    const pixelRadius = radius * scaleFactor;
    
    const centerX = width / 2;
    const centerY = height / 2;

    // The Horizon Circle (The boundary)
    g.append("circle")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("r", pixelRadius)
      .attr("fill", "#000000") // The void
      .attr("stroke", "#f43f5e") // Rose-500
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4,4") // Dashed to represent a coordinate boundary
      .style("filter", "drop-shadow(0 0 10px rgba(244, 63, 94, 0.6))");

    // Add visual "Chaos" inside the horizon (The Flip)
    // We can use a pattern or text to show "Space <-> Time"
    if (pixelRadius > 20) {
      const insideGroup = g.append("g");
      
      insideGroup.append("text")
        .attr("x", centerX)
        .attr("y", centerY)
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        .attr("fill", "#f43f5e")
        .attr("font-family", "monospace")
        .attr("font-size", Math.min(14, pixelRadius / 3))
        .text("dt ↔ dr");
    }

    // Axes for reference
    const axisColor = "rgba(255,255,255,0.2)";
    g.append("line")
      .attr("x1", centerX).attr("y1", 0)
      .attr("x2", centerX).attr("y2", height)
      .attr("stroke", axisColor);
    
    g.append("line")
      .attr("x1", 0).attr("y1", centerY)
      .attr("x2", width).attr("y2", centerY)
      .attr("stroke", axisColor);

  }, [radius, width, height]);

  return (
    <div className="relative rounded-xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900">
      <svg ref={svgRef} width={width} height={height} className="block" />
      <div className="absolute top-4 left-4 text-xs font-mono text-zinc-400 bg-black/50 p-2 rounded backdrop-blur-sm pointer-events-none">
        <div>Plot: Z = exp(-(x² + y²))</div>
        <div className="text-rose-400 mt-1">Horizon: r = {radius.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default ContourPlot;