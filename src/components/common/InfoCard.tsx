export function InfoCard({
  number,
  title,
  desc,
}: {
  number: number;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 text-9xl font-black text-gray-50 opacity-50 group-hover:scale-110 transition-transform">
        {number}
      </div>
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-full bg-[#FF3F6C]/10 text-[#FF3F6C] flex items-center justify-center font-bold text-lg mb-4">
          {number}
        </div>
        <h3 className="text-xl font-bold font-['Poppins'] text-[#1A1A1A] mb-2">
          {title}
        </h3>
        <p className="text-sm text-[#6B7280] leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}
