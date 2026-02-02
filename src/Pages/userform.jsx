import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, push } from 'firebase/database';
import { database } from '../Database/Firebase';
import { FiUser, FiPhone, FiCheck, FiLoader, FiX } from 'react-icons/fi';
import { GiDiamondRing } from 'react-icons/gi';
import { motion } from 'framer-motion';

const UserFormModal = ({ onSuccess, onClose }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [currentBg, setCurrentBg] = useState(0);

  const backgrounds = [
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!name.trim() || !phoneNumber.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (phoneNumber.length < 10) {
      setError('Please enter a valid phone number (at least 10 digits)');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        createdAt: new Date().toISOString(),
        timestamp: Date.now()
      };

      await push(ref(database, 'users'), userData);

      setSuccess(true);
      localStorage.setItem('formSubmitted', 'true');

      if (onSuccess) onSuccess();

      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);

    } catch (error) {
      console.error("Error saving user data:", error);
      setError('Failed to save user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Background images with smooth transition */}
      <div className="absolute inset-0 overflow-hidden">
        {backgrounds.map((bg, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentBg ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${bg})` }}
          />
        ))}
        <div className="absolute inset-0 bg-gray-900 bg-opacity-90" />
      </div>

      {/* Main form container */}
      <div className="relative w-full max-w-md">
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden border border-gray-700">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors z-50"
          >
            <FiX className="text-xl" />
          </button>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mb-4 flex justify-center">
                {/* <img className="text-purple-500 text-4xl" /> */}
                <img src="/logogold.png" alt="" className='h-14 w-14' />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Bhamare Jewellers
              </h1>
              <p className="text-gray-300">
                Exclusive Collection Preview
              </p>
            </div>

            {/* Messages */}
            {success && (
              <div className="mb-6 p-4 bg-purple-900/50 border border-purple-400 rounded-lg flex items-center">
                <FiCheck className="text-purple-300 mr-3" />
                <span className="text-white">Registration successful!</span>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-400 rounded-lg">
                <span className="text-white">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FiUser />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
                    placeholder="Enter your full name"
                    required
                    disabled={loading || success}
                  />
                </div>
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FiPhone />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
                    placeholder="Enter your phone number"
                    required
                    disabled={loading || success}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || success}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center 
                  ${loading || success ?
                    'bg-purple-700 text-gray-300 cursor-not-allowed' :
                    'bg-purple-600 text-white hover:bg-purple-500'
                  }`
                }
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-3" />
                    Processing...
                  </>
                ) : (
                  success ? (
                    <>
                      <FiCheck className="mr-3" />
                      Success
                    </>
                  ) : (
                    'Register Now'
                  )
                )}
              </button>
            </form>

            {/* Footer text */}
            <div className='flex flex-col items-center'>
              <div className="mt-6 text-center text-xs text-gray-400 mb-2">
                <p>By registering, you agree to receive updates about our collections.</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-purple-100/60 text-sm">Crafted with</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-purple-300"
                >
                  <img src="https://webreich.vercel.app/logo.png" alt="" className='h-6 w-6' />
                </motion.div>
                {/* <span className="text-orange-100/60 text-sm">by</span> */}
                <a
                  href="https://webreich.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-white transition-colors duration-300 flex items-center gap-1 font-bold"
                >
                  <span className='font-bold'>Webreich Technologies</span>
                  <motion.span
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    ↗
                  </motion.span>
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;