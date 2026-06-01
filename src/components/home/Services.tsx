import { 
  Home, 
  Building2, 
  HardHat, 
  Hospital, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Droplets, 
  Waves, 
  Brush, 
  Truck, 
  Stethoscope, 
  Hotel, 
  Trophy, 
  ShoppingBag, 
  Landmark, 
  Bug, 
  Sofa, 
  Bed, 
  WashingMachine 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PRD_SERVICES = [
  { title: "Building Face-lift", icon: Home, price: "From ₦45k", image: "/images/service-home.jpg", slug: "full-building-face-lift" },
  { title: "Interlock Shine", icon: ShieldCheck, price: "From ₦25k", image: "/images/service-roof.jpg", slug: "interlock-driveway-shine" },
  { title: "Fleet Maintenance", icon: Building2, price: "Custom Quote", image: "/images/service-fleet.jpg", slug: "corporate-fleet-maintenance" },
  { title: "Medical Grade", icon: Hospital, price: "Custom Quote", image: "/images/service-hospital.jpg", slug: "elderly-home-sanitization" },
  { title: "Festive Setup", icon: Sparkles, price: "From ₦35k", image: "/images/service-specialty.jpg", slug: "festive-decor-installation" },
  { title: "Post-Build Cleanup", icon: HardHat, price: "From ₦100k", image: "/images/service-construction.jpg", slug: "post-build-cleanup" }
];

const subServices = [
  { title: "Soft Chem Wash", icon: Droplets, slug: "low-pressure-soft-wash" },
  { title: "Annual Estate Wash", icon: Waves, slug: "annual-estate-power-wash" },
  { title: "Stone Wall Wash", icon: HardHat, slug: "fence-stonework-washing" },
  { title: "Deck & Pergola", icon: Sofa, slug: "veranda-deck-care" },
  { title: "Gutter Clearing", icon: Brush, slug: "gutter-de-clogging" },
  { title: "Fleet & Truck Wash", icon: Truck, slug: "corporate-fleet-maintenance" },
  { title: "Healthcare Facilities", icon: Stethoscope, slug: "elderly-home-sanitization" },
  { title: "Hotels & Resorts", icon: Hotel, slug: "hotel-resort-maintenance" },
  { title: "Arena & Stadiums", icon: Trophy, slug: "arena-sports-complex-care" },
  { title: "Sports Courts", icon: Trophy, slug: "sports-court-restoration" },
  { title: "Plazas & Malls", icon: ShoppingBag, slug: "plaza-mall-management" },
  { title: "Public Buildings", icon: Landmark, slug: "public-building-cleaning" },
  { title: "Post-Build Clean", icon: HardHat, slug: "post-build-cleanup" },
  { title: "Deep Restoration", icon: Sparkles, slug: "deep-restoration-clean" },
  { title: "Naija Fumigation", icon: Bug, slug: "professional-fumigation" },
  { title: "Sofa Restoration", icon: Sofa, slug: "deep-restoration-clean" },
  { title: "Mattress Detail", icon: Bed, slug: "deep-restoration-clean" },
  { title: "Laundry Services", icon: WashingMachine, slug: "deep-restoration-clean" }
];

export function Services() {
  return (
    <section className="py-24 bg-white font-sans">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-black text-primary tracking-tighter mb-4">
            Professional Service Categories
          </h2>
          <div className="w-24 h-1.5 bg-accent-gold mx-auto mb-8"></div>
          <p className="text-gray-500 font-bold text-xs">Your Space, Our Pride.</p>
        </div>

        {/* Featured Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {PRD_SERVICES.map((service, index) => (
            <div 
              key={index} 
              className="group relative h-96 overflow-hidden rounded-2xl shadow-xl border-b-8 border-transparent hover:border-accent-orange transition-all duration-500"
            >
              <img 
                src={service.image} 
                alt={service.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-accent-gold p-3.5 rounded-xl text-primary shadow-2xl">
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tighter leading-tight">
                    {service.title}
                  </h3>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-accent-gold font-black text-lg">{service.price}</span>
                  <Link to={`/services/${service.slug}`} className="inline-flex items-center bg-white/10 backdrop-blur-sm text-white px-4 py-2 text-[10px] font-black hover:bg-accent-gold hover:text-primary transition-all">
                    Explore Service <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Icons Grid Section */}
        <div className="bg-secondary rounded-[40px] p-10 md:p-16 border border-gray-100 shadow-inner">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-black text-primary tracking-tighter mb-2">Specialized Cleaning Solutions</h3>
            <p className="text-[10px] font-black text-gray-400">Whatever you need, we've got you covered</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-12 gap-x-6">
            {subServices.map((service, index) => (
              <Link key={index} to={`/services/${service.slug}`} className="flex flex-col items-center text-center group cursor-pointer">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white group-hover:-translate-y-2 transition-all duration-300 mb-4 border border-gray-50">
                  <service.icon className="w-7 h-7" />
                </div>
                <h4 className="text-[11px] font-black tracking-wider text-secondary-dark leading-tight max-w-[120px]">
                  {service.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
