import { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  Settings,
  Plus,
  Trash2,
  ChevronRight,
  User,
  ShieldCheck,
  Sparkles,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { api, ApiAddress, ApiBooking, ApiSubscription } from '../lib/api';

type Tab = 'overview' | 'bookings' | 'subscriptions' | 'payments' | 'addresses' | 'settings';

const naira = (n?: number) => (n != null ? `₦${Number(n).toLocaleString()}` : '—');
const fmtDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

export function CustomerDashboard() {
  const { currentUser, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Live data (null = loading)
  const [addresses, setAddresses] = useState<ApiAddress[] | null>(null);
  const [bookings, setBookings] = useState<ApiBooking[] | null>(null);
  const [subscriptions, setSubscriptions] = useState<ApiSubscription[] | null>(null);

  // Address form
  const [newAddrLabel, setNewAddrLabel] = useState<'Home' | 'Office' | 'Other'>('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newLga, setNewLga] = useState('');
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [savingAddr, setSavingAddr] = useState(false);

  // Profile form
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAddresses = useCallback(() => {
    api.addresses.list().then(setAddresses).catch(() => setAddresses([]));
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', { replace: true });
      return;
    }
    loadAddresses();
    api.bookings.mine().then(setBookings).catch(() => setBookings([]));
    api.subscriptions.list().then(setSubscriptions).catch(() => setSubscriptions([]));
  }, [isAuthenticated, loadAddresses, navigate]);

  useEffect(() => {
    if (currentUser) {
      setProfileName(`${currentUser.first_name} ${currentUser.last_name}`.trim());
      setProfilePhone(currentUser.phone || '');
    }
  }, [currentUser]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newState) return;
    setSavingAddr(true);
    setError(null);
    try {
      await api.addresses.create({
        label: newAddrLabel,
        streetAddress: newStreet,
        city: newCity,
        state: newState,
        lga: newLga || newCity,
      });
      setNewStreet('');
      setNewCity('');
      setNewState('');
      setNewLga('');
      setShowAddAddr(false);
      loadAddresses();
    } catch (err: any) {
      setError(err?.message || 'Could not save address.');
    } finally {
      setSavingAddr(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    setAddresses((prev) => (prev ? prev.filter((a) => a.id !== id) : prev));
    try {
      await api.addresses.remove(id);
    } catch {
      loadAddresses();
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setError(null);
    try {
      const [firstName, ...rest] = profileName.trim().split(' ');
      await api.auth.updateProfile({ firstName, lastName: rest.join(' '), phone: profilePhone });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      setError(err?.message || 'Could not save profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'subscriptions', label: 'Subscriptions', icon: Clock },
    { id: 'payments', label: 'Payment History', icon: CreditCard },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  const displayName = currentUser ? `${currentUser.first_name} ${currentUser.last_name}`.trim() : 'there';

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary/30 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-black text-primary uppercase tracking-tighter mb-3">Please log in</h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px] mb-8">Sign in to view your dashboard.</p>
        <Link to="/auth">
          <Button className="bg-primary text-white font-black uppercase tracking-widest px-10 py-4 rounded-none">Login / Sign up</Button>
        </Link>
      </div>
    );
  }

  const Empty = ({ label }: { label: string }) => (
    <div className="py-16 text-center text-gray-400 font-black uppercase tracking-widest text-[11px]">{label}</div>
  );

  return (
    <div className="min-h-screen bg-secondary/30 pb-24 lg:pb-12 font-sans flex flex-col">
      {/* Mobile header */}
      <header className="sticky top-0 z-40 bg-primary text-white py-4 px-6 flex justify-between items-center shadow-lg lg:hidden">
        <Link to="/" className="flex items-center bg-white p-1 rounded">
          <img src="/logo.png" alt="CleanNaija - Spotless Every Surface" className="h-6 w-auto object-contain" />
        </Link>
        <div className="flex items-center space-x-3 bg-[#144718] px-3 py-1.5 rounded-full border border-white/10">
          <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse"></div>
          <span className="text-[9px] font-black uppercase tracking-widest text-accent-gold">{currentUser?.first_name}</span>
        </div>
      </header>

      {/* Desktop banner */}
      <div className="bg-primary pt-12 pb-24 text-white relative overflow-hidden hidden lg:block">
        <div className="absolute right-0 top-0 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="container mx-auto px-6 relative z-10 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2 bg-[#144718] px-3 py-1 rounded-full border border-white/10 w-fit mb-4">
              <Sparkles className="w-3 h-3 text-accent-gold" />
              <span className="text-[9px] font-black uppercase tracking-widest text-accent-gold">{currentUser?.role || 'Member'}</span>
            </div>
            <h1 className="text-4xl font-heading font-black uppercase tracking-tighter">My Account</h1>
            <p className="text-white/60 font-bold uppercase tracking-widest text-[10px] mt-1">Welcome back, {displayName}</p>
          </div>
          <Link to="/book">
            <Button className="bg-accent-orange text-white font-black text-[10px] uppercase tracking-widest px-6 py-4 rounded-none shadow-xl hover:bg-white hover:text-accent-orange transition-all">
              Book Cleaning Service
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 flex-grow mt-6 lg:-mt-16 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-3 hidden lg:block">
            <Link to="/" className="flex items-center mb-6 px-2">
              <img src="/logo.png" alt="CleanNaija - Spotless Every Surface" className="h-10 w-auto object-contain" />
            </Link>

            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-6 py-4 font-black uppercase tracking-widest text-[10px] transition-all duration-300 border-l-4 rounded-none shadow-md ${
                    isActive ? 'bg-primary text-white border-accent-gold shadow-xl scale-[1.02]' : 'bg-white text-gray-400 border-transparent hover:bg-gray-50 hover:text-primary'
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
          </aside>

          {/* Content */}
          <main className="lg:col-span-3 pb-16">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-[10px] font-black text-red-600 uppercase tracking-wider">{error}</div>
            )}

            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="bg-gradient-to-r from-primary via-primary/95 to-primary-bright text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden border-b-8 border-accent-gold">
                  <div className="absolute right-0 top-0 w-64 h-64 bg-accent-gold/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                  <div className="relative z-10 max-w-lg space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-gold">Welcome back</p>
                      <h2 className="text-3xl lg:text-4xl font-heading font-black uppercase tracking-tighter leading-none mt-1">{displayName}</h2>
                    </div>
                    <p className="text-xs text-white/75 font-semibold uppercase tracking-wider leading-relaxed">Ready to schedule your next spotless shine? Book a vetted field specialist today.</p>
                    <Link to="/book">
                      <Button className="bg-white text-primary hover:bg-accent-orange hover:text-white font-black text-[10px] uppercase tracking-widest px-6 py-4 rounded-full shadow-lg transition-all duration-300">
                        <Sparkles className="w-4 h-4 mr-2" /> Book Spotless Clean
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:gap-6">
                  {[
                    { label: 'Upcoming Bookings', value: bookings == null ? '…' : `${bookings.filter((b) => ['pending', 'confirmed', 'in_progress'].includes(b.status)).length}`, sub: 'Active runs', icon: Calendar, bg: 'bg-primary/10 text-primary', tab: 'bookings' },
                    { label: 'Saved Addresses', value: addresses == null ? '…' : `${addresses.length}`, sub: 'Locations', icon: MapPin, bg: 'bg-accent-gold/10 text-primary', tab: 'addresses' },
                    { label: 'Hygiene Plans', value: subscriptions == null ? '…' : `${subscriptions.filter((s) => s.status === 'active').length}`, sub: 'Recurring care', icon: Clock, bg: 'bg-accent-orange/10 text-accent-orange', tab: 'subscriptions' },
                    { label: 'Total Bookings', value: bookings == null ? '…' : `${bookings.length}`, sub: 'All time', icon: CreditCard, bg: 'bg-primary-bright/10 text-primary-bright', tab: 'bookings' },
                  ].map((metric, i) => (
                    <button key={i} onClick={() => setActiveTab(metric.tab as Tab)} className="p-5 lg:p-6 bg-white border border-gray-100 rounded-3xl shadow-md text-left hover:shadow-lg hover:border-accent-gold transition-all duration-300 flex flex-col justify-between h-40 group">
                      <div className="flex justify-between items-start w-full">
                        <span className="text-[8.5px] font-black text-gray-400 uppercase tracking-widest leading-none">{metric.label}</span>
                        <div className={`p-2.5 rounded-full shrink-0 ${metric.bg} group-hover:scale-110 transition-transform`}>
                          <metric.icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-black text-primary uppercase tracking-tighter leading-none">{metric.value}</p>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">{metric.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bookings */}
            {activeTab === 'bookings' && (
              <div className="bg-white p-6 lg:p-8 border border-gray-100 shadow-xl space-y-6 animate-in fade-in duration-300 rounded-none">
                <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">My Bookings</h2>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Active dispatch runs & cleaning history</p>
                  </div>
                  <Link to="/book"><Button size="sm" className="bg-accent-orange text-white font-black text-[9px] uppercase tracking-widest px-4 py-2">New Booking</Button></Link>
                </div>
                {bookings == null ? <Empty label="Loading bookings…" /> : bookings.length === 0 ? <Empty label="No bookings yet — book your first clean!" /> : (
                  <div className="space-y-4">
                    {bookings.map((b) => (
                      <div key={b.id} className="p-6 border border-gray-100 bg-white hover:border-primary transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm border-l-4 border-l-accent-gold">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-black text-primary uppercase text-sm tracking-tight">{b.service?.name || 'Cleaning service'}</h4>
                            <span className="px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-full bg-accent-gold/15 text-primary">{b.status}</span>
                          </div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center"><Calendar className="w-3.5 h-3.5 mr-2 text-primary shrink-0" />{fmtDate(b.scheduledDate)} {b.scheduledTimeSlot ? `• ${b.scheduledTimeSlot}` : ''}</p>
                          {b.cleaner?.user && (
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center bg-secondary/50 px-3 py-1 w-fit"><User className="w-3.5 h-3.5 mr-2 text-primary shrink-0" />Assigned: {b.cleaner.user.firstName} {b.cleaner.user.lastName}</p>
                          )}
                        </div>
                        <div className="text-right w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 flex md:flex-col justify-between items-center md:items-end">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest md:mb-1">Ref: {b.bookingReference}</p>
                          <p className="text-xl font-black text-primary">{naira(b.finalPrice ?? b.quotedPrice)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Subscriptions */}
            {activeTab === 'subscriptions' && (
              <div className="bg-white p-6 lg:p-8 border border-gray-100 shadow-xl space-y-6 animate-in fade-in duration-300 rounded-none">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">Hygiene Subscriptions</h2>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Recurring weekly/monthly washes</p>
                </div>
                {subscriptions == null ? <Empty label="Loading subscriptions…" /> : subscriptions.length === 0 ? <Empty label="No active subscriptions." /> : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {subscriptions.map((s) => (
                      <div key={s.id} className="p-6 border border-gray-100 bg-white shadow-sm border-t-4 border-t-primary flex flex-col justify-between h-52">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-black text-primary uppercase text-sm tracking-tight">{s.service?.name || 'Plan'}</h4>
                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-full ${s.status === 'active' ? 'bg-primary-bright/10 text-primary-bright' : 'bg-gray-100 text-gray-400'}`}>{s.status}</span>
                          </div>
                          <p className="text-[10px] font-black text-accent-gold uppercase tracking-widest mb-1">{naira(s.pricePerVisit)} / visit</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Frequency: {s.frequency}</p>
                        </div>
                        <div className="pt-4 border-t border-gray-50">
                          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Next Run</p>
                          <p className="text-[10px] font-black text-primary uppercase">{fmtDate(s.nextBookingDate)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Payments */}
            {activeTab === 'payments' && (
              <div className="bg-white p-6 lg:p-8 border border-gray-100 shadow-xl space-y-6 animate-in fade-in duration-300 rounded-none">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">Payment History</h2>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Invoices & transactions</p>
                </div>
                {bookings == null ? <Empty label="Loading…" /> : bookings.filter((b) => b.paymentStatus === 'paid').length === 0 ? (
                  <Empty label="No payments yet. Paid bookings will appear here." />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-secondary border-b border-gray-100"><tr>{['Reference', 'Date', 'Service', 'Amount', 'Status'].map((h) => <th key={h} className="px-6 py-4 text-[9px] font-black text-primary uppercase tracking-[0.2em]">{h}</th>)}</tr></thead>
                      <tbody className="divide-y divide-gray-50 bg-white">
                        {bookings.filter((b) => b.paymentStatus === 'paid').map((b) => (
                          <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-[10px] font-black text-primary tracking-widest">{b.bookingReference}</td>
                            <td className="px-6 py-4 text-xs font-bold text-gray-500">{fmtDate(b.scheduledDate)}</td>
                            <td className="px-6 py-4 text-xs font-bold text-gray-600 uppercase">{b.service?.name}</td>
                            <td className="px-6 py-4 text-xs font-black text-primary">{naira(b.finalPrice ?? b.quotedPrice)}</td>
                            <td className="px-6 py-4 text-[9px] font-black text-primary-bright uppercase tracking-widest">{b.paymentStatus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Addresses */}
            {activeTab === 'addresses' && (
              <div className="bg-white p-6 lg:p-8 border border-gray-100 shadow-xl space-y-6 animate-in fade-in duration-300 rounded-none">
                <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">Saved Addresses</h2>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Cleaning coordinates for quick checkout</p>
                  </div>
                  <Button onClick={() => setShowAddAddr(!showAddAddr)} className="bg-primary text-white font-black text-[9px] uppercase tracking-widest px-4 py-2.5 rounded-none flex items-center"><Plus className="w-3.5 h-3.5 mr-1" /> Add Address</Button>
                </div>

                {showAddAddr && (
                  <form onSubmit={handleAddAddress} className="p-6 border border-accent-gold bg-accent-gold/5 space-y-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-black text-primary uppercase tracking-widest mb-1">Label</label>
                        <select value={newAddrLabel} onChange={(e) => setNewAddrLabel(e.target.value as any)} className="w-full h-10 border border-gray-300 px-3 font-bold text-xs bg-white focus:outline-primary">
                          <option value="Home">Home</option>
                          <option value="Office">Office</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div><label className="block text-[9px] font-black text-primary uppercase tracking-widest mb-1">City</label><input required value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="e.g. Lekki" className="w-full h-10 border border-gray-300 px-3 font-bold text-xs bg-white focus:outline-primary" /></div>
                      <div><label className="block text-[9px] font-black text-primary uppercase tracking-widest mb-1">State</label><input required value={newState} onChange={(e) => setNewState(e.target.value)} placeholder="e.g. Lagos" className="w-full h-10 border border-gray-300 px-3 font-bold text-xs bg-white focus:outline-primary" /></div>
                      <div><label className="block text-[9px] font-black text-primary uppercase tracking-widest mb-1">LGA</label><input value={newLga} onChange={(e) => setNewLga(e.target.value)} placeholder="e.g. Eti-Osa" className="w-full h-10 border border-gray-300 px-3 font-bold text-xs bg-white focus:outline-primary" /></div>
                      <div className="md:col-span-2"><label className="block text-[9px] font-black text-primary uppercase tracking-widest mb-1">Street Address</label><input required value={newStreet} onChange={(e) => setNewStreet(e.target.value)} placeholder="Building, street, area" className="w-full h-10 border border-gray-300 px-3 font-bold text-xs bg-white focus:outline-primary" /></div>
                    </div>
                    <div className="flex space-x-3 pt-2">
                      <Button type="submit" disabled={savingAddr} className="bg-primary text-white font-black text-[9px] uppercase tracking-widest px-6 py-3 rounded-none shadow-md disabled:opacity-50">{savingAddr ? 'Saving…' : 'Save Address'}</Button>
                      <button type="button" onClick={() => setShowAddAddr(false)} className="px-6 py-3 border border-gray-200 text-gray-400 hover:text-primary font-black uppercase text-[9px] tracking-widest bg-white">Cancel</button>
                    </div>
                  </form>
                )}

                {addresses == null ? <Empty label="Loading addresses…" /> : addresses.length === 0 ? <Empty label="No saved addresses yet." /> : (
                  <div className="space-y-4">
                    {addresses.map((a) => (
                      <div key={a.id} className="p-6 border border-gray-100 bg-white hover:border-primary transition-all flex justify-between items-center shadow-sm border-l-4 border-l-primary">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-black text-primary uppercase text-xs tracking-wider">{a.label}</h4>
                            {a.isDefault && <span className="bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Default</span>}
                          </div>
                          <p className="text-xs font-semibold text-gray-500 leading-relaxed flex items-start"><MapPin className="w-4 h-4 mr-2 text-accent-gold shrink-0 mt-0.5" />{a.streetAddress}, {a.city}, {a.state}</p>
                        </div>
                        <button type="button" onClick={() => handleDeleteAddress(a.id)} className="p-2.5 border border-gray-100 hover:border-red-500 text-gray-300 hover:text-red-500 transition-all bg-white" title="Delete Address"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div className="bg-white p-6 lg:p-8 border border-gray-100 shadow-xl space-y-8 animate-in fade-in duration-300 rounded-none">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">Account Settings</h2>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Update your profile information</p>
                </div>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {isSaved && <div className="p-4 bg-primary/10 border-l-4 border-primary text-[10px] font-black text-primary uppercase tracking-wider flex items-center"><ShieldCheck className="w-5 h-5 text-primary mr-2" /> Profile saved successfully!</div>}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[9px] font-black text-primary uppercase tracking-widest mb-2">Full Name</label>
                      <input type="text" required value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full h-11 border border-gray-300 px-4 font-bold text-xs bg-white focus:outline-primary" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-primary uppercase tracking-widest mb-2">Email Address</label>
                      <input type="email" disabled value={currentUser?.email || ''} className="w-full h-11 border border-gray-200 px-4 font-bold text-xs bg-secondary/30 text-gray-400 cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-primary uppercase tracking-widest mb-2">Phone Number</label>
                      <input type="text" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} className="w-full h-11 border border-gray-300 px-4 font-bold text-xs bg-white focus:outline-primary" />
                    </div>
                  </div>
                  <Button type="submit" disabled={savingProfile} className="bg-primary text-white font-black text-[10px] uppercase tracking-widest px-8 py-4 rounded-none shadow-md hover:bg-accent-orange transition-all disabled:opacity-50">{savingProfile ? 'Saving…' : 'Save Profile Settings'}</Button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-t border-white/10 px-2 py-3 flex justify-around items-center shadow-2xl lg:hidden">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'bookings', label: 'Bookings', icon: Calendar },
          { id: 'book-now', label: 'Book Now', icon: Sparkles, isCTA: true },
          { id: 'payments', label: 'Payments', icon: CreditCard },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((item) => {
          const isActive = activeTab === item.id;
          if (item.isCTA) {
            return (
              <Link key={item.id} to="/book" className="flex flex-col items-center justify-center flex-1 transition-all scale-110 -mt-5">
                <div className="w-12 h-12 rounded-full bg-accent-orange text-white flex items-center justify-center shadow-2xl border-4 border-primary"><item.icon className="w-5 h-5 animate-pulse" /></div>
                <span className="text-[7.5px] font-black uppercase tracking-widest text-accent-gold mt-1">{item.label}</span>
              </Link>
            );
          }
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id as Tab)} className={`flex flex-col items-center justify-center flex-1 transition-all ${isActive ? 'text-accent-gold scale-110 font-bold' : 'text-white/40 hover:text-white/80'}`}>
              <item.icon className="w-5 h-5 mb-1 shrink-0" />
              <span className="text-[7.5px] font-black uppercase tracking-widest text-center truncate w-full leading-none">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
