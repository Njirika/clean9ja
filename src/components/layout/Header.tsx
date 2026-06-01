import { useState } from 'react';
import { Menu, X, Phone, ChevronDown, UserCircle, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { cn } from '../../utils/cn';
import { SERVICES, type ServiceInfo } from '../../lib/siteContent';

// A short, curated set of the most-requested services keeps the menu simple.
// Titles/slugs are pulled from siteContent so the menu, service pages and SEO
// always describe the same catalogue.
const POPULAR_RESIDENTIAL = [
  'standard-home-shine',
  'deep-restoration-clean',
  'full-building-face-lift',
  'roof-parapet-washing',
  'professional-fumigation',
  'interlock-driveway-shine',
];
const POPULAR_COMMERCIAL = [
  'office-workspace-hygiene',
  'post-build-cleanup',
  'restaurant-eatery-cleaning',
  'hotel-resort-maintenance',
  'estate-block-maintenance',
  'elderly-home-sanitization',
];

const bySlugs = (slugs: string[]): ServiceInfo[] =>
  slugs
    .map((slug) => SERVICES.find((s) => s.slug === slug))
    .filter((s): s is ServiceInfo => Boolean(s));

const residentialPopular = bySlugs(POPULAR_RESIDENTIAL);
const commercialPopular = bySlugs(POPULAR_COMMERCIAL);

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
        <div className="container mx-auto px-4 flex justify-between items-center text-[11px] font-semibold tracking-wide">
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
              <img src="/logo.png" alt="Clean9ja - Spotless Every Surface" className="h-10 md:h-12 w-auto object-contain" />
            </Link>
          </div>

          {/* Middle Side: Navigation Menu (Centered) */}
          <nav className="hidden lg:flex items-center justify-center space-x-1 w-2/4">
            <div
              className="relative group px-3 py-7 cursor-pointer"
              onMouseEnter={() => setActiveDropdown('residential')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center font-semibold text-sm group-hover:text-accent-gold transition-colors">
                Home services <ChevronDown className="ml-1 w-3 h-3" />
              </div>
              {activeDropdown === 'residential' && (
                <DropdownPanel
                  heading="Popular home services"
                  services={residentialPopular}
                  viewAllLabel="View all home services"
                  promoTag="Elite standard"
                  promoTitle="Spotless Home Guarantee"
                  promoText="Every team is background-checked with verified NIN credentials, insured and clinical-grade."
                  promoCta="Book a home clean"
                />
              )}
            </div>

            <div
              className="relative group px-3 py-7 cursor-pointer"
              onMouseEnter={() => setActiveDropdown('commercial')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center font-semibold text-sm group-hover:text-accent-gold transition-colors">
                Business services <ChevronDown className="ml-1 w-3 h-3" />
              </div>
              {activeDropdown === 'commercial' && (
                <DropdownPanel
                  heading="Popular business services"
                  services={commercialPopular}
                  viewAllLabel="View all business services"
                  promoTag="Enterprise"
                  promoTitle="Facility management"
                  promoText="From malls to hospital wards, with medical-grade disinfection. Save up to 30% on monthly contracts."
                  promoCta="Request a quote"
                />
              )}
            </div>

            <Link to="/pricing" className="px-3 py-7 font-semibold text-sm hover:text-accent-gold transition-colors">Pricing</Link>

            <div
              className="relative group px-3 py-7 cursor-pointer"
              onMouseEnter={() => setActiveDropdown('about')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center font-semibold text-sm group-hover:text-accent-gold transition-colors">
                About <ChevronDown className="ml-1 w-3 h-3" />
              </div>
              {activeDropdown === 'about' && (
                <div className="absolute top-full left-0 w-52 bg-white text-secondary-dark shadow-2xl border-t-4 border-accent-gold animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="py-2">
                    <Link to="/about" className="block px-6 py-3 text-sm font-medium hover:bg-secondary hover:text-accent-orange transition-colors">About us</Link>
                    <Link to="/about" className="block px-6 py-3 text-sm font-medium hover:bg-secondary hover:text-accent-orange transition-colors">Service areas</Link>
                    <Link to="/cleaner" className="block px-6 py-3 text-sm font-medium hover:bg-secondary hover:text-accent-orange transition-colors">Find cleaning jobs</Link>
                    <Link to="/blog" className="block px-6 py-3 text-sm font-medium hover:bg-secondary hover:text-accent-orange transition-colors">Blog</Link>
                    <Link to="/faq" className="block px-6 py-3 text-sm font-medium hover:bg-secondary hover:text-accent-orange transition-colors">FAQ</Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Side: Account Actions & Button (Aligned Right) */}
          <div className="hidden lg:flex items-center justify-end space-x-6 w-1/4">
            {!isAuthenticated ? (
              <Link to="/auth" className="text-sm font-semibold text-white/80 hover:text-accent-gold transition-colors">
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
              <Button className="bg-accent-orange text-white font-bold text-sm px-8 py-4 rounded-lg shadow-xl hover:bg-white hover:text-accent-orange transition-all duration-300">
                Book now
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
          <div className="space-y-3">
            <h3 className="font-bold text-accent-gold text-sm border-b border-white/10 pb-2">Home services</h3>
            {residentialPopular.map(s => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="block py-1 text-sm font-medium text-white/90 hover:text-accent-gold" onClick={() => setIsOpen(false)}>{s.title}</Link>
            ))}
            <Link to="/pricing" className="block py-1 text-sm font-semibold text-accent-gold" onClick={() => setIsOpen(false)}>View all home services →</Link>
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-accent-gold text-sm border-b border-white/10 pb-2">Business services</h3>
            {commercialPopular.map(s => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="block py-1 text-sm font-medium text-white/90 hover:text-accent-gold" onClick={() => setIsOpen(false)}>{s.title}</Link>
            ))}
            <Link to="/pricing" className="block py-1 text-sm font-semibold text-accent-gold" onClick={() => setIsOpen(false)}>View all business services →</Link>
          </div>
          <div className="pt-8 space-y-4">
            <Link
              to={!isAuthenticated ? '/auth' : currentUser?.role === 'admin' ? '/admin' : currentUser?.role === 'cleaner' ? '/cleaner' : '/dashboard'}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center space-x-2 text-white font-semibold text-sm"
            >
              <UserCircle className="w-5 h-5 text-accent-gold" />
              <span>{!isAuthenticated ? 'Login / Join' : 'My account'}</span>
            </Link>
            <Link to="/book" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-accent-orange text-white font-bold py-5 rounded-lg shadow-2xl">Book now</Button>
            </Link>
            <Link to="/cleaner" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full border-white text-white font-bold py-5 rounded-lg">Find cleaning jobs</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

interface DropdownPanelProps {
  heading: string;
  services: ServiceInfo[];
  viewAllLabel: string;
  promoTag: string;
  promoTitle: string;
  promoText: string;
  promoCta: string;
}

function DropdownPanel({ heading, services, viewAllLabel, promoTag, promoTitle, promoText, promoCta }: DropdownPanelProps) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[560px] bg-white text-secondary-dark shadow-2xl border-t-4 border-accent-gold p-8 animate-in fade-in slide-in-from-top-2 duration-200 cursor-default">
      <div className="grid grid-cols-2 gap-8">
        {/* Left: curated service list */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-primary border-b border-gray-100 pb-2 flex items-center">
            <span className="w-1.5 h-1.5 bg-accent-gold rounded-full mr-2"></span> {heading}
          </h4>
          <div className="flex flex-col space-y-2">
            {services.map((service) => (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="text-sm font-medium text-gray-600 hover:text-accent-orange hover:translate-x-1 transition-all"
              >
                {service.title}
              </Link>
            ))}
            <Link to="/pricing" className="text-sm font-bold text-primary hover:text-accent-orange transition-colors pt-2">
              {viewAllLabel} →
            </Link>
          </div>
        </div>

        {/* Right: Premium Spot Card */}
        <div className="bg-primary text-white p-6 border-b-8 border-accent-gold flex flex-col justify-between shadow-inner relative overflow-hidden rounded-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-xl"></div>
          <div className="relative z-10">
            <span className="bg-accent-gold text-primary text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 inline-block">{promoTag}</span>
            <h4 className="text-base font-bold tracking-tight mb-2">{promoTitle}</h4>
            <p className="text-xs text-white/70 font-medium leading-relaxed mb-4">
              {promoText}
            </p>
          </div>
          <Link to="/book" className="relative z-10">
            <Button className="w-full bg-accent-orange text-white py-3 font-bold text-xs rounded-lg shadow-md hover:bg-white hover:text-accent-orange transition-all">
              {promoCta}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
