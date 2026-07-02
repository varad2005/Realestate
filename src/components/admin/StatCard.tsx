import { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend: number;
}

export function StatCard({ title, value, icon, trend }: StatCardProps) {
  const isPositive = trend > 0;
  const isNegative = trend < 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-pink-600/10 group-hover:text-pink-600 transition-colors">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold font-['Poppins'] text-gray-900">{value}</h3>
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <div className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
          isPositive ? 'bg-emerald-500/10 text-emerald-500' :
          isNegative ? 'bg-red-500/10 text-red-500' :
          'bg-gray-50 text-gray-500'
        }`}>
          {isPositive && <ArrowUpRight size={14} className="mr-0.5" />}
          {isNegative && <ArrowDownRight size={14} className="mr-0.5" />}
          {!isPositive && !isNegative && <Minus size={14} className="mr-0.5" />}
          {Math.abs(trend).toFixed(1)}%
        </div>
        <span className="text-xs text-gray-500">vs last 7 days</span>
      </div>
    </div>
  );
}
