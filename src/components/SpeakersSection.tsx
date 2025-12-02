'use client';

import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
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
    const swiperRef = useRef<SwiperType | null>(null);
    const swiperWrapperRef = useRef<HTMLDivElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (!sectionRef.current) return;

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

        let scrollTrigger: ScrollTrigger | null = null;
        let timeoutId: NodeJS.Timeout | null = null;
        let isMouseOver = false;

        const initScrollTrigger = () => {
            if (!swiperRef.current) {
                timeoutId = setTimeout(initScrollTrigger, 100);
                return;
            }

            const totalSlides = speakers.length;
            const scrollDistance = (totalSlides - 1) * 1000;
            
            scrollTrigger = ScrollTrigger.create({
                trigger: sectionRef.current,
                start: 'top top',
                end: () => `+=${scrollDistance}`,
                scrub: 0.1,
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    if (!swiperRef.current) return;
                    
                    // Scrollování probíhá pouze když je kurzor nad sekcí
                    if (!isMouseOver) {
                        // Když kurzor není nad sekcí, zastavíme scrollování
                        return;
                    }
                    
                    const progress = self.progress;
                    
                    const swiper = swiperRef.current;
                    const slides = swiper.slides;
                    
                    if (slides.length > 0 && swiper.wrapperEl) {
                        const slideWidth = slides[0].offsetWidth || 450;
                        const spaceBetween = 80;
                        const viewportWidth = window.innerWidth;
                        
                        // Počiatočná pozícia: začína zľava (translateX = 0)
                        const startX = 0;
                        
                        // Koncová pozícia: posledný slide v strede
                        // Stred posledného slide: (totalSlides - 1) * (slideWidth + spaceBetween) + slideWidth / 2
                        // Stred viewportu: viewportWidth / 2
                        // translateX = viewportWidth / 2 - [stred posledného slide]
                        const lastSlideCenter = (totalSlides - 1) * (slideWidth + spaceBetween) + slideWidth / 2;
                        const viewportCenter = viewportWidth / 2;
                        const endX = viewportCenter - lastSlideCenter;
                        
                        // Interpolácia medzi startX a endX podľa progress
                        const translateX = startX + (endX - startX) * progress;
                        
                        gsap.set(swiper.wrapperEl, {
                            x: translateX,
                            force3D: true,
                        });
                        
                        // Vypočítame aktívny slide index
                        const maxProgress = totalSlides - 1;
                        const swiperProgress = progress * maxProgress;
                        const targetSlide = Math.min(Math.round(swiperProgress), totalSlides - 1);
                        
                        if (swiper.activeIndex !== targetSlide) {
                            swiper.activeIndex = targetSlide;
                            swiper.updateSlidesClasses();
                            setActiveIndex(targetSlide);
                        }
                    }
                },
            });

            const swiper = swiperRef.current;
            const handleSlideChange = () => {
                setActiveIndex(swiper.activeIndex);
            };

            swiper.on('slideChange', handleSlideChange);

            // Sledujeme, zda je kurzor nad sekcí
            const handleMouseEnter = () => {
                isMouseOver = true;
                if (scrollTrigger) {
                    scrollTrigger.refresh();
                }
            };

            const handleMouseLeave = () => {
                isMouseOver = false;
                if (scrollTrigger) {
                    scrollTrigger.refresh();
                }
            };

            if (sectionRef.current) {
                sectionRef.current.addEventListener('mouseenter', handleMouseEnter);
                sectionRef.current.addEventListener('mouseleave', handleMouseLeave);
            }

            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 200);

            return () => {
                swiper.off('slideChange', handleSlideChange);
                if (sectionRef.current) {
                    sectionRef.current.removeEventListener('mouseenter', handleMouseEnter);
                    sectionRef.current.removeEventListener('mouseleave', handleMouseLeave);
                }
            };
        };

        timeoutId = setTimeout(initScrollTrigger, 300);

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (scrollTrigger) scrollTrigger.kill();
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
                <div className="mb-8 lg:mb-12 text-center px-6 lg:px-12">
                    <h1 className="text-7xl lg:text-8xl font-bold leading-[1.0]">
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

                {/* Swiper Slider */}
                <div className="relative w-full py-12 pb-20 pl-6 lg:pl-12">
                    <Swiper
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        grabCursor={false}
                        centeredSlides={false}
                        slidesPerView={3}
                        spaceBetween={80}
                        allowTouchMove={false}
                        className="swiper-simple"
                        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                        style={{ height: 'auto' }}
                        initialSlide={0}
                    >
                        {speakers.map((speaker, index) => {
                            const isEven = index % 2 === 0;
                            
                            return (
                                <SwiperSlide
                                    key={index}
                                    className="!flex"
                                >
                                    <div className={`speaker-card w-full rounded-3xl overflow-hidden flex flex-col shadow-lg group ${isEven ? '' : 'translate-y-[44px]'}`}>
                                        {/* Portrét s barevným pozadím a obrázkem v pozadí */}
                                        <div 
                                            className="portrait-bg relative h-[480px] lg:h-[600px] transition-colors duration-300 bg-gray-200 group-hover:bg-[#D7DF21] flex items-center justify-center overflow-visible rounded-3xl p-8 pb-24"
                                            style={{
                                                backgroundImage: `url('${speaker.image}')`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat'
                                            }}
                                        >
                                            {/* Container pro badge - flex column pro automatické uspořádání */}
                                            <div className={`badges-container absolute left-8 right-8 flex flex-col-reverse gap-2 z-10 items-start ${isEven ? 'bottom-4' : 'bottom-2'}`}>
                                                {/* Overlay label s jménem - černý obdélník s bílým textem - posune se nahoru při hover */}
                                                <div className="name-overlay bg-[#1F1919] px-[17px] py-[8.4px] rounded-lg w-fit transition-all duration-300">
                                                    <span className="text-white text-sm lg:text-base font-normal uppercase tracking-wider">
                                                        {speaker.name}
                                                    </span>
                                                </div>
                                                
                                                {/* Bílá bublina s černým textem - vysune se zespodu při hover pod černý badge */}
                                                {speaker.role && (
                                                    <div className="role-bubble bg-white px-[17px] py-[8.4px] rounded-lg w-fit max-w-full opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-300">
                                                        <span className="text-[#1F1919] text-sm lg:text-base font-normal text-left block">
                                                            {speaker.role}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}

