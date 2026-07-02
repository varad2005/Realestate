import { useState } from 'react';
import { Calculator } from 'lucide-react';

export function EMIWidget({ propertyPrice, maintenanceCharges }: { propertyPrice: number, maintenanceCharges?: number }) {
  const [customPrice, setCustomPrice] = useState(propertyPrice > 0 ? propertyPrice : 5000000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  const downPayment = (customPrice * downPaymentPct) / 100;
  const loanAmount = customPrice - downPayment;
  
  // EMI Calculation Formula: P * R * (1+R)^N / ((1+R)^N - 1)
  const monthlyRate = interestRate / 12 / 100;
  const months = tenureYears * 12;
  const emi = loanAmount * monthlyRate * (Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
          <Calculator size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold font-['Poppins'] text-gray-900">EMI Calculator</h3>
          <p className="text-sm text-gray-500">Plan your home loan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Sliders */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="font-bold text-gray-900 text-sm">Property Price</label>
              <div className="text-right">
                <span className="font-bold text-gray-900 text-lg">{formatCurrency(customPrice)}</span>
              </div>
            </div>
            <input 
              type="range" 
              min={1000000} max={100000000} step={500000} 
              value={customPrice}
              onChange={(e) => setCustomPrice(Number(e.target.value))}
              className="w-full h-2 bg-gray-50/80 rounded-lg appearance-none cursor-pointer accent-[#FF3F6C]"
            />
          </div>
          <SliderControl 
            label="Down Payment" 
            value={downPaymentPct} 
            setValue={setDownPaymentPct} 
            min={10} max={90} step={5} 
            suffix="%" 
            subText={formatCurrency(downPayment)} 
          />
          <SliderControl 
            label="Interest Rate" 
            value={interestRate} 
            setValue={setInterestRate} 
            min={6} max={15} step={0.1} 
            suffix="%" 
            subText="p.a." 
          />
          <SliderControl 
            label="Loan Tenure" 
            value={tenureYears} 
            setValue={setTenureYears} 
            min={5} max={30} step={1} 
            suffix=" Years" 
            subText={`${months} Months`} 
          />
        </div>

        {/* Results */}
        <div className="bg-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-2xl" />
          <p className="text-indigo-600/40 text-sm mb-2 relative z-10">Your Monthly EMI will be</p>
          <p className="text-4xl font-black font-['Poppins'] mb-8 relative z-10">{formatCurrency(emi)}</p>
          
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center pb-3 border-b border-secondary/50">
              <span className="text-indigo-600/40 text-sm">Principal Amount</span>
              <span className="font-bold">{formatCurrency(loanAmount)}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-secondary/50">
              <span className="text-indigo-600/40 text-sm">Interest Amount</span>
              <span className="font-bold">{formatCurrency((emi * months) - loanAmount)}</span>
            </div>
            {maintenanceCharges && (
              <div className="flex justify-between items-center pt-2 pb-2 border-b border-secondary/50">
                <span className="text-indigo-600/40 text-sm">Monthly Maintenance</span>
                <span className="font-bold text-yellow-500">{formatCurrency(maintenanceCharges)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2">
              <span className="text-indigo-600/40 text-sm">Total Payable</span>
              <span className="font-bold text-emerald-500/80">{formatCurrency(emi * months)}</span>
            </div>
          </div>
          
          <button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-600/80 text-white font-bold py-3 rounded-xl transition-colors relative z-10">
            Apply for Home Loan
          </button>
        </div>
      </div>
    </div>
  );
}

function SliderControl({ label, value, setValue, min, max, step, suffix, subText }: any) {
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <label className="font-bold text-gray-900 text-sm">{label}</label>
        <div className="text-right">
          <span className="font-bold text-gray-900 text-lg">{value}{suffix}</span>
          {subText && <span className="text-xs text-gray-500 ml-2">({subText})</span>}
        </div>
      </div>
      <input 
        type="range" 
        min={min} max={max} step={step} 
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full h-2 bg-gray-50/80 rounded-lg appearance-none cursor-pointer accent-[#FF3F6C]"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
        <span>{min}{suffix}</span>
        <span>{max}{suffix}</span>
      </div>
    </div>
  );
}
