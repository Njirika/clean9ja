import { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  CreditCard, 
  Settings, 
  Plus, 
  Trash2, 
  Download, 
  ChevronRight, 
  User, 
  ShieldCheck, 
  Sparkles,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

type Tab = 'overview' | 'bookings' | 'subscriptions' | 'payments' | 'addresses' | 'settings';

export function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  // Saved Addresses State
  const [addresses, setAddresses] = useState([
    { id: '1', name: 'Home Sweet Home', address: 'Plot 12, Admiralty Way, Lekki Phase 1, Lagos', type: 'Residential' },
    { id: '2', name: 'HQ Office', address: 'Block B, Wing 3, Civic Centre Towers, Victoria Island, Lagos', type: 'Commercial' }
  ]);
  
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrVal, setNewAddrVal] = useState('');
  const [newAddrType, setNewAddrType] = useState('Residential');
  const [showAddAddr, setShowAddAddr] = useState(false);

  // Profile Settings State
  const [profile, setProfile] = useState({
    name: 'Chidi Okeke',
    email: 'chidi@example.com',
    phone: '08034567890',
    city: 'Lekki, Lagos'
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrName || !newAddrVal) return;
    setAddresses([
      ...addresses,
      { id: Date.now().toString(), name: newAddrName, address: newAddrVal, type: newAddrType }
    ]);
    setNewAddrName('');
    setNewAddrVal('');
    setShowAddAddr(false);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Mock Bookings
  const bookings = [
    { id: 'CLN-2026-042', date: 'June 5, 2026', time: '10:00 AM', service: 'Standard Home Shine', price: '₦18,500', status: 'Scheduled', staff: 'Commander Emeka' },
    { id: 'CLN-2026-018', date: 'May 12, 2026', time: '8:30 AM', service: 'Deep Restoration Clean', price: '₦45,000', status: 'Completed', staff: 'Specialist Funmi' }
  ];

  // Mock Subscriptions
  const subscriptions = [
    { id: 'SUB-102', plan: 'Bi-Weekly Home Shine', frequency: 'Every 2 Weeks', cost: '₦32,000/mo', status: 'Active', nextWash: 'June 10, 2026' },
    { id: 'SUB-089', plan: 'Annual Gutter Review', frequency: 'Once a Year', cost: '₦15,000/yr', status: 'Paused', nextWash: 'On Demand' }
  ];

  // Mock Payments
  const payments = [
    { invoice: 'INV-9281', date: 'May 12, 2026', desc: 'Deep Restoration Clean', amount: '₦45,000', method: 'Paystack (Card)', status: 'Paid' },
    { invoice: 'INV-8302', date: 'April 28, 2026', desc: 'Standard Home Shine', amount: '₦18,500', method: 'Bank Transfer', status: 'Paid' }
  ];

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'subscriptions', label: 'Subscriptions', icon: Clock },
    { id: 'payments', label: 'Payment History', icon: CreditCard },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-secondary/30 pb-24 lg:pb-12 font-sans flex flex-col">
      {/* Sticky Mobile Header */}
      <header className="sticky top-0 z-40 bg-primary text-white py-4 px-6 flex justify-between items-center shadow-lg lg:hidden">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary font-heading font-black text-lg italic border border-white">CN</div>
          <span className="font-heading font-black uppercase text-base tracking-tighter">My Hub</span>
        </Link>
        <div className="flex items-center space-x-3 bg-[#144718] px-3 py-1.5 rounded-full border border-white/10">
          <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse"></div>
          <span className="text-[9px] font-black uppercase tracking-widest text-accent-gold">Chidi</span>
        </div>
      </header>

      {/* Hero Banner Header (Desktop Only) */}
      <div className="bg-primary pt-12 pb-24 text-white relative overflow-hidden hidden lg:block">
        <div className="absolute right-0 top-0 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="container mx-auto px-6 relative z-10 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2 bg-[#144718] px-3 py-1 rounded-full border border-white/10 w-fit mb-4">
              <Sparkles className="w-3 h-3 text-accent-gold" />
              <span className="text-[9px] font-black uppercase tracking-widest text-accent-gold">Premium Member</span>
            </div>
            <h1 className="text-4xl font-heading font-black uppercase tracking-tighter">My Account</h1>
            <p className="text-white/60 font-bold uppercase tracking-widest text-[10px] mt-1">Welcome back, Chidi Okeke</p>
          </div>
          <Link to="/book">
            <Button className="bg-accent-orange text-white font-black text-[10px] uppercase tracking-widest px-6 py-4 rounded-none shadow-xl hover:bg-white hover:text-accent-orange transition-all">
              Book Cleaning Service
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Structure (Fixed Margin Top on Mobile to prevent overlapping) */}
      <div className="container mx-auto px-4 lg:px-6 flex-grow mt-6 lg:-mt-16 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Navigation Sidebar (Desktop Only) */}
          <aside className="lg:col-span-1 space-y-3 hidden lg:block">
            {/* Logo Link to Home */}
            <Link to="/" className="flex items-center space-x-2 mb-6 group px-2">
              <div className="bg-primary p-1.5 rounded-lg border border-primary-bright shadow-inner group-hover:scale-105 transition-transform">
                <div className="w-7 h-7 flex items-center justify-center text-white bg-primary font-heading font-black text-lg italic border border-white">CN</div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-heading font-black tracking-tighter text-white uppercase group-hover:text-accent-gold transition-colors">CleanNaija</span>
                <span className="text-[7.5px] tracking-[0.2em] font-black text-accent-gold uppercase">My Dashboard</span>
              </div>
            </Link>

            {menuItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-6 py-4 font-black uppercase tracking-widest text-[10px] transition-all duration-300 border-l-4 rounded-none shadow-md ${
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
            
            {/* Quick Summary Card */}
            <div className="p-6 bg-primary text-white rounded-none border-b-8 border-accent-gold mt-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-xl"></div>
              <span className="bg-accent-gold text-primary text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-3 inline-block">Elite Squad</span>
              <h4 className="text-xs font-black uppercase tracking-tighter mb-2">CleanNaija Protection</h4>
              <p className="text-[9px] text-white/70 font-bold uppercase tracking-wide leading-relaxed">
                All scheduled missions are backed by our ₦1M liability insurance & 100% Satisfaction Guarantee.
              </p>
            </div>
          </aside>

          {/* Right Content Area */}
          <main className="lg:col-span-3 pb-16">
            
            {/* Tab: Overview (Trulicares Inspired Mobile Feel) */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                
                {/* Welcome Card Banner */}
                <div className="bg-gradient-to-r from-primary via-primary/95 to-primary-bright text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden border-b-8 border-accent-gold">
                  {/* Visual Impact Gradients */}
                  <div className="absolute right-0 top-0 w-64 h-64 bg-accent-gold/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                  <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

                  <div className="relative z-10 max-w-lg space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-gold">Welcome back</p>
                      <h2 className="text-3xl lg:text-4xl font-heading font-black uppercase tracking-tighter leading-none mt-1">
                        {profile.name}
                      </h2>
                    </div>
                    <p className="text-xs text-white/75 font-semibold uppercase tracking-wider leading-relaxed">
                      Ready to schedule your next spotless shine? Book a vetted field specialist today.
                    </p>
                    <div className="pt-2">
                      <Link to="/book">
                        <Button className="bg-white text-primary hover:bg-accent-orange hover:text-white font-black text-[10px] uppercase tracking-widest px-6 py-4 rounded-full shadow-lg transition-all duration-300">
                          <Sparkles className="w-4 h-4 mr-2" /> Book Spotless Clean
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Grid 2x2 Metric Layout (Trulicares Inspired) */}
                <div className="grid grid-cols-2 gap-4 lg:gap-6">
                  {[
                    { label: 'Upcoming Missions', value: '1 Active', sub: 'Scheduled run', icon: Calendar, bg: 'bg-primary/10 text-primary', tab: 'bookings' },
                    { label: 'Saved Address Hub', value: `${addresses.length} Saved`, sub: 'Locations registered', icon: MapPin, bg: 'bg-accent-gold/10 text-primary', tab: 'addresses' },
                    { label: 'Hygiene Plans', value: '1 Active', sub: 'Recurring care', icon: Clock, bg: 'bg-accent-orange/10 text-accent-orange', tab: 'subscriptions' },
                    { label: 'Settled Invoices', value: '2 Paid', sub: 'Paystack checkout', icon: CreditCard, bg: 'bg-primary-bright/10 text-primary-bright', tab: 'payments' }
                  ].map((metric, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveTab(metric.tab as Tab)}
                      className="p-5 lg:p-6 bg-white border border-gray-100 rounded-3xl shadow-md text-left hover:shadow-lg hover:border-accent-gold transition-all duration-300 flex flex-col justify-between h-40 group"
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-[8.5px] font-black text-gray-400 uppercase tracking-widest leading-none">
                          {metric.label}
                        </span>
                        <div className={`p-2.5 rounded-full shrink-0 ${metric.bg} group-hover:scale-110 transition-transform`}>
                          <metric.icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-black text-primary uppercase tracking-tighter leading-none">
                          {metric.value}
                        </p>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">
                          {metric.sub}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Quick Action Activity Widget */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <h4 className="font-heading font-black uppercase text-xs tracking-widest border-b border-gray-50 pb-3 flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2 text-primary" /> Active Safety Verification
                  </h4>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider leading-relaxed">
                    CleanNaija locks direct background API credentials with NIMC. All dispatch cleaners undergo physical vetting interviews at operations stations before booking dispatch.
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Bookings */}
            {activeTab === 'bookings' && (
              <div className="bg-white p-6 lg:p-8 border border-gray-100 shadow-xl space-y-6 animate-in fade-in duration-300 rounded-none">
                <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">My Bookings</h2>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Active dispatch runs & cleaning history</p>
                  </div>
                  <Link to="/book" className="lg:hidden">
                    <Button size="sm" className="bg-accent-orange text-white font-black text-[9px] uppercase tracking-widest px-4 py-2">
                      New Book
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {bookings.map(b => (
                    <div key={b.id} className="p-6 border border-gray-100 bg-white hover:border-primary transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm border-l-4 border-l-accent-gold">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-black text-primary uppercase text-sm tracking-tight">{b.service}</h4>
                          <span className={`px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-full ${
                            b.status === 'Scheduled' ? 'bg-accent-gold/15 text-primary' : 'bg-primary/10 text-primary-bright'
                          }`}>{b.status}</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-2 text-primary shrink-0" />
                          {b.date} • {b.time}
                        </p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center bg-secondary/50 px-3 py-1 w-fit">
                          <User className="w-3.5 h-3.5 mr-2 text-primary shrink-0" />
                          Assigned: {b.staff}
                        </p>
                      </div>
                      <div className="text-right w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 flex md:flex-col justify-between items-center md:items-end">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest md:mb-1">Reference: {b.id}</p>
                        <p className="text-xl font-black text-primary">{b.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Subscriptions */}
            {activeTab === 'subscriptions' && (
              <div className="bg-white p-6 lg:p-8 border border-gray-100 shadow-xl space-y-6 animate-in fade-in duration-300 rounded-none">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">Hygiene Subscriptions</h2>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Steady weekly/monthly recurring washes</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subscriptions.map(s => (
                    <div key={s.id} className="p-6 border border-gray-100 bg-white hover:border-accent-gold transition-all shadow-sm border-t-4 border-t-primary flex flex-col justify-between h-56">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-black text-primary uppercase text-sm tracking-tight">{s.plan}</h4>
                          <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-full ${
                            s.status === 'Active' ? 'bg-primary-bright/10 text-primary-bright' : 'bg-gray-100 text-gray-400'
                          }`}>{s.status}</span>
                        </div>
                        <p className="text-[10px] font-black text-accent-gold uppercase tracking-widest mb-1">{s.cost}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Interval: {s.frequency}</p>
                      </div>
                      <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                        <div>
                          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Next Run</p>
                          <p className="text-[10px] font-black text-primary uppercase">{s.nextWash}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary font-black uppercase text-[9px] tracking-widest p-0">Manage Plan</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Payments */}
            {activeTab === 'payments' && (
              <div className="bg-white p-6 lg:p-8 border border-gray-100 shadow-xl space-y-6 animate-in fade-in duration-300 rounded-none">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">Payment History</h2>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Past invoices & paystack transactions</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-secondary border-b border-gray-100">
                      <tr>
                        {['Invoice', 'Date', 'Description', 'Amount', 'Method', 'Receipt'].map(h => (
                          <th key={h} className="px-6 py-4 text-[9px] font-black text-primary uppercase tracking-[0.2em]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 bg-white">
                      {payments.map(p => (
                        <tr key={p.invoice} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-[10px] font-black text-primary tracking-widest">{p.invoice}</td>
                          <td className="px-6 py-4 text-xs font-bold text-gray-500">{p.date}</td>
                          <td className="px-6 py-4 text-xs font-bold text-gray-600 uppercase">{p.desc}</td>
                          <td className="px-6 py-4 text-xs font-black text-primary">{p.amount}</td>
                          <td className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">{p.method}</td>
                          <td className="px-6 py-4">
                            <button className="text-primary hover:text-accent-orange p-1.5 border border-gray-100 hover:border-accent-orange bg-white transition-all shadow-sm">
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Saved Addresses */}
            {activeTab === 'addresses' && (
              <div className="bg-white p-6 lg:p-8 border border-gray-100 shadow-xl space-y-6 animate-in fade-in duration-300 rounded-none">
                <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">Saved Addresses</h2>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Cleaning coordinates for quick checkout</p>
                  </div>
                  <Button 
                    onClick={() => setShowAddAddr(!showAddAddr)}
                    className="bg-primary text-white font-black text-[9px] uppercase tracking-widest px-4 py-2.5 rounded-none flex items-center"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Address
                  </Button>
                </div>

                {showAddAddr && (
                  <form onSubmit={handleAddAddress} className="p-6 border border-accent-gold bg-accent-gold/5 space-y-4 animate-in slide-in-from-top-4 duration-300">
                    <h3 className="font-black text-primary uppercase text-xs tracking-wider mb-2">New Location Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-[9px] font-black text-primary uppercase tracking-widest mb-1">Label Name</label>
                        <input 
                          type="text" 
                          required
                          value={newAddrName}
                          onChange={e => setNewAddrName(e.target.value)}
                          placeholder="e.g. My Beach House" 
                          className="w-full h-10 border border-gray-300 px-3 font-bold text-xs bg-white focus:outline-primary focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-[9px] font-black text-primary uppercase tracking-widest mb-1">Property Type</label>
                        <select 
                          value={newAddrType}
                          onChange={e => setNewAddrType(e.target.value)}
                          className="w-full h-10 border border-gray-300 px-3 font-bold text-xs bg-white focus:outline-primary"
                        >
                          <option>Residential</option>
                          <option>Commercial</option>
                          <option>Industrial</option>
                        </select>
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-[9px] font-black text-primary uppercase tracking-widest mb-1">Street Address</label>
                        <input 
                          type="text" 
                          required
                          value={newAddrVal}
                          onChange={e => setNewAddrVal(e.target.value)}
                          placeholder="Full address details, building name, state" 
                          className="w-full h-10 border border-gray-300 px-3 font-bold text-xs bg-white focus:outline-primary focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3 pt-2">
                      <Button type="submit" className="bg-primary text-white font-black text-[9px] uppercase tracking-widest px-6 py-3 rounded-none shadow-md">
                        Save Address
                      </Button>
                      <button 
                        type="button" 
                        onClick={() => setShowAddAddr(false)} 
                        className="px-6 py-3 border border-gray-200 text-gray-400 hover:text-primary font-black uppercase text-[9px] tracking-widest bg-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-4">
                  {addresses.map(a => (
                    <div key={a.id} className="p-6 border border-gray-100 bg-white hover:border-primary transition-all flex justify-between items-center shadow-sm border-l-4 border-l-primary">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-black text-primary uppercase text-xs tracking-wider">{a.name}</h4>
                          <span className="bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">{a.type}</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-500 leading-relaxed flex items-start">
                          <MapPin className="w-4 h-4 mr-2 text-accent-gold shrink-0 mt-0.5" />
                          {a.address}
                        </p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleDeleteAddress(a.id)}
                        className="p-2.5 border border-gray-100 hover:border-red-500 text-gray-300 hover:text-red-500 transition-all bg-white"
                        title="Delete Address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Settings */}
            {activeTab === 'settings' && (
              <div className="bg-white p-6 lg:p-8 border border-gray-100 shadow-xl space-y-8 animate-in fade-in duration-300 rounded-none">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">Account Settings</h2>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Update profile information & password</p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {isSaved && (
                    <div className="p-4 bg-primary/10 border-l-4 border-primary text-[10px] font-black text-primary uppercase tracking-wider animate-pulse flex items-center">
                      <ShieldCheck className="w-5 h-5 text-primary mr-2" /> Profile information saved successfully!
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[9px] font-black text-primary uppercase tracking-widest mb-2">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={profile.name}
                        onChange={e => setProfile({...profile, name: e.target.value})}
                        className="w-full h-11 border border-gray-300 px-4 font-bold text-xs bg-white focus:outline-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-primary uppercase tracking-widest mb-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={profile.email}
                        onChange={e => setProfile({...profile, email: e.target.value})}
                        className="w-full h-11 border border-gray-300 px-4 font-bold text-xs bg-white focus:outline-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-primary uppercase tracking-widest mb-2">Phone Number</label>
                      <input 
                        type="text" 
                        required
                        value={profile.phone}
                        onChange={e => setProfile({...profile, phone: e.target.value})}
                        className="w-full h-11 border border-gray-300 px-4 font-bold text-xs bg-white focus:outline-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-primary uppercase tracking-widest mb-2">Primary Hub Location</label>
                      <input 
                        type="text" 
                        disabled
                        value={profile.city}
                        className="w-full h-11 border border-gray-200 px-4 font-bold text-xs bg-secondary/30 text-gray-400 cursor-not-allowed uppercase tracking-wider"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="bg-primary text-white font-black text-[10px] uppercase tracking-widest px-8 py-4 rounded-none shadow-md hover:bg-accent-orange transition-all">
                    Save Profile Settings
                  </Button>
                </form>

                {/* Manage sections quick links inside Settings for Mobile Users */}
                <div className="lg:hidden pt-8 border-t border-gray-100 space-y-3">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Other Account Panels</h4>
                  <button onClick={() => setActiveTab('subscriptions')} className="w-full text-left p-4 bg-secondary/30 hover:bg-secondary/50 font-black uppercase text-[9px] tracking-widest flex justify-between items-center">
                    <span>Manage Subscriptions</span>
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </button>
                  <button onClick={() => setActiveTab('addresses')} className="w-full text-left p-4 bg-secondary/30 hover:bg-secondary/50 font-black uppercase text-[9px] tracking-widest flex justify-between items-center">
                    <span>Manage Address Notebook</span>
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </button>
                </div>

                <div className="pt-8 border-t border-gray-100 space-y-6">
                  <div>
                    <h3 className="font-black text-primary uppercase tracking-tighter text-lg">Change Credentials</h3>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Update password security parameters</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[9px] font-black text-primary uppercase tracking-widest mb-2">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full h-11 border border-gray-300 px-4 font-bold text-xs bg-white focus:outline-primary" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-primary uppercase tracking-widest mb-2">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full h-11 border border-gray-300 px-4 font-bold text-xs bg-white focus:outline-primary" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-primary uppercase tracking-widest mb-2">Confirm New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full h-11 border border-gray-300 px-4 font-bold text-xs bg-white focus:outline-primary" />
                    </div>
                  </div>
                  <Button className="bg-primary text-white font-black text-[10px] uppercase tracking-widest px-8 py-4 rounded-none shadow-md hover:bg-accent-orange transition-all">
                    Update Security Password
                  </Button>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* Glassmorphic Mobile Bottom Navigation Bar (Fixed bottom-0) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-t border-white/10 px-2 py-3 flex justify-around items-center shadow-2xl lg:hidden">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'bookings', label: 'Bookings', icon: Calendar },
          { id: 'book-now', label: 'Book Now', icon: Sparkles, isCTA: true },
          { id: 'payments', label: 'Payments', icon: CreditCard },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(item => {
          const isActive = activeTab === item.id;
          
          if (item.isCTA) {
            return (
              <Link
                key={item.id}
                to="/book"
                className="flex flex-col items-center justify-center flex-1 transition-all scale-110 -mt-5"
              >
                <div className="w-12 h-12 rounded-full bg-accent-orange text-white flex items-center justify-center shadow-2xl border-4 border-primary">
                  <item.icon className="w-5 h-5 animate-pulse" />
                </div>
                <span className="text-[7.5px] font-black uppercase tracking-widest text-accent-gold mt-1">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`flex flex-col items-center justify-center flex-1 transition-all ${
                isActive ? 'text-accent-gold scale-110 font-bold' : 'text-white/40 hover:text-white/80'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1 shrink-0" />
              <span className="text-[7.5px] font-black uppercase tracking-widest text-center truncate w-full leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
