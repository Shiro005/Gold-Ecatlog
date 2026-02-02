import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../Database/Firebase';
import { GiGoldBar } from 'react-icons/gi';
import { BsWhatsapp } from 'react-icons/bs';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FaWeightHanging, FaPercentage, FaGem } from 'react-icons/fa';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [goldRates, setGoldRates] = useState({
    '18': { rate: 0, makingCharges: 0 },
    '22': { rate: 0, makingCharges: 0 },
    '24': { rate: 0, makingCharges: 0 }
  });
  const [gstRate, setGstRate] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product details
    const productRef = ref(database, `products/${id}`);
    onValue(productRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProduct({
          id,
          ...data
        });
        setLoading(false);
      } else {
        setError('Product not found');
        setLoading(false);
      }
    });

    // Fetch gold rates with making charges
    const goldRateRef = ref(database, 'goldRate');
    onValue(goldRateRef, (snapshot) => {
      const rates = snapshot.val();
      if (rates) {
        setGoldRates({
          '18': {
            rate: parseFloat(rates['18']?.rate || 0),
            makingCharges: parseFloat(rates['18']?.makingCharges || 0)
          },
          '22': {
            rate: parseFloat(rates['22']?.rate || 0),
            makingCharges: parseFloat(rates['22']?.makingCharges || 0)
          },
          '24': {
            rate: parseFloat(rates['24']?.rate || 0),
            makingCharges: parseFloat(rates['24']?.makingCharges || 0)
          }
        });
      }
    });

    // Fetch GST rate
    const gstRateRef = ref(database, 'gstRate');
    onValue(gstRateRef, (snapshot) => {
      setGstRate(parseFloat(snapshot.val()) || 3);
    });
  }, [id]);

  // Helper to get the correct gold rate for the product's carat
  const getGoldRateForCarat = (carat) => {
    if (!goldRates[carat]) return { rate: 0, makingCharges: 0 };
    return goldRates[carat];
  };

  const calculatePriceBreakdown = (carat = product?.carat) => {
    if (!product) return null;

    const goldRateData = getGoldRateForCarat(carat);
    const currentGoldRate = goldRateData.rate;
    const currentMakingCharges = product.makingChargesPercentage || goldRateData.makingCharges || 0;

    if (!currentGoldRate || !product.netWeight) {
      return {
        goldValue: 0,
        makingChargesValue: 0,
        hallmarkCharges: 0,
        stoneCharges: 0,
        gstAmount: 0,
        subtotal: 0,
        total: 0,
        rate: 0,
        makingChargesPercentage: 0
      };
    }

    const goldValue = parseFloat(product.netWeight) * currentGoldRate;
    const makingChargesValue = goldValue * (currentMakingCharges / 100);
    const subtotal = (
      goldValue +
      makingChargesValue +
      parseFloat(product.hallmarkCharges || 0) +
      parseFloat(product.stoneCharges || 0)
    );
    
    const gstAmount = subtotal * (parseFloat(product.gstRate || gstRate) / 100);
    const total = subtotal + gstAmount;

    return {
      goldValue: goldValue.toFixed(2),
      makingChargesValue: makingChargesValue.toFixed(2),
      hallmarkCharges: parseFloat(product.hallmarkCharges || 0).toFixed(2),
      stoneCharges: parseFloat(product.stoneCharges || 0).toFixed(2),
      gstAmount: gstAmount.toFixed(2),
      subtotal: subtotal.toFixed(2),
      total: total.toFixed(2),
      rate: currentGoldRate.toFixed(2),
      makingChargesPercentage: currentMakingCharges
    };
  };

  const handleWhatsAppInquiry = () => {
    const priceBreakdown = calculatePriceBreakdown();
    const message = 
      `Hello Bhamare Jewellers,%0A%0A` +
      `I'm interested in the following product:%0A` +
      `----------------------------%0A` +
      `*Product Name:* ${product.itemName || '-'}%0A` +
      `*Barcode:* ${product.barcodeNo || '-'}%0A` +
      `*Category:* ${product.category || '-'}%0A` +
      `*Carat:* ${product.carat || '22'}K%0A` +
      `*Net Weight:* ${product.netWeight || '-'}g%0A` +
      `*Gross Weight:* ${product.grossWeight || '-'}g%0A` +
      `*Stone Charges:* ₹${product.stoneCharges || '0'}%0A` +
      `*Hallmark Charges:* ₹${product.hallmarkCharges || '0'}%0A` +
      `*Making Charges (%):* ${priceBreakdown.makingChargesPercentage || '0'}%0A` +
      `*GST Rate:* ${product.gstRate || gstRate}%0A` +
      `*Gold Rate (${product.carat || '22'}K):* ₹${priceBreakdown.rate}/g%0A` +
      `*Total Price:* ₹${priceBreakdown.total || '0'}%0A` +
      `----------------------------%0A` +
      `Please provide more details.`;
    window.open(`https://wa.me/919881096439?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">Product Not Found</h2>
          <p className="text-stone-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const priceBreakdown = calculatePriceBreakdown();
  const goldRateData = getGoldRateForCarat(product.carat);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header with Gold Rates */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-2 md:mb-0">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center text-white hover:text-purple-200 transition-colors mr-4"
              >
                <FiArrowLeft className="mr-1" /> Back
              </button>
              <div className="flex items-center text-white">
                <GiGoldBar className="text-yellow-400 mr-2 text-xl" />
                <span className="font-medium">Today's Gold Rates:</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {['24', '22', '18'].map(carat => (
                <div key={carat} className="flex items-center bg-purple-800/50 px-3 py-1 rounded-lg">
                  <span className="font-semibold text-yellow-300 mr-1">
                    {carat}K
                  </span>
                  <span className="text-white text-sm">
                    ₹{goldRates[carat]?.rate ? goldRates[carat].rate.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}/g
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2 p-4 md:p-8">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-stone-100">
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/800x800?text=Product+Image'}
                  alt={product.itemName}
                  className="h-full w-full object-cover object-center"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x800?text=Product+Image';
                  }}
                />
              </div>
              
              {/* Gold Rate Info */}
              <div className="mt-6 bg-stone-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">
                  Current Gold Rate for {product.carat}K
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600">Rate per gram</span>
                    <span className="font-medium">₹{goldRateData.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600">Default Making Charges</span>
                    <span className="font-medium">{goldRateData.makingCharges}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600">Applied Making Charges</span>
                    <span className="font-medium text-purple-700">
                      {product.makingChargesPercentage || goldRateData.makingCharges}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-4 md:p-8">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-purple-900 mb-2">
                  {product.itemName}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.carat === '24' ? 'bg-yellow-100 text-yellow-800' : 
                    product.carat === '22' ? 'bg-amber-100 text-amber-800' : 
                    'bg-stone-100 text-stone-800'
                  }`}>
                    {product.carat}K Gold
                  </span>
                  <span className="text-stone-500">#{product.barcodeNo}</span>
                  {product.isCustomizable && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Customizable
                    </span>
                  )}
                </div>
              </div>

              {/* Category and Weight */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-stone-50 p-3 rounded-lg">
                  <p className="text-xs text-stone-500 uppercase font-medium">Category</p>
                  <p className="text-sm font-medium capitalize">{product.category}</p>
                </div>
                <div className="bg-stone-50 p-3 rounded-lg">
                  <p className="text-xs text-stone-500 uppercase font-medium flex items-center">
                    <FaWeightHanging className="mr-1" /> Net Weight
                  </p>
                  <p className="text-sm font-medium">{product.netWeight}g</p>
                </div>
                <div className="bg-stone-50 p-3 rounded-lg">
                  <p className="text-xs text-stone-500 uppercase font-medium flex items-center">
                    <FaWeightHanging className="mr-1" /> Gross Weight
                  </p>
                  <p className="text-sm font-medium">{product.grossWeight}g</p>
                </div>
                <div className="bg-stone-50 p-3 rounded-lg">
                  <p className="text-xs text-stone-500 uppercase font-medium flex items-center">
                    <FaPercentage className="mr-1" /> Making Charges
                  </p>
                  <p className="text-sm font-medium">
                    {product.makingChargesPercentage || goldRateData.makingCharges}%
                  </p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-purple-900 mb-4">Price Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-stone-600">
                      Gold Value ({product.netWeight}g × ₹{priceBreakdown.rate}/g)
                    </span>
                    <span className="font-medium">₹{priceBreakdown.goldValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">
                      Making Charges ({priceBreakdown.makingChargesPercentage}%)
                    </span>
                    <span className="font-medium">₹{priceBreakdown.makingChargesValue}</span>
                  </div>
                  {parseFloat(product.hallmarkCharges || 0) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-stone-600">Hallmark Charges</span>
                      <span className="font-medium">₹{priceBreakdown.hallmarkCharges}</span>
                    </div>
                  )}
                  {parseFloat(product.stoneCharges || 0) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-stone-600 flex items-center">
                        <FaGem className="mr-1 text-xs" /> Stone Charges
                      </span>
                      <span className="font-medium">₹{priceBreakdown.stoneCharges}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-stone-200 pt-2 mt-1">
                    <span className="text-stone-600">Subtotal</span>
                    <span className="font-medium">₹{priceBreakdown.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">GST ({product.gstRate || gstRate}%)</span>
                    <span className="font-medium">₹{priceBreakdown.gstAmount}</span>
                  </div>
                  <div className="border-t border-stone-200 pt-3 mt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-purple-900">Total Price</span>
                      <span className="text-xl font-bold text-purple-900">₹{priceBreakdown.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleWhatsAppInquiry}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors"
                >
                  <BsWhatsapp size={20} />
                  <span>Inquire on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-purple-900 mb-4">Product Description</h3>
            <p className="text-stone-600">{product.description}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductPage;