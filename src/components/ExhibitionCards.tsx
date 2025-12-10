'use client';

import { useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const cards = [
    {
        title: 'World nuclear',
        subtitle: 'exhibition',
        year: '2021',
        image: '/images/fotky/wne2021.jpg'
    },
    {
        title: 'World nuclear',
        subtitle: 'exhibition',
        year: '2023',
        image: '/images/fotky/wne2023.jpg'
    },
    {
        title: 'World nuclear',
        subtitle: 'exhibition',
        year: '2025',
        image: '/images/fotky/wne2025.jpg'
    }
];

export default function ExhibitionCards() {
    const sectionRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const isActiveRef = useRef(false);
    const progressRef = useRef(0);
    const moveDistanceRef = useRef(0);
    const lastTouchYRef = useRef(0);

    const updateAnimation = useCallback((prog: number) => {
        const card1 = cardsRef.current[0];
        const card2 = cardsRef.current[1];
        const moveDistance = moveDistanceRef.current;

        if (!card1 || !card2) return;

        const card1Progress = Math.min(prog * 2, 1);
        gsap.to(card1, {
            x: -card1Progress * moveDistance,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto'
        });

        const card2Progress = Math.max(0, (prog - 0.5) * 2);
        gsap.to(card2, {
            x: card2Progress * moveDistance,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    }, []);

    const stopScroll = useCallback((e: Event) => {
        if (isActiveRef.current) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, []);

    const activateSection = useCallback(() => {
        if (isActiveRef.current) return;
        isActiveRef.current = true;
        
        // Zastavíme Lenis
        const lenis = (window as Window & { lenis?: { stop: () => void } }).lenis;
        if (lenis) lenis.stop();
        
        // Blokujeme scroll
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
        document.addEventListener('touchmove', stopScroll, { passive: false });
        document.addEventListener('scroll', stopScroll, { passive: false });
    }, [stopScroll]);

    const deactivateSection = useCallback(() => {
        if (!isActiveRef.current) return;
        isActiveRef.current = false;
        
        // Obnovíme scroll
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        document.removeEventListener('touchmove', stopScroll);
        document.removeEventListener('scroll', stopScroll);
        
        // Spustíme Lenis
        const lenis = (window as Window & { lenis?: { start: () => void } }).lenis;
        if (lenis) lenis.start();
    }, [stopScroll]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const section = sectionRef.current;
        const card1 = cardsRef.current[0];
        const card2 = cardsRef.current[1];
        const card3 = cardsRef.current[2];

        if (!section || !card1 || !card2 || !card3) return;

        moveDistanceRef.current = window.innerWidth * 1.2;

        // Počiatočné pozície
        gsap.set([card1, card2, card3], {
            xPercent: -50,
            left: '50%',
            x: 0
        });
        gsap.set(card1, { rotation: -2 });
        gsap.set(card2, { rotation: 0 });
        gsap.set(card3, { rotation: 2 });

        // Intersection Observer s rootMargin pre lepšiu detekciu
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
                        // Aktivuj ak animácia nie je na konci ALEBO ak nie je na začiatku
                        // To znamená - aktivuj vždy keď je sekcia viditeľná a animácia nie je "hotová" v danom smere
                        if (!isActiveRef.current) {
                            activateSection();
                        }
                    }
                });
            },
            { 
                threshold: [0, 0.25, 0.5, 0.75, 0.9, 1],
                rootMargin: '0px'
            }
        );

        observer.observe(section);

        // Wheel handler
        const handleWheel = (e: WheelEvent) => {
            if (!isActiveRef.current) return;

            e.preventDefault();
            e.stopPropagation();

            const delta = e.deltaY || e.detail || 0;
            const currentProgress = progressRef.current;
            const sensitivity = 0.002;
            const newProgress = Math.max(0, Math.min(1, currentProgress + delta * sensitivity));
            
            progressRef.current = newProgress;
            updateAnimation(newProgress);

            // Dokončenie animácie smerom dole (progress = 1, scroll dole)
            if (newProgress >= 0.99 && delta > 0) {
                progressRef.current = 1;
                updateAnimation(1);
                setTimeout(() => deactivateSection(), 150);
            }
            
            // Dokončenie animácie smerom hore (progress = 0, scroll hore)
            if (newProgress <= 0.01 && delta < 0) {
                progressRef.current = 0;
                updateAnimation(0);
                setTimeout(() => deactivateSection(), 150);
            }
        };

        // Touch handlers pre mobile a trackpad
        const handleTouchStart = (e: TouchEvent) => {
            if (!isActiveRef.current) return;
            lastTouchYRef.current = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isActiveRef.current) return;

            e.preventDefault();
            
            const touchY = e.touches[0].clientY;
            const delta = lastTouchYRef.current - touchY;
            lastTouchYRef.current = touchY;

            const currentProgress = progressRef.current;
            const sensitivity = 0.003;
            const newProgress = Math.max(0, Math.min(1, currentProgress + delta * sensitivity));
            
            progressRef.current = newProgress;
            updateAnimation(newProgress);

            // Dokončenie animácie smerom dole
            if (newProgress >= 0.99 && delta > 0) {
                progressRef.current = 1;
                updateAnimation(1);
                setTimeout(() => deactivateSection(), 150);
            }
            
            // Dokončenie animácie smerom hore
            if (newProgress <= 0.01 && delta < 0) {
                progressRef.current = 0;
                updateAnimation(0);
                setTimeout(() => deactivateSection(), 150);
            }
        };

        // Event listeners
        window.addEventListener('wheel', handleWheel, { passive: false });
        section.addEventListener('touchstart', handleTouchStart, { passive: true });
        section.addEventListener('touchmove', handleTouchMove, { passive: false });

        // Resize handler
        const handleResize = () => {
            moveDistanceRef.current = window.innerWidth * 1.2;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            observer.disconnect();
            window.removeEventListener('wheel', handleWheel);
            section.removeEventListener('touchstart', handleTouchStart);
            section.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('resize', handleResize);
            deactivateSection();
        };
    }, [updateAnimation, activateSection, deactivateSection]);

    return (
        <section 
            ref={sectionRef}
            className="relative w-full h-screen bg-[#121212] px-4 lg:px-8 xl:px-12 2xl:px-16 flex items-center justify-center"
        >
            <div className="w-full h-full flex items-center justify-center">
                <div className="cards-container relative w-full h-[500px] lg:h-[600px] xl:h-[700px] 2xl:h-[800px] flex items-center justify-center overflow-visible">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            ref={(el) => { 
                                cardsRef.current[index] = el;
                            }}
                            className="absolute w-full max-w-[1664px] xl:max-w-[1800px] 2xl:max-w-[2000px] h-[400px] lg:h-[480px] xl:h-[580px] 2xl:h-[680px] rounded-xl lg:rounded-2xl xl:rounded-3xl 2xl:rounded-[32px] overflow-hidden border border-white p-[5px] lg:p-[6px] xl:p-[8px] 2xl:p-[10px]"
                            style={{ zIndex: cards.length - index }}
                        >
                            <div className="relative w-full h-full bg-[#1D1D1D] rounded-xl lg:rounded-2xl xl:rounded-[28px] 2xl:rounded-[36px] overflow-hidden p-3 lg:p-4 xl:p-5 2xl:p-6">
                                <div className="flex h-full">
                                    <div className="bg-[#1D1D1D] rounded-l-xl lg:rounded-l-2xl xl:rounded-l-[28px] 2xl:rounded-l-[36px] p-6 lg:p-8 xl:p-12 2xl:p-16 w-1/2 flex flex-col justify-between h-full">
                                        <div className="flex flex-col">
                                            <h2 className="text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white leading-none mb-2 lg:mb-3 xl:mb-4">
                                                {card.title}
                                            </h2>
                                            <h3 className="text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white leading-none mb-2 lg:mb-3 xl:mb-4">
                                                {card.subtitle}
                                            </h3>
                                            <p className="text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white leading-none mb-6 lg:mb-8 xl:mb-10 2xl:mb-12">
                                                {card.year}
                                            </p>
                                        </div>
                                        
                                        <button 
                                            className="flex items-center gap-0 group"
                                            tabIndex={0}
                                            aria-label={`View more photos from ${card.title} ${card.subtitle} ${card.year}`}
                                        >
                                            <span className="px-4 lg:px-6 xl:px-8 2xl:px-10 py-2 lg:py-3 xl:py-4 2xl:py-5 rounded-full bg-[#D7DF21] text-[#1F1919] font-medium text-sm lg:text-base xl:text-lg 2xl:text-xl group-hover:bg-[#D7DF21]/90 transition-colors whitespace-nowrap">
                                                View more photos
                                            </span>
                                            <span className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 rounded-full bg-[#D7DF21] group-hover:bg-[#D7DF21]/90 flex items-center justify-center transition-colors flex-shrink-0">
                                                <svg width="18" height="18" className="lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7.5 15L12.5 10L7.5 5" stroke="#1F1919" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </span>
                                        </button>
                                    </div>
                                    
                                    <div className="w-1/2 bg-[#1D1D1D] rounded-r-xl lg:rounded-r-2xl xl:rounded-r-[28px] 2xl:rounded-r-[36px] relative overflow-hidden h-full">
                                        <Image
                                            src={card.image}
                                            alt={`${card.title} ${card.subtitle} ${card.year}`}
                                            fill
                                            className="object-cover h-full rounded-[13px]"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
