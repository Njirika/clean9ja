import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const prd_faqs = [
  {
    question: "How do I book a cleaning service?",
    answer: "You can book in 60 seconds via our app or web. Simply select your service, enter your details, and get an instant quote."
  },
  {
    question: "What areas do you cover?",
    answer: "CleanNaija is nationwide! We currently serve all 36 states and the FCT with dedicated local teams."
  },
  {
    question: "Are your cleaners background-checked?",
    answer: "Yes, every single cleaner undergoes a rigorous background check and verification process including NIN verification."
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer: "We offer a 100% Satisfaction Guarantee. If you're not happy, we will re-clean for FREE."
  },
  {
    question: "Do you provide cleaning supplies?",
    answer: "Yes, our teams arrive fully equipped with professional tools and eco-friendly products."
  },
  {
    question: "Can I reschedule or cancel my booking?",
    answer: "Absolutely. You can manage your bookings through the Customer Portal or by calling our hotline."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-secondary font-sans">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-black text-primary uppercase tracking-tighter mb-4">
            FAQ
          </h2>
          <div className="w-20 h-1.5 bg-accent-gold mx-auto"></div>
        </div>

        <div className="space-y-4">
          {prd_faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-none overflow-hidden shadow-sm border border-gray-100">
              <button 
                className="w-full px-8 py-8 text-left flex items-center justify-between focus:outline-none group"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-sm font-black text-primary uppercase tracking-widest">{faq.question}</span>
                {openIndex === i ? <ChevronUp className="text-accent-gold" /> : <ChevronDown className="text-gray-300 group-hover:text-primary" />}
              </button>
              {openIndex === i && (
                <div className="px-8 pb-8 text-gray-500 font-bold uppercase text-[11px] leading-relaxed tracking-widest animate-in fade-in slide-in-from-top-1">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
