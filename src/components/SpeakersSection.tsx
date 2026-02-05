'use client';

import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import AnimatedText from './AnimatedText';

const speakers = [
    {
        name: 'MONIQUE BARBUT',
        role: 'Executive Director, World Nuclear Association',
        image: '/images/portretovky/portrait-png.png'
    },
    {
        name: 'ROLAND LESCURE',
        role: 'Vice-President Energy Transition, EDF',
        image: '/images/portretovky/portrait2.png'
    },
    {
        name: 'SYLVIE BERMANN',
        role: 'Technical Director, French Nuclear Safety Authority (ASN)',
        image: '/images/portretovky/portrait3.png'
    },
    {
        name: 'CÉDRIC KLAPISCH',
        role: 'Executive Director, Framatome',
        image: '/images/portretovky/portrait-png.png'
    },
    {
        name: 'ELISHA KARMITZ',
        role: 'Head of Business Development, Orano',
        image: '/images/portretovky/portrait2.png'
    },
    {
        name: 'ANA GIRARDOT',
        role: 'Head of R&D, IAEA Division of Nuclear Power',
        image: '/images/portretovky/portrait3.png'
    },
    {
        name: 'BRUNO PATINO',
        role: 'Vice-President New Build, Westinghouse',
        image: '/images/portretovky/portrait-png.png'
    },
    {
        name: 'JUNIE LAU',
        role: 'Technical Director, CEA',
        image: '/images/portretovky/portrait2.png'
    },
    {
        name: 'RAPHAËL FRYDMAN',
        role: 'Executive Director, Nuclear Energy Agency (NEA)',
        image: '/images/portretovky/portrait3.png'
    },
    {
        name: 'JEAN-PIERRE DARROUSSIN',
        role: 'Head of R&D, Assystem',
        image: '/images/portretovky/portrait-png.png'
    },
    {
        name: 'MARION COTILLARD',
        role: 'Head of Business Development, SMR Programme',
        image: '/images/portretovky/portrait2.png'
    },
    {
        name: 'LÉA SEYDOUX',
        role: 'Vice-President Innovation & New Nuclear, Urenco',
        image: '/images/portretovky/portrait3.png'
    },
];

