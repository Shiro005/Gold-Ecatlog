import React, { useEffect, useState } from "react";
import { GiGoldBar, GiSilverBullet } from "react-icons/gi";
import { FaSyncAlt, FaRupeeSign, FaToggleOff, FaToggleOn } from "react-icons/fa";
import { BsLightningCharge } from "react-icons/bs";
import { TbBrandSpeedtest } from "react-icons/tb";

const CITY_PREMIUM = {
  "Sambhaji Nagar (Aurangabad)": 20
};

const GoldLiveRate = () => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gstEnabled, setGstEnabled] = useState(false);
  const [makingEnabled, setMakingEnabled] = useState(false);
  const [makingCharge, setMakingCharge] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const city = "Sambhaji Nagar (Aurangabad)";

  const fetchRates = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setRefreshing(true);
      
      const res = await fetch(
        "https://data-asg.goldprice.org/dbXRates/INR"
      );
      const data = await res.json();

      const ounceToGram = 31.1035;
      const cityPremium = CITY_PREMIUM[city];

      const gold24 =
        data.items[0].xauPrice / ounceToGram + cityPremium;
      const silver =
        data.items[0].xagPrice / ounceToGram + 2;

      setRates({
        gold24: Math.round(gold24),
        gold22: Math.round((gold24 * 22) / 24),
        gold18: Math.round((gold24 * 18) / 24),
        silver: Math.round(silver),
        baseGold24: Math.round(gold24 - cityPremium),
        baseSilver: Math.round(silver - 2),
        updated: new Date()
      });

      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(() => fetchRates(false), 300000);
    return () => clearInterval(interval);
  }, []);

  const finalPrice = (price) => {
    let result = price;
    if (makingEnabled) result += (price * makingCharge) / 100;
    if (gstEnabled) result += (result * 3) / 100;
    return Math.round(result);
  };

  const calculateComponents = (basePrice) => {
    const components = { base: basePrice };
    if (makingEnabled) {
      components.making = (basePrice * makingCharge) / 100;
      components.afterMaking = basePrice + components.making;
    } else {
      components.afterMaking = basePrice;
    }
    if (gstEnabled) {
      components.gst = components.afterMaking * 0.03;
      components.final = components.afterMaking + components.gst;
    } else {
      components.final = components.afterMaking;
    }
    return components;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-amber-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-amber-200 max-w-md mx-4">
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Live Rates</h2>
          <p className="text-gray-600">Fetching real-time gold & silver prices...</p>
          <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
            <TbBrandSpeedtest className="mr-2 animate-pulse" />
            Connecting to market data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-amber-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-2xl md:text-2xl font-bold mb-2 flex items-center justify-center md:justify-start">
                <GiGoldBar className="mr-3 text-yellow-300" />
                Kalawanti Jewellers 
              </h1>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2">
                <div className="flex items-center bg-amber-700/30 px-3 py-1 rounded-full text-sm">
                  <BsLightningCharge className="mr-2 animate-pulse" />
                  Real-time Market Data
                </div>
                <div className="text-amber-100 text-sm">
                  {city}, Maharashtra • Per Gram
                </div>
              </div>
            </div>
            
            <button
              onClick={() => fetchRates(false)}
              disabled={refreshing}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              <FaSyncAlt className={`${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Controls Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-amber-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaToggleOff className="mr-2 text-amber-600" />
            Price Calculation Controls
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* GST Toggle */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className={`w-10 h-6 rounded-full mr-3 flex items-center p-1 cursor-pointer ${gstEnabled ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'}`}
                    onClick={() => setGstEnabled(!gstEnabled)}>
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">GST (3%)</h3>
                    <p className="text-sm text-gray-600">Add 3% GST to price</p>
                  </div>
                </div>
                <div className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100">
                  {gstEnabled ? 'ON' : 'OFF'}
                </div>
              </div>
              {gstEnabled && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">GST of 3% will be added to final price</p>
                </div>
              )}
            </div>

            {/* Making Charges Toggle */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className={`w-10 h-6 rounded-full mr-3 flex items-center p-1 cursor-pointer ${makingEnabled ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'}`}
                    onClick={() => setMakingEnabled(!makingEnabled)}>
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Making Charges</h3>
                    <p className="text-sm text-gray-600">Add making charges to price</p>
                  </div>
                </div>
                <div className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100">
                  {makingEnabled ? 'ON' : 'OFF'}
                </div>
              </div>
              
              {makingEnabled && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Making Charge: {makingCharge}%</label>
                    <span className="text-sm font-bold text-blue-600">{makingCharge}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={makingCharge}
                    onChange={(e) => setMakingCharge(parseInt(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:shadow-lg"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>15%</span>
                    <span>30%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Both GST and Making Charges are disabled by default. 
              Toggle switches to see how they affect final prices.
            </p>
          </div>
        </div>

        {/* Rates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <RateCard 
            title="24K Gold" 
            price={finalPrice(rates.gold24)}
            basePrice={rates.baseGold24}
            components={calculateComponents(rates.baseGold24)}
            color="from-amber-500 to-yellow-500"
            icon={<GiGoldBar className="text-3xl" />}
            purity="99.9% Pure"
            gstEnabled={gstEnabled}
            makingEnabled={makingEnabled}
            makingCharge={makingCharge}
          />
          
          <RateCard 
            title="22K Gold" 
            price={finalPrice(rates.gold22)}
            basePrice={Math.round(rates.baseGold24 * 22 / 24)}
            components={calculateComponents(Math.round(rates.baseGold24 * 22 / 24))}
            color="from-yellow-500 to-amber-600"
            icon={<GiGoldBar className="text-3xl" />}
            purity="91.6% Pure"
            gstEnabled={gstEnabled}
            makingEnabled={makingEnabled}
            makingCharge={makingCharge}
          />
          
          <RateCard 
            title="18K Gold" 
            price={finalPrice(rates.gold18)}
            basePrice={Math.round(rates.baseGold24 * 18 / 24)}
            components={calculateComponents(Math.round(rates.baseGold24 * 18 / 24))}
            color="from-orange-400 to-amber-500"
            icon={<GiGoldBar className="text-3xl" />}
            purity="75% Pure"
            gstEnabled={gstEnabled}
            makingEnabled={makingEnabled}
            makingCharge={makingCharge}
          />
          
          <RateCard 
            title="Silver" 
            price={finalPrice(rates.silver)}
            basePrice={rates.baseSilver}
            components={calculateComponents(rates.baseSilver)}
            color="from-gray-400 to-slate-500"
            icon={<GiSilverBullet className="text-3xl" />}
            purity="99.5% Pure"
            gstEnabled={gstEnabled}
            makingEnabled={makingEnabled}
            makingCharge={makingCharge}
            isSilver={true}
          />
        </div>

        {/* Update Time & Powered By */}
        <div className="text-center space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <h3 className="font-semibold text-gray-800 mb-1">Last Updated</h3>
                <p className="text-lg font-mono text-gray-700">
                  {rates.updated.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </p>
                <p className="text-sm text-gray-500">
                  {rates.updated.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="w-px h-12 bg-gray-300 hidden md:block"></div>
              
              <div className="text-left md:text-right">
                <h3 className="font-semibold text-gray-800 mb-1">Data Source</h3>
                <p className="text-sm text-gray-600">WebReich Tech API</p>
                <p className="text-xs text-gray-500">Auto-refresh every 5 minutes</p>
              </div>
            </div>
          </div>
          
          {/* Powered By */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl p-6 shadow-lg max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-300 mb-2">Technology Partner</p>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-white">WR</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">WebReich Technologies</h3>
                    <p className="text-sm text-gray-300">Powering Digital Experiences</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                Real-time market data processing and visualization platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RateCard = ({ 
  title, 
  price, 
  basePrice,
  components,
  color, 
  icon, 
  purity,
  gstEnabled,
  makingEnabled,
  makingCharge,
  isSilver = false 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Header with Gradient */}
      <div className={`bg-gradient-to-r ${color} text-white p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              {icon}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-sm opacity-90">{purity}</p>
            </div>
          </div>
          {/* <div className="text-right">
            <div className="text-xs opacity-80">Final Price</div>
            <div className="text-2xl font-bold flex items-center">
              <FaRupeeSign className="text-lg" />
              <span>{price.toLocaleString("en-IN")}</span>
            </div>
          </div> */}
        </div>
      </div>
      
      {/* Price Breakdown */}
      <div className="p-5">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Base Price</span>
            <span className="font-mono font-bold text-gray-800">
              ₹{basePrice.toLocaleString("en-IN")}
            </span>
          </div>
          
          {makingEnabled && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Making Charges ({makingCharge}%)
              </span>
              <span className="font-mono font-medium text-blue-600">
                ₹{Math.round(components.making).toLocaleString("en-IN")}
              </span>
            </div>
          )}
          
          <div className={`flex justify-between items-center mb-2 ${makingEnabled ? '' : 'hidden'}`}>
            <span className="text-sm font-medium text-gray-600">After Making</span>
            <span className="font-mono font-bold text-gray-800">
              ₹{Math.round(components.afterMaking).toLocaleString("en-IN")}
            </span>
          </div>
          
          {gstEnabled && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">GST (3%)</span>
              <span className="font-mono font-medium text-green-600">
                ₹{Math.round(components.gst).toLocaleString("en-IN")}
              </span>
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-3 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-gray-800">Total Price</span>
              <div className="flex items-center">
                <FaRupeeSign className="text-gray-700 mr-1" />
                <span className="text-xl font-bold text-gray-900">
                  {components.final.toLocaleString("en-IN")}
                </span>
                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 font-medium">
                  FINAL
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Status Indicators */}
        <div className="flex flex-wrap gap-2">
          {makingEnabled && (
            <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
              Making: {makingCharge}%
            </span>
          )}
          {gstEnabled && (
            <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
              GST: 3%
            </span>
          )}
          {!makingEnabled && !gstEnabled && (
            <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
              Base Price Only
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoldLiveRate;