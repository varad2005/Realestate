// TourBadge — small reusable badge indicating a 360° tour is available
import { Globe } from 'lucide-react';

export function TourBadge({ className = '', sceneCount }: { className?: string, sceneCount?: number }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider bg-purple-600/95 backdrop-blur-sm shadow-sm text-white uppercase ${className}`}
    >
      🌐 360 Tour
    </span>
  );
}
