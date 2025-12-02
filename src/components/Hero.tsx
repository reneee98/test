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
        <div ref={containerRef} className="relative w-full min-h-screen px-[1.5rem] pt-32 pb-[1.5rem] flex flex-col lg:flex-row gap-[1.5rem] bg-white">

            {/* Left Section - Yellow */}
            <div className="w-full lg:w-1/2 bg-[#D7DF21] rounded-[40px] p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden min-h-[80vh]">
                {/* Decorative Curve (Bottom Right) */}
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-transparent rounded-br-[40px] shadow-[10px_10px_0_10px_#F0F0F0] z-0"></div>

                <div className="max-w-none mx-auto relative z-20 text-center">
                    <AnimatedText 
                        as="h1" 
                        className="text-7xl lg:text-8xl font-bold leading-[1.1] mb-8 text-[#1F1919]"
                        stagger={0.015}
                        duration={0.6}
                        start="top 95%"
                    >
                        The world's leading civil nuclear exhibition
                    </AnimatedText>

                    <p className="text-base lg:text-lg mb-12 hero-text text-[#1F1919] leading-relaxed">
                        WNE connects you with the most comprehensive network of worldwide top-tier suppliers and service providers across the entire nuclear sector, from energy to other application markets like medicine, agriculture & space.
                    </p>

                    <div className="flex justify-center mb-12 hero-text">
                        <button ref={buttonRef} className="flex items-center gap-0 group">
                            <span className="px-6 py-3 rounded-full bg-[#1F1919] text-[#F0F0F0] font-medium text-base group-hover:bg-[#368391] transition-colors whitespace-nowrap">
                                Register
                            </span>
                            <span className="w-[3rem] h-[3rem] rounded-full bg-[#1F1919] group-hover:bg-[#368391] flex items-center justify-center transition-colors flex-shrink-0">
                                <svg width="17" height="17" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#F0F0F0]">
                                    <path d="M4 10L10 4M10 4H4M10 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-4 hero-text">
                        <div className="flex -space-x-4">
                            {[
                                '/images/portretovky/middle-aged-man-wearing-jacket-laughing-happy.jpg',
                                '/images/portretovky/woman-wearing-blue-shirt-with-gold-necklace-it.jpg',
                                '/images/portretovky/portrait-beautiful-albino-woman.jpg'
                            ].map((src, i) => (
                                <div key={i} ref={(el) => { if (el) imagesRef.current[i] = el; }} className="w-12 h-12 rounded-full border-2 border-[#F0F0F0] overflow-hidden bg-[#56C4C6] relative">
                                    <Image
                                        src={src}
                                        alt={`Member ${i + 1}`}
                                        fill
                                        sizes="48px"
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm font-medium max-w-[200px] leading-tight text-[#1F1919] text-left">
                            Join thousands of industry professionals
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Section - Video */}
            <div ref={videoRef} className="w-full lg:w-1/2 relative rounded-[40px] overflow-hidden min-h-[80vh]">
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
                        className="w-full h-auto object-contain p-10"
                    />
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-[#1F1919]/10"></div>

                {/* SVG Mask Bubble - Top Left */}
                <div className="absolute top-8 left-8 z-20 group">
                    <svg width="250" height="188" viewBox="0 0 151 103" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[250px] h-[188px]">
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
                        
                        {/* Title - Bottom Right inside SVG with padding */}
                        <text x="83" y="82" fill="#1F1919" fontSize="9" fontWeight="500" fontFamily="Nohemi, sans-serif">
                            <tspan x="83" dy="0">We & Our</tspan>
                            <tspan x="83" dy="11">Volunteers</tspan>
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
                <div className="absolute bottom-8 right-8 flex items-center gap-4 text-[#F0F0F0]">
                    <div className="flex gap-2">
                        <div className="w-10 h-10 rounded-full border border-[#F0F0F0]/30 flex items-center justify-center backdrop-blur-sm">📷</div>
                        <div className="w-10 h-10 rounded-full border border-[#F0F0F0]/30 flex items-center justify-center backdrop-blur-sm">f</div>
                    </div>
                    <span className="text-sm font-medium">Find us on social networks</span>
                </div>

                {/* Top Right Icon */}
                <div className="absolute top-8 right-8 w-12 h-12 rounded-full border border-[#F0F0F0]/30 flex items-center justify-center text-[#F0F0F0] backdrop-blur-sm">
                    ♨
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
