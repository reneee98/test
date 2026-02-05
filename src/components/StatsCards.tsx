'use client';

import { useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedText from './AnimatedText';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function StatsCards() {
    const sectionRef = useRef<HTMLElement>(null);
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);
    
    const metrics = [
        { 
            label: 'PARTICIPANTS', 
            value: 36000, 
            suffix: '+',
        },
        { 
            label: 'EXHIBITORS', 
            value: 1070, 
            suffix: '+',
        },
        { 
            label: 'REPRESENTED COUNTRIES', 
            value: 80, 
            suffix: '+',
        }
    ];

    useLayoutEffect(() => {
        if (typeof window === 'undefined' || !sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Animate description
            if (descriptionRef.current) {
                gsap.from(descriptionRef.current, {
                    y: 60,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: descriptionRef.current,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse',
                    },
                });
            }

            // Animate cards
            if (cardsRef.current) {
                const cards = cardsRef.current.children;
                gsap.from(cards, {
                    y: 80,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out',
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: cardsRef.current,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse',
                    },
                });
            }

            // Refresh after a delay
            setTimeout(() => ScrollTrigger.refresh(), 500);

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section 
            ref={sectionRef} 
            className="relative w-full bg-[#121212] pt-12 lg:pt-16 xl:pt-24 2xl:pt-32 pb-16 lg:pb-20 xl:pb-32 2xl:pb-40 px-6 lg:px-12 xl:px-16 2xl:px-24"
        >
            <div className="w-full">
                {/* Header */}
                <div className="mb-12 lg:mb-16 xl:mb-20 2xl:mb-24 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8 xl:gap-12 2xl:gap-16">
                    <div className="flex-shrink-0">
                        <AnimatedText 
                            as="h1" 
                            className="text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white leading-[1.0]"
                            stagger={0.04}
                            start="top 90%"
                        >
                            Key figures
                        </AnimatedText>
                    </div>
                    <p 
                        ref={descriptionRef}
                        className="text-white/70 text-sm lg:text-base xl:text-lg 2xl:text-xl leading-relaxed max-w-2xl xl:max-w-3xl 2xl:max-w-4xl font-light"
                    >
                        WNE 2025 confirms its status as the leading nuclear exhibition, with remarkable figures that demonstrate the global industry's commitment to innovation, safety, and the advancement of sustainable, decarbonized energy solutions.
                    </p>
                </div>

                {/* Divider */}
                <div className="mb-10 lg:mb-12 xl:mb-16 2xl:mb-20 border-t border-white/10"></div>

                {/* Three Panels */}
                <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 xl:gap-8 2xl:gap-10">
                    {metrics.map((metric, index) => {
                        const hasBackgroundImage = index === 1;
                        const isDarkCard = index === 0 || index === 2;
                        
                        return (
                            <div
                                key={metric.label}
                                className={`relative rounded-xl lg:rounded-2xl xl:rounded-3xl 2xl:rounded-[32px] p-6 lg:p-8 xl:p-10 2xl:p-12 min-h-[280px] lg:min-h-[300px] xl:min-h-[350px] 2xl:min-h-[400px] flex flex-col justify-between items-end overflow-hidden ${
                                    isDarkCard ? 'bg-[#1D1D1D]' : 'bg-[#2A2A2A]'
                                }`}
                            >
                                {hasBackgroundImage && (
                                    <>
                                        <div className="absolute inset-0 z-0">
                                            <Image
                                                src="/images/desert.png"
                                                alt="Background"
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                        </div>
                                        <div className="absolute inset-0 z-0">
                                            <Image
                                                src="/images/fotky/keyfigures.jpg"
                                                alt="Key figures background"
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-black/60 z-0"></div>
                                    </>
                                )}
                                
                                <div className="relative z-10 w-full flex flex-col justify-between items-end h-full">
                                    <div className="text-right">
                                        <span 
                                            className="text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-thin block leading-none tracking-tight text-white"
                                            style={{ fontFamily: "'Nohemi', sans-serif" }}
                                        >
                                            {metric.value.toLocaleString('en-US')}{metric.suffix}
                                        </span>
                                    </div>
                                    
                                    <p className="text-white text-xs lg:text-sm xl:text-base 2xl:text-lg uppercase tracking-wide text-right">
                                        {metric.label}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
