'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import AnimatedText from './AnimatedText';

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);

    const videoRef = useRef<HTMLDivElement>(null);
    const logoMaskRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<HTMLDivElement[]>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useGSAP(() => {
        // Initial animations can go here
        gsap.from('.hero-text', {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            delay: 0.2
        });

        // Animace video sekce
        if (videoRef.current) {
            gsap.fromTo(videoRef.current,
                { scale: 0.95, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power3.out',
                    delay: 0.3,
                }
            );
        }

        // Animace logo mask
        if (logoMaskRef.current) {
            gsap.fromTo(logoMaskRef.current,
                { scale: 0.8, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 1,
                    ease: 'power2.out',
                    delay: 0.5,
                }
            );
        }

        // Animace obrázků
        imagesRef.current.forEach((img, index) => {
            if (!img) return;
            gsap.fromTo(img,
                { scale: 0, opacity: 0, rotation: -180 },
                {
                    scale: 1,
                    opacity: 1,
                    rotation: 0,
                    duration: 0.6,
                    delay: 0.4 + index * 0.1,
                    ease: 'back.out(1.7)',
                }
            );
        });

        // Animace tlačítka
        if (buttonRef.current) {
            gsap.fromTo(buttonRef.current,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.out',
                    delay: 0.6,
                }
            );
        }
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative w-full h-screen px-2 sm:px-4 md:px-6 lg:px-6 xl:px-8 2xl:px-12 pt-16 sm:pt-20 md:pt-24 lg:pt-32 xl:pt-40 2xl:pt-48 pb-2 sm:pb-3 md:pb-4 lg:pb-6 xl:pb-8 2xl:pb-12 flex flex-row gap-1.5 sm:gap-2 md:gap-3 lg:gap-6 xl:gap-8 2xl:gap-12 bg-white overflow-hidden">

            {/* Left Section - Yellow */}
            <div className="w-1/2 bg-[#D7DF21] rounded-xl sm:rounded-2xl md:rounded-[32px] lg:rounded-[40px] xl:rounded-[48px] 2xl:rounded-[56px] p-2 sm:p-3 md:p-4 lg:p-10 xl:p-16 2xl:p-20 flex flex-col justify-center relative overflow-hidden">
                {/* Decorative Curve (Bottom Right) */}
                <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 bg-transparent rounded-br-2xl sm:rounded-br-3xl md:rounded-br-[32px] lg:rounded-br-[40px] xl:rounded-br-[48px] 2xl:rounded-br-[56px] shadow-[6px_6px_0_6px_#F0F0F0] sm:shadow-[7px_7px_0_7px_#F0F0F0] md:shadow-[8px_8px_0_8px_#F0F0F0] lg:shadow-[10px_10px_0_10px_#F0F0F0] xl:shadow-[12px_12px_0_12px_#F0F0F0] 2xl:shadow-[14px_14px_0_14px_#F0F0F0] z-0"></div>

                <div className="max-w-none mx-auto relative z-20 text-center px-0.5 sm:px-1 md:px-2 lg:px-4 xl:px-6 2xl:px-8">
                    <AnimatedText 
                        as="h1" 
                        className="text-lg sm:text-xl md:text-2xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-[1.1] sm:leading-[1.05] md:leading-none mb-1 sm:mb-2 md:mb-3 lg:mb-6 xl:mb-8 2xl:mb-10 text-[#1F1919]"
                        stagger={0.015}
                        duration={0.6}
                        start="top 95%"
                    >
                        The world's leading civil nuclear exhibition
                    </AnimatedText>

                    <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-base xl:text-lg 2xl:text-xl mb-2 sm:mb-2.5 md:mb-3 lg:mb-8 xl:mb-10 2xl:mb-12 hero-text text-[#1F1919] leading-tight sm:leading-relaxed px-0.5 sm:px-1 md:px-2 lg:px-0 max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto">
                        WNE connects you with the most comprehensive network of worldwide top-tier suppliers and service providers across the entire nuclear sector, from energy to other application markets like medicine, agriculture & space.
                    </p>

                    <div className="flex justify-center mb-2 sm:mb-2.5 md:mb-3 lg:mb-8 xl:mb-10 2xl:mb-12 hero-text">
                        <button ref={buttonRef} className="flex items-center gap-0 group">
                            <span className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 xl:px-7 xl:py-3.5 2xl:px-8 2xl:py-4 rounded-full bg-[#1F1919] text-[#F0F0F0] font-medium text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl group-hover:bg-[#368391] transition-colors whitespace-nowrap">
                                Get ready to 2027
                            </span>
                            <span className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 rounded-full bg-[#1F1919] group-hover:bg-[#368391] flex items-center justify-center transition-colors flex-shrink-0">
                                <svg width="10" height="10" className="sm:w-[12px] sm:h-[12px] md:w-[14px] md:h-[14px] lg:w-[16px] lg:h-[16px] xl:w-[18px] xl:h-[18px] 2xl:w-[20px] 2xl:h-[20px]" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#F0F0F0]">
                                    <path d="M4 10L10 4M10 4H4M10 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 hero-text flex-wrap sm:flex-nowrap">
                        <div className="flex -space-x-1.5 sm:-space-x-2 md:-space-x-3 lg:-space-x-4">
                            {[
                                '/images/portretovky/middle-aged-man-wearing-jacket-laughing-happy.jpg',
                                '/images/portretovky/woman-wearing-blue-shirt-with-gold-necklace-it.jpg',
                                '/images/portretovky/portrait-beautiful-albino-woman.jpg'
                            ].map((src, i) => (
                                <div key={i} ref={(el) => { if (el) imagesRef.current[i] = el; }} className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 rounded-full border-2 border-[#F0F0F0] overflow-hidden bg-[#56C4C6] relative">
                                    <Image
                                        src={src}
                                        alt={`Member ${i + 1}`}
                                        fill
                                        sizes="(max-width: 640px) 24px, (max-width: 768px) 28px, (max-width: 1024px) 32px, (max-width: 1280px) 40px, 48px"
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                        <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base font-medium max-w-[120px] sm:max-w-[140px] md:max-w-[160px] lg:max-w-[180px] xl:max-w-[200px] leading-tight text-[#1F1919] text-left">
                            Join thousands of industry professionals
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Section - Video */}
            <div ref={videoRef} className="w-1/2 relative rounded-xl sm:rounded-2xl md:rounded-[32px] lg:rounded-[40px] xl:rounded-[48px] 2xl:rounded-[56px] overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="/images/7202976_Eiffel_Tower_Paris_1920x1080_2.mp4" type="video/mp4" />
                </video>

                {/* Logo Mask Overlay */}
                <div ref={logoMaskRef} className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <Image
                        src="/images/logo-mask.svg"
                        alt="Logo Mask"
                        width={800}
                        height={800}
                        className="w-full h-auto object-contain p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12"
                    />
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-[#1F1919]/10"></div>

                {/* Badge */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 lg:top-6 lg:left-6 xl:top-8 xl:left-8 2xl:top-10 2xl:left-10 bg-white/90 backdrop-blur-sm rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl xl:rounded-3xl 2xl:rounded-[32px] px-2 py-1.5 sm:px-2.5 sm:py-2 md:px-3 md:py-2.5 lg:px-5 lg:py-3 xl:px-6 xl:py-4 2xl:px-8 2xl:py-5 z-30 flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3 2xl:gap-4 shadow-lg">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <svg width="12" height="12" className="sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#4B5563"/>
                        </svg>
                    </div>
                    <div className="text-[#1F1919]">
                        <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-base xl:text-lg 2xl:text-xl font-bold mb-0 sm:mb-0.5 md:mb-0.5 lg:mb-1 xl:mb-1.5 2xl:mb-2 leading-tight">07-09 December 2027</p>
                        <p className="text-[8px] sm:text-[9px] md:text-[9px] lg:text-[10px] xl:text-xs 2xl:text-sm text-[#1F1919]/70 leading-tight">Parc des Expositions - Hall 6 - Villepinte</p>
                    </div>
                </div>

                {/* SVG Mask Bubble - Top Right */}
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 lg:top-6 lg:right-6 xl:top-8 xl:right-8 2xl:top-10 2xl:right-10 z-20 group">
                    <svg width="250" height="188" viewBox="0 0 151 103" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[80px] h-[60px] sm:w-[100px] sm:h-[75px] md:w-[120px] md:h-[90px] lg:w-[180px] lg:h-[135px] xl:w-[220px] xl:h-[165px] 2xl:w-[250px] 2xl:h-[188px]">
                        <defs>
                            <clipPath id="imageClip">
                                <rect x="16" y="16" width="60.4" height="71" rx="8" />
                            </clipPath>
                        </defs>
                        <path d="M116 17.6259C116 27.1528 123.723 35 133.25 35C142.777 35 150.5 42.7231 150.5 52.25V83C150.5 94.0457 141.546 103 130.5 103H20C8.9543 103 0 94.0457 0 83V20C0 8.95431 8.95431 0 20 0H98.5C108.165 0 116 7.96092 116 17.6259Z" fill="white" />
                        
                        {/* Portrait Image - Left, 40% width, with 1rem padding */}
                        <image 
                            href="/images/portretovky/happy-woman-home-coronavirus-quarantine.jpg"
                            x="16" 
                            y="16" 
                            width="60.4" 
                            height="71" 
                            clipPath="url(#imageClip)"
                            preserveAspectRatio="xMidYMid slice"
                        />
                        
                        {/* Title - Bottom Right inside SVG with padding - fontSize scales automatically with SVG size */}
                        <text x="83" y="82" fill="#1F1919" fontSize="9" fontWeight="500" fontFamily="Nohemi, sans-serif">
                            <tspan x="83" dy="0">View Our</tspan>
                            <tspan x="83" dy="11">Program</tspan>
                        </text>
                        
                        <circle cx="136" cy="15" r="15" fill="#D7DF21" className="group-hover:fill-[#1F1919] transition-colors" />
                        <mask id="mask0_70_16" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="128" y="8" width="17" height="17">
                            <rect x="128" y="8" width="16.2317" height="16.2317" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_70_16)">
                            <path d="M132.328 20.1738L131.382 19.2269L137.874 12.7342H132.058V11.3816H140.174V19.4974H138.821V13.6811L132.328 20.1738Z" fill="#1F1919" className="group-hover:fill-[#F0F0F0] transition-colors" />
                        </g>
                    </svg>
                </div>

                {/* Bottom Right Socials */}
                <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4 lg:bottom-6 lg:right-6 xl:bottom-8 xl:right-8 2xl:bottom-10 2xl:right-10 flex flex-col lg:flex-row items-end lg:items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 xl:gap-4 2xl:gap-5 text-[#F0F0F0] z-20">
                    <div className="flex gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3 2xl:gap-4">
                        <a href="#" className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-9 lg:h-9 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 rounded-full border border-[#F0F0F0]/30 flex items-center justify-center backdrop-blur-sm hover:bg-[#F0F0F0]/10 transition-colors">
                            <Image src="/images/X.svg" alt="X (Twitter)" width={20} height={20} className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 brightness-0 invert" />
                        </a>
                        <a href="#" className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-9 lg:h-9 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 rounded-full border border-[#F0F0F0]/30 flex items-center justify-center backdrop-blur-sm hover:bg-[#F0F0F0]/10 transition-colors">
                            <Image src="/images/011-linkedin.svg" alt="LinkedIn" width={20} height={20} className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 brightness-0 invert" />
                        </a>
                        <a href="#" className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-9 lg:h-9 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 rounded-full border border-[#F0F0F0]/30 flex items-center justify-center backdrop-blur-sm hover:bg-[#F0F0F0]/10 transition-colors">
                            <Image src="/images/021-youtube.svg" alt="YouTube" width={20} height={20} className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 brightness-0 invert" />
                        </a>
                    </div>
                    <span className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base 2xl:text-lg font-medium hidden lg:inline">Find us on social networks</span>
                </div>

            </div>
        </div>
    );
}

function Hotspot({ top, left, label, icon, expanded }: { top: string, left: string, label: string, icon?: string, expanded?: boolean }) {
    if (expanded) {
        return (
            <div className="absolute bg-white rounded-3xl p-4 pr-12 shadow-lg" style={{ top, left }}>
                <div className="w-full h-32 bg-[#56C4C6] rounded-2xl mb-2 overflow-hidden relative">
                    <Image src="/images/portretovky/middle-aged-man-wearing-leaning-against-rusty-colored-background.jpg" alt="Volunteer" fill className="object-cover" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#D7DF21] rounded-full"></span>
                    <span className="font-bold text-sm leading-tight w-20 text-[#1F1919]">{label}</span>
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-[#D7DF21] rounded-full flex items-center justify-center text-xl">
                    {icon}
                </div>
            </div>
        )
    }

    return (
        <div
            className="absolute flex items-center gap-2 px-4 py-2 rounded-full border border-[#D7DF21]/50 bg-[#1F1919]/20 backdrop-blur-sm text-[#F0F0F0] hover:bg-[#1F1919]/40 transition-colors cursor-pointer"
            style={{ top, left }}
        >
            <span className="w-2 h-2 bg-[#D7DF21] rounded-full"></span>
            <span className="text-sm font-medium">{label}</span>
        </div>
    )
}
