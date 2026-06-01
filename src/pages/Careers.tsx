import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Briefcase, MapPin, DollarSign, CheckCircle2 } from 'lucide-react';
import { Seo } from '../components/seo/Seo';

const JOBS = [
  {
    title: "Professional Cleaner (Lagos Hub)",
    type: "Full-time / Part-time",
    location: "Lagos, Nigeria",
    salary: "₦100k - ₦150k / Mo",
    desc: "Join our elite cleaning squad. We provide training, insurance, and the best tools in the industry."
  },
  {
    title: "Facility Maintenance Lead",
    type: "Full-time",
    location: "Abuja, Nigeria",
    salary: "₦250k - ₦350k / Mo",
    desc: "Oversee large-scale commercial cleaning projects for our top corporate clients in FCT."
  },
  {
    title: "Customer Support Hero",
    type: "Remote / Hybrid",
    location: "Nationwide",
    salary: "₦120k - ₦180k / Mo",
    desc: "Be the voice of CleanNaija. Help our customers have a seamless experience from booking to completion."
  }
];

export function Careers() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <Seo
        title="Careers & Cleaning Jobs in Nigeria"
        description="Join the CleanNaija squad. Cleaning and facility roles in Lagos, Abuja and nationwide with training, insurance and the best tools in the industry."
        path="/careers"
      />
      <div className="bg-secondary py-24 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-heading font-black text-primary uppercase tracking-tighter mb-4">Join The Pro Team</h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs">Help Us Make Nigeria Spotless, One Space At A Time</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {[
            { title: "Great Pay", desc: "We offer competitive salaries and weekly performance bonuses." },
            { title: "Health & Safety", desc: "All our pros are fully insured and provided with top-grade PPE." },
            { title: "Career Growth", desc: "Start as a pro cleaner and rise to hub manager in months." }
          ].map((v, i) => (
            <div key={i} className="flex flex-col items-center text-center p-8 bg-secondary/50 rounded-none border-b-4 border-accent-gold">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-6 shadow-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-primary uppercase tracking-tighter mb-2">{v.title}</h3>
              <p className="text-sm text-gray-500 font-medium">{v.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-heading font-black text-primary uppercase tracking-tighter mb-12 border-b-8 border-accent-gold inline-block">Open Positions</h2>
        
        <div className="space-y-6">
          {JOBS.map((job, i) => (
            <Card key={i} className="p-10 rounded-none border-l-8 border-primary hover:border-accent-orange transition-all shadow-sm hover:shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-primary uppercase tracking-tighter mb-4">{job.title}</h3>
                  <div className="flex flex-wrap gap-6 mb-6">
                    <div className="flex items-center text-xs font-black text-gray-400 uppercase tracking-widest"><Briefcase className="w-4 h-4 mr-2 text-accent-gold" /> {job.type}</div>
                    <div className="flex items-center text-xs font-black text-gray-400 uppercase tracking-widest"><MapPin className="w-4 h-4 mr-2 text-accent-gold" /> {job.location}</div>
                    <div className="flex items-center text-xs font-black text-gray-400 uppercase tracking-widest"><DollarSign className="w-4 h-4 mr-2 text-accent-gold" /> {job.salary}</div>
                  </div>
                  <p className="text-gray-500 font-medium leading-relaxed">{job.desc}</p>
                </div>
                <Button className="bg-primary text-white font-black uppercase tracking-widest px-10 py-5 rounded-none shadow-xl hover:bg-accent-orange">Apply Now</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