export default function SpeakersSection() {
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
                        observer.disconnect(); // Spustíme len raz
                    }
                });
            },
            {
                threshold: 0.2, // 20% sekcie musí byť viditeľné
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

        // Počkáme na DOM
        const timeout = setTimeout(() => {
            if (!wrapperRef.current) return;

            // Získame rozmery
            const wrapper = wrapperRef.current;
            const cards = wrapper.querySelectorAll('.speaker-card');
            if (cards.length === 0) return;

            const firstCard = cards[0] as HTMLElement;
            const cardWidth = firstCard.offsetWidth || 450;
            const computedStyle = window.getComputedStyle(wrapper);
            const gap = parseInt(computedStyle.gap) || 80;
            const totalWidth = (cardWidth + gap) * speakers.length;

            // Infinity slider animácia
            const tween = gsap.to(wrapper, {
                x: -totalWidth,
                duration: speakers.length * 6, // 6 sekúnd na kartu
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
        <section ref={sectionRef} className="relative w-full min-h-screen bg-white text-[#1F1919] overflow-hidden flex flex-col justify-center">
            <div className="relative z-10 w-full">
                {/* Header */}
                <div className="pt-16 lg:pt-20 xl:pt-24 2xl:pt-32 mb-2 lg:mb-3 xl:mb-4 2xl:mb-6 text-center px-4 lg:px-6 xl:px-12 2xl:px-16">
                    <h1 className="text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold leading-[1.0]">
                        <AnimatedText 
                            as="span" 
                            className="block"
                            stagger={0.025}
                            start="top 85%"
                        >
                            Key speakers of the 2027 edition
                        </AnimatedText>
                    </h1>
                </div>

                {/* Auto Slider */}
                <div className="relative w-full py-8 lg:py-12 xl:py-16 2xl:py-20 pb-16 lg:pb-20 xl:pb-24 2xl:pb-28 overflow-hidden">
                    <div 
                        ref={wrapperRef}
                        className="flex gap-10 lg:gap-12 xl:gap-16 2xl:gap-20 pl-4 lg:pl-6 xl:pl-12 2xl:pl-16"
                        style={{ willChange: 'transform' }}
                    >
                        {/* Duplikujeme karty pre infinity efekt */}
                        {[...speakers, ...speakers].map((speaker, index) => {
                            const isEven = index % 2 === 0;
                            
                            return (
                                <div
                                    key={index}
                                    className="flex-shrink-0 w-[350px] lg:w-[400px] xl:w-[450px] 2xl:w-[450px]"
                                >
                                    <div className={`speaker-card w-full rounded-2xl lg:rounded-3xl xl:rounded-[32px] 2xl:rounded-[40px] overflow-hidden flex flex-col shadow-lg group ${isEven ? '' : 'translate-y-[32px] lg:translate-y-[44px] xl:translate-y-[60px] 2xl:translate-y-[60px]'}`}>
                                        {/* Portrét s barevným pozadím a obrázkom v pozadí */}
                                        <div 
                                            className="portrait-bg relative h-[320px] lg:h-[380px] xl:h-[560px] 2xl:h-[560px] transition-colors duration-300 bg-gray-200 group-hover:bg-[#D7DF21] flex items-center justify-center overflow-visible rounded-2xl lg:rounded-3xl xl:rounded-[32px] 2xl:rounded-[40px] p-6 lg:p-8 xl:p-10 2xl:p-12 pb-20 lg:pb-24 xl:pb-28 2xl:pb-32"
                                            style={{
                                                backgroundImage: `url('${speaker.image}')`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat'
                                            }}
                                        >
                                            {/* Container pro badge - flex column pro automatické uspořádání */}
                                            <div className={`badges-container absolute left-6 lg:left-8 xl:left-10 2xl:left-12 right-6 lg:right-8 xl:right-10 2xl:right-12 flex flex-col-reverse gap-2 lg:gap-2.5 xl:gap-3 2xl:gap-4 z-10 items-start ${isEven ? 'bottom-3 lg:bottom-4 xl:bottom-5 2xl:bottom-6' : 'bottom-2 lg:bottom-3 xl:bottom-4 2xl:bottom-5'}`}>
                                                {/* Overlay label s jménem - černý obdélník s bílým textem - posune se nahoru při hover */}
                                                <div className="name-overlay bg-[#1F1919] px-4 lg:px-[17px] xl:px-5 2xl:px-6 py-2 lg:py-[8.4px] xl:py-2.5 2xl:py-3 rounded-lg xl:rounded-xl 2xl:rounded-2xl w-fit transition-all duration-300">
                                                    <span className="text-white text-xs lg:text-sm xl:text-base 2xl:text-lg font-normal uppercase tracking-wider">
                                                        {speaker.name}
                                                    </span>
                                                </div>
                                                
                                                {/* Bílá bublina s černým textem - vysune se zespodu při hover pod černý badge */}
                                                {speaker.role && (
                                                    <div className="role-bubble bg-white px-4 lg:px-[17px] xl:px-5 2xl:px-6 py-2 lg:py-[8.4px] xl:py-2.5 2xl:py-3 rounded-lg xl:rounded-xl 2xl:rounded-2xl w-fit max-w-full opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-300">
                                                        <span className="text-[#1F1919] text-xs lg:text-sm xl:text-base 2xl:text-lg font-normal text-left block">
                                                            {speaker.role}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* View All Button */}
                <div className="flex justify-center pb-16 lg:pb-20 xl:pb-24 2xl:pb-28 px-4 lg:px-6 xl:px-12 2xl:px-16">
                    <a 
                        href="/program/speakers" 
                        className="flex items-center gap-0 group"
                    >
                        <span className="px-4 py-2 lg:px-5 lg:py-2.5 xl:px-6 xl:py-3 2xl:px-7 2xl:py-3.5 rounded-full bg-[#1F1919] text-[#F0F0F0] font-medium text-sm lg:text-base xl:text-lg 2xl:text-xl group-hover:bg-[#368391] transition-colors whitespace-nowrap">
                            View all speakers
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
