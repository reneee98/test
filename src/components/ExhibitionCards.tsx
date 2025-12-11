'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const exhibitions = [
    {
        year: '2021',
        title: 'World Nuclear',
        subtitle: 'Exhibition',
        image: '/images/fotky/wne2021.jpg'
    },
    {
        year: '2023',
        title: 'World Nuclear',
        subtitle: 'Exhibition',
        image: '/images/fotky/wne2023.jpg'
    },
    {
        year: '2025',
        title: 'World Nuclear',
        subtitle: 'Exhibition',
        image: '/images/fotky/wne2025.jpg'
    }
];

export default function ExhibitionCards() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % exhibitions.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + exhibitions.length) % exhibitions.length);
    };

    const handleKeyDown = (e: React.KeyboardEvent, action: 'prev' | 'next') => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            action === 'prev' ? handlePrev() : handleNext();
        }
    };

    return (
        <section className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden">
            <div className="flex flex-col lg:flex-row w-full h-full">
                {/* Left: Image Area */}
                <div className="flex-1 relative overflow-hidden bg-[#111]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ x: '-100%' }}
                            animate={{ x: '0%' }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={exhibitions[currentIndex].image}
                                alt={`${exhibitions[currentIndex].title} ${exhibitions[currentIndex].year}`}
                                fill
                                className="object-cover opacity-80"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="absolute bottom-8 left-8 lg:bottom-12 lg:left-12 flex gap-4 z-10">
                        <button
                            onClick={handlePrev}
                            onKeyDown={(e) => handleKeyDown(e, 'prev')}
                            className="p-3 lg:p-4 rounded-full border border-white/30 hover:bg-white hover:text-black text-white transition-all duration-300 backdrop-blur-sm"
                            aria-label="Previous exhibition"
                            tabIndex={0}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 lg:w-6 lg:h-6">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button
                            onClick={handleNext}
                            onKeyDown={(e) => handleKeyDown(e, 'next')}
                            className="p-3 lg:p-4 rounded-full border border-white/30 hover:bg-white hover:text-black text-white transition-all duration-300 backdrop-blur-sm"
                            aria-label="Next exhibition"
                            tabIndex={0}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 lg:w-6 lg:h-6">
                                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>

                    {/* Slide indicators */}
                    <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 flex gap-2 z-10">
                        {exhibitions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-300 ${
                                    index === currentIndex 
                                        ? 'bg-[#D7DF21] w-6 lg:w-8' 
                                        : 'bg-white/30 hover:bg-white/50'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                                tabIndex={0}
                            />
                        ))}
                    </div>
                </div>

                {/* Right: Typography Area */}
                <div className="flex-1 relative flex items-center justify-center bg-[#0a0a0a] p-8 lg:p-12 xl:p-16 2xl:p-20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="flex flex-col items-start gap-4 lg:gap-6"
                        >
                            {/* Year - Large Typography */}
                            <h2 className="text-[#D7DF21] text-[80px] sm:text-[100px] md:text-[120px] lg:text-[140px] xl:text-[180px] 2xl:text-[220px] font-bold leading-[0.85] tracking-tighter">
                                {exhibitions[currentIndex].year}
                            </h2>

                            {/* Divider */}
                            <div className="h-1 w-16 lg:w-20 xl:w-24 bg-[#D7DF21] my-2 lg:my-4" />

                            {/* Title */}
                            <h3 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light uppercase tracking-wide leading-tight">
                                {exhibitions[currentIndex].title}
                            </h3>

                            {/* Subtitle */}
                            <p className="text-white/50 text-lg sm:text-xl md:text-2xl uppercase tracking-widest">
                                {exhibitions[currentIndex].subtitle}
                            </p>

                            {/* View More Button */}
                            <button 
                                className="mt-6 lg:mt-8 flex items-center gap-0 group"
                                tabIndex={0}
                                aria-label={`View more photos from ${exhibitions[currentIndex].year}`}
                            >
                                <span className="px-5 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-full bg-[#D7DF21] text-[#1F1919] font-medium text-sm sm:text-base lg:text-lg group-hover:bg-[#D7DF21]/90 transition-colors whitespace-nowrap">
                                    View more photos
                                </span>
                                <span className="w-10 h-10 sm:w-11 sm:h-11 lg:w-14 lg:h-14 rounded-full bg-[#D7DF21] group-hover:bg-[#D7DF21]/90 flex items-center justify-center transition-colors flex-shrink-0">
                                    <svg width="18" height="18" className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.5 15L12.5 10L7.5 5" stroke="#1F1919" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                            </button>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
