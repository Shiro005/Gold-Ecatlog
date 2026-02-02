import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../Database/Firebase';
import { FiSearch, FiChevronRight } from 'react-icons/fi';
import { GiGoldBar, GiDiamondRing, GiGemNecklace, GiEarrings, GiGemPendant, GiMale, GiFemale } from 'react-icons/gi';
import { BsWhatsapp, BsStars, BsGem } from 'react-icons/bs';
import { RiLeafLine, RiHandHeartLine, RiSecurePaymentLine } from 'react-icons/ri';
import { FaRing, FaHeart, FaRegHeart } from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import UserFormModal from './userform';

const Home = () => {
  const [goldRates, setGoldRates] = useState({ '18': 0, '22': 0, '24': 0 });
  const [showUserForm, setShowUserForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const genderCategories = [
    {
      id: 'women',
      name: "Women's Jewelry",
      icon: <GiFemale className="text-xl" />,
      subCategories: [
        {
          id: 'ladies ring',
          name: 'Ladies Rings',
          icon: <FaRing />,
          image: 'https://res.cloudinary.com/dbt5oz7fk/image/upload/v1754718992/Bhamreimages/1754718991095_lr4.jpg',
          bgColor: 'from-pink-600 to-rose-700'
        },
        {
          id: 'earring',
          name: 'Earrings',
          icon: <GiEarrings />,
          image: 'https://res.cloudinary.com/dbt5oz7fk/image/upload/v1754720961/Bhamreimages/1754720957810_le1.jpg',
          bgColor: 'from-rose-600 to-red-700'
        },
        {
          id: 'mangalsutra',
          name: 'Mangalsutras',
          icon: <GiGemNecklace />,
          image: 'https://res.cloudinary.com/dbt5oz7fk/image/upload/v1754720724/Bhamreimages/1754720723003_m3.jpg',
          bgColor: 'from-orange-600 to-amber-700'
        },
        {
          id: 'ladies bracelet',
          name: 'Bracelets',
          icon: <GiGemNecklace />,
          image: 'https://res.cloudinary.com/dbt5oz7fk/image/upload/v1754721986/Bhamreimages/1754721984812_lb2.jpg',
          bgColor: 'from-red-600 to-pink-700'
        },
        {
          id: 'mangalsutra pendant',
          name: 'Mangalsutra Pendants',
          icon: <GiGemNecklace />,
          image: '/pendant.jpg',
          bgColor: 'from-amber-600 to-orange-700'
        },
        {
          id: 'locket',
          name: 'Lockets',
          icon: <GiGemNecklace />,
          image: 'https://www.chidambaramgoldcovering.com/image/cache/catalog/ChidambaramGoldCovering/dollar-chain/bgdr1136-long-impon-lotus-dollar-chain-regular-wear-collections-1a-1700x2000.jpg',
          bgColor: 'from-purple-400 to-fuchsia-500'
        },
        {
          id: 'ladies chain',
          name: 'Chains',
          icon: <GiGemNecklace />,
          image: 'https://res.cloudinary.com/dbt5oz7fk/image/upload/v1754722114/Bhamreimages/1754722112607_lc2.jpg',
          bgColor: 'from-pink-400 to-rose-500'
        }
      ]
    },
    {
      id: 'men',
      name: "Men's Jewelry",
      icon: <GiMale className="text-xl" />,
      subCategories: [
        {
          id: 'gents ring',
          name: 'Rings',
          icon: <FaRing />,
          image: 'https://res.cloudinary.com/dbt5oz7fk/image/upload/v1754717027/Bhamreimages/1754717026360_2.jpg',
          bgColor: 'from-blue-600 to-indigo-700'
        },
        {
          id: 'mens bali',
          name: 'Balis',
          icon: <GiDiamondRing />,
          image: 'https://images.unsplash.com/photo-1708222169666-3308b930be33?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          bgColor: 'from-indigo-600 to-purple-700'
        },
        {
          id: 'mens stud',
          name: 'Studs',
          icon: <GiEarrings />,
          image: 'https://th.bing.com/th/id/OIP.5cPY83hA00IBkaoq20FNIQHaHa?r=0&w=2000&h=2000&rs=1&pid=ImgDetMain&cb=idpwebpc2',
          bgColor: 'from-teal-600 to-blue-700'
        },
        {
          id: 'gents bracelet',
          name: 'Bracelets',
          icon: <GiGemNecklace />,
          image: 'https://res.cloudinary.com/dbt5oz7fk/image/upload/v1754721917/Bhamreimages/1754721915554_gbrac.jpg',
          bgColor: 'from-purple-600 to-fuchsia-700'
        },
        {
          id: 'mens chain',
          name: 'Chains',
          icon: <GiGemNecklace />,
          image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          bgColor: 'from-gray-600 to-blue-700'
        },
        {
          id: 'couple ring',
          name: 'Couple Rings',
          icon: <FaRing />,
          image: 'https://res.cloudinary.com/dbt5oz7fk/image/upload/v1754721834/Bhamreimages/1754721831138_cr1.jpg',
          bgColor: 'from-blue-400 to-indigo-500'
        }
      ]
    },
    {
      id: 'kids',
      name: "Kids' Jewelry",
      icon: <GiDiamondRing className="text-xl" />,
      subCategories: [
        {
          id: 'kids ring',
          name: 'Rings',
          icon: <FaRing />,
          image: 'https://images.unsplash.com/photo-1726256677740-dfd61fa1af26?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          bgColor: 'from-yellow-600 to-amber-700'
        },
        // {
        //   id: 'kids earring',
        //   name: 'Earrings',
        //   icon: <GiEarrings />,
        //   image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        //   bgColor: 'from-amber-600 to-orange-700'
        // }
      ]
    },
  ];

  const banners = [
    {
      image: '/img1.JPG',
      title: 'Bhamare Jewellers',
      subtitle: 'Akola\'s First Digital Gold Experience',
      tagline: 'Pioneering digital gold shopping since 2007',
      buttonText: 'Explore Collections'
    },
    {
      image: '/earring.JPG',
      title: 'Trusted for Generations',
      subtitle: 'Crafting Elegance Since 2007',
      tagline: 'The most trendy jewellery outlet',
      buttonText: 'Shop Now'
    },
    {
      image: '/img2.JPG',
      title: 'Trendsetters in Akola',
      subtitle: 'Your Style, Our Craftsmanship',
      tagline: 'Best Jewellery Design',
      buttonText: 'View Designs'
    }
  ];

  const features = [
    {
      icon: <BsStars className="text-2xl" />,
      title: "Premium Quality",
      description: "Hallmarked gold with purity guarantee"
    },
    {
      icon: <RiLeafLine className="text-2xl" />,
      title: "Transparent Pricing",
      description: "No hidden charges, competitive rates"
    },
    {
      icon: <GiDiamondRing className="text-2xl" />,
      title: "Custom Designs",
      description: "Tailored to your unique preferences"
    },
    {
      icon: <RiHandHeartLine className="text-2xl" />,
      title: "Trusted Legacy",
      description: "Serving Akola for over 18 years"
    },
    {
      icon: <RiSecurePaymentLine className="text-2xl" />,
      title: "Secure Payments",
      description: "Multiple safe payment options"
    },
    {
      icon: <BsGem className="text-2xl" />,
      title: "Wide Selection",
      description: "From traditional to contemporary designs"
    }
  ];

  // useEffect(() => {
  //   const goldRateRef = ref(database, 'goldRate');
  //   const unsubscribeGoldRates = onValue(goldRateRef, (snapshot) => {
  //     const rates = snapshot.val();
  //     if (rates) {
  //       setGoldRates({
  //         '18': parseFloat(rates['18'] || 0),
  //         '22': parseFloat(rates['22'] || 0),
  //         '24': parseFloat(rates['24'] || 0)
  //       });
  //     }
  //   });

  //   return () => unsubscribeGoldRates();
  // }, []);

  useEffect(() => {
    const goldRateRef = ref(database, 'goldRate');
    const unsubscribeGoldRates = onValue(goldRateRef, (snapshot) => {
      const rates = snapshot.val();
      if (rates) {
        // The goldRate structure now has both rate and makingCharges
        // Extract just the rate values for display
        setGoldRates({
          '18': parseFloat(rates['18']?.rate || 0),
          '22': parseFloat(rates['22']?.rate || 0),
          '24': parseFloat(rates['24']?.rate || 0),
          'Silver': parseFloat(rates['Silver']?.rate || 0)
        });
      } else {
        // Fallback to default values if no rates found
        setGoldRates({ '18': 0, '22': 0, '24': 0, 'Silver': 0 });
      }
    });

    return () => unsubscribeGoldRates();
  }, []);

  useEffect(() => {
    const hasSubmitted = localStorage.getItem('formSubmitted');
    if (!hasSubmitted) {
      const timer = setTimeout(() => {
        setShowUserForm(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    fade: true,
    cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
  };

  const categorySliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const viewCategoryProducts = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white font-sans">
      {showUserForm && <UserFormModal />}

      {/* Gold Rate Ticker */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-600 py-2 shadow-md sticky top-0 z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between text-white text-sm">
            <div className="flex items-center mb-2 sm:mb-0">
              <GiGoldBar className="text-yellow-300 mr-2 text-lg" />
              <span className="font-medium">Today's Gold Rate:</span>
            </div>
            <div className="flex space-x-4">
              {/* {['24', '22', '18'].map(carat => (
                <div key={carat} className="flex items-center">
                  <span className="font-semibold text-yellow-300 mr-1">{carat}K</span>
                  <span>₹{goldRates[carat]?.toLocaleString('en-IN') || '--'}/g</span>
                </div>
              ))} */}

              {['24', '22', '18'].map(carat => (
                <div key={carat} className="flex items-center bg-purple-700/50 px-1 py-1 rounded-lg">
                  <span className="font-semibold text-yellow-300 mr-1">
                    {carat === '18' ? '18K' : `${carat}K`}
                  </span>
                  <span>
                    ₹{goldRates[carat] ? goldRates[carat].toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}/g
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Slider */}
      <div className="relative">
        <Slider {...sliderSettings} className="overflow-hidden">
          {banners.map((banner, index) => (
            <div key={index} className="relative">
              <img
                src={banner.image}
                alt={`Banner ${index + 1}`}
                className="w-full h-64 md:h-96 lg:h-[500px] object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/30 to-transparent"></div>
              <div className="absolute bottom-8 left-0 right-0 text-center px-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 font-serif tracking-tight">
                  {banner.title}
                </h1>
                <p className="text-lg md:text-xl text-purple-200 font-medium mb-4">
                  {banner.subtitle}
                </p>
                <p className="text-sm md:text-base text-purple-100 font-light mb-6 max-w-2xl mx-auto">
                  {banner.tagline}
                </p>
                <button
                  onClick={() => navigate('/collections')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {banner.buttonText}
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">

        {/* Horizontal Banner */}
        <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
          <div className="relative h-32 md:h-40 bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative z-10 text-center px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Exclusive Collection</h2>
              <p className="text-purple-100 max-w-2xl mx-auto">
                Discover our premium jewelry crafted with precision and passion
              </p>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-purple-900 mb-2 font-serif">Our Collections</h2>
            <div className="w-20 h-1 bg-purple-500 mx-auto"></div>
            <p className="text-purple-700 mt-4 max-w-2xl mx-auto">
              Explore our exquisite range of jewellery crafted with precision and passion
            </p>
          </div>

          {genderCategories.map((genderCategory) => (
            <div key={genderCategory.id} className="mb-12">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg bg-purple-100 text-purple-700 shadow-sm mr-4">
                  {genderCategory.icon}
                </div>
                <h3 className="text-2xl font-semibold text-purple-800">{genderCategory.name}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {genderCategory.subCategories.map((subCategory) => (
                  <div
                    key={subCategory.id}
                    onClick={() => viewCategoryProducts(subCategory.id)}
                    className="group relative h-28 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <img
                      src={subCategory.image}
                      alt={subCategory.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white align-text-bottom">
                      <h4 className="text-lg font-semibold mb-1 align-bottom">{subCategory.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">View Collection</span>
                        <FiChevronRight className="text-lg" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Features Section */}
        <section className="py-12 bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-inner mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-purple-900 mb-2 font-serif">Why Choose Us</h2>
            <div className="w-20 h-1 bg-purple-500 mx-auto"></div>
            <p className="text-purple-700 mt-4 max-w-2xl mx-auto">
              We combine traditional craftsmanship with modern designs to bring you the best
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-purple-100">
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-4 mx-auto text-purple-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-center text-purple-800 mb-2">{feature.title}</h3>
                <p className="text-purple-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WhatsApp CTA */}
        <div className="fixed bottom-6 right-6 z-10">
          <a
            href="https://wa.me/919881096439"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 animate-bounce"
          >
            <BsWhatsapp className="text-2xl" />
            <span className="ml-2 font-medium hidden sm:inline">Chat with Us</span>
          </a>
        </div>
      </main>
    </div>
  );
};

export default Home;
