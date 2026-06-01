import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useUser } from '../../context/UserContext';
import { MapPin, Navigation, CheckCircle2, Sparkles } from 'lucide-react';

export function Onboarding() {
  const { completeOnboarding } = useUser();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    state: '',
    city: '',
    lga: '',
    town: ''
  });

  const steps = [
    {
      title: "Welcome to Clean9ja",
      subtitle: "Let's personalize your spotless experience.",
      icon: <Sparkles className="w-12 h-12 text-accent-gold" />
    },
    {
      title: "Select Your State",
      subtitle: "We're expanding nationwide daily.",
      icon: <MapPin className="w-12 h-12 text-primary" />
    },
    {
      title: "City & Local Government",
      subtitle: "To match you with our closest local hub.",
      icon: <Navigation className="w-12 h-12 text-accent-orange" />
    },
    {
      title: "Final Detail",
      subtitle: "Exactly where should our pros arrive?",
      icon: <CheckCircle2 className="w-12 h-12 text-primary-bright" />
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <div className="p-6 bg-secondary rounded-full shadow-inner border border-gray-100">
                {steps[step].icon}
              </div>
            </div>
            
            <h1 className="text-3xl font-heading font-black text-primary uppercase tracking-tighter mb-2">
              {steps[step].title}
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-12">
              {steps[step].subtitle}
            </p>

            <div className="space-y-6 mb-12">
              {step === 1 && (
                <div className="grid grid-cols-2 gap-3">
                  {['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Enugu'].map(s => (
                    <button
                      key={s}
                      onClick={() => setFormData({ ...formData, state: s })}
                      className={`p-4 border-2 font-black uppercase text-[11px] tracking-widest transition-all ${formData.state === s ? 'border-primary bg-primary text-white shadow-xl' : 'border-gray-100 bg-white text-gray-400 hover:border-accent-gold'}`}
                    >
                      {s}
                    </button>
                  ))}
                  <Input 
                    placeholder="Other State..." 
                    className="col-span-2 text-center" 
                    value={formData.state} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <Input 
                    label="City / Urban Area" 
                    placeholder="e.g. Ikeja, Lekki, Maitama" 
                    value={formData.city}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, city: e.target.value })}
                  />
                  <Input 
                    label="Local Government Area (LGA)" 
                    placeholder="e.g. Eti-Osa, AMAC" 
                    value={formData.lga}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, lga: e.target.value })}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <Input 
                    label="Town or Neighborhood" 
                    placeholder="e.g. Osapa London, Gwarimpa" 
                    value={formData.town}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, town: e.target.value })}
                  />
                  <div className="bg-primary/5 p-6 border-l-4 border-accent-gold text-left">
                    <p className="text-[11px] font-bold text-primary uppercase tracking-tight leading-relaxed">
                      "Clean9ja provides specialized equipment for {formData.city || 'your area'}. Your location is now mapped to our {formData.state} command center."
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleNext}
              disabled={(step === 1 && !formData.state) || (step === 2 && (!formData.city || !formData.lga)) || (step === 3 && !formData.town)}
              className="w-full bg-accent-orange text-white font-black uppercase tracking-[0.2em] py-6 text-lg rounded-none shadow-2xl hover:bg-primary transition-all"
            >
              {step === 0 ? "Get Started" : step === steps.length - 1 ? "Complete Setup" : "Continue"}
            </Button>

            {step > 0 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="mt-6 text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-primary transition-colors"
              >
                Go Back
              </button>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mt-12">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-accent-gold' : 'w-2 bg-gray-100'}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
