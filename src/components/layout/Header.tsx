import { useState } from 'react';
import { Menu, X, Phone, ChevronDown, UserCircle, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { cn } from '../../utils/cn';

const RESIDENTIAL_SERVICES = [
  { title: "Full Building Face-lift", slug: "full-building-face-lift" },
  { title: "Interlock & Driveway Shine", slug: "interlock-driveway-shine" },
  { title: "Roof & Parapet Washing", slug: "roof-parapet-washing" },
  { title: "Low-Pressure Soft Wash", slug: "low-pressure-soft-wash" },
  { title: "Annual Estate Power Wash", slug: "annual-estate-power-wash" },
  { title: "Fence & Stonework Washing", slug: "fence-stonework-washing" },
  { title: "Veranda & Deck Care", slug: "veranda-deck-care" },
  { title: "Gutter De-clogging", slug: "gutter-de-clogging" },
  { title: "Drainage & Gutter Wash", slug: "drainage-gutter-wash" },
  { title: "Home Maintenance Review", slug: "home-maintenance-review" },
  { title: "Standard Home Shine", slug: "standard-home-shine" },
  { title: "Deep Restoration Clean", slug: "deep-restoration-clean" },
  { title: "Laundry & Dry Cleaning", slug: "deep-restoration-clean" },
  { title: "Professional Fumigation", slug: "professional-fumigation" },
  { title: "Festive Decor Installation", slug: "festive-decor-installation" }
];

const COMMERCIAL_SERVICES = [
  { title: "Corporate Fleet Maintenance", slug: "corporate-fleet-maintenance" },
  { title: "Office & Workspace Hygiene", slug: "office-workspace-hygiene" },
  { title: "Restaurant & Eatery Cleaning", slug: "restaurant-eatery-cleaning" },
  { title: "Shop Front & Signage Shine", slug: "shop-front-signage-shine" },
  { title: "Reception & Lobby Detail", slug: "reception-lobby-detail" },
  { title: "Estate & Block Maintenance", slug: "estate-block-maintenance" },
  { title: "Community Area Care", slug: "community-area-care" },
  { title: "Elderly Home Sanitization", slug: "elderly-home-sanitization" },
  { title: "Hotel & Resort Maintenance", slug: "hotel-resort-maintenance" },
  { title: "Post-Build Cleanup", slug: "post-build-cleanup" },
  { title: "Arena & Sports Complex Care", slug: "arena-sports-complex-care" },
  { title: "Sports Court Restoration", slug: "sports-court-restoration" },
  { title: "Plaza & Mall Management", slug: "plaza-mall-management" },
  { title: "Public Building Cleaning", slug: "public-building-cleaning" },
  { title: "Corporate Festive Decor", slug: "corporate-festive-decor" }
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [lang, setLang] = useState('EN');
  const { location, logout, isAuthenticated, currentUser } = useUser();

  const languages = ['EN', 'PCM', 'YO', 'HA', 'IG'];

  return (
    <header className="sticky top-0 z-50 bg-primary text-white shadow-md font-sans">
      {/* Top bar for phone & localization */}
      <div className="bg-[#144718] py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-[9px] font-black tracking-widest uppercase">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 border-r border-white/10 pr-6 mr-2">
              {languages.map(l => (
                <button 
                  key={l} 
                  onClick={() => setLang(l)}
                  className={cn("hover:text-accent-gold transition-colors", lang === l ? "text-accent-gold" : "text-white/40")}
                >
                  {l}
                </button>
              ))}
            </div>
            {location && (
              <div className="flex items-center text-accent-gold hidden sm:flex">
                <MapPin className="w-3 h-3 mr-1" />
                <span>Hub: {location.city}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-6">
            <a href="tel:0800-CLEAN-9JA" className="flex items-center hover:text-accent-gold transition-colors">
              <Phone className="w-3 h-3 mr-2" />
              0800-CLEAN-9JA
            </a>
            {location && (
              <button onClick={logout} className="opacity-40 hover:opacity-100 transition-opacity">Reset</button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 w-full">
          
          {/* Left Side: Logo (Aligned Left) */}
          <div className="w-1/4 flex justify-start">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="CleanNaija - Spotless Every Surface" className="h-10 md:h-12 w-auto object-contain" />
            </Link>
          </div>

          {/* Middle Side: Navigation Menu (Centered) */}
          <nav className="hidden lg:flex items-center justify-center space-x-1 w-2/4">
            <div 
              className="relative group px-3 py-7 cursor-pointer"
              onMouseEnter={() => setActiveDropdown('residential')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center font-black text-[10px] uppercase tracking-[0.15em] group-hover:text-accent-gold transition-colors">
                Residential <ChevronDown className="ml-1 w-3 h-3" />
              </div>
              {activeDropdown === 'residential' && (
                <div className="absolute top-full left-1/2 -translate-x-[40%] w-[850px] bg-white text-secondary-dark shadow-2xl border-t-4 border-accent-gold p-8 animate-in fade-in slide-in-from-top-2 duration-200 cursor-default">
                  <div className="grid grid-cols-12 gap-8">
                    
                    {/* Left: Exterior & Restoration */}
                    <div className="col-span-4 space-y-4">
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-gray-100 pb-2 flex items-center">
                        <span className="w-1.5 h-1.5 bg-accent-gold rounded-full mr-2"></span> Exterior & Restoration
                      </h4>
                      <div className="flex flex-col space-y-2">
                        {RESIDENTIAL_SERVICES.slice(0, 8).map((service) => (
                          <Link 
                            key={service.slug} 
                            to={`/services/${service.slug}`}
                            className="text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-accent-orange hover:translate-x-1 transition-all"
                          >
                            {service.title}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Middle: Interior Care & Specialty */}
                    <div className="col-span-4 space-y-4">
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-gray-100 pb-2 flex items-center">
                        <span className="w-1.5 h-1.5 bg-primary-bright rounded-full mr-2"></span> Interior & Specialty
                      </h4>
                      <div className="flex flex-col space-y-2">
                        {RESIDENTIAL_SERVICES.slice(8).map((service) => (
                          <Link 
                            key={service.slug} 
                            to={`/services/${service.slug}`}
                            className="text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-accent-orange hover:translate-x-1 transition-all"
                          >
                            {service.title}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Right: Premium Spot Card */}
                    <div className="col-span-4 bg-primary text-white p-6 border-b-8 border-accent-gold flex flex-col justify-between shadow-inner relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-xl"></div>
                      <div className="relative z-10">
                        <span className="bg-accent-gold text-primary text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-3 inline-block">Elite Standard</span>
                        <h4 className="text-sm font-black uppercase tracking-tighter mb-2">Spotless Home Guarantee</h4>
                        <p className="text-[9px] text-white/70 font-bold uppercase tracking-wide leading-relaxed mb-4">
                          All field teams are background checked via NIMC with verified NIN credentials. Insured & clinical grade.
                        </p>
                      </div>
                      <Link to="/book" className="relative z-10">
                        <Button className="w-full bg-accent-orange text-white py-3 font-black text-[9px] uppercase tracking-widest rounded-none shadow-md hover:bg-white hover:text-accent-orange transition-all">
                          Book Home Shine
                        </Button>
                      </Link>
                    </div>

                  </div>
                </div>
              )}
            </div>

            <div 
              className="relative group px-3 py-7 cursor-pointer"
              onMouseEnter={() => setActiveDropdown('commercial')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center font-black text-[10px] uppercase tracking-[0.15em] group-hover:text-accent-gold transition-colors">
                Commercial <ChevronDown className="ml-1 w-3 h-3" />
              </div>
              {activeDropdown === 'commercial' && (
                <div className="absolute top-full left-1/2 -translate-x-[50%] w-[850px] bg-white text-secondary-dark shadow-2xl border-t-4 border-accent-gold p-8 animate-in fade-in slide-in-from-top-2 duration-200 cursor-default">
                  <div className="grid grid-cols-12 gap-8">
                    
                    {/* Left: Office & Fleet */}
                    <div className="col-span-4 space-y-4">
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-gray-100 pb-2 flex items-center">
                        <span className="w-1.5 h-1.5 bg-accent-gold rounded-full mr-2"></span> Corporate Operations
                      </h4>
                      <div className="flex flex-col space-y-2">
                        {COMMERCIAL_SERVICES.slice(0, 8).map((service) => (
                          <Link 
                            key={service.slug} 
                            to={`/services/${service.slug}`}
                            className="text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-accent-orange hover:translate-x-1 transition-all"
                          >
                            {service.title}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Middle: Estate & Building */}
                    <div className="col-span-4 space-y-4">
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-gray-100 pb-2 flex items-center">
                        <span className="w-1.5 h-1.5 bg-primary-bright rounded-full mr-2"></span> Facility & Estate
                      </h4>
                      <div className="flex flex-col space-y-2">
                        {COMMERCIAL_SERVICES.slice(8).map((service) => (
                          <Link 
                            key={service.slug} 
                            to={`/services/${service.slug}`}
                            className="text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-accent-orange hover:translate-x-1 transition-all"
                          >
                            {service.title}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Right: Premium Spot Card */}
                    <div className="col-span-4 bg-primary text-white p-6 border-b-8 border-accent-gold flex flex-col justify-between shadow-inner relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-xl"></div>
                      <div className="relative z-10">
                        <span className="bg-accent-gold text-primary text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-3 inline-block">Enterprise</span>
                        <h4 className="text-sm font-black uppercase tracking-tighter mb-2">Facility Management</h4>
                        <p className="text-[9px] text-white/70 font-bold uppercase tracking-wide leading-relaxed mb-4">
                          From retail malls to hospital wards, we provide medical-grade disinfection protocols. Save up to 30% on monthly contracts.
                        </p>
                      </div>
                      <Link to="/book" className="relative z-10">
                        <Button className="w-full bg-accent-orange text-white py-3 font-black text-[9px] uppercase tracking-widest rounded-none shadow-md hover:bg-white hover:text-accent-orange transition-all">
                          Request Sales Quote
                        </Button>
                      </Link>
                    </div>

                  </div>
                </div>
              )}
            </div>

            <Link to="/about" className="px-3 py-7 font-black text-[10px] uppercase tracking-[0.15em] hover:text-accent-gold transition-colors">Service Areas</Link>
            <Link to="/pricing" className="px-3 py-7 font-black text-[10px] uppercase tracking-[0.15em] hover:text-accent-gold transition-colors">Pricing</Link>
            
            <div 
              className="relative group px-3 py-7 cursor-pointer"
              onMouseEnter={() => setActiveDropdown('about')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center font-black text-[10px] uppercase tracking-[0.15em] group-hover:text-accent-gold transition-colors">
                About <ChevronDown className="ml-1 w-3 h-3" />
              </div>
              {activeDropdown === 'about' && (
                <div className="absolute top-full left-0 w-48 bg-white text-secondary-dark shadow-2xl border-t-4 border-accent-gold animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="py-2">
                    <Link to="/about" className="block px-6 py-3 text-[10px] font-black uppercase tracking-wider hover:bg-secondary transition-colors">About Us</Link>
                    <Link to="/cleaner" className="block px-6 py-3 text-[10px] font-black uppercase tracking-wider hover:bg-secondary transition-colors">Find Cleaning Jobs</Link>
                    <Link to="/blog" className="block px-6 py-3 text-[10px] font-black uppercase tracking-wider hover:bg-secondary transition-colors">Blog</Link>
                    <Link to="/faq" className="block px-6 py-3 text-[10px] font-black uppercase tracking-wider hover:bg-secondary transition-colors">FAQ</Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Side: Account Actions & Button (Aligned Right) */}
          <div className="hidden lg:flex items-center justify-end space-x-6 w-1/4">
            {!isAuthenticated ? (
              <Link to="/auth" className="text-[10px] font-black uppercase tracking-widest text-white/80 hover:text-accent-gold transition-colors">
                Login
              </Link>
            ) : (
              <Link 
                to={currentUser?.role === 'admin' ? '/admin' : currentUser?.role === 'cleaner' ? '/cleaner' : '/dashboard'} 
                className="text-white/80 hover:text-accent-gold transition-all hover:scale-115 flex items-center justify-center shrink-0"
                title="Go to Dashboard"
              >
                <UserCircle className="w-6 h-6 text-accent-gold" />
              </Link>
            )}
            <Link to="/book">
              <Button className="bg-accent-orange text-white font-black text-[10px] uppercase tracking-[0.2em] px-8 py-4 rounded-none shadow-xl hover:bg-white hover:text-accent-orange transition-all duration-300">
                Request Quote
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden p-2 text-white ml-auto" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-[112px] z-50 bg-primary overflow-y-auto py-8 px-6 space-y-6 shadow-xl animate-in slide-in-from-right-full duration-300">
          <div className="space-y-4">
            <h3 className="font-black text-accent-gold text-xs uppercase tracking-[0.2em] border-b border-white/10 pb-2">Home Services</h3>
            {RESIDENTIAL_SERVICES.slice(0, 8).map(s => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="block py-1 text-sm font-bold text-white/90 hover:text-accent-gold" onClick={() => setIsOpen(false)}>{s.title}</Link>
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="font-black text-accent-gold text-xs uppercase tracking-[0.2em] border-b border-white/10 pb-2">Business Services</h3>
            {COMMERCIAL_SERVICES.slice(0, 8).map(s => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="block py-1 text-sm font-bold text-white/90 hover:text-accent-gold" onClick={() => setIsOpen(false)}>{s.title}</Link>
            ))}
          </div>
          <div className="pt-8 space-y-4">
            <Link 
              to={!isAuthenticated ? '/auth' : currentUser?.role === 'admin' ? '/admin' : currentUser?.role === 'cleaner' ? '/cleaner' : '/dashboard'} 
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center space-x-2 text-white font-black uppercase text-xs"
            >
              <UserCircle className="w-5 h-5 text-accent-gold" />
              <span>{!isAuthenticated ? 'Login / Join' : 'My Account'}</span>
            </Link>
            <Link to="/book" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-accent-orange text-white font-black uppercase tracking-widest py-5 rounded-none shadow-2xl">Book Now</Button>
            </Link>
            <Link to="/cleaner" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full border-white text-white font-black uppercase tracking-widest py-5 rounded-none">Cleaner Portal & Jobs</Button>
            </Link>
            <Link to="/admin" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full text-white/40 font-black uppercase tracking-widest py-5 rounded-none">Admin Panel</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
