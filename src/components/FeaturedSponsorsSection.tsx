'use client';

import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import AnimatedText from './AnimatedText';

type Sponsor = {
    name: string;
    logo: string;
    tier: 'Platinum' | 'Gold' | 'Silver';
};

const sponsors: Sponsor[] = [
    { name: 'EDF', logo: '/images/sponsors/edf_logo.jpg', tier: 'Platinum' },
    { name: 'Framatome', logo: '/images/sponsors/Framatome.jpg', tier: 'Platinum' },
    { name: 'Orano', logo: '/images/sponsors/Orano.jpg', tier: 'Platinum' },
    { name: 'Westinghouse', logo: '/images/sponsors/Westinghouse BLUE.jpg', tier: 'Platinum' },
    { name: 'Assystem', logo: '/images/sponsors/Assystem.jpg', tier: 'Gold' },
    { name: 'Atkins', logo: '/images/sponsors/Atkins Logo.jpg', tier: 'Gold' },
    { name: 'Boccard', logo: '/images/sponsors/boccard.jpg', tier: 'Gold' },
    { name: 'Bureau Veritas', logo: '/images/sponsors/Bureau Veritas (1).png', tier: 'Gold' },
    { name: 'Celeros', logo: '/images/sponsors/Celeros.jpg', tier: 'Gold' },
    { name: 'CNNC', logo: '/images/sponsors/CNNC (1).jpg', tier: 'Gold' },
    { name: 'EY', logo: '/images/sponsors/EY..jpg', tier: 'Silver' },
    { name: 'Apave', logo: '/images/sponsors/Apave (300 x 165 px).png', tier: 'Silver' },
    { name: 'Urenco', logo: '/images/sponsors/Urenco.png', tier: 'Silver' },
    { name: 'Rolls-Royce', logo: '/images/sponsors/RR (1).jpg', tier: 'Silver' },
];

const tierColors = {
    Platinum: 'bg-[#E5E5E5] text-[#1F1919]',
    Gold: 'bg-[#D4AF37] text-[#1F1919]',
    Silver: 'bg-[#C0C0C0] text-[#1F1919]',
};

