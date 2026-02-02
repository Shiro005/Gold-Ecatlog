import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../Database/Firebase';

const GoldRate = () => {
  const [goldRate, setGoldRate] = useState({
    '24': { rate: '', makingCharges: '' },
    '22': { rate: '', makingCharges: '' },
    '18': { rate: '', makingCharges: '' },
    'Silver': { rate: '', makingCharges: '' }
  });
  const [gstRate, setGstRate] = useState(3);

  useEffect(() => {
    const goldRateRef = ref(database, 'goldRate');
    onValue(goldRateRef, (snapshot) => {
      const rates = snapshot.val();
      if (rates) {
        setGoldRate({
          '24': { rate: rates['24']?.rate || '', makingCharges: rates['24']?.makingCharges || '' },
          '22': { rate: rates['22']?.rate || '', makingCharges: rates['22']?.makingCharges || '' },
          '18': { rate: rates['18']?.rate || '', makingCharges: rates['18']?.makingCharges || '' },
          'Silver': { rate: rates['Silver']?.rate || '', makingCharges: rates['Silver']?.makingCharges || '' }
        });
      }
    });

    const gstRateRef = ref(database, 'gstRate');
    onValue(gstRateRef, (snapshot) => {
      setGstRate(snapshot.val() || 3);
    });
  }, []);

  const calculateFinalPrice = (caratType) => {
    const rate = parseFloat(goldRate[caratType]?.rate || 0);
    const makingChargesPercent = parseFloat(goldRate[caratType]?.makingCharges || 0);
    if (rate === 0) return 0;
    const makingCharges = rate * (makingChargesPercent / 100);
    const gstAmount = (rate + makingCharges) * (gstRate / 100);
    const finalPrice = rate + makingCharges + gstAmount;
    return finalPrice.toFixed(2);
  };

  const calculatePriceWithoutGST = (caratType) => {
    const rate = parseFloat(goldRate[caratType]?.rate || 0);
    const makingChargesPercent = parseFloat(goldRate[caratType]?.makingCharges || 0);
    if (rate === 0) return 0;
    const makingCharges = rate * (makingChargesPercent / 100);
    return (rate + makingCharges).toFixed(2);
  };

  const formatNumber = (num) => {
    return parseFloat(num || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-blue-50/20 to-gray-100/20"></div>

        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px)`,
            backgroundSize: '80px 80px'
          }}>
        </div>

        {/* Animated Accent Lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent animate-shimmer-line"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-shimmer-line" style={{ animationDelay: '2s' }}></div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes shimmer-line {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes subtle-glow {
          0%, 100% { box-shadow: 0 8px 32px rgba(251, 191, 36, 0.1); }
          50% { box-shadow: 0 8px 32px rgba(251, 191, 36, 0.2); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-shimmer-line {
          animation: shimmer-line 8s linear infinite;
        }
        
        .animate-subtle-glow {
          animation: subtle-glow 3s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .professional-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08),
                      0 2px 8px rgba(0, 0, 0, 0.04),
                      inset 0 1px 0 rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.9);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        
        .professional-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12),
                      0 4px 16px rgba(0, 0, 0, 0.06),
                      inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }
        
        .table-row-hover:hover {
          background: linear-gradient(to right, rgba(251, 191, 36, 0.05), rgba(59, 130, 246, 0.05)) !important;
          transform: translateX(5px);
          transition: all 0.2s ease;
        }

        /* TV Color Fix */
        .tv-color-fix {
          background: white !important;
          color: #1f2937 !important;
        }
        
        .tv-bg-fix {
          background: white !important;
        }
        
        .tv-text-fix {
          color: #1f2937 !important;
        }
        
        .tv-border-fix {
          border-color: #e5e7eb !important;
        }
        
        .tv-shadow-fix {
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08),
                      0 2px 8px rgba(0, 0, 0, 0.04),
                      inset 0 1px 0 rgba(255, 255, 255, 0.8) !important;
        }

        /* Mobile specific adjustments */
        @media (max-width: 640px) {
          .professional-card {
            border-radius: 16px;
          }
          
          .mobile-text-sm {
            font-size: 1rem !important;
          }
          
          .mobile-text-md {
            font-size: 1.125rem !important;
          }
          
          .mobile-text-lg {
            font-size: 1.25rem !important;
          }
          
          .mobile-text-xl {
            font-size: 1.5rem !important;
          }
          
          .mobile-text-2xl {
            font-size: 1.75rem !important;
          }
          
          .mobile-padding {
            padding: 1rem !important;
          }
        }
      `}</style>

      <div className="max-w-8xl mx-auto relative z-10 px-4 sm:px-6 py-6 sm:py-10">
        {/* Header Section - Made mobile friendly */}
        <div className="text-center mb-4 sm:mb-2 animate-fade-in-up">
          <div className="inline-flex items-center justify-center mb-4 sm:mb-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-blue-50 shadow-lg border border-amber-100 animate-float tv-bg-fix tv-border-fix w-full max-w-4xl mx-auto">
            <div className="text-center w-full">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-gray-800 mb-2 sm:mb-1 tv-text-fix tracking-tight">
                <span className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent italic font-extrabold uppercase block w-full text-center py-2 sm:py-4">
                  Bhamare Jewellers
                </span>
              </h1>
              <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-600 font-bold mt-1 sm:mt-2 tv-text-fix">
                {new Date().toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Main Rates Grid - Made responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {/* 24K Gold */}
          <div className="professional-card p-4 sm:p-7 pt-10 sm:pt-12 animate-fade-in-up tv-color-fix tv-shadow-fix" style={{ animationDelay: '0.1s' }}>
            <div className="relative">
              <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg animate-subtle-glow">
                  <span className="text-white font-bold text-xl sm:text-2xl md:text-3xl">24K</span>
                </div>
              </div>
              <div className="text-center mb-4 sm:mb-6 pt-10 sm:pt-12">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800 font-bold mobile-text-lg">99.5% Purity</p>
              </div>
              <div className="space-y-3 sm:space-y-5">
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-3 sm:p-5 border border-amber-100 tv-bg-fix tv-border-fix">
                  <p className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-center font-bold text-gray-800 tv-text-fix">
                    ₹{formatNumber(goldRate['24']?.rate || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 22K Gold */}
          <div className="professional-card p-4 sm:p-7 pt-10 sm:pt-12 animate-fade-in-up tv-color-fix tv-shadow-fix" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg animate-subtle-glow" style={{ animationDelay: '0.5s' }}>
                  <span className="text-white font-bold text-xl sm:text-2xl md:text-3xl">22K</span>
                </div>
              </div>
              <div className="text-center mb-4 sm:mb-6 pt-10 sm:pt-12">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800 font-bold mobile-text-lg">91.6% Purity</p>
              </div>
              <div className="space-y-3 sm:space-y-5">
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-3 sm:p-5 border border-amber-100 tv-bg-fix tv-border-fix">
                  <p className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-center font-bold text-gray-800 tv-text-fix">
                    ₹{formatNumber(goldRate['22']?.rate || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 18K Gold */}
          <div className="professional-card p-4 sm:p-7 pt-10 sm:pt-12 animate-fade-in-up tv-color-fix tv-shadow-fix" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center shadow-lg animate-subtle-glow" style={{ animationDelay: '1s' }}>
                  <span className="text-white font-bold text-xl sm:text-2xl md:text-3xl">18K</span>
                </div>
              </div>
              <div className="text-center mb-4 sm:mb-6 pt-10 sm:pt-12">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800 font-bold mobile-text-lg">75% Purity</p>
              </div>
              <div className="space-y-3 sm:space-y-5">
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-3 sm:p-5 border border-amber-100 tv-bg-fix tv-border-fix">
                  <p className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-center font-bold text-gray-800 tv-text-fix">
                    ₹{formatNumber(goldRate['18']?.rate || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Silver */}
          <div className="professional-card p-4 sm:p-7 pt-10 sm:pt-12 animate-fade-in-up tv-color-fix tv-shadow-fix" style={{ animationDelay: '0.4s' }}>
            <div className="relative">
              <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-gray-400 to-slate-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl sm:text-2xl md:text-3xl">Ag</span>
                </div>
              </div>
              <div className="text-center mb-4 sm:mb-6 pt-10 sm:pt-12">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800 font-bold mobile-text-lg">99.5% Purity</p>
              </div>
              <div className="space-y-3 sm:space-y-5">
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-3 sm:p-5 border border-gray-100 tv-bg-fix tv-border-fix">
                  <p className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-center font-bold text-gray-800 tv-text-fix">
                    ₹{formatNumber(goldRate['Silver']?.rate || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Section - Made responsive */}
        <div className="professional-card p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 animate-fade-in-up tv-color-fix tv-shadow-fix" style={{ animationDelay: '0.5s' }}>
          <div className="flex flex-col items-center justify-between mb-4 sm:mb-6 lg:mb-8">
            <div className="mb-3 sm:mb-0 text-center lg:text-left w-full">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 tv-text-fix text-center">
                Detailed Price Breakdown
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 tv-text-fix text-center mt-1">
                Complete calculation including making charges and GST
              </p>
            </div>
          </div>

          {/* Mobile View - Stacked Cards */}
          <div className="lg:hidden space-y-4">
            {['24', '22', '18', 'Silver'].map((carat, idx) => (
              <div key={carat} className="professional-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      carat === 'Silver' 
                        ? 'bg-gradient-to-r from-gray-400 to-slate-500' 
                        : 'bg-gradient-to-r from-amber-400 to-yellow-500'
                    }`}></div>
                    <span className="font-semibold text-base">
                      {carat === 'Silver' ? 'Silver' : `${carat}K Gold`}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-gray-800">
                    ₹{formatNumber(goldRate[carat]?.rate || 0)}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">Making</div>
                    <div className="font-medium">{goldRate[carat]?.makingCharges || 0}%</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">Making Amt</div>
                    <div className="font-medium">₹{formatNumber((parseFloat(goldRate[carat]?.rate || 0) * (parseFloat(goldRate[carat]?.makingCharges || 0) / 100)))}</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">Total Amount</div>
                    <div className="font-bold text-blue-600">₹{formatNumber(calculatePriceWithoutGST(carat))}</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">GST Amt</div>
                    <div className="font-medium">₹{formatNumber((parseFloat(goldRate[carat]?.rate || 0) + (parseFloat(goldRate[carat]?.rate || 0) * (parseFloat(goldRate[carat]?.makingCharges || 0) / 100))) * (gstRate / 100))}</div>
                  </div>
                </div>
                
                <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                  <div className="text-xs text-gray-500 mb-1">Gross Amount</div>
                  <div className="text-lg font-bold text-gray-800">
                    ₹{formatNumber(calculateFinalPrice(carat))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-100 shadow-sm tv-border-fix">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-blue-50 tv-bg-fix">
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm uppercase tracking-wider border-b border-gray-200 tv-text-fix tv-border-fix">Purity</th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-700 text-sm uppercase tracking-wider border-b border-gray-200 tv-text-fix tv-border-fix">Rate</th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-700 text-sm uppercase tracking-wider border-b border-gray-200 tv-text-fix tv-border-fix">Making (%)</th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-700 text-sm uppercase tracking-wider border-b border-gray-200 tv-text-fix tv-border-fix">Making Amount</th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-700 text-sm uppercase tracking-wider border-b border-gray-200 tv-text-fix tv-border-fix">Total Amount</th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-700 text-sm uppercase tracking-wider border-b border-gray-200 tv-text-fix tv-border-fix">GST Amount</th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-700 text-sm uppercase tracking-wider border-b border-gray-200 tv-text-fix tv-border-fix">Gross Amount</th>
                </tr>
              </thead>
              <tbody>
                {['24', '22', '18'].map((carat, idx) => (
                  <tr
                    key={carat}
                    className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} table-row-hover tv-bg-fix`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-800 border-b border-gray-100 tv-text-fix tv-border-fix">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 mr-3"></div>
                        <span className="font-semibold text-xl">{carat}K Gold</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-700 border-b border-gray-100 tv-text-fix tv-border-fix text-2xl">₹{formatNumber(goldRate[carat]?.rate || 0)}</td>
                    <td className="px-6 py-4 text-right text-amber-600 font-medium border-b border-gray-100 tv-text-fix tv-border-fix text-2xl">{goldRate[carat]?.makingCharges || 0}%</td>
                    <td className="px-6 py-4 text-right text-gray-700 border-b border-gray-100 tv-text-fix tv-border-fix text-2xl">₹{formatNumber((parseFloat(goldRate[carat]?.rate || 0) * (parseFloat(goldRate[carat]?.makingCharges || 0) / 100)))}</td>
                    <td className="px-6 py-4 text-right font-bold text-blue-600 border-b border-gray-100 tv-text-fix tv-border-fix text-2xl">₹{formatNumber(calculatePriceWithoutGST(carat))}</td>
                    <td className="px-6 py-4 text-right text-gray-700 border-b border-gray-100 tv-text-fix tv-border-fix text-2xl">₹{formatNumber((parseFloat(goldRate[carat]?.rate || 0) + (parseFloat(goldRate[carat]?.rate || 0) * (parseFloat(goldRate[carat]?.makingCharges || 0) / 100))) * (gstRate / 100))}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-800 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100 tv-text-fix tv-border-fix text-2xl">
                      ₹{formatNumber(calculateFinalPrice(carat))}
                    </td>
                  </tr>
                ))}
                <tr className="bg-white table-row-hover tv-bg-fix">
                  <td className="px-6 py-4 font-medium text-gray-800 tv-text-fix">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-gray-400 to-slate-500 mr-3"></div>
                      <span className="font-semibold text-xl">Silver</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-700 tv-text-fix text-2xl">₹{formatNumber(goldRate['Silver']?.rate || 0)}</td>
                  <td className="px-6 py-4 text-right text-amber-600 font-medium tv-text-fix text-2xl">{goldRate['Silver']?.makingCharges || 0}%</td>
                  <td className="px-6 py-4 text-right text-gray-700 tv-text-fix text-2xl">₹{formatNumber((parseFloat(goldRate['Silver']?.rate || 0) * (parseFloat(goldRate['Silver']?.makingCharges || 0) / 100)))}</td>
                  <td className="px-6 py-4 text-right font-bold text-blue-600 tv-text-fix text-2xl">₹{formatNumber(calculatePriceWithoutGST('Silver'))}</td>
                  <td className="px-6 py-4 text-right text-gray-700 tv-text-fix text-2xl">₹{formatNumber((parseFloat(goldRate['Silver']?.rate || 0) + (parseFloat(goldRate['Silver']?.rate || 0) * (parseFloat(goldRate['Silver']?.makingCharges || 0) / 100))) * (gstRate / 100))}</td>
                  <td className="px-6 py-4 text-right font-bold text-gray-800 bg-gradient-to-r from-green-50 to-emerald-50 tv-text-fix text-2xl">
                    ₹{formatNumber(calculateFinalPrice('Silver'))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table Legend */}
          <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-gray-600 tv-text-fix">
            <a href="https://www.webreich.in/" className="flex items-center justify-center">
              <img src="https://www.webreich.in/logo.png" alt="WebReich" className="w-6 h-6 sm:w-8 sm:h-8 mr-2" />
              <h2 className="text-base sm:text-lg md:text-xl font-bold">
                Powered By <span className="text-orange-600">WebReich Technologies</span>
              </h2>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GoldRate;