import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { api } from '../lib/api';
import { 
  CheckCircle2,
  Calendar,
  CreditCard,
  Sparkles,
  Calculator,
  Plus, 
  Trash2,
  Building2,
  HardHat,
  ShieldCheck,
  Waves,
  Brush,
  Home,
  Briefcase,
  Droplets,
  Stethoscope,
  Hotel,
  Landmark,
  Bug,
  Sofa,
  Bed,
  WashingMachine,
  ChevronDown,
  ChevronUp,
  Wind,
  Layers,
  Container,
  Activity,
  UserCheck
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useUser } from '../context/UserContext';
import { Seo } from '../components/seo/Seo';
import { payWithPaystack, PaymentGateways } from '../lib/integrations';

// Predictable jobs are priced instantly and paid online. Jobs that genuinely
// need a site assessment (office, post-construction, medical) are submitted as
// a quote request — our team confirms a final price and sends a payment link.
const PAY_STEPS = ['Location', 'Services', 'Quote', 'Schedule', 'Pay', 'Done'];
const QUOTE_STEPS = ['Location', 'Services', 'Estimate', 'Schedule', 'Request', 'Done'];
const QUOTE_ONLY_CATEGORIES = new Set<string>(['office', 'construction', 'medical']);

interface ServiceOption {
  name: string;
  icon: any;
  base: number;
  category: 'home' | 'office' | 'construction' | 'medical' | 'roof' | 'specialty';
}

const SERVICE_CATEGORIES = [
  { id: 'home', name: 'Home Cleaning', icon: Home },
  { id: 'office', name: 'Office & Commercial', icon: Building2 },
  { id: 'construction', name: 'Post-Construction', icon: HardHat },
  { id: 'medical', name: 'Medical & Hospital', icon: Stethoscope },
  { id: 'roof', name: 'Roof & Exterior', icon: Waves },
  { id: 'specialty', name: 'Specialty Services', icon: Sparkles }
];

const SERVICE_OPTIONS: ServiceOption[] = [
  // Home Cleaning
  { name: 'Standard Home Shine', icon: Home, base: 15000, category: 'home' },
  { name: 'Deep Restoration Clean', icon: Sparkles, base: 35000, category: 'home' },
  { name: 'Move-in / Move-out Cleaning', icon: Layers, base: 40000, category: 'home' },
  { name: 'Post-Party / Event Cleaning', icon: Waves, base: 30000, category: 'home' },
  { name: 'Kitchen & Bathroom Deep Clean', icon: Droplets, base: 25000, category: 'home' },
  { name: 'Laundry Services', icon: WashingMachine, base: 10000, category: 'home' },
  { name: 'Dry Cleaning', icon: Wind, base: 15000, category: 'home' },

  // Office & Commercial
  { name: 'Daily Office Cleaning', icon: Briefcase, base: 50000, category: 'office' },
  { name: 'Carpet & Upholstery Cleaning', icon: Sofa, base: 30000, category: 'office' },
  { name: 'Window Cleaning (Interior/Exterior)', icon: Droplets, base: 20000, category: 'office' },
  { name: 'Floor Stripping & Waxing', icon: Layers, base: 45000, category: 'office' },
  { name: 'Janitorial Services', icon: UserCheck, base: 60000, category: 'office' },

  // Post-Construction
  { name: 'Rough Clean (Phase 1)', icon: HardHat, base: 100000, category: 'construction' },
  { name: 'Detail Clean (Phase 2)', icon: HardHat, base: 150000, category: 'construction' },
  { name: 'Final Touch Clean (Phase 3)', icon: Sparkles, base: 80000, category: 'construction' },
  { name: 'Debris Removal', icon: Container, base: 50000, category: 'construction' },

  // Medical & Hospital
  { name: 'Ward Cleaning', icon: Hotel, base: 50000, category: 'medical' },
  { name: 'Operating Theatre Sanitization', icon: Activity, base: 150000, category: 'medical' },
  { name: 'Waiting Area Maintenance', icon: Landmark, base: 40000, category: 'medical' },
  { name: 'Biohazard Cleaning', icon: ShieldCheck, base: 200000, category: 'medical' },
  { name: 'Infection Control Cleaning', icon: Bug, base: 100000, category: 'medical' },

  // Roof & Exterior
  { name: 'Roof & Parapet Washing', icon: Waves, base: 40000, category: 'roof' },
  { name: 'Gutter De-clogging', icon: Brush, base: 12000, category: 'roof' },
  { name: 'Pressure Washing (Driveways/Walls)', icon: Waves, base: 25000, category: 'roof' },
  { name: 'Fence & Gate Cleaning', icon: ShieldCheck, base: 15000, category: 'roof' },
  { name: 'Water Tank Cleaning', icon: Droplets, base: 20000, category: 'roof' },

  // Specialty Services
  { name: 'Professional Fumigation', icon: Bug, base: 25000, category: 'specialty' },
  { name: 'Sofa restoration', icon: Sofa, base: 15000, category: 'specialty' },
  { name: 'Mattress Detail', icon: Bed, base: 12000, category: 'specialty' },
  { name: 'AC Duct Cleaning', icon: Wind, base: 20000, category: 'specialty' },
];

