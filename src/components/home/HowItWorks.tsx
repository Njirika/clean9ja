import { Smartphone, ClipboardList, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: Smartphone,
    title: "Book Online",
    description: "Book in 60 seconds via app or web. Select your service and get an instant quote."
  },
  {
    icon: ClipboardList,
    title: "We Clean",
    description: "Our verified team arrives on schedule with professional equipment and eco-friendly products."
  },
  {
    icon: Sparkles,
    title: "Enjoy Your Space",
    description: "Relax while we make your space sparkle. Enjoy a spotless environment, guaranteed."
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-secondary font-sans">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-black text-primary uppercase tracking-tighter mb-4">
            How It Works
          </h2>
          <div className="w-24 h-1.5 bg-accent-gold mx-auto"></div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[48px] left-0 w-full h-1 bg-primary/20 -z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-accent-gold text-primary rounded-full flex items-center justify-center font-black border-4 border-white shadow-lg z-20">
                    {index + 1}
                  </div>
                  <div className="w-24 h-24 bg-primary text-white rounded-none flex items-center justify-center shadow-2xl mb-8 border-8 border-white transform transition-transform group-hover:rotate-6">
                    <step.icon className="w-10 h-10" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-primary uppercase tracking-tighter mb-4">{step.title}</h3>
                <p className="text-gray-500 font-bold text-sm uppercase leading-relaxed tracking-wider px-4">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
