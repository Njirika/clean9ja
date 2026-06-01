import { ShieldCheck, MapPin, CheckCircle2, Clock, Star, ArrowRight } from 'lucide-react';
import { Hero } from '../components/home/Hero';
import { Services } from '../components/home/Services';
import { HowItWorks } from '../components/home/HowItWorks';
import { Testimonials } from '../components/home/Testimonials';
import { FAQ } from '../components/home/FAQ';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';
import { Link } from 'react-router-dom';
import { BeforeAfterSlider } from '../components/ui/BeforeAfterSlider';
import { Seo } from '../components/seo/Seo';
import { SERVICES, SITE_URL } from '../lib/siteContent';

import { motion } from 'framer-motion';

export function Home() {
  return (
    <motion.main
      className="font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Seo
        title="Professional Cleaning Services in Nigeria | Clean9ja"
        description="Book trusted home, office, post-construction, hospital and specialty cleaning across all 36 states and the FCT. NIN-verified, insured teams. Instant quotes. Spotless. Guaranteed. Nationwide."
        path="/"
        keywords="cleaning services nigeria, cleaners lagos, office cleaning abuja, fumigation, post construction cleaning, roof cleaning"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Clean9ja Cleaning Services',
          itemListElement: SERVICES.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: s.title,
            url: `${SITE_URL}/services/${s.slug}`,
          })),
        }}
      />
      <Hero />
      
      {/* Trust Bar (PRD) */}
      <section className="bg-primary py-8 border-y-4 border-accent-gold">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: CheckCircle2, label: "Background Checked Staff" },
              { icon: ShieldCheck, label: "Fully Insured" },
              { icon: Clock, label: "Same Day Available" },
              { icon: Star, label: "100% Guarantee" }
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-4 justify-center">
                <item.icon className="w-6 h-6 text-accent-gold shrink-0" />
                <span className="text-white font-black uppercase tracking-widest text-[10px] leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Services />
      <HowItWorks />

      {/* Why Choose Clean9ja (Detailed PRD) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-black text-primary uppercase tracking-tighter mb-4">
              Why Choose Clean9ja
            </h2>
            <div className="w-24 h-1.5 bg-accent-gold mx-auto"></div>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-6">
            {[
              "Verified & Background-Checked Cleaners",
              "Real-Time Tracking",
              "Transparent Pricing - No Hidden Charges",
              "Fully Insured - Your Property Is Protected",
              "100% Satisfaction Guarantee or We Re-Clean FREE",
              "Available in 36 States + FCT",
              "24/7 Customer Support",
              "Eco-Friendly Cleaning Products"
            ].map((feature, i) => (
              <div key={i} className="flex items-center space-x-4 py-4 border-b border-gray-50 group hover:border-accent-gold transition-colors">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shrink-0 shadow-lg group-hover:bg-accent-gold transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="font-black text-primary uppercase tracking-widest text-[11px] leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas Map (PRD) */}
      <section className="py-24 bg-secondary font-sans overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-black text-primary uppercase tracking-tighter mb-4">
              Service Areas
            </h2>
            <div className="w-24 h-1.5 bg-accent-gold mx-auto mb-4"></div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Click on your state to check availability</p>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 bg-white p-8 rounded-none shadow-2xl border-4 border-primary min-h-[500px] w-full flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-primary opacity-5 group-hover:opacity-10 transition-opacity"></div>
               <div className="relative z-10 text-center">
                 <MapPin className="w-32 h-32 text-accent-gold mx-auto mb-6 animate-bounce" />
                 <h3 className="text-2xl font-black text-primary uppercase tracking-tighter mb-4">Interactive Nigeria Map</h3>
                 <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Serving 36 States + FCT</p>
               </div>
               {/* City badges floating */}
               <div className="absolute top-10 left-10 bg-primary text-white p-2 text-[10px] font-black uppercase animate-pulse">Lagos</div>
               <div className="absolute top-20 right-20 bg-primary text-white p-2 text-[10px] font-black uppercase animate-pulse delay-75">Abuja</div>
               <div className="absolute bottom-10 left-20 bg-primary text-white p-2 text-[10px] font-black uppercase animate-pulse delay-150">PH City</div>
            </div>
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                {['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Enugu', 'Benin City', 'Kaduna', 'Warri', 'Owerri', 'Calabar', '+ 25 more'].map(city => (
                  <div key={city} className="flex items-center space-x-3 group cursor-pointer">
                    <div className="w-2 h-2 bg-accent-gold rounded-full group-hover:scale-150 transition-transform"></div>
                    <span className="font-black text-primary uppercase tracking-widest text-[11px] group-hover:text-accent-gold transition-colors">{city}</span>
                  </div>
                ))}
              </div>
              <div className="bg-primary p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="font-black uppercase tracking-tighter text-xl mb-4">Find cleaner near you</h4>
                  <div className="flex bg-white p-1">
                    <input type="text" placeholder="Enter your area..." className="flex-1 px-4 py-3 text-secondary-dark font-bold text-xs uppercase focus:outline-none" />
                    <Link to="/book">
                      <Button className="bg-accent-gold text-primary font-black uppercase tracking-widest px-6 py-3 rounded-none">Start</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before & After Gallery (PRD) */}
      <section className="py-24 bg-white font-sans overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-black text-primary uppercase tracking-tighter mb-4">
              Proven Results
            </h2>
            <div className="w-24 h-1.5 bg-accent-gold mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Kitchen Restoration", before: "/images/hero-before.jpg", after: "/images/hero-after.jpg" },
              { title: "Corporate Lobby", before: "/images/service-office.jpg", after: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800" },
              { title: "Roof Washing", before: "/images/service-roof.jpg", after: "https://images.unsplash.com/photo-1635839352932-d17e5a6b0b2e?auto=format&fit=crop&q=80&w=800" },
              { title: "Medical Facility", before: "/images/service-hospital.jpg", after: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800" }
            ].map((item, i) => (
              <div key={i} className="space-y-4 group">
                <div className="relative aspect-[4/5] overflow-hidden border-b-4 border-transparent group-hover:border-accent-gold transition-all">
                  <BeforeAfterSlider beforeImage={item.before} afterImage={item.after} />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-primary uppercase tracking-tighter">{item.title}</h3>
                  <ArrowRight className="w-5 h-5 text-accent-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Pricing Preview (PRD Specification) */}
      <section className="py-24 bg-secondary font-sans">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-black text-primary uppercase tracking-tighter mb-4">
              Pricing
            </h2>
            <div className="w-20 h-1.5 bg-accent-gold mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              { tier: "BASIC", price: "₦15,000", features: ["Standard Cleaning", "2-3 Hours", "1 Room+"] },
              { tier: "PREMIUM ⭐", price: "₦35,000", features: ["Deep Cleaning", "4-6 Hours", "All Rooms", "Full Equipment"], popular: true },
              { tier: "ELITE", price: "Custom Quote", features: ["Medical-Grade", "Certified Team", "Full Insurance", "Dedicated Lead"] }
            ].map((plan, i) => (
              <div key={i} className={cn(
                "p-12 flex flex-col items-center text-center transition-all duration-500",
                plan.popular ? "bg-primary text-white shadow-[0_30px_60px_rgba(0,0,0,0.2)] z-10 scale-105 border-y-8 border-accent-gold" : "bg-white text-secondary-dark border border-gray-100"
              )}>
                <h3 className={cn("text-xs font-black uppercase tracking-[0.4em] mb-10", plan.popular ? "text-accent-gold" : "text-gray-400")}>{plan.tier}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60 font-accent">From</p>
                <div className="text-5xl font-black tracking-tighter mb-10 font-heading">{plan.price}</div>
                <ul className="space-y-6 mb-12 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center justify-center space-x-2">
                      <CheckCircle2 className={cn("w-4 h-4", plan.popular ? "text-accent-gold" : "text-primary")} />
                      <span className="text-[11px] font-black uppercase tracking-widest">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/book" className="w-full">
                  <Button className={cn(
                    "w-full font-black uppercase tracking-widest py-5 rounded-none text-xs transition-all",
                    plan.popular ? "bg-accent-gold text-primary hover:bg-white" : "bg-primary text-white hover:bg-accent-gold"
                  )}>Book Now</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ />

      {/* CTA BANNER (PRD Specification) */}
      <section className="py-24 bg-white font-sans px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-primary py-16 px-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            
            <div className="relative z-10 text-center lg:text-left">
              <div className="inline-flex items-center text-accent-gold font-black text-xs uppercase tracking-[0.3em] mb-6">
                Ready for a Spotless Space?
              </div>
              <h2 className="text-4xl md:text-6xl font-heading font-black text-white uppercase tracking-tighter leading-none mb-4">
                WE CLEAN AM <br />
                <span className="text-accent-gold italic">PROPER!</span>
              </h2>
            </div>

            <div className="relative z-10 flex flex-col items-center lg:items-end gap-6 w-full lg:w-auto">
              <Link to="/book" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-accent-orange text-white font-black uppercase tracking-[0.2em] px-12 py-6 text-lg rounded-none shadow-2xl hover:bg-white hover:text-accent-orange transition-all transform hover:-translate-y-1">
                  Book Your Cleaning Now
                </Button>
              </Link>
              <div className="flex flex-col items-center lg:items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Or Call Nationwide</span>
                <a href="tel:0800-CLEAN-9JA" className="text-3xl font-black text-white hover:text-accent-gold transition-colors">0800-CLEAN-9JA</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
