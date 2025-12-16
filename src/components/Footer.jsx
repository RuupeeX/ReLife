import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, Instagram, Twitter, Mail, Phone, MapPin, 
  CreditCard, Shield, Truck, Send 
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Subscription logic would go here
    alert(`Subscribed with: ${email}`);
    setEmail('');
  };

  // 2. Data organized (Translated)
  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' }
  ];

  const quickLinks = [
    { name: 'New Arrivals', path: '/new-arrivals' },
    { name: 'Special Offers', path: '/sales' },
    { name: 'Tops', path: '/category/tops' },
    { name: 'Bottoms', path: '/category/bottoms' },
    { name: 'Accessories', path: '/category/accessories' },
  ];

  const legalLinks = [
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Cookie Policy', path: '/cookies' },
  ];

  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        
        {/* --- TOP SECTION: NEWSLETTER & BRAND --- */}
        <div className="grid md:grid-cols-2 gap-8 mb-12 items-center border-b border-gray-800 pb-12">
          <div>
            <Link to="/" className="inline-block mb-4">
               {/* Logo Image */}
               <img 
                 src="/images/logoGrafitiWhite.png" 
                 alt="HoloCrew Logo" 
                 className="h-20 w-auto object-contain"
                 onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='block'}}
               />
               <span className="hidden text-2xl font-black tracking-widest uppercase">HoloCrew</span>
            </Link>
            <p className="text-gray-400 max-w-sm">
              Join the club. Get exclusive offers and early access to new collections.
            </p>
          </div>
          
          {/* Newsletter Form */}
          <div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-900 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
                required
              />
              <button 
                type="submit"
                className="bg-white text-black px-6 py-3 font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                Subscribe <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* --- MIDDLE SECTION: LINKS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Contact */}
          <div>
            <h3 className="font-bold mb-6 text-sm tracking-widest uppercase text-gray-500">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>123 Fashion St,<br/>28000 Madrid, Spain</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:+34900000000">+34 900 000 000</a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:info@holocrew.com">info@holocrew.com</a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-6 text-sm tracking-widest uppercase text-gray-500">Explore</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-white transition-colors duration-200 block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment & Security */}
          <div>
            <h3 className="font-bold mb-6 text-sm tracking-widest uppercase text-gray-500">Guarantees</h3>
            <ul className="space-y-4">
               <li className="flex items-center gap-3 text-gray-400">
                 <Truck className="w-5 h-5" />
                 <div>
                   <span className="block text-white font-medium">Global Shipping</span>
                   <span className="text-xs">Free on orders over €200</span>
                 </div>
               </li>
               <li className="flex items-center gap-3 text-gray-400">
                 <Shield className="w-5 h-5" />
                 <div>
                   <span className="block text-white font-medium">Secure Payment</span>
                   <span className="text-xs">256-bit SSL Encryption</span>
                 </div>
               </li>
            </ul>
            
            {/* Payment Icons */}
            <div className="mt-6 pt-6 border-t border-gray-800 flex gap-3 text-gray-500">
                <CreditCard className="w-6 h-6" />
                <span className="text-xs border border-gray-700 px-2 py-1 rounded">VISA</span>
                <span className="text-xs border border-gray-700 px-2 py-1 rounded">PAYPAL</span>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold mb-6 text-sm tracking-widest uppercase text-gray-500">Follow Us</h3>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: LEGAL --- */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; {currentYear} HoloCrew. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            {legalLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;