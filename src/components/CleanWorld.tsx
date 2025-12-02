'use client';

import Image from 'next/image';
import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const welcomeText = "Welcome to Event, the original social entertainment venue! Get ready to get playful, and create memories around the table.";

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

            // Animate images when section enters viewport
            imagesRef.current.forEach((img, i) => {
                if (img) {
                    gsap.to(img, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        delay: i * 0.15,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top 80%",
                            end: "top 50%",
                            toggleActions: "play none none reverse",
                        }
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

            // 1. Expand Video to Fullscreen
            tl.to(videoRef.current, {
                scale: 3.5, // Zväčšíme dostatočne aby pokrylo celú obrazovku
                borderWidth: 0,
                padding: 0,
                borderRadius: 0,
                duration: 1,
                ease: "power2.inOut"
            }, 0);

            tl.to(videoInnerRef.current, {
                borderRadius: 0,
                duration: 1,
                ease: "power2.inOut"
            }, 0);

            // Hide images as video expands
            imagesRef.current.forEach((img, i) => {
                if (img) {
                    tl.to(img, {
                        opacity: 0,
                        duration: 0.5,
                        ease: "power1.out"
                    }, 0);
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
            <div className="relative w-full py-16 lg:py-24 px-6 lg:px-12">
                {/* Main Content Area */}
                <div className="relative z-10 max-w-7xl mx-auto">
                    {/* Central Video Player */}
                    <div ref={videoRef} className="relative w-full max-w-4xl mx-auto aspect-video rounded-3xl overflow-hidden border border-[#1F1919] p-[5px] origin-center z-20">
                        <div ref={videoInnerRef} className="relative w-full h-full bg-[#1F1919] rounded-2xl overflow-hidden">
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
                                <div className="max-w-md mx-auto text-center px-6">
                                    <h1 className="text-base lg:text-lg font-bold text-white leading-[1.0]">
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

                    {/* Images */}
                    <div ref={(el) => { if (el) imagesRef.current[0] = el; }} className="absolute top-[-2rem] right-[-8rem] lg:top-[-12rem] lg:right-[-10rem] w-40 h-40 lg:w-56 lg:h-56 rounded-2xl overflow-hidden z-10 bg-gray-200">
                        <Image
                            src="/images/portretovky/portrait-png.png"
                            alt="People"
                            fill
                            sizes="(max-width: 1024px) 160px, 224px"
                            className="object-cover"
                        />
                    </div>

                    <div ref={(el) => { if (el) imagesRef.current[1] = el; }} className="absolute left-[-8rem] lg:left-[-8rem] top-[10rem] lg:top-[-5rem] w-48 h-48 lg:w-54 lg:h-54 rounded-2xl overflow-hidden z-10 bg-gray-200">
                        <Image
                            src="/images/portretovky/portrait2.png"
                            alt="People with headwraps"
                            fill
                            sizes="(max-width: 1024px) 192px, 216px"
                            className="object-cover"
                        />
                    </div>

                    <div ref={(el) => { if (el) imagesRef.current[2] = el; }} className="absolute left-[-2rem] lg:left-[-4rem] bottom-[2rem] lg:bottom-[2em] w-24 h-24 lg:w-40 lg:h-40 rounded-2xl overflow-hidden z-10 bg-gray-200">
                        <Image
                            src="/images/portretovky/portrait3.png"
                            alt="Man on couch"
                            fill
                            sizes="(max-width: 1024px) 96px, 160px"
                            className="object-cover"
                        />
                    </div>

                    <div ref={(el) => { if (el) imagesRef.current[3] = el; }} className="absolute top-[2rem] right-[-8rem] lg:top-[15rem] lg:right-[-4rem] w-40 h-40 lg:w-32 lg:h-32 rounded-2xl overflow-hidden z-10 bg-gray-200">
                        <Image
                            src="/images/portretovky/portrait-png.png"
                            alt="Woman at table"
                            fill
                            sizes="(max-width: 1024px) 160px, 128px"
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
