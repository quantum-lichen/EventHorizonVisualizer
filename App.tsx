import React, { useState, useEffect } from 'react';
import ContourPlot from './components/ContourPlot';
import Controls from './components/Controls';
import AIExplanation from './components/AIExplanation';
import { DEFAULT_RADIUS } from './constants';

const App: React.FC = () => {
  const [radius, setRadius] = useState<number>(DEFAULT_RADIUS);
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });

  // Responsive resizing for the D3 plot
  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('plot-container');
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientWidth, // Keep it square
        });
      }
    };
    
    // Initial size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <header className="max-w-6xl mx-auto mb-8 flex justify-between items-end border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-emerald-400">
            Event Horizon Visualizer
          </h1>
          <p className="text-zinc-400 mt-2 max-w-lg text-sm md:text-base">
            An interactive simulation of the <span className="text-rose-400 font-mono">dt ↔ dr</span> coordinate flip in the Schwarzschild metric.
          </p>
        </div>
        <div className="hidden md:block text-right">
           <div className="text-xs font-mono text-zinc-500">Based on Python/Matplotlib Model</div>
           <div className="text-xs font-mono text-emerald-500/80">React + D3 + Tailwind</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Visualization */}
        <div className="lg:col-span-7 space-y-6">
          <div id="plot-container" className="w-full relative">
            <ContourPlot 
              radius={radius} 
              width={dimensions.width} 
              height={dimensions.height} 
            />
          </div>
          
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 text-sm text-zinc-400 font-mono">
            <p className="mb-2"><strong className="text-emerald-400">Green Region:</strong> Normal Spacetime (r &gt; r_s). Radial movement is free in both directions.</p>
            <p><strong className="text-rose-500">Black Region:</strong> Interior (r &lt; r_s). Radial coordinate becomes timelike. Movement towards the center is as inevitable as moving forward in time.</p>
          </div>
        </div>

        {/* Right Column: Controls & AI */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          <Controls radius={radius} setRadius={setRadius} />
          <div className="flex-1">
             <AIExplanation radius={radius} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;