export default function FeaturedSponsorsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<gsap.core.Tween | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Intersection Observer pre detekciu vstupu do viewportu
    useEffect(() => {
        if (!sectionRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                });
            },
            {
                threshold: 0.2,
            }
        );

        observer.observe(sectionRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    // Spustenie animácie keď je sekcia viditeľná
    useEffect(() => {
        if (!isVisible || !wrapperRef.current) return;

        const timeout = setTimeout(() => {
            if (!wrapperRef.current) return;

            const wrapper = wrapperRef.current;
            const cards = wrapper.querySelectorAll('.sponsor-card');
            if (cards.length === 0) return;

            const firstCard = cards[0] as HTMLElement;
            const cardWidth = firstCard.offsetWidth || 300;
            const computedStyle = window.getComputedStyle(wrapper);
            const gap = parseInt(computedStyle.gap) || 40;
            const totalWidth = (cardWidth + gap) * sponsors.length;

            // Infinity slider animácia
            const tween = gsap.to(wrapper, {
                x: -totalWidth,
                duration: sponsors.length * 4,
                ease: 'none',
                repeat: -1,
                force3D: true,
            });

            animationRef.current = tween;

            // Pause on hover
            const handleMouseEnter = () => tween.pause();
            const handleMouseLeave = () => tween.resume();

            wrapper.addEventListener('mouseenter', handleMouseEnter);
            wrapper.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                wrapper.removeEventListener('mouseenter', handleMouseEnter);
                wrapper.removeEventListener('mouseleave', handleMouseLeave);
            };
        }, 200);

        return () => {
            clearTimeout(timeout);
            if (animationRef.current) {
                animationRef.current.kill();
                animationRef.current = null;
            }
        };
    }, [isVisible]);

    return (
        <section ref={sectionRef} className="relative w-full bg-white text-[#1F1919] overflow-hidden py-16 lg:py-20 xl:py-24 2xl:py-32">
            <div className="relative z-10 w-full">
                {/* Header */}
                <div className="mb-8 lg:mb-10 xl:mb-12 2xl:mb-14 text-center px-4 lg:px-6 xl:px-12 2xl:px-16">
                    <h1 className="text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold leading-[1.0]">
                        <AnimatedText 
                            as="span" 
                            className="block"
                            stagger={0.025}
                            start="top 85%"
                        >
                            Featured sponsors
                        </AnimatedText>
                    </h1>
                </div>

                {/* Auto Slider */}
                <div className="relative w-full py-8 lg:py-12 xl:py-16 2xl:py-20 overflow-hidden">
                    <div 
                        ref={wrapperRef}
                        className="flex gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 pl-4 lg:pl-6 xl:pl-12 2xl:pl-16"
                        style={{ willChange: 'transform' }}
                    >
                        {/* Duplikujeme karty pre infinity efekt */}
                        {[...sponsors, ...sponsors].map((sponsor, index) => (
                            <div
                                key={`${sponsor.name}-${index}`}
                                className="flex-shrink-0 sponsor-card w-[280px] lg:w-[320px] xl:w-[360px] 2xl:w-[400px]"
                            >
                                <div className="w-full rounded-xl lg:rounded-2xl xl:rounded-3xl 2xl:rounded-[32px] overflow-hidden bg-white border border-gray-200 group hover:border-[#D7DF21] transition-colors duration-300">
                                    {/* Logo Container */}
                                    <div className="relative h-[200px] lg:h-[240px] xl:h-[280px] 2xl:h-[320px] bg-white flex items-center justify-center p-6 lg:p-8 xl:p-10 2xl:p-12">
                                        <Image
                                            src={sponsor.logo}
                                            alt={sponsor.name}
                                            fill
                                            className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                                            sizes="(max-width: 1024px) 280px, (max-width: 1280px) 320px, (max-width: 1536px) 360px, 400px"
                                        />
                                    </div>
                                    
                                    {/* Tier Badge */}
                                    <div className="px-4 lg:px-5 xl:px-6 2xl:px-8 py-3 lg:py-4 xl:py-5 2xl:py-6">
                                        <span className={`inline-block px-3 py-1.5 lg:px-4 lg:py-2 xl:px-5 xl:py-2.5 2xl:px-6 2xl:py-3 rounded-full text-xs lg:text-sm xl:text-base 2xl:text-lg font-semibold uppercase tracking-wide ${tierColors[sponsor.tier]}`}>
                                            {sponsor.tier}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* View All Button */}
                <div className="flex justify-center pt-8 lg:pt-10 xl:pt-12 2xl:pt-14 px-4 lg:px-6 xl:px-12 2xl:px-16">
                    <a 
                        href="/exhibit/sponsors" 
                        className="flex items-center gap-0 group"
                    >
                        <span className="px-4 py-2 lg:px-5 lg:py-2.5 xl:px-6 xl:py-3 2xl:px-7 2xl:py-3.5 rounded-full bg-[#1F1919] text-[#F0F0F0] font-medium text-sm lg:text-base xl:text-lg 2xl:text-xl group-hover:bg-[#368391] transition-colors whitespace-nowrap">
                            View all sponsors
                        </span>
                        <span className="w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 rounded-full bg-[#1F1919] group-hover:bg-[#368391] flex items-center justify-center transition-colors flex-shrink-0">
                            <svg width="12" height="12" className="lg:w-[14px] lg:h-[14px] xl:w-[16px] xl:h-[16px] 2xl:w-[18px] 2xl:h-[18px] text-[#F0F0F0]" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 10L10 4M10 4H4M10 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </a>
                </div>
            </div>
        </section>
    );
}
