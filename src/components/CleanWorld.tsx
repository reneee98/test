'use client';

import Image from 'next/image';
import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const welcomeText = "Discover innovative solutions that highlight the industry's ability to address global challenges while engaging with leaders who are driving decarbonization, innovation, and economic growth, boldly shaping the sustainable future of nuclear energy.";

export default function CleanWorld() {
    const sectionRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLDivElement>(null);
    const videoInnerRef = useRef<HTMLDivElement>(null);
    const videoElementRef = useRef<HTMLVideoElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const charsRef = useRef<HTMLSpanElement[]>([]);
    const overlayRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<HTMLDivElement[]>([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (!sectionRef.current || !videoRef.current) return;

            // Initial states
            const chars = charsRef.current.filter(Boolean);
            if (chars.length > 0) {
                gsap.set(chars, { xPercent: 105 });
            }
            if (textRef.current) {
                gsap.set(textRef.current, { opacity: 0 });
            }

            // Set initial states for images
            imagesRef.current.forEach((img) => {
                if (img) {
                    gsap.set(img, { 
                        opacity: 0, 
                        y: 30,
                        scale: 0.9
                    });
                }
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=2500", // Dĺžka scrollovania
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        // Play video when user starts scrolling into the section
                        if (self.progress > 0 && videoElementRef.current && videoElementRef.current.paused) {
                            videoElementRef.current.play().catch(() => { });
                        }
                    }
                }
            });

            // Show images when section enters viewport (at the start of scroll)
            imagesRef.current.forEach((img, i) => {
                if (img) {
                    tl.to(img, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.4,
                        delay: i * 0.1,
                        ease: "power2.out"
                    }, 0);
                }
            });

            // 1. Expand Video to Fullscreen (starts after images are visible)
            tl.to(videoRef.current, {
                scale: 3.5, // Zväčšíme dostatočne aby pokrylo celú obrazovku
                borderWidth: 0,
                padding: 0,
                borderRadius: 0,
                duration: 1,
                ease: "power2.inOut"
            }, 0.5);

            tl.to(videoInnerRef.current, {
                borderRadius: 0,
                duration: 1,
                ease: "power2.inOut"
            }, 0.5);

            // Hide images as video starts expanding (same time as video expansion)
            imagesRef.current.forEach((img, i) => {
                if (img) {
                    tl.to(img, {
                        opacity: 0,
                        scale: 0.8,
                        y: -20,
                        duration: 0.5,
                        ease: "power1.out"
                    }, 0.5);
                }
            });

            // 2. Darken Overlay
            if (overlayRef.current) {
                tl.to(overlayRef.current, {
                    opacity: 0.8,
                    duration: 0.5,
                    ease: "power1.inOut"
                }, 0.8); // Start slightly before video finish
            }

            // 3. Animate Text
            if (textRef.current) {
                tl.to(textRef.current, {
                    opacity: 1,
                    duration: 0.1
                }, 1);

                if (chars.length > 0) {
                    tl.to(chars, {
                        xPercent: 0,
                        stagger: 0.02,
                        duration: 1,
                        ease: "expo.out"
                    }, 1.1);
                }
            }

            // Add a small pause at the end to read text
            tl.to({}, { duration: 0.5 });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Rozdelenie textu na slová a znaky
    const words = welcomeText.split(' ');
    let charIndex = 0;

    return (
        <section ref={sectionRef} className="relative w-full h-screen bg-white overflow-hidden flex items-center">
            <div className="relative w-full py-12 lg:py-16 xl:py-24 2xl:py-32 px-4 lg:px-6 xl:px-12 2xl:px-16">
                {/* Main Content Area */}
                <div className="relative z-10 max-w-7xl mx-auto">
                    {/* Central Video Player */}
                    <div ref={videoRef} className="relative w-full max-w-2xl sm:max-w-3xl md:max-w-3xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto aspect-video rounded-2xl lg:rounded-3xl xl:rounded-[32px] 2xl:rounded-[40px] overflow-hidden border border-[#1F1919] p-[5px] lg:p-[6px] xl:p-[8px] 2xl:p-[10px] origin-center z-20">
                        <div ref={videoInnerRef} className="relative w-full h-full bg-[#1F1919] rounded-xl lg:rounded-2xl xl:rounded-[28px] 2xl:rounded-[36px] overflow-hidden">
                            <video
                                ref={videoElementRef}
                                className="absolute inset-0 w-full h-full object-cover"
                                src="/images/7202976_Eiffel_Tower_Paris_1920x1080_2.mp4"
                                muted
                                loop
                                playsInline
                            />

                            {/* Černý overlay - vnútri video container */}
                            <div
                                ref={overlayRef}
                                className="absolute inset-0 bg-[#1F1919] z-40 pointer-events-none"
                                style={{ opacity: 0 }}
                            />

                            {/* Text - vnútri video container */}
                            <div ref={textRef} className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none" style={{ opacity: 0 }}>
                                <div className="max-w-xs lg:max-w-sm xl:max-w-xs 2xl:max-w-sm mx-auto text-center px-4 lg:px-6 xl:px-6 2xl:px-8">
                                    <h1 className="text-xs lg:text-sm xl:text-base 2xl:text-lg font-bold text-white leading-[1.0]">
                                        {words.map((word, wordIndex) => (
                                            <span key={wordIndex} className="word inline-block whitespace-nowrap">
                                                {word.split('').map((char, i) => {
                                                    const currentIndex = charIndex++;
                                                    return (
                                                        <span
                                                            key={`${wordIndex}-${i}`}
                                                            className="char-wrap inline-block relative overflow-hidden"
                                                        >
                                                            <span
                                                                ref={(el) => {
                                                                    if (el) charsRef.current[currentIndex] = el;
                                                                }}
                                                                className="char inline-block"
                                                            >
                                                                {char}
                                                            </span>
                                                        </span>
                                                    );
                                                })}
                                                {wordIndex < words.length - 1 && (
                                                    <span className="inline-block">&nbsp;</span>
                                                )}
                                            </span>
                                        ))}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Images - Outside max-w-7xl container to be relative to full viewport */}
                {/* Top Right */}
                <div ref={(el) => { if (el) imagesRef.current[0] = el; }} className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 lg:top-12 lg:right-12 xl:top-16 xl:right-16 2xl:top-20 2xl:right-20 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-40 xl:h-40 2xl:w-48 2xl:h-48 rounded-xl lg:rounded-2xl xl:rounded-3xl 2xl:rounded-[32px] overflow-hidden z-10 bg-gray-200">
                    <Image
                        src="/images/portretovky/portrait-png.png"
                        alt="People"
                        fill
                        sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, (max-width: 1280px) 128px, 160px"
                        className="object-cover"
                    />
                </div>

                {/* Left Middle */}
                <div ref={(el) => { if (el) imagesRef.current[1] = el; }} className="absolute left-4 sm:left-6 md:left-8 lg:left-12 xl:left-16 2xl:left-20 top-[30%] lg:top-[28%] xl:top-[25%] 2xl:top-[22%] -translate-y-1/2 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-44 xl:h-44 2xl:w-52 2xl:h-52 rounded-xl lg:rounded-2xl xl:rounded-3xl 2xl:rounded-[32px] overflow-hidden z-10 bg-gray-200">
                    <Image
                        src="/images/portretovky/portrait2.png"
                        alt="People with headwraps"
                        fill
                        sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, (max-width: 1024px) 128px, (max-width: 1280px) 144px, 176px"
                        className="object-cover"
                    />
                </div>

                {/* Bottom Left */}
                <div ref={(el) => { if (el) imagesRef.current[2] = el; }} className="absolute left-4 sm:left-6 md:left-8 lg:left-12 xl:left-16 2xl:left-20 bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-12 xl:bottom-16 2xl:bottom-20 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 2xl:w-44 2xl:h-44 rounded-xl lg:rounded-2xl xl:rounded-3xl 2xl:rounded-[32px] overflow-hidden z-10 bg-gray-200">
                    <Image
                        src="/images/portretovky/portrait3.png"
                        alt="Man on couch"
                        fill
                        sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, (max-width: 1280px) 128px, 144px"
                        className="object-cover"
                    />
                </div>

                {/* Right Middle */}
                <div ref={(el) => { if (el) imagesRef.current[3] = el; }} className="absolute right-4 sm:right-6 md:right-8 lg:right-12 xl:right-16 2xl:right-20 top-[60%] lg:top-[62%] xl:top-[65%] 2xl:top-[68%] -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 2xl:w-44 2xl:h-44 rounded-xl lg:rounded-2xl xl:rounded-3xl 2xl:rounded-[32px] overflow-hidden z-10 bg-gray-200">
                    <Image
                        src="/images/portretovky/portrait-png.png"
                        alt="Woman at table"
                        fill
                        sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, (max-width: 1280px) 128px, 144px"
                        className="object-cover"
                    />
                </div>
            </div>
        </section>
    );
}
