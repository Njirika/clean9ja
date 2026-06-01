import { Button } from '../components/ui/Button';
import { ShieldCheck, Target, Heart, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BlogSection } from '../components/home/BlogSection';
import { FAQ } from '../components/home/FAQ';
import { Seo } from '../components/seo/Seo';

export function About() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="About Clean9ja & Our Service Areas"
        description="Clean9ja is Nigeria's #1 digital platform for professional cleaning, serving all 36 states and the FCT with NIN-verified, insured teams and a 100% satisfaction guarantee."
        path="/about"
      />
      {/* Hero */}
      <section className="bg-primary py-32 text-white overflow-hidden relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-heading font-black uppercase tracking-tighter mb-8 leading-none">
            We Are <br /> <span className="text-accent-gold italic">Clean9ja.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl font-bold uppercase tracking-[0.2em] text-white/70">
            Nigeria's #1 digital platform for professional cleaning services.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
      </section>

      {/* Mission */}
      <section className="py-24 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Our Mission</h2>
              <p className="text-lg text-gray-500 font-medium leading-relaxed italic">
                "To make world-class cleaning services accessible, transparent, and reliable for every Nigerian home and business, while creating thousands of dignified jobs for local professionals."
              </p>
              <div className="grid grid-cols-2 gap-8 pt-8">
                {[
                  { icon: ShieldCheck, label: "Trust First" },
                  { icon: Target, label: "Precision Work" },
                  { icon: Heart, label: "Care for Space" },
                  { icon: Award, label: "Gold Standard" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <item.icon className="w-8 h-8 text-accent-gold" />
                    <span className="font-black text-primary uppercase tracking-widest text-[11px]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-secondary p-4 rounded-none border-r-8 border-b-8 border-accent-gold shadow-2xl overflow-hidden aspect-video">
                <img src="/images/service-home.jpg" alt="About Clean9ja" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="py-32 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-black text-primary uppercase tracking-tighter mb-4">Work With Us & Learn</h2>
            <div className="w-24 h-1.5 bg-accent-gold mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="bg-white p-12 shadow-2xl border-t-8 border-primary relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <h3 className="text-3xl font-black text-primary uppercase tracking-tighter mb-6 relative z-10">Industry <br/><span className="text-accent-gold">Insights</span></h3>
              <p className="text-gray-500 font-medium mb-10 leading-relaxed relative z-10">Get the latest cleaning tips, maintenance hacks, and industry news from our team of elite professionals.</p>
              <Link to="/blog" className="relative z-10">
                <Button className="bg-primary text-white font-black uppercase tracking-widest px-10 py-5 rounded-none shadow-xl hover:bg-accent-gold hover:text-primary transition-all">Visit Our Blog</Button>
              </Link>
            </div>
            <div className="bg-white p-12 shadow-2xl border-t-8 border-accent-orange relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-orange/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <h3 className="text-3xl font-black text-primary uppercase tracking-tighter mb-6 relative z-10">Join Our <br/><span className="text-accent-orange">Pro Squad</span></h3>
              <p className="text-gray-500 font-medium mb-10 leading-relaxed relative z-10">Want to become a Clean9ja Pro? We are always looking for dedicated, verified, and high-performing talent.</p>
              <Link to="/careers" className="relative z-10">
                <Button className="bg-accent-orange text-white font-black uppercase tracking-widest px-10 py-5 rounded-none shadow-[0_20px_50px_rgba(255,87,34,0.3)] hover:bg-primary transition-all">Recruitment</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <BlogSection />
      <FAQ />
    </div>
  );
}
