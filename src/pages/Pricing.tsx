import { Button } from '../components/ui/Button';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { Link } from 'react-router-dom';
import { Seo } from '../components/seo/Seo';
import { SITE_URL } from '../lib/siteContent';

export function Pricing() {
  const categories = [
    {
      name: "Home Cleaning",
      items: [
        { service: "Home Cleaning (per room)", basic: "₦3k - ₦5k", premium: "₦5k - ₦8k", elite: "₦10k - ₦15k" },
        { service: "Full Apartment (1-bed)", basic: "₦15,000", premium: "₦25,000", elite: "₦40,000" },
        { service: "Full Apartment (2-bed)", basic: "₦20,000", premium: "₦35,000", elite: "₦55,000" },
        { service: "Full Apartment (3-bed)", basic: "₦25,000", premium: "₦45,000", elite: "₦70,000" },
        { service: "Full House (4-bed+)", basic: "₦35,000", premium: "₦60,000", elite: "₦100,000+" },
      ]
    },
    {
      name: "Commercial & Specialty",
      items: [
        { service: "Office (per sq meter)", basic: "₦500", premium: "₦800", elite: "₦1,200" },
        { service: "Post-Construction (sqm)", basic: "₦800", premium: "₦1,200", elite: "₦2,000" },
        { service: "Hospital Ward", basic: "-", premium: "-", elite: "₦50k - ₦150k" },
        { service: "Roof Cleaning", basic: "₦20,000", premium: "₦40,000", elite: "₦60,000+" },
        { service: "Sofa Cleaning (per seat)", basic: "₦3,000", premium: "₦5,000", elite: "-" },
        { service: "Fumigation (per room)", basic: "₦5,000", premium: "₦8,000", elite: "₦12,000" },
      ]
    }
  ];

  const discounts = [
    { frequency: "Weekly", discount: "25% off per visit" },
    { frequency: "Bi-weekly", discount: "20% off per visit" },
    { frequency: "Monthly", discount: "15% off per visit" },
    { frequency: "Quarterly Contract", discount: "30% off total" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <Seo
        title="Cleaning Service Pricing in Nigeria"
        description="Transparent CleanNaija pricing: home cleaning from ₦3,000/room, apartments from ₦15,000, offices from ₦500/sqm, fumigation, roof and post-construction. Save up to 30% on recurring plans."
        path="/pricing"
        keywords="cleaning prices nigeria, house cleaning cost lagos, office cleaning rates, fumigation price"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: 'Cleaning service',
          name: 'CleanNaija Cleaning Services',
          areaServed: { '@type': 'Country', name: 'Nigeria' },
          provider: { '@type': 'Organization', name: 'CleanNaija', url: SITE_URL },
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'NGN',
            lowPrice: '3000',
            highPrice: '150000',
          },
        }}
      />
      <div className="bg-primary py-24 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-heading font-black uppercase tracking-tighter mb-4 text-accent-gold leading-none">The Price of Perfection</h1>
          <p className="text-white/70 font-bold uppercase tracking-[0.3em] text-[10px]">Nigerian Standards • Transparent Rates • ₦</p>
        </div>
      </div>

      <section className="py-24 container mx-auto px-4 max-w-6xl">
        {/* Tier Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-24">
          {[
            { tier: "BASIC", desc: "Standard shine for regular maintenance", features: ["Vacuum & Mop", "Surface Dusting", "Trash Removal"] },
            { tier: "PREMIUM ⭐", desc: "Deep restoration and clinical sanitization", features: ["Industrial Degreasing", "Inside Cabinets", "Wall Spot Cleaning"], popular: true },
            { tier: "ELITE", desc: "Medical-grade protocol for high-stakes spaces", features: ["NIN-Verified Lead", "HEPA Filtration", "Full Asset Insurance"] }
          ].map((plan, i) => (
            <div key={i} className={cn(
              "p-12 flex flex-col items-center text-center transition-all duration-500",
              plan.popular ? "bg-primary text-white shadow-2xl z-10 scale-105 border-y-8 border-accent-gold" : "bg-white text-secondary-dark border border-gray-100"
            )}>
              <h3 className={cn("text-xs font-black uppercase tracking-[0.4em] mb-6", plan.popular ? "text-accent-gold" : "text-gray-400")}>{plan.tier}</h3>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-10 opacity-70 leading-relaxed">{plan.desc}</p>
              <ul className="space-y-4 mb-12 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center justify-center space-x-2">
                    <CheckCircle2 className={cn("w-3.5 h-3.5", plan.popular ? "text-accent-gold" : "text-primary")} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/book" className="w-full">
                <Button className={cn(
                  "w-full font-black uppercase tracking-widest py-5 rounded-none text-xs transition-all",
                  plan.popular ? "bg-accent-orange text-white hover:bg-white hover:text-primary" : "bg-primary text-white hover:bg-accent-gold"
                )}>Book Mission</Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Detailed Comparison Table */}
        <div className="space-y-16">
          {categories.map((cat) => (
            <div key={cat.name}>
              <h2 className="text-2xl font-black text-primary uppercase tracking-tighter mb-8 border-b-4 border-accent-gold inline-block">{cat.name}</h2>
              <div className="overflow-x-auto shadow-2xl">
                <table className="w-full text-left bg-white border-collapse">
                  <thead>
                    <tr className="bg-secondary/50 border-b-2 border-gray-100">
                      <th className="p-6 text-[10px] font-black text-primary uppercase tracking-widest">Service Item</th>
                      <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Basic</th>
                      <th className="p-6 text-[10px] font-black text-accent-gold uppercase tracking-widest">Premium</th>
                      <th className="p-6 text-[10px] font-black text-primary uppercase tracking-widest text-right">Elite</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {cat.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                        <td className="p-6 text-sm font-bold text-secondary-dark uppercase tracking-tight">{item.service}</td>
                        <td className="p-6 text-xs font-black text-gray-500">{item.basic}</td>
                        <td className="p-6 text-xs font-black text-primary-bright">{item.premium}</td>
                        <td className="p-6 text-sm font-black text-primary text-right">{item.elite}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Subscription Discounts */}
        <div className="mt-32 bg-secondary p-12 rounded-none border-t-8 border-primary">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-md">
              <h2 className="text-3xl font-black text-primary uppercase tracking-tighter mb-4">Subscription Rewards</h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs leading-relaxed">Automate your shine and save significantly with our recurring maintenance plans.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full lg:w-auto">
              {discounts.map((d) => (
                <div key={d.frequency} className="bg-white p-6 text-center shadow-lg border-b-4 border-accent-gold">
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">{d.frequency}</p>
                   <p className="text-xl font-black text-primary leading-tight">{d.discount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-black text-primary uppercase tracking-tighter mb-8">Need a Custom Commercial Quote?</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-10 leading-relaxed">For office buildings, plazas, and large estates, we provide tailored pricing based on square footage and frequency.</p>
          <Link to="/contact">
            <Button className="bg-primary text-white font-black uppercase tracking-widest px-12 py-5 rounded-none shadow-xl">Contact Sales</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
