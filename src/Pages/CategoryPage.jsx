import React, { useState, useEffect } from 'react';
import { ref, query, orderByChild, equalTo, get, onValue } from 'firebase/database';
import { database } from '../Database/Firebase';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShare2 } from 'react-icons/fi';
import { MdRemoveRedEye, MdOutlineStarPurple500 } from 'react-icons/md';
import { BsWhatsapp, BsArrowRight } from 'react-icons/bs';
import { GiGoldBar, GiDiamondRing } from 'react-icons/gi';

const BATCH_SIZES = [15, 15, 15];
const DEFAULT_BATCH_SIZE = 2;

function formatCategoryName(id) {
  return id.replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [batchCount, setBatchCount] = useState(0);
  const [goldRates, setGoldRates] = useState({
    '18': { rate: 0, makingCharges: 0 },
    '22': { rate: 0, makingCharges: 0 },
    '24': { rate: 0, makingCharges: 0 },
    'Silver': { rate: 0, makingCharges: 0 }
  });
  const [gstRate, setGstRate] = useState(3);
  const navigate = useNavigate();

  // Fetch gold rates and GST rate
  useEffect(() => {
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
          },
          'Silver': {
            rate: parseFloat(rates['Silver']?.rate || 0),
            makingCharges: parseFloat(rates['Silver']?.makingCharges || 0)
          }
        });
      }
    });

    // Fetch GST rate
    const gstRateRef = ref(database, 'gstRate');
    onValue(gstRateRef, (snapshot) => {
      setGstRate(snapshot.val() || 3);
    });
  }, []);

  // Fetch all products for the category once
  useEffect(() => {
    setLoading(true);
    setProducts([]);
    setAllProducts([]);
    setBatchCount(0);
    setHasMore(true);

    // Fetch all products in this category
    const productsQuery = query(
      ref(database, 'products'),
      orderByChild('category'),
      equalTo(categoryId)
    );
    get(productsQuery).then(snapshot => {
      if (!snapshot.exists()) {
        setAllProducts([]);
        setProducts([]);
        setHasMore(false);
        setLoading(false);
        return;
      }
      const data = snapshot.val();
      const productsArray = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      // Sort by price (optional)
      productsArray.sort((a, b) => calculatePrice(a) - calculatePrice(b));
      setAllProducts(productsArray);
      // Load first batch
      const firstBatchSize = BATCH_SIZES[0] || DEFAULT_BATCH_SIZE;
      setProducts(productsArray.slice(0, firstBatchSize));
      setBatchCount(1);
      setHasMore(productsArray.length > firstBatchSize);
      setLoading(false);
    }).catch(error => {
      console.error("Error fetching products:", error);
      setAllProducts([]);
      setProducts([]);
      setHasMore(false);
      setLoading(false);
    });
    // eslint-disable-next-line
  }, [categoryId]);

  // Calculate price helper
  function calculatePrice(product) {
    if (!product.netWeight) return 0;
    
    const selectedCarat = product.carat || '22';
    const currentGoldRate = parseFloat(goldRates[selectedCarat]?.rate || 0);
    const currentMakingCharges = parseFloat(goldRates[selectedCarat]?.makingCharges || product.makingChargesPercentage || 0);
    
    if (!currentGoldRate || !product.netWeight) return 0;

    const goldValue = parseFloat(product.netWeight) * currentGoldRate;
    const makingChargesValue = goldValue * (currentMakingCharges / 100);
    
    const subtotal = (
      goldValue +
      makingChargesValue +
      parseFloat(product.hallmarkCharges || 0) +
      parseFloat(product.stoneCharges || 0)
    );
    
    const gstAmount = subtotal * (parseFloat(product.gstRate || gstRate) / 100);
    return Math.round(subtotal + gstAmount);
  }

  // Load more products (client-side pagination)
  const fetchProductsBatch = () => {
    setLoading(true);
    let batchSize = BATCH_SIZES[batchCount] || DEFAULT_BATCH_SIZE;
    const startIdx = products.length;
    const nextBatch = allProducts.slice(startIdx, startIdx + batchSize);
    setProducts(prev => [...prev, ...nextBatch]);
    setBatchCount(prev => prev + 1);
    setHasMore(startIdx + batchSize < allProducts.length);
    setLoading(false);
  };

  const viewProductDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleWhatsAppInquiry = (product) => {
    const productPrice = calculatePrice(product);
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
      `*Making Charges (%):* ${product.makingChargesPercentage || goldRates[product.carat || '22']?.makingCharges || '0'}%0A` +
      `*GST Rate:* ${product.gstRate || gstRate}%0A` +
      `*Gold Rate (${product.carat || '22'}K):* ₹${goldRates[product.carat || '22']?.rate?.toLocaleString('en-IN') || '0'}/g%0A` +
      `*Total Price:* ₹${productPrice?.toLocaleString('en-IN') || '-'}%0A` +
      `----------------------------%0A` +
      `Please provide more details.`;
    window.open(`https://wa.me/919881096439?text=${message}`, '_blank');
  };

  const shareProduct = (product) => {
    const productPrice = calculatePrice(product);
    if (navigator.share) {
      navigator.share({
        title: product.itemName,
        text: `Check out this ${product.itemName} from Bhamare Jewellers for just ₹${productPrice}`,
        url: window.location.origin + `/product/${product.id}`
      }).catch(console.error);
    } else {
      const shareUrl = `whatsapp://send?text=Check out this ${product.itemName} from Bhamare Jewellers: ${window.location.origin}/product/${product.id}`;
      window.open(shareUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-800 to-purple-600 shadow-lg py-4 px-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 text-white hover:text-purple-200 transition-colors"
        >
          <FiArrowLeft className="text-xl" />
        </button>
        <h1 className="text-xl font-bold text-white">
          {formatCategoryName(categoryId)}
        </h1>
      </div>

      {/* Gold Rate Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 text-white py-3 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-2 md:mb-0">
            <GiGoldBar className="text-yellow-400 mr-2 text-xl" />
            <span className="font-medium mr-3">Today's Gold Rates:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {['24', '22', '18'].map(carat => (
              <div key={carat} className="flex items-center bg-purple-800/50 px-3 py-1 rounded-lg">
                <span className="font-semibold text-yellow-300 mr-1">
                  {carat === '18' ? '18K' : `${carat}K`}
                </span>
                <span>
                  ₹{goldRates[carat]?.rate ? goldRates[carat].rate.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}/g
                </span>
                {/* {goldRates[carat]?.makingCharges > 0 && (
                  <span className="ml-2 text-xs text-blue-300">
                    ({goldRates[carat]})
                  </span>
                )} */}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {loading && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-purple-700">Loading beautiful jewelry...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md border border-purple-100">
            <MdOutlineStarPurple500 className="mx-auto text-4xl text-purple-400 mb-3" />
            <h3 className="text-lg font-medium text-purple-800 mb-2">No products found</h3>
            <p className="text-purple-600 text-sm max-w-md mx-auto">
              We couldn't find any items in this category. Our artisans might be crafting something special!
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center mx-auto transition-colors"
            >
              Back to Collections <BsArrowRight className="ml-2" />
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const productPrice = calculatePrice(product);
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-purple-100 hover:border-purple-200 group"
                  >
                    {/* Product Image */}
                    <div className="h-56 relative overflow-hidden">
                      {product.imageUrl ? (
                        <>
                          <img
                            src={product.imageUrl}
                            alt={product.itemName}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 via-transparent to-transparent"></div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-purple-50 flex items-center justify-center">
                          <GiDiamondRing className="text-4xl text-purple-300" />
                        </div>
                      )}

                      {/* Share Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          shareProduct(product);
                        }}
                        className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200 text-purple-700 hover:text-purple-900"
                      >
                        <FiShare2 />
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-purple-900 line-clamp-2" style={{ minHeight: '2.5rem' }}>
                          {product.itemName}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          product.carat === '24' ? 'bg-amber-100 text-amber-800' :
                          product.carat === '22' ? 'bg-purple-100 text-purple-800' :
                          product.carat === 'Silver' ? 'bg-gray-100 text-gray-800' :
                          'bg-stone-100 text-stone-800'
                        }`}>
                          {product.carat === 'Silver' ? 'Silver' : `${product.carat}K`}
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-purple-600">Net Weight</span>
                          <span className="text-sm font-medium">{product.netWeight}g</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-purple-600">Making Charges</span>
                          <span className="text-sm font-medium">
                            {product.makingChargesPercentage || goldRates[product.carat]?.makingCharges || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-purple-600">Gold Rate</span>
                          <span className="text-sm font-medium">
                            ₹{goldRates[product.carat]?.rate?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}/g
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-purple-100 pt-3 mb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-purple-600">Total Price</span>
                          <span className="text-lg font-bold text-purple-800">
                            ₹{productPrice?.toLocaleString('en-IN') || '0'}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewProductDetails(product.id)}
                          className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-800 py-2 px-3 rounded-lg text-sm flex items-center justify-center transition-colors"
                        >
                          <MdRemoveRedEye className="mr-1" /> View
                        </button>
                        <button
                          onClick={() => handleWhatsAppInquiry(product)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center transition-colors"
                        >
                          <BsWhatsapp className="mr-1" /> Enquire
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={fetchProductsBatch}
                  disabled={loading}
                  className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all ${
                    loading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'
                  } text-white flex items-center`}
                >
                  {loading ? (
                    'Loading...'
                  ) : (
                    <>
                      Load More
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;