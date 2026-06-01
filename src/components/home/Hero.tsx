import { Button } from '../ui/Button';
import { BeforeAfterSlider } from '../ui/BeforeAfterSlider';
import { Star, ShieldCheck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';

export function Hero() {
  const { location } = useUser();

  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-white font-sans">
      {/* Visual Impact: Background Image */}
      <div className="absolute inset-0 z-0">
        <img src="/images/hero-bg.jpg" alt="Premium Nigerian Interior" className="w-full h-full object-cover opacity-[0.12]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white to-white"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent lg:block hidden"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div 
            className="flex-1 text-center lg:text-left z-10"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {location && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center space-x-2 bg-primary/5 text-primary px-4 py-2 rounded-full font-black text-[9px] mb-8 border border-primary/10 shadow-sm"
              >
                <MapPin className="w-3 h-3 text-accent-gold" />
                <span>Now Serving {location.town}, {location.city}</span>
              </motion.div>
            )}
            
            <h1 className="text-5xl md:text-7xl lg:text-[100px] font-heading font-black text-primary tracking-tighter leading-[0.85] mb-6">
              Expert <br />
              <span className="text-primary-bright">Cleaning</span> <br />
              {location?.city ? `in ${location.city}` : "Across Nigeria"}
            </h1>
            
            <p className="text-xl font-bold text-secondary-dark/60 mb-10 max-w-xl mx-auto lg:mx-0">
              Spotless. Guaranteed. <br />
              <span className="text-accent-gold italic">Your Space, Our Pride.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-16 w-full sm:w-auto">
              <Link to="/book" className="w-full sm:w-auto">
                <Button className="w-full bg-accent-orange text-white font-black text-[10px] px-8 py-4 rounded-none shadow-xl hover:bg-white hover:text-accent-orange transition-all duration-300">
                  Get Free Quote
                </Button>
              </Link>
              <Link to="/cleaner" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full font-black text-[10px] px-8 py-4 rounded-none shadow-xl hover:bg-primary hover:text-white transition-all duration-300">
                  Find cleaning jobs
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-12">
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex text-accent-gold mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <span className="text-[11px] font-black text-primary">100% Satisfaction Guarantee</span>
              </div>
              <div className="w-px h-12 bg-gray-100 hidden sm:block"></div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-3xl font-black text-primary tracking-tighter">36 + FCT</span>
                <span className="text-[10px] font-black text-gray-400">States Covered</span>
              </div>
              <div className="w-px h-12 bg-gray-100 hidden sm:block"></div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-3xl font-black text-primary tracking-tighter">NIN</span>
                <span className="text-[10px] font-black text-gray-400">Verified Pros</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="flex-1 w-full relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full -z-10 animate-pulse"></div>
            <BeforeAfterSlider 
              beforeImage="/images/hero-before.jpg"
              afterImage="/images/hero-after.jpg"
            />
            {/* Guarantee Badge Overlay */}
            <div className="absolute -bottom-10 -right-6 lg:-right-10 w-40 h-40 bg-primary rounded-full border-8 border-white flex flex-col items-center justify-center text-center shadow-2xl transform rotate-12 z-20">
              <ShieldCheck className="w-10 h-10 text-accent-gold mb-1" />
              <span className="text-[10px] font-black text-white leading-none px-4">100% Satisfaction Guarantee</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
