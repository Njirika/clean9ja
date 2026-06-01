import { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { api, ApiReview } from '../../lib/api';

export function Testimonials() {
  const [reviews, setReviews] = useState<ApiReview[] | null>(null);

  useEffect(() => {
    api.reviews
      .publicList(6)
      .then((data) => setReviews(data || []))
      .catch(() => setReviews([]));
  }, []);

  // Don't render the section until we have real, published reviews.
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-secondary-dark mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Real reviews from Nigerians who trust Clean9ja for their spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((t) => {
            const name = [t.customer?.firstName, t.customer?.lastName].filter(Boolean).join(' ') || 'Verified Customer';
            const role = t.booking?.service?.name ? `${t.booking.service.name} customer` : 'Clean9ja customer';
            return (
              <div key={t.id} className="bg-secondary p-8 rounded-2xl relative">
                <Quote className="absolute top-6 right-8 w-12 h-12 text-primary/10" />
                <div className="flex text-accent-gold mb-4">
                  {[...Array(Math.max(0, Math.min(5, t.rating)))].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-lg text-secondary-dark mb-8 relative z-10">"{t.comment}"</p>
                <div className="flex items-center">
                  {t.customer?.avatarUrl ? (
                    <img src={t.customer.avatarUrl} alt={name} className="w-12 h-12 rounded-full mr-4 border-2 border-primary object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full mr-4 border-2 border-primary bg-primary/10 text-primary flex items-center justify-center font-black ">
                      {name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-secondary-dark">{name}</h4>
                    <p className="text-sm text-gray-500">{role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
