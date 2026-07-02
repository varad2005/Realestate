import { ArrowRight } from 'lucide-react';

export function SectionHeader({
  title,
  sub,
  action,
  onAction,
}: {
  title: string;
  sub?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold font-['Poppins'] text-gray-900">{title}</h2>
        {sub && <p className="text-sm text-gray-500-foreground mt-1">{sub}</p>}
      </div>
      {action && (
        <button
          onClick={onAction}
          className="flex items-center gap-1 text-sm font-bold text-pink-600 hover:gap-2 transition-all group shrink-0"
        >
          {action}
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
}
