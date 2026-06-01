import { Seo } from '../components/seo/Seo';

export function Legal({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title={title}
        description={`${title} for Clean9ja — how we deliver our cleaning services, our 100% satisfaction guarantee, security, NIN-verified pros and your responsibilities as a user.`}
        path={title.toLowerCase().includes('privacy') ? '/privacy' : '/terms'}
      />
      <div className="bg-primary py-24 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-heading font-black tracking-tighter mb-4 text-accent-gold">{title}</h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-black text-primary tracking-tighter mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed font-medium">By accessing and using Clean9ja, you agree to be bound by these terms. We Clean Am Proper, but we expect our users to respect our pros and follow our booking guidelines.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-primary tracking-tighter mb-4">2. Satisfaction Guarantee</h2>
            <p className="text-gray-600 leading-relaxed font-medium">We offer a 100% Satisfaction Guarantee. If you are not satisfied with our service, you must notify us within 24 hours of completion. We will re-clean the specific area at no additional cost.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-primary tracking-tighter mb-4">3. Security and Trust</h2>
            <p className="text-gray-600 leading-relaxed font-medium">All our pros are NIN-verified and background checked. However, we recommend that valuables are kept in a secure location during the cleaning process.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
