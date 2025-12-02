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
            className="relative w-full bg-[#121212] pt-16 lg:pt-24 pb-20 lg:pb-32 px-8 lg:px-16 xl:px-24"
        >
            <div className="w-full">
                {/* Header */}
                <div className="mb-16 lg:mb-20 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12">
                    <div className="flex-shrink-0">
                        <AnimatedText 
                            as="h1" 
                            className="text-7xl lg:text-8xl font-bold text-white leading-[1.0]"
                            stagger={0.04}
                            start="top 90%"
                        >
                            Key figures
                        </AnimatedText>
                    </div>
                    <p 
                        ref={descriptionRef}
                        className="text-white/70 text-base lg:text-lg leading-relaxed max-w-2xl font-light"
                    >
                        Explore how nuclear energy is transforming sectors beyond power—advancing medicine, revolutionizing agriculture, powering space missions, producing hydrogen, providing heat, and enabling desalination for water security.
                    </p>
                </div>

                {/* Divider */}
                <div className="mb-12 lg:mb-16 border-t border-white/10"></div>

                {/* Three Panels */}
                <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {metrics.map((metric, index) => {
                        const hasBackgroundImage = index === 1;
                        const isDarkCard = index === 0 || index === 2;
                        
                        return (
                            <div
                                key={metric.label}
                                className={`relative rounded-2xl p-8 lg:p-10 min-h-[300px] flex flex-col justify-between items-end overflow-hidden ${
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
                                            className="text-6xl lg:text-8xl font-thin block leading-none tracking-tight text-white"
                                            style={{ fontFamily: "'Nohemi', sans-serif" }}
                                        >
                                            {metric.suffix}{metric.value.toLocaleString('en-US')}
                                        </span>
                                    </div>
                                    
                                    <p className="text-white text-sm lg:text-base uppercase tracking-wide text-right">
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
