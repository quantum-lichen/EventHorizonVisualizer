import React from 'react';
import { MIN_RADIUS, MAX_RADIUS } from '../constants';

interface ControlsProps {
  radius: number;
  setRadius: (r: number) => void;
}

const Controls: React.FC<ControlsProps> = ({ radius, setRadius }) => {
  return (
    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
      <h3 className="text-zinc-100 font-semibold flex items-center gap-2">
        <span className="w-2 h-6 bg-rose-500 rounded-full"></span>
        Simulation Parameters
      </h3>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-mono text-zinc-400">
          <label htmlFor="radius-slider">Schwarzschild Radius (r_s)</label>
          <span className="text-rose-400">{radius.toFixed(2)}</span>
        </div>
        <input
          id="radius-slider"
          type="range"
          min={MIN_RADIUS}
          max={MAX_RADIUS}
          step={0.01}
          value={radius}
          onChange={(e) => setRadius(parseFloat(e.target.value))}
          className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500 hover:accent-rose-400 transition-colors"
        />
        <div className="flex justify-between text-xs text-zinc-600 font-mono">
          <span>{MIN_RADIUS}</span>
          <span>{MAX_RADIUS}</span>
        </div>
      </div>

      <div className="text-xs text-zinc-500 leading-relaxed border-t border-zinc-800 pt-4">
        <p>
          Drag to expand the event horizon. The "Normal" spacetime curvature (green/blue contour) represents stable causal structure. 
          The <span className="text-rose-500">Black/Red Zone</span> represents the region where radial coordinates become timelike.
        </p>
      </div>
    </div>
  );
};

export default Controls;