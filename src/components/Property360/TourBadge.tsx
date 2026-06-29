// TourBadge — small reusable badge indicating a 360° tour is available
import { Globe } from 'lucide-react';

export function TourBadge({ className = '', sceneCount }: { className?: string, sceneCount?: number }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-violet-600/95 backdrop-blur-sm shadow-sm text-white ${className}`}
    >
      <Globe size={12} className="animate-[pulse_3s_ease-in-out_infinite]" />
      {sceneCount && sceneCount > 1 ? `${sceneCount} Interactive Scenes` : '360° Tour Available'}
    </span>
  );
}
