import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export function BeforeAfterSlider({ beforeImage, afterImage }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[16/9] md:aspect-video rounded-2xl overflow-hidden cursor-col-resize select-none shadow-2xl"
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
    >
      {/* After Image (Background) */}
      <div className="absolute inset-0">
        <img src={afterImage} alt="After" className="w-full h-full object-cover" />
        <div className="absolute bottom-4 right-6 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">AFTER</div>
      </div>

      {/* Before Image (Foreground with Clip Path) */}
      <div 
        className="absolute inset-0 z-10"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img src={beforeImage} alt="Before" className="w-full h-full object-cover" />
        <div className="absolute bottom-4 left-6 bg-secondary-dark text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">BEFORE</div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute inset-y-0 z-20 w-1 bg-white cursor-col-resize"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
          <div className="flex space-x-0.5">
            <ChevronLeft className="w-4 h-4 text-primary" />
            <ChevronRight className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
