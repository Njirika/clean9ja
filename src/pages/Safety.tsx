import { ShieldCheck, UserCheck, Navigation, AlertCircle, Phone, Image, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Seo } from '../components/seo/Seo';

export function Safety() {
  const customerFeatures = [
    { icon: UserCheck, title: "NIN-Verified Pros", desc: "Every cleaner's National Identity is verified for absolute security." },
    { icon: Navigation, title: "Real-Time GPS", desc: "Track your deployment team's location from hub to your doorstep." },
    { icon: AlertCircle, title: "In-App Panic Button", desc: "One-tap emergency alert to our rapid response unit." },
    { icon: ShieldCheck, title: "Full Asset Insurance", desc: "Your property is insured against accidental damage during missions." },
    { icon: Image, title: "Before/After Evidence", desc: "Operators must submit photo proof to finalize any mission." },
    { icon: Phone, title: "24/7 Support Line", desc: "Direct access to mission control throughout the cleanup." }
  ];

  const risks = [
    { risk: "Staff Quality", likelihood: "High", mitigation: "Rigorous certification, random quality audits, and weekly performance training." },
    { risk: "Security Incidents", likelihood: "Medium", mitigation: "NIN background checks, bond insurance, and mandatory security deposits for operators." },
    { risk: "Payment Defaults", likelihood: "Medium", mitigation: "Escrow-based upfront payment system via Paystack/Flutterwave." },
    { risk: "Connectivity Issues", likelihood: "High", mitigation: "USSD (*347*CLEAN#) and WhatsApp-first communication for low-internet areas." }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <Seo
        title="Safety & Trust"
        description="How CleanNaija keeps you safe: NIN-verified pros, real-time GPS tracking, in-app panic button, full asset insurance, before/after photo proof and 24/7 support."
        path="/safety"
      />
      <div className="bg-primary py-24 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-heading font-black uppercase tracking-tighter mb-4 text-accent-gold">Trust & Safety</h1>
          <p className="text-white/70 font-bold uppercase tracking-[0.3em] text-[10px]">Zero Compromise • Real-Time Protection • Verified Personnel</p>
        </div>
      </div>

      {/* Customer Features */}
      <section className="py-24 container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-primary uppercase tracking-tighter mb-4">Customer Protection Protocol</h2>
          <div className="w-20 h-1 bg-accent-gold mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {customerFeatures.map((f, i) => (
            <Card key={i} className="p-10 rounded-none border-t-8 border-primary hover:border-accent-orange transition-all group">
              <div className="w-12 h-12 bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors mb-6 shadow-sm">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-3">{f.title}</h3>
              <p className="text-xs text-gray-500 font-bold uppercase leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Risk Assessment Table */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-primary uppercase tracking-tighter mb-4">Operational Risk Management</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Proactive Mitigation Strategies</p>
          </div>
          <div className="overflow-x-auto shadow-2xl">
            <table className="w-full text-left bg-white border-collapse">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest">Identified Risk</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest">Impact</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest">CleanNaija Mitigation Strategy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {risks.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="p-6 text-sm font-black text-primary uppercase tracking-tighter">{r.risk}</td>
                    <td className="p-6">
                       <span className="bg-red-100 text-red-700 px-3 py-1 text-[8px] font-black uppercase tracking-widest">Critical</span>
                    </td>
                    <td className="p-6 text-[11px] font-bold text-gray-500 uppercase leading-relaxed italic">
                      {r.mitigation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Guarantee Banner */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="bg-primary/5 p-16 border-4 border-dashed border-primary relative">
            <CheckCircle2 className="w-20 h-20 text-accent-gold mx-auto mb-8 animate-pulse" />
            <h2 className="text-4xl font-black text-primary uppercase tracking-tighter mb-6">100% Satisfaction or Re-Clean FREE</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs leading-relaxed mb-10">We stand by our professional standards. If our deployment team misses even a spot, we will send a restoration unit within 24 hours at no extra charge.</p>
            <Button className="bg-primary text-white px-12 py-5 rounded-none font-black uppercase tracking-widest shadow-xl">Our Quality Promise</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
