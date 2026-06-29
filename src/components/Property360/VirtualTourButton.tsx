import { Globe } from 'lucide-react';

interface VirtualTourButtonProps {
  onClick: () => void;
  sceneCount: number;
}

// Premium CTA button overlaid on property gallery hero
export function VirtualTourButton({ onClick, sceneCount }: VirtualTourButtonProps) {
  return (
    <button
      id="virtual-tour-btn"
      onClick={onClick}
      className="group relative inline-flex items-center gap-2.5 bg-black/70 backdrop-blur-md hover:bg-violet-700 text-white font-bold px-5 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-violet-500/30 border border-white/20 hover:border-violet-400"
    >
      {/* Animated pulse ring */}
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-300" />
      </span>

      <Globe size={18} className="text-violet-300 group-hover:text-white transition-colors" />

      <span className="text-sm tracking-wide">View 360° Virtual Tour</span>

      {sceneCount > 1 && (
        <span className="bg-violet-500/60 group-hover:bg-white/20 text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors">
          {sceneCount} scenes
        </span>
      )}
    </button>
  );
}