interface LocationBooking {
  id: string;
  address: string;
  city: string;
  state: string;
  services: string[];
  rooms: string;
}

export function Booking() {
  const { currentUser } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [locations, setLocations] = useState<LocationBooking[]>([
    { id: '1', address: '', city: '', state: '', services: [], rooms: '1' }
  ]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, Record<string, boolean>>>({});
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  // Any assessment-only service in the basket turns the whole booking into a
  // quote request (we can't honestly auto-charge for jobs that need a survey).
  const requiresQuote = locations.some(loc =>
    loc.services.some(s => {
      const opt = SERVICE_OPTIONS.find(o => o.name === s);
      return opt ? QUOTE_ONLY_CATEGORIES.has(opt.category) : false;
    })
  );
  const steps = requiresQuote ? QUOTE_STEPS : PAY_STEPS;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleConfirm = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      // Pay-now path: open Paystack first when it's configured. If the customer
      // closes the popup without paying, stop here. (Server-side verification of
      // the reference is still required before the booking is truly "paid".)
      if (!requiresQuote && PaymentGateways.paystack.publicKey) {
        const email = currentUser?.email;
        if (!email) {
          setSubmitError('Please log in so we can process your payment.');
          setSubmitting(false);
          return;
        }
        const reference = await payWithPaystack({ email, amountNaira: calculateTotal() });
        if (!reference) {
          setSubmitError('Payment was not completed. You can try again.');
          setSubmitting(false);
          return;
        }
      }

      // Create a booking for the first selected service on the first location
      // (multi-location bookings map to multiple API calls)
      const firstLoc = locations[0];
      const firstServiceName = firstLoc?.services[0];
      const option = SERVICE_OPTIONS.find(o => o.name === firstServiceName);

      const result = await api.bookings.create({
        serviceId: option?.name || firstServiceName || 'custom',
        scheduledDate: date,
        scheduledTimeSlot: time,
        quotedPrice: calculateTotal(),
        requiresQuote,
        specialInstructions: locations.map((l, i) =>
          `Location ${i + 1}: ${l.address}, ${l.city}, ${l.state} — Services: ${l.services.join(', ')}`
        ).join(' | '),
        numberOfRooms: parseInt(firstLoc?.rooms || '1'),
        address: {
          streetAddress: firstLoc?.address || 'Site Address',
          city: firstLoc?.city || 'Lagos',
          state: firstLoc?.state || 'Lagos',
        }
      });

      setBookingRef(result?.bookingReference || null);
      nextStep();
    } catch (err: any) {
      setSubmitError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const addLocation = () => {
    setLocations([...locations, { 
      id: Math.random().toString(36).substr(2, 9), 
      address: '', city: '', state: '', services: [], rooms: '1' 
    }]);
  };

  const removeLocation = (id: string) => {
    if (locations.length > 1) {
      setLocations(locations.filter(l => l.id !== id));
    }
  };

  const updateLocation = (id: string, data: Partial<LocationBooking>) => {
    setLocations(locations.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const toggleCategory = (locId: string, catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [locId]: {
        ...(prev[locId] || {}),
        [catId]: !(prev[locId]?.[catId])
      }
    }));
  };

  const toggleService = (locId: string, serviceName: string) => {
    const loc = locations.find(l => l.id === locId);
    if (!loc) return;
    const newServices = loc.services.includes(serviceName)
      ? loc.services.filter(s => s !== serviceName)
      : [...loc.services, serviceName];
    updateLocation(locId, { services: newServices });
  };

  const hasHomeService = (loc: LocationBooking) => {
    return loc.services.some(sName => {
      const opt = SERVICE_OPTIONS.find(o => o.name === sName);
      return opt?.category === 'home';
    });
  };

  const calculateTotal = () => {
    return locations.reduce((acc, loc) => {
      const locTotal = loc.services.reduce((sAcc, sName) => {
        const option = SERVICE_OPTIONS.find(o => o.name === sName);
        const base = option ? option.base : 0;
        const multiplier = option?.category === 'home' ? parseInt(loc.rooms || '1') * 5000 : 0;
        return sAcc + base + multiplier;
      }, 0);
      return acc + locTotal;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
      <Seo
        title="Book a Cleaning Service Online"
        description="Book professional cleaning in about 60 seconds. Add your locations, pick services, get an instant quote and schedule a NIN-verified Clean9ja team anywhere in Nigeria."
        path="/book"
      />
      <div className="bg-white border-b border-gray-100 sticky top-20 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center flex-1 relative">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-all duration-300",
                  currentStep === index ? "bg-accent-orange text-white shadow-lg" : 
                  currentStep > index ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                )}>
                  {currentStep > index ? <CheckCircle2 className="w-6 h-6" /> : index + 1}
                </div>
                <span className={cn(
                  "text-[10px] font-black hidden md:block text-center",
                  currentStep === index ? "text-primary" : "text-gray-400"
                )}>
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div className="absolute top-5 -right-1/2 w-full h-[2px] bg-gray-100 -z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 max-w-4xl">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {currentStep === 0 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-black text-primary tracking-tighter">Where do you need cleaning?</h2>
                <p className="text-gray-500 mt-2 font-medium text-sm">Add one or more locations for your service.</p>
              </div>
              
              <div className="space-y-6">
                {locations.map((loc, idx) => (
                  <Card key={loc.id} className="p-10 rounded-none border-t-8 border-accent-gold relative group">
                    {locations.length > 1 && (
                      <button onClick={() => removeLocation(loc.id)} className="absolute top-4 right-4 text-gray-200 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                    )}
                    <h3 className="text-[10px] font-black text-primary mb-8">Location #{idx + 1}</h3>
                    <div className="space-y-8">
                      <Input label="Street Address" placeholder="Enter street address" value={loc.address} onChange={e => updateLocation(loc.id, { address: e.target.value })} />
                      <div className="grid grid-cols-2 gap-6">
                        <Input label="City" placeholder="e.g. Lekki" value={loc.city} onChange={e => updateLocation(loc.id, { city: e.target.value })} />
                        <Input label="State" placeholder="e.g. Lagos" value={loc.state} onChange={e => updateLocation(loc.id, { state: e.target.value })} />
                      </div>
                    </div>
                  </Card>
                ))}
                
                <Button variant="outline" onClick={addLocation} className="w-full py-8 border-dashed border-4 border-gray-100 hover:border-primary text-gray-300 hover:text-primary transition-all rounded-none font-black text-xs">
                  <Plus className="w-5 h-5 mr-3" /> Add another location
                </Button>

                <div className="flex pt-10">
                  <Button onClick={nextStep} disabled={locations.some(l => !l.address || !l.city)} className="flex-1 bg-primary rounded-none shadow-[0_20px_50px_rgba(27,94,32,0.3)] py-8 text-xl font-black ">
                    Continue to services
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-black text-primary tracking-tighter">Choose your services</h2>
                <p className="text-gray-500 mt-2 font-medium text-sm">Pick the services you need at each location.</p>
              </div>

              {locations.map((loc, idx) => (
                <div key={loc.id} className="space-y-6 bg-white p-12 border-l-8 border-accent-gold shadow-2xl">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary text-white w-12 h-12 flex items-center justify-center font-black text-xl italic">{idx + 1}</div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 ">Location</p>
                        <h3 className="font-black text-primary text-sm">{loc.address || 'Address pending'}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {SERVICE_CATEGORIES.map(cat => (
                      <div key={cat.id} className="border border-gray-100 overflow-hidden bg-white">
                        <button onClick={() => toggleCategory(loc.id, cat.id)} className="w-full flex items-center justify-between p-6 bg-secondary/20 hover:bg-secondary transition-colors group">
                          <div className="flex items-center space-x-6">
                            <cat.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                            <span className="font-black text-xs">{cat.name}</span>
                            <span className="bg-primary text-white text-[9px] px-3 py-1 font-black ">
                              {loc.services.filter(s => SERVICE_OPTIONS.find(o => o.name === s)?.category === cat.id).length} selected
                            </span>
                          </div>
                          {expandedCategories[loc.id]?.[cat.id] ? <ChevronUp className="w-4 h-4 text-accent-gold" /> : <ChevronDown className="w-4 h-4 text-gray-300" />}
                        </button>

                        {expandedCategories[loc.id]?.[cat.id] && (
                          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                            {SERVICE_OPTIONS.filter(o => o.category === cat.id).map(opt => (
                              <button
                                key={opt.name}
                                onClick={() => toggleService(loc.id, opt.name)}
                                className={cn(
                                  "p-6 border-2 text-left transition-all flex items-center justify-between group rounded-none",
                                  loc.services.includes(opt.name) 
                                    ? "bg-primary border-primary text-white shadow-xl scale-[1.02]" 
                                    : "bg-white border-gray-50 hover:border-accent-orange text-primary shadow-sm"
                                )}
                              >
                                <div className="flex items-center space-x-4">
                                  <div className={cn(
                                    "p-3 transition-colors",
                                    loc.services.includes(opt.name) ? "bg-white/10" : "bg-secondary"
                                  )}>
                                    <opt.icon className="w-5 h-5" />
                                  </div>
                                  <span className="font-black text-[10px] leading-tight">{opt.name}</span>
                                </div>
                                {loc.services.includes(opt.name) && <CheckCircle2 className="w-5 h-5 text-accent-gold" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {hasHomeService(loc) && (
                    <div className="max-w-xs pt-10 animate-in fade-in zoom-in-95 duration-500">
                       <label className="block text-[10px] font-black text-primary mb-4">Approx. Number of Rooms</label>
                       <div className="flex items-center space-x-4">
                          <input 
                            type="number" 
                            min="1" 
                            value={loc.rooms} 
                            onChange={e => updateLocation(loc.id, { rooms: e.target.value })}
                            className="w-24 p-4 border-2 border-primary focus:outline-none font-black text-xl text-primary"
                          />
                          <p className="text-[9px] text-gray-400 font-bold leading-relaxed max-w-[150px]">Home pricing is calculated per room for precision.</p>
                       </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex pt-10">
                <Button variant="outline" onClick={prevStep} className="mr-6 px-10 py-6 border-2 rounded-none font-black text-xs ">Back</Button>
                <Button onClick={nextStep} disabled={locations.some(l => l.services.length === 0)} className="flex-1 bg-primary rounded-none shadow-2xl py-6 text-xl font-black ">
                  See my quote
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <Card className="p-12 rounded-none border-t-8 border-accent-gold shadow-2xl bg-white">
              <div className="flex items-center space-x-4 mb-12">
                <div className="p-4 bg-primary/10 text-primary rounded-full"><Calculator className="w-8 h-8" /></div>
                <h2 className="text-3xl font-black text-primary tracking-tighter">{requiresQuote ? 'Your estimate' : 'Your quote'}</h2>
              </div>
              <div className="space-y-12">
                <div className="divide-y-2 divide-gray-50">
                  {locations.map((loc, idx) => (
                    <div key={loc.id} className="py-8 first:pt-0">
                      <h4 className="font-black text-primary text-[10px] mb-6 flex items-center">
                        <div className="w-3 h-3 mr-2 text-accent-gold"><Plus className="w-full h-full" /></div> Location {idx + 1}: {loc.address}
                      </h4>
                      <div className="space-y-4">
                        {loc.services.map(s => {
                          const option = SERVICE_OPTIONS.find(o => o.name === s);
                          const multiplier = option?.category === 'home' ? parseInt(loc.rooms) * 5000 : 0;
                          const lineTotal = (option?.base || 0) + multiplier;
                          return (
                            <div key={s} className="flex justify-between items-end border-b border-dashed border-gray-100 pb-2">
                              <div>
                                <p className="text-gray-600 font-black text-xs tracking-tighter">{s}</p>
                                {option?.category === 'home' && (
                                  <p className="text-[9px] text-gray-400 font-bold ">Includes {loc.rooms} Rooms Detailing</p>
                                )}
                              </div>
                              <span className="font-black text-primary text-lg">₦{lineTotal.toLocaleString()}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-12 bg-primary text-white text-center border-b-[16px] border-accent-gold shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                  <p className="text-accent-gold font-black text-[10px] mb-4">Estimated total</p>
                  <div className="text-7xl font-black tracking-tighter mb-4 font-heading leading-none font-black ">
                    ₦{calculateTotal().toLocaleString()}
                  </div>
                  <p className="text-xs text-white/40 font-bold italic">All-inclusive — no hidden fees.</p>
                </div>

                {requiresQuote && (
                  <div className="p-6 bg-accent-blue/10 border-l-4 border-accent-blue text-sm text-secondary-dark leading-relaxed">
                    This is an estimate for planning. Your selection includes a service that needs a quick site assessment, so we'll confirm a final price before any payment — no card needed today.
                  </div>
                )}

                <div className="flex pt-10">
                  <Button variant="outline" onClick={prevStep} className="mr-6 px-10 py-6 border-2 rounded-none font-black text-xs ">Back</Button>
                  <Button onClick={nextStep} className="flex-1 bg-accent-orange rounded-none shadow-2xl py-6 text-xl font-black transition-all hover:bg-primary">
                    Choose a date & time
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="p-12 rounded-none border-t-8 border-accent-gold shadow-2xl bg-white">
              <div className="flex items-center space-x-4 mb-12">
                <div className="p-4 bg-primary/10 text-primary rounded-full"><Calendar className="w-8 h-8" /></div>
                <h2 className="text-3xl font-black text-primary tracking-tighter">Pick a date & time</h2>
              </div>
              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-primary ">Preferred date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-6 border-4 border-secondary font-black text-xl text-primary focus:outline-accent-gold " />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {['Morning (8AM-12PM)', 'Afternoon (12PM-4PM)', 'Evening (4PM-8PM)'].map(t => (
                    <button key={t} onClick={() => setTime(t)} className={cn("p-8 border-4 transition-all text-[10px] font-black leading-relaxed", time === t ? "border-accent-orange bg-accent-orange text-white shadow-2xl" : "border-gray-50 bg-white text-gray-300 hover:border-primary")}>
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex pt-10">
                  <Button variant="outline" onClick={prevStep} className="mr-6 px-10 py-6 border-2 rounded-none font-black text-xs ">Back</Button>
                  <Button onClick={nextStep} disabled={!date || !time} className="flex-1 bg-primary rounded-none shadow-2xl py-6 text-xl font-black disabled:opacity-50">
                    {requiresQuote ? 'Continue' : 'Continue to payment'}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {currentStep === 4 && (
            <Card className="p-12 rounded-none border-t-8 border-accent-gold shadow-2xl bg-white">
              <div className="flex items-center space-x-4 mb-12">
                <div className="p-4 bg-primary/10 text-primary rounded-full"><CreditCard className="w-8 h-8" /></div>
                <h2 className="text-3xl font-black text-primary tracking-tighter">{requiresQuote ? 'Review & request quote' : 'Confirm & pay'}</h2>
              </div>
              <div className="space-y-10">
                <div className="bg-secondary p-12 rounded-none border-l-[12px] border-primary space-y-10 shadow-inner">
                  {locations.map((loc, idx) => (
                    <div key={loc.id} className="space-y-4">
                      <p className="font-black text-primary text-xs ">Location {idx+1}: {loc.address}</p>
                      <div className="flex flex-wrap gap-3">
                        {loc.services.map(s => (
                          <span key={s} className="bg-white px-4 py-2 text-[10px] font-black border-2 border-gray-100 shadow-sm">{s}</span>
                        ))}
                      </div>
                      {hasHomeService(loc) && (
                        <p className="text-[10px] text-gray-400 font-bold italic">Full Detailing for {loc.rooms} Rooms</p>
                      )}
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-10 border-t-2 border-white">
                    <span className="text-primary font-black text-sm ">{requiresQuote ? 'Estimated total' : 'Total'}</span>
                    <span className="text-5xl font-black text-primary tracking-tighter">₦{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>

                {!requiresQuote && (
                  <div className="space-y-6">
                    <p className="text-[10px] font-black text-gray-400 text-center">Secure payment</p>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-10 border-4 border-primary bg-white flex flex-col items-center justify-center shadow-xl">
                        <span className="font-black text-primary text-lg mb-1">Paystack</span>
                        <span className="text-[9px] text-gray-400 font-bold">Card, transfer & USSD</span>
                      </div>
                      <div className="p-10 border-2 border-gray-100 bg-white flex flex-col items-center justify-center opacity-40">
                        <span className="font-black text-gray-400 text-lg mb-1">Flutterwave</span>
                        <span className="text-[9px] text-gray-300 font-bold">Coming soon</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-8 bg-accent-gold/20 border-2 border-accent-gold flex items-center space-x-6">
                   <ShieldCheck className="w-10 h-10 text-primary shrink-0" />
                   <p className="text-sm font-medium text-primary leading-relaxed">
                     {requiresQuote
                       ? `We'll review your request and send a final price with a secure payment link. Your preferred slot is ${date} at ${time}.`
                       : `We'll send a confirmation by SMS. Your cleaning is scheduled for ${date} at ${time}.`}
                   </p>
                </div>

                {submitError && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 text-sm font-semibold text-red-600">{submitError}</div>
                )}

                <Button onClick={handleConfirm} disabled={submitting} className="w-full bg-accent-orange text-white py-8 text-2xl rounded-none shadow-[0_25px_60px_rgba(255,87,34,0.4)] font-black transition-all hover:bg-primary disabled:opacity-60">
                  {submitting
                    ? 'Processing…'
                    : requiresQuote
                      ? 'Request my quote'
                      : PaymentGateways.paystack.publicKey
                        ? `Pay ₦${calculateTotal().toLocaleString()} & confirm`
                        : 'Confirm booking'}
                </Button>
              </div>
            </Card>
          )}

          {currentStep === 5 && (
            <div className="space-y-8">
              <Card className="p-16 rounded-none border-t-[20px] border-primary text-center bg-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl ring-[16px] ring-secondary/50 relative z-10">
                  <CheckCircle2 className="w-14 h-14" />
                </div>
                <h2 className="text-5xl font-black text-primary tracking-tighter mb-6 relative z-10">{requiresQuote ? 'Quote requested!' : 'Booking confirmed!'}</h2>
                {bookingRef && <p className="text-accent-gold font-black text-sm mb-4 relative z-10">Ref: {bookingRef}</p>}
                <p className="text-gray-500 text-sm mb-16 relative z-10 leading-relaxed max-w-md mx-auto">
                  {requiresQuote
                    ? `Thanks! Our team will review your request and send a final price with a secure payment link — usually within a few hours.`
                    : `We're sending a verified team to your ${locations.length} location(s) in ${locations.map(l => l.city).join(', ')}.`}
                </p>

                {requiresQuote ? (
                  <div className="p-10 border-4 border-secondary rounded-none mb-16 bg-secondary/10 relative z-10 text-left space-y-6">
                    <h3 className="font-black text-primary text-sm">What happens next</h3>
                    <ol className="space-y-4">
                      {[
                        'We review your locations and services.',
                        'We confirm a final price (and arrange a site visit if needed).',
                        'You get a secure payment link by SMS and email.',
                        'Once paid, we schedule and dispatch your team.',
                      ].map((stepText, i) => (
                        <li key={i} className="flex items-start space-x-4">
                          <span className="w-7 h-7 shrink-0 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">{i + 1}</span>
                          <span className="text-sm text-secondary-dark leading-relaxed pt-0.5">{stepText}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  <div className="p-12 border-4 border-secondary rounded-none mb-16 bg-secondary/10 relative z-10">
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center space-x-6 text-left">
                        <div className="w-20 h-20 bg-primary rounded-full overflow-hidden border-8 border-white shadow-2xl">
                          <img src="https://i.pravatar.cc/150?u=cleaner" alt="Cleaner" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-black text-primary text-[11px] opacity-50 mb-1">Your team lead</p>
                          <p className="font-black text-primary tracking-tighter text-2xl">Emeka O.</p>
                        </div>
                      </div>
                      <div className="bg-primary text-white px-6 py-3 text-[11px] font-black shadow-lg">
                        Confirmed
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 text-left leading-relaxed">
                      You can track your team's arrival and manage this booking from your dashboard on the day of service.
                    </p>
                  </div>
                )}
              </Card>
              <Button onClick={() => setCurrentStep(0)} variant="outline" className="w-full rounded-none border-4 border-primary text-primary font-black py-8 text-xl hover:bg-primary hover:text-white transition-all shadow-xl">Make another booking</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
