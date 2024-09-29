import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

const GridComponent: React.FC = () => {
  const [selectedDescription, setSelectedDescription] = useState<string>('');

  const gridItems = Array.from({ length: 9 }, (_, i) => {
    const hue = 70 + i * 10; // Shifting hue from green to yellow
    const color = d3.hsl(hue, 0.5, 0.5).formatHex(); // Keep saturation and lightness consistent
    return { id: i + 1, color, description: `This is color with hue ${hue}` };
  });

  useEffect(() => {
    const svg = d3.select('#grid')
      .attr('width', 300)
      .attr('height', 300);

    const rects = svg.selectAll('rect')
      .data(gridItems)
      .enter()
      .append('rect')
      .attr('x', (d, i) => (i % 3) * 100)
      .attr('y', (d, i) => Math.floor(i / 3) * 100)
      .attr('width', 100)
      .attr('height', 100)
      .attr('fill', d => d.color)
      .style('cursor', 'pointer')
      .on('click', (_, d) => setSelectedDescription(d.description));
  }, [gridItems]);

  return (
    <div style={{zIndex: 100}}>
      <svg id="grid"></svg>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        {selectedDescription && <p>{selectedDescription}</p>}
      </div>
    </div>
  );
};

export default GridComponent;
