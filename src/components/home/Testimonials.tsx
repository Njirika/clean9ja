import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Adunni Okafor",
    role: "CEO, TechHub Lagos",
    content: "CleanNaija transformed my office! The team was professional, punctual and thorough. I've now subscribed to their monthly plan. Truly world-class service in Nigeria.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=adunni"
  },
  {
    name: "Chidi Eze",
    role: "Homeowner, Lekki",
    content: "I was skeptical at first, but the deep clean they did before I moved into my new apartment was incredible. Not a speck of dust left. Highly recommended!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=chidi"
  },
  {
    name: "Amina Yusuf",
    role: "Facility Manager, Abuja",
    content: "Managing a medical clinic requires high standards of hygiene. CleanNaija's hospital-grade cleaning is reliable and consistent. Best in the business.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=amina"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-secondary-dark mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Join thousands of happy Nigerians who trust CleanNaija for their spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-secondary p-8 rounded-2xl relative">
              <Quote className="absolute top-6 right-8 w-12 h-12 text-primary/10" />
              <div className="flex text-accent-gold mb-4">
                {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-lg text-secondary-dark mb-8 relative z-10">"{t.content}"</p>
              <div className="flex items-center">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full mr-4 border-2 border-primary" />
                <div>
                  <h4 className="font-bold text-secondary-dark">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
