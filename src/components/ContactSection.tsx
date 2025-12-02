'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedText from './AnimatedText';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function ContactSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!sectionRef.current || !containerRef.current) return;

        // Animace rámečku
        gsap.fromTo(containerRef.current,
            { scale: 0.95, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            }
        );

        // Animace tlačítka
        if (buttonRef.current) {
            gsap.fromTo(buttonRef.current,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: 0.3,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        }

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full bg-white py-16 lg:py-24 overflow-hidden">
            <div className="w-full px-6 lg:px-12">
                <div ref={containerRef} className="border-2 border-gray-300 rounded-[40px] p-8 lg:p-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Left Column */}
                    <div>
                        <p className="text-[#1F1919]/60 text-sm uppercase tracking-wide mb-4">CONTACT</p>
                        <AnimatedText 
                            as="h2" 
                            className="text-3xl lg:text-5xl xl:text-6xl font-bold text-[#1F1919] leading-tight"
                            stagger={0.04}
                            start="top 85%"
                        >
                            Get in touch.
                        </AnimatedText>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-6">
                        <p className="text-[#1F1919] text-base lg:text-lg leading-relaxed">
                            There are collaborative opportunities for like-minded organisations to partner with Fin-Erth across our global dinners/events, the inaugural Fin-Erth Women in Climate Awards as well as a new convening planned for 2025 and beyond.
                        </p>
                        
                        <p className="text-[#1F1919] text-base lg:text-lg leading-relaxed">
                            Our trusted partners support the growth of a truly global network of women working at the intersection of business, finance and climate; those women really unlocking solutions within their sector. We already know that trust is built in the room, not the virtual room, and that trust is the only way we unlock solutions at the scale and speed necessary.
                        </p>

                        {/* Button */}
                        <div className="mt-4">
                            <button ref={buttonRef} className="flex items-center gap-0 group">
                                <span className="px-6 py-3 rounded-full bg-[#1F1919] text-white font-medium text-base group-hover:bg-[#368391] transition-colors">
                                    Get In Touch
                                </span>
                                <span className="w-12 h-12 rounded-full bg-[#1F1919] group-hover:bg-[#368391] flex items-center justify-center transition-colors flex-shrink-0">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.5 15L12.5 10L7.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

