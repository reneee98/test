'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedText from './AnimatedText';

const exhibitions = [
    {
        id: 1,
        year: '2021',
        title: 'World Nuclear Exhibition',
        image: '/images/fotky/wne2021.jpg'
    },
    {
        id: 2,
        year: '2023',
        title: 'World Nuclear Exhibition',
        image: '/images/fotky/wne2023.jpg'
    },
    {
        id: 3,
        year: '2025',
        title: 'World Nuclear Exhibition',
        image: '/images/fotky/wne2025.jpg'
    }
];

export default function ExhibitionCards() {
    const [hoveredIndex, setHoveredIndex] = useState(0);

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setHoveredIndex(index);
        }
    };

    return (
        <section className="relative w-full min-h-screen bg-[#121212] overflow-hidden flex flex-col">
            <div className="flex-1 flex flex-col md:flex-row gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 h-[80vh] w-full max-w-7xl mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16 py-16 lg:py-20 xl:py-24">
                {/* Left: List of Years/Titles */}
                <div className="flex-1 flex flex-col justify-center z-10 gap-3 lg:gap-4 xl:gap-6">
                    {exhibitions.map((exhibition, index) => (
                        <div
                            key={exhibition.id}
                            className="relative cursor-pointer group flex items-start gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 py-2 lg:py-3 xl:py-4"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onClick={() => setHoveredIndex(index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            tabIndex={0}
                            aria-label={`View ${exhibition.year} exhibition`}
                        >
                            <AnimatedText
                                as="span"
                                className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold transition-all duration-500 ease-out ${
                                    index === hoveredIndex 
                                        ? 'text-[#D7DF21] translate-x-4 lg:translate-x-6 xl:translate-x-8' 
                                        : 'text-white/20 hover:text-white/30'
                                }`}
                                stagger={0.03}
                                start="top 85%"
                            >
                                {exhibition.year}
                            </AnimatedText>
                            <div 
                                className={`flex flex-col leading-tight text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium uppercase tracking-wider transition-all duration-500 ${
                                    index === hoveredIndex 
                                        ? 'opacity-100 text-white translate-x-0' 
                                        : 'opacity-0 -translate-x-4 pointer-events-none'
                                }`}
                            >
                                <AnimatedText
                                    as="span"
                                    className="block"
                                    stagger={0.02}
                                    start="top 85%"
                                    delay={0.1}
                                >
                                    world
                                </AnimatedText>
                                <AnimatedText
                                    as="span"
                                    className="block"
                                    stagger={0.02}
                                    start="top 85%"
                                    delay={0.2}
                                >
                                    nuclear
                                </AnimatedText>
                                <AnimatedText
                                    as="span"
                                    className="block"
                                    stagger={0.02}
                                    start="top 85%"
                                    delay={0.3}
                                >
                                    exhibition
                                </AnimatedText>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right: Image Preview */}
                <div className="flex-1 relative hidden md:flex items-center justify-center">
                    <div className="relative w-full max-w-[400px] lg:max-w-[500px] xl:max-w-[600px] aspect-[4/5]">
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={exhibitions[hoveredIndex].id}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={exhibitions[hoveredIndex].image}
                                    alt={`${exhibitions[hoveredIndex].title} ${exhibitions[hoveredIndex].year}`}
                                    fill
                                    className="object-cover rounded-xl lg:rounded-2xl xl:rounded-3xl 2xl:rounded-[32px] shadow-xl"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
                
                {/* Mobile Background Image */}
                <div className="md:hidden absolute inset-0 z-0 opacity-10 pointer-events-none">
                    <Image 
                        src={exhibitions[hoveredIndex].image}
                        alt={`${exhibitions[hoveredIndex].title} ${exhibitions[hoveredIndex].year}`}
                        fill
                        className="object-cover transition-all duration-500 rounded-xl"
                        sizes="100vw"
                    />
                </div>
            </div>
        </section>
    );
}
