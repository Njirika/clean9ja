import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { API_URL } from '../lib/api';
import { 
  Briefcase, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  Navigation2, 
  Wallet,
  Clock,
  ShieldCheck,
  ChevronRight,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  UserCheck,
  FileText,
  User,
  ChevronLeft
} from 'lucide-react';
import { cn } from '../utils/cn';

type FlowStep = 'LANDING' | 'APPLY' | 'LOGIN' | 'JOBS' | 'ACTIVE_JOB' | 'PHOTOS' | 'COMPLETED';
type CleanerTab = 'dispatch' | 'earnings' | 'badge';

export function CleanerPortal() {
  const [step, setStep] = useState<FlowStep>('LANDING');
  const [activeCleanerTab, setActiveCleanerTab] = useState<CleanerTab>('dispatch');
  const [photosUploaded, setPhotosUploaded] = useState({ before: false, after: false });
  const [applicationData, setApplicationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    state: 'Lagos',
    city: '',
    lga: '',
    nin: '',
    experience: '1-2 years'
  });
  const [applied, setApplied] = useState(false);

  // Bank Info Settings
  const [bankInfo, setBankInfo] = useState({
    bankName: 'Access Bank',
    accountNumber: '0782910492',
    accountName: 'KABIRU YUSUF'
  });
  const [bankSaved, setBankSaved] = useState(false);

  // Cleaner's assigned tasks (assigned by the company)
  const assignedJobs = [
    {
      id: 'JOB-101',
      service: 'Home Deep Cleaning (Assigned)',
      location: 'Victoria Island, Lagos',
      time: 'Today, 10:00 AM',
      payout: '₦12,500',
      status: 'assigned'
    },
    {
      id: 'JOB-102',
      service: 'Office Janitorial (Assigned)',
      location: 'Ikeja GRA, Lagos',
      time: 'Tomorrow, 8:00 AM',
      payout: '₦25,000',
      status: 'scheduled'
    }
  ];

  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplying(true);
    setApplyError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: applicationData.fullName.split(' ')[0] || applicationData.fullName,
          lastName: applicationData.fullName.split(' ').slice(1).join(' ') || '',
          email: applicationData.email,
          phone: applicationData.phone,
          password: Math.random().toString(36).slice(2) + 'Aa1!', // temp password
          role: 'cleaner',
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        // If already registered, still show success to avoid user confusion
        if (res.status !== 409) {
          throw new Error(json?.message || 'Application failed. Please try again.');
        }
      }
      setApplied(true);
    } catch (err: any) {
      setApplyError(err?.message || 'Could not submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const handleSaveBankInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setBankSaved(true);
    setTimeout(() => setBankSaved(false), 3000);
  };

  const isSelfOnboarded = step === 'LANDING' || step === 'APPLY' || step === 'LOGIN';

  // Render Onboarding Views
  if (isSelfOnboarded) {
    return (
      <div className="min-h-screen bg-secondary/30 pb-20 pt-10 font-sans">
        <div className="container mx-auto px-4 max-w-lg">
          
          {/* Step 0: Landing / Find Cleaning Jobs */}
          {step === 'LANDING' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
              <div className="text-center mb-10">
                <div className="inline-flex p-4 bg-primary text-white rounded-none mb-6 shadow-xl border-2 border-accent-gold">
                  <Sparkles className="w-8 h-8 text-accent-gold" />
                </div>
                <h1 className="text-4xl font-black text-primary tracking-tighter leading-none mb-4">
                  Find Stable Cleaning Jobs
                </h1>
                <p className="text-gray-500 font-bold text-[10px]">
                  Join Clean9ja's Elite Vetted Fleet & Earn High Payouts Weekly
                </p>
              </div>

              <Card className="p-8 border-y-8 border-accent-gold bg-white shadow-xl space-y-6">
                <div className="space-y-4">
                  <h3 className="font-black text-primary tracking-tighter text-xl border-b border-gray-100 pb-3">Why Work With Clean9ja?</h3>
                  <div className="space-y-4">
                    {[
                      { title: "Stable Weekly Pay", desc: "No bidding or hustle. We find the customers, coordinate the quotes, and pay you steady rates up to ₦150k+/mo." },
                      { title: "Work Tools Provided", desc: "We equip you with industry-grade HEPA vacuums, protective equipment, and professional cleaning solutions." },
                      { title: "Insurance & Security", desc: "Full asset liability and worker medical coverage for all active duty field commanders." },
                      { title: "Professional Vetting", desc: "Build a solid career. We support our staff through NIN background checks, certificate verification, and regular skills training." }
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-black text-primary text-xs tracking-tight">{benefit.title}</p>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed">{benefit.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 grid grid-cols-1 gap-4 border-t border-gray-100">
                  <Button onClick={() => setStep('APPLY')} className="w-full bg-accent-orange hover:bg-primary text-white py-6 rounded-none font-black transition-all shadow-xl">
                    Apply to Join Squad <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" onClick={() => setStep('LOGIN')} className="w-full border-4 border-primary text-primary hover:bg-primary hover:text-white py-6 rounded-none font-black transition-all">
                    Hired Cleaners Log In
                  </Button>
                </div>
              </Card>

              <div className="p-6 bg-primary text-white rounded-none border-l-8 border-accent-gold flex items-center space-x-4 shadow-sm">
                <ShieldCheck className="w-10 h-10 text-accent-gold shrink-0" />
                <div>
                  <p className="font-black text-accent-gold text-[10px] mb-1">Company Staff Model</p>
                  <p className="text-[11px] text-white/80 font-bold tracking-tight leading-relaxed">
                    Clean9ja is not a peer-to-peer open marketplace. We are the cleaning company ourselves. All jobs are directly assigned to our vetted staff commanders.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 0.5: Job Application Form */}
          {step === 'APPLY' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-primary tracking-tighter">Squad Application</h2>
                <p className="text-gray-500 font-bold text-[10px] mt-1">Start your journey to stable professional cleaning employment</p>
              </div>

              {!applied ? (
                <Card className="p-10 rounded-none border-t-8 border-primary bg-white shadow-2xl">
                  <form onSubmit={handleApplySubmit} className="space-y-6">
                    <Input 
                      label="Full Name" 
                      placeholder="Chidi Okeke" 
                      required 
                      value={applicationData.fullName}
                      onChange={e => setApplicationData({...applicationData, fullName: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        label="Email Address" 
                        type="email" 
                        placeholder="chidi@example.com" 
                        required 
                        value={applicationData.email}
                        onChange={e => setApplicationData({...applicationData, email: e.target.value})}
                      />
                      <Input 
                        label="Phone Number" 
                        placeholder="08012345678" 
                        required 
                        value={applicationData.phone}
                        onChange={e => setApplicationData({...applicationData, phone: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1 col-span-1">
                        <label className="block text-xs font-bold text-primary tracking-wider">State</label>
                        <select 
                          value={applicationData.state} 
                          onChange={e => setApplicationData({...applicationData, state: e.target.value})}
                          className="w-full h-11 border border-gray-300 px-3 focus:outline-primary font-bold text-sm bg-white"
                        >
                          <option>Lagos</option>
                          <option>Abuja</option>
                          <option>Port Harcourt</option>
                          <option>Ibadan</option>
                        </select>
                      </div>
                      <div className="col-span-1">
                        <Input 
                          label="City" 
                          placeholder="e.g. Lekki" 
                          required 
                          value={applicationData.city}
                          onChange={e => setApplicationData({...applicationData, city: e.target.value})}
                        />
                      </div>
                      <div className="col-span-1">
                        <Input 
                          label="LGA" 
                          placeholder="Eti-Osa" 
                          required 
                          value={applicationData.lga}
                          onChange={e => setApplicationData({...applicationData, lga: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <Input 
                      label="National Identity Number (NIN)" 
                      placeholder="11-Digit Number for Background Checks" 
                      required 
                      maxLength={11}
                      value={applicationData.nin}
                      onChange={e => setApplicationData({...applicationData, nin: e.target.value})}
                    />

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-primary tracking-wider">Cleaning Experience</label>
                      <select 
                        value={applicationData.experience} 
                        onChange={e => setApplicationData({...applicationData, experience: e.target.value})}
                        className="w-full h-11 border border-gray-300 px-3 focus:outline-primary font-bold text-sm bg-white"
                      >
                        <option>No experience (We provide full training)</option>
                        <option>Less than 1 year</option>
                        <option>1-2 years</option>
                        <option>3+ years</option>
                      </select>
                    </div>

                    <div className="p-4 bg-accent-gold/10 border-2 border-accent-gold text-left flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-[9px] font-bold text-primary leading-relaxed">
                        NIN registration is mandatory. Clean9ja runs background security checks on all applicants to maintain our zero-liability security guarantee.
                      </p>
                    </div>

                    <div className="flex flex-col space-y-3">
                      {applyError && (
                        <div className="p-3 bg-red-50 border-l-4 border-red-500 text-[10px] font-black text-red-600 tracking-wider">{applyError}</div>
                      )}
                      <div className="flex space-x-4">
                        <Button type="button" variant="outline" onClick={() => setStep('LANDING')} className="px-6 py-5 border-2 rounded-none font-black text-xs ">Back</Button>
                        <Button type="submit" disabled={applying} className="flex-grow bg-primary py-5 text-sm rounded-none font-black disabled:opacity-60">{applying ? 'Submitting…' : 'Submit Application'}</Button>
                      </div>
                    </div>
                  </form>
                </Card>
              ) : (
                <Card className="p-12 text-center bg-white shadow-2xl rounded-none border-t-[20px] border-primary animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <UserCheck className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-black text-primary tracking-tighter mb-4">Application Received!</h3>
                  <p className="text-gray-400 font-black text-[9px] mb-8 leading-relaxed">
                    Thank you for applying, {applicationData.fullName}. 
                  </p>
                  <div className="p-6 bg-secondary text-left space-y-3 mb-10 border-l-4 border-accent-gold">
                    <div className="flex items-center space-x-2 text-[10px] font-black text-primary "><FileText className="w-4 h-4 text-accent-gold" /> <span>Next Vetting Stages:</span></div>
                    <ul className="list-decimal pl-4 text-[10px] font-bold text-gray-500 space-y-2 leading-relaxed">
                      <li>NIN Verification & background check validation (24 Hours)</li>
                      <li>Syllabus Training invitation via Termii (SMS)</li>
                      <li>Hub Interview & physical kit assignment</li>
                    </ul>
                  </div>
                  <Button onClick={() => { setApplied(false); setStep('LANDING'); }} className="w-full bg-primary py-5 rounded-none font-black shadow-lg">Return to Careers Hub</Button>
                </Card>
              )}
            </div>
          )}

          {/* Step 1: Hired Cleaner Login */}
          {step === 'LOGIN' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-10">
                <div className="inline-flex p-4 bg-primary text-white rounded-none mb-6 shadow-xl">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-black text-primary tracking-tighter">Staff Portal</h1>
                <p className="text-gray-500 mt-2 font-bold text-[10px]">Log in with your Clean9ja Employee Credentials</p>
              </div>
              <Card className="p-10 rounded-none border-t-8 border-accent-gold bg-white">
                <div className="space-y-6">
                  <Input label="Staff ID" placeholder="CN-10492" />
                  <Input label="Password" type="password" placeholder="••••••••" />
                  <Button onClick={() => { setStep('JOBS'); setActiveCleanerTab('dispatch'); }} className="w-full bg-primary py-6 text-lg rounded-none font-black ">Authorize Access</Button>
                  <div className="flex justify-between items-center text-[9px] font-black ">
                    <button onClick={() => setStep('LANDING')} className="text-gray-400 hover:text-primary">Recruitment Hub</button>
                    <a href="#" className="text-accent-gold hover:underline">Forgot Credentials?</a>
                  </div>
                </div>
              </Card>
              <div className="mt-8 p-6 bg-white rounded-none border-l-8 border-primary flex items-center space-x-4 shadow-sm">
                <ShieldCheck className="w-10 h-10 text-primary shrink-0" />
                <div>
                  <p className="font-black text-primary text-[10px] mb-1">Active Staff Duty</p>
                  <p className="text-[11px] text-gray-500 font-bold tracking-tight leading-relaxed">Ensure you carry your physical badge and clean uniform to all assigned sites.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // Render Active Dashboard for Hired Cleaners
  const menuItems = [
    { id: 'dispatch', label: 'Active Dispatch', icon: Briefcase },
    { id: 'earnings', label: 'Earnings Hub', icon: Wallet },
    { id: 'badge', label: 'Employee Badge', icon: ShieldCheck }
  ] as const;

  return (
    <div className="min-h-screen bg-secondary/30 pb-24 lg:pb-12 font-sans flex flex-col">
      
      {/* Sticky Mobile Header */}
      <header className="sticky top-0 z-40 bg-primary text-white py-4 px-6 flex justify-between items-center shadow-lg lg:hidden">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="Clean9ja - Spotless Every Surface" className="h-6 w-auto object-contain" />
        </Link>
        <div className="flex items-center space-x-3 bg-[#144718] px-3 py-1.5 rounded-full border border-white/10">
          <div className="w-2 h-2 rounded-full bg-primary-bright animate-pulse"></div>
          <span className="text-[9px] font-black text-accent-gold">CN-10492</span>
        </div>
      </header>

      {/* Hero Banner Header (Desktop Only) */}
      <div className="bg-primary pt-12 pb-24 text-white relative overflow-hidden hidden lg:block">
        <div className="absolute right-0 top-0 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="container mx-auto px-6 relative z-10 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2 bg-[#144718] px-3 py-1 rounded-full border border-white/10 w-fit mb-4">
              <Sparkles className="w-3 h-3 text-accent-gold" />
              <span className="text-[9px] font-black text-accent-gold">Field Commander</span>
            </div>
            <h1 className="text-4xl font-heading font-black tracking-tighter">Staff Command</h1>
            <p className="text-white/60 font-bold text-[10px] mt-1">Commander Kabiru Yusuf • Active Duty Station</p>
          </div>
          <button 
            onClick={() => { setStep('LANDING'); setPhotosUploaded({ before: false, after: false }); }}
            className="px-6 py-3 border border-white/20 text-white/80 hover:text-white hover:bg-white/10 font-black text-[10px] bg-transparent transition-all"
          >
            Log Out Duty
          </button>
        </div>
      </div>

      {/* Main Structure */}
      <div className="container mx-auto px-4 lg:px-6 flex-grow mt-6 lg:-mt-16 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Navigation Sidebar (Desktop Only) */}
          <aside className="lg:col-span-1 space-y-3 hidden lg:block">
            {/* Logo Link to Home */}
            <Link to="/" className="flex items-center mb-6 px-2">
              <img src="/logo.png" alt="Clean9ja - Spotless Every Surface" className="h-10 w-auto object-contain" />
            </Link>
            {menuItems.map(item => {
              const isActive = activeCleanerTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveCleanerTab(item.id)}
                  className={`w-full flex items-center justify-between px-6 py-4 font-black text-[10px] transition-all duration-300 border-l-4 rounded-none shadow-md ${
                    isActive 
                      ? 'bg-primary text-white border-accent-gold shadow-xl scale-[1.02]' 
                      : 'bg-white text-gray-400 border-transparent hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-1 text-accent-gold' : 'opacity-0'}`} />
                </button>
              );
            })}
            
            <button
              onClick={() => { setStep('LANDING'); setPhotosUploaded({ before: false, after: false }); }}
              className="w-full flex items-center space-x-3 px-6 py-4 font-black text-[10px] transition-all bg-white text-red-500 border border-red-100 hover:bg-red-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Log Out Duty</span>
            </button>
          </aside>

          {/* Right Content Area */}
          <main className="lg:col-span-3 pb-16">
            
            {/* Tab: Dispatch (Wraps the active steps) */}
            {activeCleanerTab === 'dispatch' && (
              <div className="animate-in fade-in duration-300 space-y-6">
                
                {/* Step 2: Hired Cleaner's Assigned Tasks */}
                {step === 'JOBS' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <h2 className="text-xl font-black text-primary tracking-tighter">My Dispatch Board</h2>
                        <p className="text-[9px] text-gray-400 font-black ">Active assigned missions waiting for run</p>
                      </div>
                    </div>
                    
                    {assignedJobs.map(job => (
                      <Card 
                        key={job.id} 
                        className="p-8 rounded-none border-l-4 border-accent-gold hover:border-accent-orange transition-all cursor-pointer group shadow-sm bg-white hover:shadow-xl" 
                        onClick={() => setStep('ACTIVE_JOB')}
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="font-black text-primary tracking-tighter text-lg mb-1">{job.service}</h3>
                            <div className="flex items-center text-gray-400 text-[10px] font-black ">
                              <MapPin className="w-3.5 h-3.5 mr-2 text-accent-gold" />
                              {job.location}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-primary font-black text-xl tracking-tighter mb-1">{job.payout}</p>
                            <span className="bg-primary/5 text-primary px-3 py-1 text-[8px] font-black rounded-full">HQ Assigned</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                          <div className="flex items-center text-gray-400 text-[10px] font-black ">
                            <Clock className="w-3.5 h-3.5 mr-2 text-primary" />
                            {job.time}
                          </div>
                          <span className="text-accent-gold font-black text-[10px] flex items-center group-hover:translate-x-1 transition-transform">
                            Run Mission <ChevronRight className="w-3.5 h-3.5 ml-1" />
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Step 3: Active Job Execution */}
                {step === 'ACTIVE_JOB' && (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="bg-primary text-white p-8 rounded-none shadow-xl relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="bg-accent-gold text-primary inline-block px-3 py-0.5 text-[9px] font-black mb-4">Active Mission</div>
                        <h2 className="text-3xl font-black tracking-tighter leading-none mb-3">Deep Cleaning Task</h2>
                        <p className="text-white/70 font-black text-[10px] mb-6 flex items-center"><MapPin className="w-4 h-4 mr-2 text-accent-gold" /> Victoria Island, Lagos</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/10 p-4 border-l-4 border-accent-gold">
                            <p className="text-[9px] font-black text-white/50 mb-1.5">Payout</p>
                            <p className="text-xl font-black text-accent-gold">₦12,500</p>
                          </div>
                          <div className="bg-white/10 p-4 border-l-4 border-white/20">
                            <p className="text-[9px] font-black text-white/50 mb-1.5">Arrival ETA</p>
                            <p className="text-xl font-black text-white">10:00 AM</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Card className="p-8 rounded-none bg-white space-y-6 shadow-md border-y-4 border-accent-gold">
                      <div className="space-y-3">
                        <Button className="w-full bg-primary py-5 text-sm flex items-center justify-center rounded-none font-black shadow-md">
                          <Navigation2 className="w-4 h-4 mr-2 fill-current" /> Start Navigation
                        </Button>
                        <Button onClick={() => setStep('PHOTOS')} variant="outline" className="w-full py-5 border-2 border-primary text-primary font-black rounded-none hover:bg-primary hover:text-white transition-all">
                          Confirm Hub Arrival
                        </Button>
                      </div>
                      <div className="pt-4 border-t border-gray-50">
                        <h4 className="font-black text-primary text-[9px] mb-2">Dispatcher Notes</h4>
                        <p className="text-gray-500 text-xs font-bold tracking-wider leading-relaxed italic">
                          "Clean9ja Dispatch: Call Mrs. Adebayo at 0801XXX before entry. Deep clean focus on the master bathroom and interlock pavement."
                        </p>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Step 4: Before/After Evidence Photos */}
                {step === 'PHOTOS' && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <h2 className="text-2xl font-black text-primary tracking-tighter">Upload Clean Evidence</h2>
                    
                    <Card className="p-6 rounded-none shadow-md bg-white">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="font-black text-primary text-xs tracking-wider">Before Cleaning Photos</h3>
                          <p className="text-[9px] text-gray-400 font-black ">Initial workspace state verification</p>
                        </div>
                        {photosUploaded.before ? (
                          <CheckCircle2 className="w-8 h-8 text-primary" />
                        ) : (
                          <Button size="sm" onClick={() => setPhotosUploaded({ ...photosUploaded, before: true })} className="bg-accent-gold rounded-full p-3 shadow-md"><Camera className="w-5 h-5 text-primary" /></Button>
                        )}
                      </div>
                      {photosUploaded.before && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="aspect-square bg-secondary rounded-none flex items-center justify-center border-2 border-dashed border-gray-200"><ImageIcon className="text-gray-300" /></div>
                          <div className="aspect-square bg-secondary rounded-none flex items-center justify-center border-2 border-dashed border-gray-200"><ImageIcon className="text-gray-300" /></div>
                        </div>
                      )}
                    </Card>

                    <Card className={cn("p-6 rounded-none shadow-md bg-white transition-all", !photosUploaded.before && "opacity-30 pointer-events-none")}>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="font-black text-primary text-xs tracking-wider">After Spotless Photos</h3>
                          <p className="text-[9px] text-gray-400 font-black ">Post-service quality completion proof</p>
                        </div>
                        {photosUploaded.after ? (
                          <CheckCircle2 className="w-8 h-8 text-primary" />
                        ) : (
                          <Button size="sm" onClick={() => setPhotosUploaded({ ...photosUploaded, after: true })} className="bg-accent-gold rounded-full p-3 shadow-md"><Camera className="w-5 h-5 text-primary" /></Button>
                        )}
                      </div>
                      {photosUploaded.after && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="aspect-square bg-secondary rounded-none flex items-center justify-center border-2 border-dashed border-gray-200"><ImageIcon className="text-gray-300" /></div>
                          <div className="aspect-square bg-secondary rounded-none flex items-center justify-center border-2 border-dashed border-gray-200"><ImageIcon className="text-gray-300" /></div>
                        </div>
                      )}
                    </Card>

                    <Button 
                      disabled={!photosUploaded.before || !photosUploaded.after} 
                      onClick={() => setStep('COMPLETED')}
                      className="w-full bg-primary py-6 text-base rounded-none font-black shadow-lg disabled:bg-gray-200"
                    >
                      Confirm Complete & Submit
                    </Button>
                  </div>
                )}

                {/* Step 5: Completed */}
                {step === 'COMPLETED' && (
                  <div className="animate-in zoom-in-95 duration-500">
                    <Card className="p-8 text-center bg-white shadow-xl rounded-none border-t-[16px] border-primary">
                      <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl ring-4 ring-secondary">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <h2 className="text-3xl font-black text-primary tracking-tighter mb-2">Job Verified</h2>
                      <p className="text-gray-400 font-black text-[9px] mb-8 leading-relaxed">Proof submitted to HQ dispatcher successfully. Payout loop active.</p>
                      
                      <div className="bg-primary p-8 rounded-none mb-8 border-b-8 border-accent-gold shadow-md">
                        <div className="flex justify-center mb-4">
                          <Wallet className="w-10 h-10 text-accent-gold" />
                        </div>
                        <p className="text-[9px] font-black text-white/50 mb-2">Current Balance</p>
                        <div className="text-4xl font-black text-white tracking-tighter mb-2">₦12,500.00</div>
                        <div className="bg-white/10 py-1.5 px-3 inline-block font-black text-[8.5px] tracking-wider text-accent-gold">Direct Bank Transfer: Friday</div>
                      </div>

                      <div className="space-y-3">
                        <Button onClick={() => { setStep('JOBS'); setPhotosUploaded({ before: false, after: false }); }} className="w-full bg-primary py-4 rounded-none font-black shadow-md">Back to Active Dispatch</Button>
                        <Button variant="outline" onClick={() => setActiveCleanerTab('earnings')} className="w-full border border-primary text-primary py-4 rounded-none font-black ">My Payout History</Button>
                      </div>
                    </Card>
                  </div>
                )}

              </div>
            )}

            {/* Tab: Earnings Hub */}
            {activeCleanerTab === 'earnings' && (
              <div className="bg-white p-6 lg:p-8 border border-gray-100 shadow-xl animate-in fade-in duration-300 rounded-none space-y-8">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-black text-primary tracking-tighter">Earnings Hub</h2>
                  <p className="text-[9px] text-gray-400 font-bold ">Track payouts, weekly bank deposits, and cash accounts</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-primary p-6 text-white rounded-none border-b-4 border-accent-gold shadow-md">
                    <p className="text-[8.5px] font-black text-white/50 mb-1.5">Unpaid Balance</p>
                    <p className="text-3xl font-black text-accent-gold">₦12,500</p>
                    <span className="text-[8px] font-bold text-white/60 block mt-3">Disburses on upcoming Friday</span>
                  </div>
                  <div className="bg-secondary p-6 rounded-none shadow-md border-t-4 border-primary">
                    <p className="text-[8.5px] font-black text-gray-400 mb-1.5">Month to Date</p>
                    <p className="text-3xl font-black text-primary">₦87,500</p>
                    <span className="text-[8px] font-bold text-gray-400 block mt-3">Total completed: 5 runs</span>
                  </div>
                  <div className="bg-secondary p-6 rounded-none shadow-md border-t-4 border-accent-gold">
                    <p className="text-[8.5px] font-black text-gray-400 mb-1.5">All-time Payouts</p>
                    <p className="text-3xl font-black text-primary">₦432,000</p>
                    <span className="text-[8px] font-bold text-gray-400 block mt-3">Vetted commander since 2025</span>
                  </div>
                </div>

                {/* Bank Information Settings Form */}
                <div className="pt-6 border-t border-gray-50 space-y-4">
                  <h3 className="font-black text-primary text-sm border-b border-gray-100 pb-2">Direct Deposit Account</h3>
                  
                  <form onSubmit={handleSaveBankInfo} className="space-y-4 max-w-md">
                    {bankSaved && (
                      <div className="p-3 bg-primary/10 border-l-4 border-primary text-[9px] font-black text-primary animate-pulse">
                        Bank payroll parameters updated successfully!
                      </div>
                    )}
                    <div>
                      <label className="block text-[8.5px] font-black text-primary mb-1.5">Bank Name</label>
                      <input 
                        type="text" 
                        required
                        value={bankInfo.bankName}
                        onChange={e => setBankInfo({...bankInfo, bankName: e.target.value})}
                        className="w-full h-10 border border-gray-300 px-3 font-bold text-xs focus:outline-primary bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-black text-primary mb-1.5">Account Number (10 Digits)</label>
                      <input 
                        type="text" 
                        required
                        maxLength={10}
                        value={bankInfo.accountNumber}
                        onChange={e => setBankInfo({...bankInfo, accountNumber: e.target.value})}
                        className="w-full h-10 border border-gray-300 px-3 font-bold text-xs focus:outline-primary bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-black text-primary mb-1.5">Account Beneficiary Name</label>
                      <input 
                        type="text" 
                        required
                        value={bankInfo.accountName}
                        onChange={e => setBankInfo({...bankInfo, accountName: e.target.value})}
                        className="w-full h-10 border border-gray-200 px-3 font-bold text-xs bg-secondary/20 cursor-not-allowed tracking-wider text-gray-400"
                        disabled
                      />
                    </div>
                    <Button type="submit" className="bg-primary text-white font-black text-[9px] px-6 py-3 rounded-none shadow-md">
                      Update Bank Details
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Tab: Staff Badge */}
            {activeCleanerTab === 'badge' && (
              <div className="bg-white p-6 lg:p-8 border border-gray-100 shadow-xl animate-in fade-in duration-300 rounded-none space-y-8 flex flex-col items-center">
                <div className="border-b border-gray-100 pb-4 w-full text-left">
                  <h2 className="text-2xl font-black text-primary tracking-tighter">Employee Badge</h2>
                  <p className="text-[9px] text-gray-400 font-bold ">Verify employee ID for customer site entry permissions</p>
                </div>

                {/* Premium Digital Badge Card */}
                <div className="w-80 bg-primary text-white rounded-none border-b-[16px] border-accent-gold shadow-2xl relative overflow-hidden p-8 flex flex-col items-center text-center mt-6">
                  {/* Glassmorphic overlay badge circles */}
                  <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent-gold/5 rounded-full blur-xl"></div>

                  <div className="w-full flex justify-between items-center mb-6 z-10">
                    <div className="flex items-center justify-center">
                      <img src="/logo.png" alt="Clean9ja" className="h-6 w-auto object-contain" />
                    </div>
                    <span className="bg-accent-gold text-primary font-black text-[7px] px-2 py-0.5 rounded-full">ACTIVE DUTY</span>
                  </div>

                  {/* Initials Placeholder in Generic Avatar */}
                  <div className="w-28 h-28 bg-[#144718] border-4 border-accent-gold flex items-center justify-center mb-4 shadow-xl shrink-0 z-10">
                    <User className="w-14 h-14 text-accent-gold" />
                  </div>

                  <h3 className="font-black text-lg tracking-tight mb-1 z-10">Kabiru Yusuf</h3>
                  <p className="text-[9px] font-black text-accent-gold mb-4 z-10">Field Commander • CN-10492</p>

                  <div className="w-full bg-[#144718] p-3 border border-white/10 text-left space-y-2 z-10">
                    <div className="flex justify-between items-center text-[8px] font-black text-white/50">
                      <span>Verification</span>
                      <span className="text-accent-gold">NIN CHECK PASSED</span>
                    </div>
                    <div className="flex justify-between items-center text-[8px] font-black text-white/50">
                      <span>Hub Center</span>
                      <span className="text-white">Lekki Hub (Lagos)</span>
                    </div>
                    <div className="flex justify-between items-center text-[8px] font-black text-white/50">
                      <span>Assigned Gear</span>
                      <span className="text-white">Squad Kit #9A</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center space-x-2 text-[7.5px] font-black text-white/40 z-10">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent-gold" />
                    <span>Clean9ja Verified Personnel</span>
                  </div>
                </div>

                <div className="p-6 bg-secondary text-left space-y-3 w-full border-l-4 border-accent-gold mt-6">
                  <h4 className="font-black text-primary text-[10px] flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-primary" /> Active Training Certification</h4>
                  <p className="text-xs text-gray-500 font-bold tracking-wider leading-relaxed">
                    Syllabus Level: **Restoration & Deep Clean Specialist** (Completed: May 2025). Background check verified annually via NIMC databases.
                  </p>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* Glassmorphic Mobile Bottom Navigation Bar (Fixed bottom-0) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-t border-white/10 px-2 py-3 flex justify-around items-center shadow-2xl lg:hidden">
        {menuItems.map(item => {
          const isActive = activeCleanerTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveCleanerTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 transition-all ${
                isActive ? 'text-accent-gold scale-110 font-bold' : 'text-white/40 hover:text-white/80'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1 shrink-0" />
              <span className="text-[7.5px] font-black text-center truncate w-full leading-none">
                {item.id === 'dispatch' ? 'Dispatch' : 
                 item.id === 'earnings' ? 'Earnings' : 'Badge'}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
