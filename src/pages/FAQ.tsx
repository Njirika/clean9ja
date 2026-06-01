import { FAQ as FAQSection } from '../components/home/FAQ';
import { Seo } from '../components/seo/Seo';
import { FAQS } from '../lib/siteContent';

export function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="FAQ & Help Center"
        description="Answers to common questions about booking, coverage, pricing, payments, our 100% satisfaction guarantee, NIN-verified cleaners and recurring plans at Clean9ja."
        path="/faq"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQS.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }}
      />
      <div className="bg-primary py-24 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-heading font-black uppercase tracking-tighter mb-4 text-accent-gold">Help Center</h1>
          <p className="text-white/70 font-bold uppercase tracking-[0.3em] text-xs">Everything You Need to Know</p>
        </div>
      </div>
      <FAQSection />
      
      <section className="py-24 container mx-auto px-4 text-center">
        <h2 className="text-2xl font-black text-primary uppercase tracking-tighter mb-6">Still Have Questions?</h2>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-10">Our 24/7 support team is here to help you well well.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a href="tel:0800-CLEAN-9JA" className="bg-primary text-white font-black uppercase tracking-widest px-12 py-5 rounded-none shadow-xl hover:bg-accent-gold transition-colors">Call Support</a>
          <a href="https://wa.me/2348000000000" className="bg-[#25D366] text-white font-black uppercase tracking-widest px-12 py-5 rounded-none shadow-xl hover:bg-white hover:text-[#25D366] transition-colors">WhatsApp Us</a>
        </div>
      </section>
    </div>
  );
}
