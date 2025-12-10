'use client';

import Image from 'next/image';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedText from './AnimatedText';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const speakers = [
    {
        name: 'MONIQUE BARBUT',
        role: '',
        image: '/images/portretovky/portrait-png.png'
    },
    {
        name: 'ROLAND LESCURE',
        role: 'Minister for Ecological Transition, Biodiversity and International Negotiations on Climate and Nature for France',
        image: '/images/portretovky/portrait2.png'
    },
    {
        name: 'SYLVIE BERMANN',
        role: '',
        image: '/images/portretovky/portrait3.png'
    },
    {
        name: 'CÉDRIC KLAPISCH',
        role: 'DIRECTOR • SCREENWRITER • PRODUCER',
        image: '/images/portretovky/portrait-png.png'
    },
    {
        name: 'ELISHA KARMITZ',
        role: 'PRODUCER - CHIEF EXECUTIVE OFFICER OF MK2',
        image: '/images/portretovky/portrait2.png'
    },
    {
        name: 'ANA GIRARDOT',
        role: 'ACTRESS',
        image: '/images/portretovky/portrait3.png'
    },
    {
        name: 'BRUNO PATINO',
        role: 'CEO OF ARTE FRANCE - JOURNALIST AND MEDIA EXECUTIVE',
        image: '/images/portretovky/portrait-png.png'
    },
    {
        name: 'JUNIE LAU',
        role: 'ARTIST',
        image: '/images/portretovky/portrait2.png'
    },
    {
        name: 'RAPHAËL FRYDMAN',
        role: 'FILMMAKER',
        image: '/images/portretovky/portrait3.png'
    },
    {
        name: 'JEAN-PIERRE DARROUSSIN',
        role: 'ACTOR • DIRECTOR',
        image: '/images/portretovky/portrait-png.png'
    },
    {
        name: 'MARION COTILLARD',
        role: 'ACTRESS • PRODUCER',
        image: '/images/portretovky/portrait2.png'
    },
    {
        name: 'LÉA SEYDOUX',
        role: 'ACTRESS',
        image: '/images/portretovky/portrait3.png'
    },
];

export default function SpeakersSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        if (!sectionRef.current || !wrapperRef.current) return;

        gsap.set(sectionRef.current, { backgroundColor: '#FFFFFF' });

        // Animácia kariet pri vstupe do sekcie
        const cards = sectionRef.current.querySelectorAll('.speaker-card');
        if (cards.length > 0) {
            gsap.set(cards, {
                opacity: 0,
                y: 60,
                force3D: true,
            });

            gsap.to(cards, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'expo.out',
                stagger: 0.1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 50%',
                    end: 'top 30%',
                    toggleActions: 'play none none reverse',
                },
                force3D: true,
            });
        }

        // Automatický slider - posúvanie zľava doprava
        const initAutoSlider = () => {
            if (!wrapperRef.current) return;

            const cards = wrapperRef.current.querySelectorAll('.speaker-card');
            if (cards.length === 0) return;

            // Získame šírku jednej karty a spacing
            const firstCard = cards[0] as HTMLElement;
            const cardWidth = firstCard.offsetWidth || 450;
            const spaceBetween = 80; // Medzera medzi kartami
            const totalWidth = (cardWidth + spaceBetween) * speakers.length;
            const viewportWidth = window.innerWidth;
            
            // Vypočítame, o koľko musíme posunúť, aby posledná karta prešla cez viewport
            // Posunieme tak, aby posledná karta prešla úplne cez pravý okraj
            const maxTranslateX = -(totalWidth - viewportWidth + cardWidth);

            // Nastavíme počiatočnú pozíciu
            gsap.set(wrapperRef.current, {
                x: 0,
                force3D: true,
            });

            // Vytvoríme nekonečnú animáciu s plynulým resetom
            const tl = gsap.timeline({
                repeat: -1,
                ease: 'none',
            });

            // Animácia zľava doprava
            tl.to(wrapperRef.current, {
                x: maxTranslateX,
                duration: speakers.length * 10, // 10 sekúnd na každú kartu (pomaly)
                ease: 'none',
                force3D: true,
            });

            // Reset na začiatok s okamžitým presunom (bez animácie)
            tl.set(wrapperRef.current, {
                x: 0,
                immediateRender: false,
            });

            animationRef.current = tl;

            // Pause on hover
            const handleMouseEnter = () => {
                if (animationRef.current) {
                    animationRef.current.pause();
                }
            };

            const handleMouseLeave = () => {
                if (animationRef.current) {
                    animationRef.current.resume();
                }
            };

            if (sectionRef.current) {
                sectionRef.current.addEventListener('mouseenter', handleMouseEnter);
                sectionRef.current.addEventListener('mouseleave', handleMouseLeave);
            }

            return () => {
                if (animationRef.current) {
                    animationRef.current.kill();
                }
                if (sectionRef.current) {
                    sectionRef.current.removeEventListener('mouseenter', handleMouseEnter);
                    sectionRef.current.removeEventListener('mouseleave', handleMouseLeave);
                }
            };
        };

        // Spustíme animáciu až keď sekcia vstúpi do viewportu pomocou ScrollTrigger
        let hasStarted = false;
        
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                if (!hasStarted && !animationRef.current) {
                    hasStarted = true;
                    requestAnimationFrame(() => {
                        initAutoSlider();
                    });
                }
            },
        });

        // Refresh pri resize
        const handleResize = () => {
            if (animationRef.current) {
                animationRef.current.kill();
            }
            requestAnimationFrame(() => {
                initAutoSlider();
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationRef.current) {
                animationRef.current.kill();
            }
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.vars.trigger === sectionRef.current) {
                    trigger.kill();
                }
            });
        };
    }, []);

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
                            Among key speakers
                        </AnimatedText>
                        <AnimatedText 
                            as="span" 
                            className="block"
                            stagger={0.025}
                            start="top 85%"
                        >
                            of the edition
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
                        {speakers.map((speaker, index) => {
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
            </div>
        </section>
    );
}
