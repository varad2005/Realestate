import { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return (
    <div className={`min-h-screen pt-24 pb-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        {children}
      </div>
    </div>
  );
}
