import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminBlogManager } from '../components/home/BlogSection';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ShieldCheck, 
  DollarSign, 
  Filter, 
  Search, 
  Briefcase, 
  CheckCircle2, 
  Trash2,
  Settings,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Booking, BookingStatus } from '../types/database';

type Tab = 'dispatch' | 'recruitment' | 'blog' | 'settings';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('dispatch');

  // Stats
  const stats = [
    { label: 'Total Bookings', value: '1,284', icon: Calendar, color: 'text-primary' },
    { label: 'Hired Cleaners', value: '142', icon: Users, color: 'text-accent-gold' },
    { label: 'Pending Applicants', value: '18', icon: Briefcase, color: 'text-accent-orange' },
    { label: 'Revenue (MTD)', value: '₦4.2M', icon: DollarSign, color: 'text-primary-bright' },
  ];

  // Active bookings with dispatch statuses
  const [bookings, setBookings] = useState<Partial<Booking & { customer_name: string; service_name: string; location_name: string; assigned_cleaner: string }>[]>([
    { id: '1', booking_reference: 'CLN-2025-001', customer_name: 'Chidi Okeke', service_name: 'Deep Restoration', location_name: 'Lekki, Lagos', status: 'in_progress', scheduled_date: '2025-05-20', assigned_cleaner: 'Commander Emeka' },
    { id: '2', booking_reference: 'CLN-2025-002', customer_name: 'Funmi Adebayo', service_name: 'Building Face-lift', location_name: 'Maitama, Abuja', status: 'pending', scheduled_date: '2025-05-21', assigned_cleaner: '' },
    { id: '3', booking_reference: 'CLN-2025-003', customer_name: 'Musa Ibrahim', service_name: 'Post-Build Clean', location_name: 'GRA, Port Harcourt', status: 'completed', scheduled_date: '2025-05-18', assigned_cleaner: 'Specialist Funmi' },
  ]);

  // Vetting application pipeline for cleaners applying to find jobs
  const [applicants, setApplicants] = useState([
    { id: 'app-1', name: 'Kabiru Yusuf', phone: '08029381922', location: 'Ikeja, Lagos', experience: '1-2 years', nin: '49281039481', status: 'Pending Verification' },
    { id: 'app-2', name: 'Adunni Balogun', phone: '08139401293', location: 'Gwarimpa, Abuja', experience: '3+ years', nin: '12938102938', status: 'Pending Verification' },
    { id: 'app-3', name: 'Ngozi Nwachukwu', phone: '09012391039', location: 'GRA, Port Harcourt', experience: 'No experience', nin: '82049103948', status: 'Pending Verification' }
  ]);

  // Settings Configuration State
  const [vettingMode, setVettingMode] = useState('simulated');
  const [smsGateway, setSmsGateway] = useState('termii');
  const [apiKey, setApiKey] = useState('tm_live_93810a08df9328490a0d');
  const [dispatchBuffer, setDispatchBuffer] = useState('2');
  const [sandboxEnabled, setSandboxEnabled] = useState(true);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleAssignCleaner = (bookingId: string, cleanerName: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, assigned_cleaner: cleanerName, status: cleanerName ? 'confirmed' : 'pending' } : b));
    console.log(`[Dispatcher] Assigned Cleaner ${cleanerName} to booking ID ${bookingId}`);
  };

  const handleHireApplicant = (applicantId: string) => {
    setApplicants(prev => prev.filter(app => app.id !== applicantId));
    console.log(`[Hiring] Hired & Onboarded applicant ID: ${applicantId}. Account generated, and SMS notification dispatched via Termii.`);
  };

  const handleRejectApplicant = (applicantId: string) => {
    setApplicants(prev => prev.filter(app => app.id !== applicantId));
    console.log(`[Hiring] Application archived for ID: ${applicantId}`);
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'completed': return 'bg-primary/10 text-primary';
      case 'pending': return 'bg-accent-orange/10 text-accent-orange';
      case 'in_progress': return 'bg-accent-gold/10 text-accent-gold';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-400';
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const menuItems = [
    { id: 'dispatch', label: 'Overview & Dispatch', icon: LayoutDashboard },
    { id: 'recruitment', label: 'Recruitment Hub', icon: Users },
    { id: 'blog', label: 'Blog Manager', icon: BookOpen },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ] as const;

  return (
    <div className="min-h-screen bg-secondary/30 pb-24 lg:pb-12 font-sans flex flex-col">
      
      {/* Sticky Mobile Header */}
      <header className="sticky top-0 z-40 bg-primary text-white py-4 px-6 flex justify-between items-center shadow-lg lg:hidden">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary font-heading font-black text-lg italic border border-white">CN</div>
          <span className="font-heading font-black uppercase text-base tracking-tighter">HQ Dispatch</span>
        </Link>
        <div className="flex items-center space-x-3 bg-[#144718] px-3 py-1.5 rounded-full border border-white/10">
          <div className="w-2 h-2 rounded-full bg-accent-orange animate-pulse"></div>
          <span className="text-[9px] font-black uppercase tracking-widest text-accent-gold">SuperAdmin</span>
        </div>
      </header>

      {/* Hero Banner Header (Desktop Only) */}
      <div className="bg-primary pt-12 pb-24 text-white relative overflow-hidden hidden lg:block">
        <div className="absolute right-0 top-0 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="container mx-auto px-6 relative z-10 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2 bg-[#144718] px-3 py-1 rounded-full border border-white/10 w-fit mb-4">
              <ShieldCheck className="w-3 h-3 text-accent-gold" />
              <span className="text-[9px] font-black uppercase tracking-widest text-accent-gold">CleanNaija Command Center</span>
            </div>
            <h1 className="text-4xl font-heading font-black uppercase tracking-tighter">HQ Operations</h1>
            <p className="text-white/60 font-bold uppercase tracking-widest text-[10px] mt-1">Lekki Dispatch Control & Administration</p>
          </div>
          <div className="flex space-x-4 bg-white/5 p-4 border border-white/10 rounded-none">
            <div className="text-center px-4 border-r border-white/10">
              <p className="text-[9px] font-black text-white/50 uppercase">Active Hubs</p>
              <p className="text-xl font-black text-accent-gold">4 STATIONS</p>
            </div>
            <div className="text-center px-4">
              <p className="text-[9px] font-black text-white/50 uppercase">NIN Vetting</p>
              <p className="text-xl font-black text-primary-bright">99.8% OK</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Structure */}
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
                <span className="text-[7.5px] tracking-[0.2em] font-black text-accent-gold uppercase">Command Center</span>
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
            
            {/* Quick Status Sidebar Widget */}
            <div className="p-6 bg-white border border-gray-100 rounded-none border-t-4 border-t-accent-gold shadow-md space-y-4">
              <h4 className="font-black text-primary uppercase text-[10px] tracking-wider border-b border-gray-50 pb-2">Vetting Services</h4>
              <div className="flex items-center space-x-3 p-3 bg-primary/5 border-l-4 border-primary">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                <p className="text-[8.5px] font-black text-primary uppercase leading-normal">
                  NIMC API connected. Background validation checks are fully live.
                </p>
              </div>
            </div>
          </aside>

          {/* Right Content Area */}
          <main className="lg:col-span-3 pb-16">
            
            {/* Tab: Dispatch Overview */}
            {activeTab === 'dispatch' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map(s => (
                    <Card key={s.label} className="p-6 rounded-none border-b-4 border-accent-gold shadow-md bg-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{s.label}</p>
                          <p className="text-xl font-black text-primary uppercase tracking-tighter">{s.value}</p>
                        </div>
                        <s.icon className={`w-5 h-5 ${s.color} shrink-0`} />
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Bookings Dispatch Table */}
                  <div className="xl:col-span-2">
                    <Card className="rounded-none border-t-8 border-primary shadow-xl overflow-hidden bg-white">
                      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                          <h3 className="font-black text-primary uppercase tracking-tighter text-lg">Mission Dispatch Control</h3>
                          <p className="text-[8.5px] text-gray-400 font-bold uppercase tracking-widest">Assign staff cleaners to scheduled bookings</p>
                        </div>
                        <div className="flex items-center space-x-2 w-full sm:w-auto">
                          <div className="relative flex-grow sm:flex-none">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
                            <input className="w-full sm:w-40 pl-8 pr-3 py-1.5 border border-gray-100 font-bold text-[9px] uppercase tracking-widest focus:outline-primary bg-white" placeholder="Search..." />
                          </div>
                          <button className="p-2 border border-gray-100 text-gray-400 bg-white"><Filter className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-secondary/50 border-b border-gray-100">
                            <tr>
                              {['Ref', 'Customer', 'Service & Area', 'Status', 'Assign Specialist'].map(h => (
                                <th key={h} className="px-6 py-4 text-[9px] font-black text-primary uppercase tracking-[0.2em]">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 bg-white">
                            {bookings.map(b => (
                              <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-5 text-[9px] font-black text-primary tracking-widest">{b.booking_reference}</td>
                                <td className="px-6 py-5">
                                  <p className="text-xs font-bold text-gray-600">{b.customer_name}</p>
                                  <p className="text-[8px] text-gray-400 font-bold uppercase">{b.scheduled_date}</p>
                                </td>
                                <td className="px-6 py-5">
                                  <p className="text-[9px] font-black uppercase text-accent-gold leading-tight">{b.service_name}</p>
                                  <p className="text-[9px] font-bold text-gray-400">{b.location_name}</p>
                                </td>
                                <td className="px-6 py-5">
                                  <span className={`px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-full ${getStatusColor(b.status as BookingStatus)}`}>
                                    {b.status === 'confirmed' ? 'Scheduled' : b.status?.replace('_', ' ')}
                                  </span>
                                </td>
                                <td className="px-6 py-5">
                                  <select 
                                    value={b.assigned_cleaner} 
                                    onChange={e => handleAssignCleaner(b.id!, e.target.value)}
                                    className="text-[9px] font-black uppercase tracking-widest border border-gray-200 p-1.5 bg-white focus:outline-primary w-full max-w-[140px]"
                                  >
                                    <option value="">Unassigned</option>
                                    <option value="Commander Emeka">Emeka (Lagos)</option>
                                    <option value="Specialist Funmi">Funmi (Abuja)</option>
                                    <option value="Specialist Adunni">Adunni (Lagos)</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </div>

                  {/* Sidebar Feed */}
                  <div className="xl:col-span-1">
                    <Card className="p-6 rounded-none border-t-8 border-primary shadow-xl bg-white space-y-6">
                      <div>
                        <h3 className="font-black text-primary uppercase tracking-tighter text-lg">Live Feeds</h3>
                        <p className="text-[8.5px] text-gray-400 font-bold uppercase tracking-widest">Real-time dispatcher logs</p>
                      </div>
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                            <div>
                              <p className="font-black text-primary uppercase text-[10px]">Mission #{2840 + i}</p>
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                                {i === 1 ? "Lekki • Emeka" : i === 2 ? "Maitama • Pending" : "PH • Specialist Funmi"}
                              </p>
                            </div>
                            <div className={`px-2 py-0.5 text-[7.5px] font-black uppercase tracking-widest ${i === 2 ? "bg-accent-orange/10 text-accent-orange" : "bg-primary/5 text-primary"}`}>
                              {i === 2 ? "Alert" : "Active"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Recruitment Hub */}
            {activeTab === 'recruitment' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <Card className="p-6 lg:p-8 rounded-none border-t-8 border-accent-gold shadow-xl bg-white space-y-6">
                  <div>
                    <h3 className="font-black text-primary uppercase tracking-tighter text-xl">Recruitment & Vetting</h3>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Review employee submissions and NIN registrations</p>
                  </div>

                  {applicants.length > 0 ? (
                    <div className="space-y-4">
                      {applicants.map(app => (
                        <div key={app.id} className="p-6 border border-gray-100 bg-white hover:border-accent-gold transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm border-l-4 border-l-primary">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <h4 className="font-black text-primary uppercase text-sm">{app.name}</h4>
                              <span className="bg-accent-gold/15 text-primary text-[8px] font-black uppercase tracking-widest px-2 py-0.5">{app.experience}</span>
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone: {app.phone} • Hub Target: {app.location}</p>
                            <div className="inline-flex items-center space-x-2 text-[9px] font-black text-primary uppercase tracking-wider bg-secondary px-3 py-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span>NIN: {app.nin} (Simulated Active Vetting)</span>
                            </div>
                          </div>
                          <div className="flex space-x-3 w-full md:w-auto">
                            <button 
                              onClick={() => handleHireApplicant(app.id)}
                              className="flex-grow md:flex-none bg-primary text-white text-[9.5px] font-black uppercase tracking-widest px-5 py-3 hover:bg-accent-orange transition-all"
                            >
                              Approve & Hire
                            </button>
                            <button 
                              onClick={() => handleRejectApplicant(app.id)}
                              className="p-3 border border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-500 transition-all bg-white"
                              title="Reject Application"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 border-2 border-dashed border-gray-100 rounded-none text-center bg-secondary/10">
                      <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-3" />
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No pending applications to review.</p>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Tab: Blog Manager */}
            {activeTab === 'blog' && (
              <div className="bg-white p-6 lg:p-8 border border-gray-100 shadow-xl animate-in fade-in duration-300 rounded-none">
                <AdminBlogManager />
              </div>
            )}

            {/* Tab: System Settings */}
            {activeTab === 'settings' && (
              <div className="bg-white p-6 lg:p-8 border border-gray-100 shadow-xl animate-in fade-in duration-300 rounded-none space-y-8">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">System Settings</h2>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Global configurations for background APIs & dispatch rules</p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-6">
                  {settingsSaved && (
                    <div className="p-4 bg-primary/10 border-l-4 border-primary text-[10px] font-black text-primary uppercase tracking-wider animate-pulse flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-primary mr-2" /> Global dispatch parameters updated successfully!
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[9px] font-black text-primary uppercase tracking-widest mb-2">Vetting Check Mode</label>
                      <select 
                        value={vettingMode}
                        onChange={e => setVettingMode(e.target.value)}
                        className="w-full h-11 border border-gray-300 px-4 font-bold text-xs bg-white focus:outline-primary"
                      >
                        <option value="simulated">Simulated Sandbox NIN check (Lekki Dev)</option>
                        <option value="live">Live NIMC Production Verification API</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black text-primary uppercase tracking-widest mb-2">SMS Integration Gateway</label>
                      <select 
                        value={smsGateway}
                        onChange={e => setSmsGateway(e.target.value)}
                        className="w-full h-11 border border-gray-300 px-4 font-bold text-xs bg-white focus:outline-primary"
                      >
                        <option value="termii">Termii SMS Gateway (Nigeria)</option>
                        <option value="twilio">Twilio Global API</option>
                        <option value="none">Disabled SMS Alerts</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black text-primary uppercase tracking-widest mb-2">Gateway Bearer API Token</label>
                      <input 
                        type="text" 
                        value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                        className="w-full h-11 border border-gray-300 px-4 font-bold text-xs bg-white focus:outline-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-black text-primary uppercase tracking-widest mb-2">Dispatch Buffer Window (Hours)</label>
                      <input 
                        type="number" 
                        value={dispatchBuffer}
                        onChange={e => setDispatchBuffer(e.target.value)}
                        className="w-full h-11 border border-gray-300 px-4 font-bold text-xs bg-white focus:outline-primary"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-accent-gold/10 border-2 border-accent-gold text-left flex items-start space-x-3">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">HQ Sandbox Rules</p>
                      <label className="flex items-center space-x-2 cursor-pointer mt-1">
                        <input 
                          type="checkbox" 
                          checked={sandboxEnabled}
                          onChange={e => setSandboxEnabled(e.target.checked)}
                          className="w-4 h-4 rounded text-primary focus:ring-primary focus:ring-2"
                        />
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Toggle development testing credentials bypass</span>
                      </label>
                    </div>
                  </div>

                  <Button type="submit" className="bg-primary text-white font-black text-[10px] uppercase tracking-widest px-8 py-4 rounded-none shadow-md hover:bg-accent-orange transition-all">
                    Save Operations Settings
                  </Button>
                </form>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* Glassmorphic Mobile Bottom Navigation Bar (Fixed bottom-0) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-t border-white/10 px-2 py-3 flex justify-around items-center shadow-2xl lg:hidden">
        {menuItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 transition-all ${
                isActive ? 'text-accent-gold scale-110 font-bold' : 'text-white/40 hover:text-white/80'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1 shrink-0" />
              <span className="text-[7.5px] font-black uppercase tracking-widest text-center truncate w-full leading-none">
                {item.id === 'dispatch' ? 'Dispatch' : 
                 item.id === 'recruitment' ? 'Hiring' : 
                 item.id === 'blog' ? 'Blog' : 'Settings'}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
