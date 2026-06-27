import { useState } from 'react';

const categories = [
  "Buy",
  "Rent",
  "New Launch",
  "Commercial",
  "Plots / Land",
  "Projects"
];

interface CategoryTabsProps {
  value: string;
  onChange: (val: string) => void;
}

export function CategoryTabs({ value, onChange }: CategoryTabsProps) {
  return (
    <div className="flex justify-center items-center gap-3 bg-white/10 backdrop-blur-md px-3 py-2 rounded-full flex-wrap mb-4">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-5 py-2 rounded-full text-sm font-bold cursor-pointer transition-all duration-200 drop-shadow-sm ${
            value === cat
              ? "bg-[#FF3F6C] text-white shadow-md"
              : "text-white bg-transparent hover:bg-white/20"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
