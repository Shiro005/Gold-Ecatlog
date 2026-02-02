import React from 'react';
import { Link } from 'react-router-dom';
import { GiDiamondTrophy } from 'react-icons/gi'; // Removed GiSparklingDiamond
import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const socialLinks = [
    {
      icon: <FaFacebook />,
      url: "https://www.facebook.com/share/1EE2AfZAqG/?mibextid=LQQJ4d",
      label: "Facebook",
      followers: "3.4K+ followers"
    },
    {
      icon: <FaInstagram />,
      url: "https://www.instagram.com/bhamarejewellers_akola/?hl=en",
      label: "Instagram",
      followers: "68.1K+ followers"
    },
    {
      icon: <FaWhatsapp />,
      url: "https://wa.me/919881096439",
      label: "WhatsApp",
      followers: "Chat with us"
    },
    {
      icon: <FaYoutube />,
      url: "https://youtube.com/@bhamarejewellers?si=YPsJQZeiyL7DSgOP",
      label: "Youtube",
      followers: "Watch our videos"
    }
  ];

  const contactItems = [
    {
      icon: <FaMapMarkerAlt />,
      content: <>
        Jayhind Chowk, Near Raj Rajeshower Mandir,<br />
        Akola, Maharashtra - 444001
      </>,
      highlight: false
    },
    {
      icon: <FaPhone />,
      content: <a href="tel:+919881096439" className="hover:text-purple-300 transition-colors">+91 9881096439</a>,
      highlight: true
    },
    {
      icon: <FaEnvelope />,
      content: <a href="mailto:info@bhamarejewellers.com" className="hover:text-purple-300 transition-colors">info@bhamarejewellers.com</a>,
      highlight: false
    },
    {
      icon: <FaClock />,
      content: "10:00 AM - 8:00 PM (Daily)",
      highlight: false
    }
  ];

  return (
    <footer className="bg-gray-900 text-purple-100 pt-16 pb-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <GiDiamondTrophy className="absolute top-1/4 left-10 text-purple-300 text-4xl animate-pulse opacity-30" />
        <GiDiamondTrophy className="absolute bottom-1/3 right-20 text-purple-400 text-5xl rotate-12 opacity-30" />
        <GiDiamondTrophy className="absolute top-10 right-1/4 text-purple-200 text-3xl opacity-30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex items-center"
            >
              <img
                src="logogold.png"
                alt="Bhamare Jewellers Logo"
                className='h-12 w-12 mr-4 object-contain animate-float'
              />
              <h3 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-purple-200 to-purple-100 tracking-wider">
                Bhamare Jewellers
              </h3>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-purple-100/80 text-lg leading-relaxed max-w-2xl"
            >
              Since 2007, we've been crafting exquisite gold jewellery in Akola with unmatched purity and traditional craftsmanship.
              Each piece tells a story of heritage and trust.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-wrap gap-4 items-center"
            >
              {socialLinks.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-purple-100 hover:text-white transition-colors duration-300 bg-purple-900/50 hover:bg-purple-800/50 rounded-lg px-4 py-2"
                >
                  <span className="text-xl">
                    {item.icon}
                  </span>
                  <div className="text-sm">
                    <div>{item.label}</div>
                    {item.followers && (
                      <div className="text-xs text-purple-200/70">{item.followers}</div>
                    )}
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold pb-3 border-b border-purple-800/50 relative">
              <span className="relative z-10">Visit Us</span>
              <span className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              {contactItems.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`flex items-start p-3 rounded-lg transition-all duration-300 ${item.highlight ? 'bg-purple-900/30 hover:bg-purple-800/40' : 'hover:bg-purple-900/20'}`}
                >
                  <span className="text-purple-300 mt-0.5 mr-3 flex-shrink-0 text-lg">
                    {item.icon}
                  </span>
                  <span className="text-purple-100/90">
                    <a href="https://maps.app.goo.gl/Jm5qqw5Y9YLU7vff7?g_st=ic">
                      {item.content}
                    </a>
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Copyright & Credits */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
          className="border-t border-purple-900/50 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-purple-100/60 text-sm">
              &copy; {new Date().getFullYear()} Bhamare Jewellers, Akola. All Rights Reserved.
            </p>

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
                href="https://webreich.in/"
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
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;