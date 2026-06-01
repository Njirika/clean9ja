import { Share2, Globe, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[#144718] text-white pt-24 pb-8 font-sans">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-8">
              <img src="/logo.png" alt="Clean9ja - Spotless Every Surface" className="h-10 md:h-14 w-auto object-contain" />
            </Link>
            <p className="text-white/70 mb-10 max-w-sm leading-relaxed font-medium">
              Nigeria's premier digital platform for professional cleaning services. 
              Spotless. Guaranteed. Nationwide. We Clean Am Proper!
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/Clean9ja" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 rounded-none flex items-center justify-center hover:bg-accent-gold hover:text-primary transition-all duration-300"
                title="Follow us on Facebook"
              >
                <Share2 className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/Clean9ja" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 rounded-none flex items-center justify-center hover:bg-accent-gold hover:text-primary transition-all duration-300"
                title="Follow us on Instagram"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com/company/clean9ja" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 rounded-none flex items-center justify-center hover:bg-accent-gold hover:text-primary transition-all duration-300"
                title="Connect on LinkedIn"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/23480025326952" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 rounded-none flex items-center justify-center hover:bg-accent-gold hover:text-primary transition-all duration-300"
                title="Chat with us on WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-black tracking-tighter mb-6 text-white">Services</h4>
            <ul className="space-y-4 text-[10px] font-black text-white/50">
              <li><Link to="/services/full-building-face-lift" className="hover:text-accent-gold transition-colors block">Full Building Face-lift</Link></li>
              <li><Link to="/services/office-workspace-hygiene" className="hover:text-accent-gold transition-colors block">Office & Workspace Hygiene</Link></li>
              <li><Link to="/services/post-build-cleanup" className="hover:text-accent-gold transition-colors block">Post-Build Cleanup</Link></li>
              <li><Link to="/services/elderly-home-sanitization" className="hover:text-accent-gold transition-colors block">Medical Grade Care</Link></li>
              <li><Link to="/services/roof-parapet-washing" className="hover:text-accent-gold transition-colors block">Roof & Parapet Washing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-black tracking-tighter mb-6 text-white">Company</h4>
            <ul className="space-y-4 text-[10px] font-black text-white/50">
              <li><Link to="/about" className="hover:text-accent-gold transition-colors block">About Us</Link></li>
              <li><Link to="/safety" className="hover:text-accent-gold transition-colors block">Trust & Safety</Link></li>
              <li><Link to="/careers" className="hover:text-accent-gold transition-colors block">Recruitment</Link></li>
              <li><Link to="/cleaner" className="text-accent-gold hover:text-white transition-colors block">Cleaner Portal</Link></li>
              <li><Link to="/admin" className="hover:text-accent-gold transition-colors block">Admin Command</Link></li>
              <li><Link to="/blog" className="hover:text-accent-gold transition-colors block">Blog</Link></li>
              <li><Link to="/gallery" className="hover:text-accent-gold transition-colors block">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-black tracking-tighter mb-6 text-white">Support</h4>
            <ul className="space-y-4 text-[10px] font-black text-white/50">
              <li><Link to="/help" className="hover:text-accent-gold transition-colors block">Help Center</Link></li>
              <li><Link to="/pricing" className="hover:text-accent-gold transition-colors block">Price List</Link></li>
              <li><Link to="/faq" className="hover:text-accent-gold transition-colors block">FAQ</Link></li>
              <li><Link to="/terms" className="hover:text-accent-gold transition-colors block">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-accent-gold transition-colors block">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2025 Clean9ja. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            RC: 1234567 | Licensed by NAFDAC
          </div>
        </div>
      </div>
    </footer>
  );
}
