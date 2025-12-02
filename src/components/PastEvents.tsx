'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function PastEvents() {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const textWrapperRef = useRef<HTMLDivElement>(null);

    // Pool of images to cycle through
    const images = [
        '/images/fotky/54946086991_afb658095a_c.jpg',
        '/images/fotky/54946096406_7aaf689003_z.jpg',
        '/images/fotky/54946096421_3aa63a7949_c.jpg',
        '/images/fotky/54946287883_62c1097949_c.jpg',
        '/images/fotky/54946403495_c6ff099621_c.jpg',
    ];

    useEffect(() => {
        if (!sectionRef.current || !textRef.current || !containerRef.current || !textWrapperRef.current) return;

        // Nastavíme počáteční barvu pozadí
        gsap.set(sectionRef.current, { backgroundColor: '#FFFFFF' });

        // Mouse Move Image Trail
        let imageIndex = 0;
        let lastX = 0;
        let lastY = 0;
        const threshold = 250; // Větší mezery mezi obrázky

        const handleMouseMove = (e: MouseEvent) => {
            // Throttling pomocí requestAnimationFrame pro lepší výkon
            requestAnimationFrame(() => {
                const { clientX, clientY } = e;
                const rect = sectionRef.current?.getBoundingClientRect();

                if (!rect) return;

                // Check if mouse is within the section
                if (
                    clientX < rect.left ||
                    clientX > rect.right ||
                    clientY < rect.top ||
                    clientY > rect.bottom
                ) return;

                const distance = Math.hypot(clientX - lastX, clientY - lastY);

                if (distance > threshold) {
                    spawnImage(clientX, clientY);
                    lastX = clientX;
                    lastY = clientY;
                }
            });
        };

        const spawnImage = (x: number, y: number) => {
            if (!containerRef.current) return;

            const imgUrl = images[imageIndex % images.length];
            imageIndex++;

            // Random starting rotation between -8 and 8 degrees (menší natočení)
            const startRotation = Math.random() * 16 - 8;
            // Random additional rotation for animation (between -5 and 5 degrees)
            const additionalRotation = Math.random() * 10 - 5;
            const endRotation = startRotation + additionalRotation;

            // Create container for the image
            const imgContainer = document.createElement('div');
            imgContainer.className = 'absolute pointer-events-none overflow-hidden rounded-lg shadow-2xl';
            imgContainer.style.left = `${x}px`;
            imgContainer.style.top = `${y}px`;
            imgContainer.style.width = '300px';
            imgContainer.style.height = '210px';
            imgContainer.style.transform = `translate(-50%, -50%) scale(0) rotate(${startRotation}deg)`;
            imgContainer.style.zIndex = '10';

            // Create image element
            const img = document.createElement('img');
            img.src = imgUrl;
            img.className = 'w-full h-full object-cover';
            imgContainer.appendChild(img);

            containerRef.current.appendChild(imgContainer);

            // Animate with rotation change
            const tl = gsap.timeline({
                onComplete: () => {
                    imgContainer.remove();
                }
            });

            tl.to(imgContainer, {
                scale: 1,
                rotation: startRotation,
                duration: 0.8,
                ease: 'back.out(1.2)',
            })
                .to(imgContainer, {
                    y: -100,
                    rotation: endRotation,
                    opacity: 0,
                    duration: 1.5,
                    ease: 'power2.in',
                }, '+=0.5');
        };

        // Wait for initialization - počkáme na načtení textu
        let scrollTriggerInstance: ScrollTrigger | null = null;
        let resizeHandler: (() => void) | null = null;

        const initScroll = () => {
            if (!textRef.current || !textWrapperRef.current) {
                return;
            }

            // Počkáme na načtení fontů pro správný výpočet šířky
            document.fonts.ready.then(() => {
                const viewportWidth = window.innerWidth;
                const textWidth = textRef.current?.offsetWidth || 0;

                // Pokud textWidth stále není dostupný, použijeme odhad
                const scrollDistance = textWidth > 0
                    ? Math.max(textWidth + viewportWidth, viewportWidth * 2)
                    : viewportWidth * 3;

                // Set initial position - text starts on the right (outside viewport)
                if (textWrapperRef.current) {
                    gsap.set(textWrapperRef.current, { x: viewportWidth });
                }

                // Pin section and scroll text
                scrollTriggerInstance = ScrollTrigger.create({
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: () => {
                        // Dynamicky přepočítáme při každém refresh
                        const currentTextWidth = textRef.current?.offsetWidth || 0;
                        if (currentTextWidth === 0) {
                            return `+=${viewportWidth * 3}`;
                        }
                        return `+=${Math.max(currentTextWidth + viewportWidth, viewportWidth * 2)}`;
                    },
                    scrub: 1,
                    pin: true,
                    pinSpacing: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        // Scroll text from right to left based on scroll progress
                        if (textWrapperRef.current && textRef.current) {
                            const progress = self.progress;
                            const currentTextWidth = textRef.current.offsetWidth || viewportWidth * 3;
                            // Start at viewportWidth (right), end at -textWidth (left)
                            const translateX = viewportWidth - (viewportWidth + currentTextWidth) * progress;
                            gsap.set(textWrapperRef.current, { x: translateX });
                        }
                    },
                });
            });

            window.addEventListener('mousemove', handleMouseMove);

            // Handle resize
            resizeHandler = () => {
                ScrollTrigger.refresh();
            };
            window.addEventListener('resize', resizeHandler);

            // Refresh ScrollTrigger po vytvoření všech triggerů
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 200);
        };

        const timer = setTimeout(initScroll, 300);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', handleMouseMove);
            if (resizeHandler) {
                window.removeEventListener('resize', resizeHandler);
            }
            if (scrollTriggerInstance) {
                scrollTriggerInstance.kill();
            }
            // Kill všechny ScrollTriggery pro tuto sekci
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.vars.trigger === sectionRef.current) {
                    trigger.kill();
                }
            });
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-[100vh] min-h-[100dvh] bg-white overflow-hidden flex items-center justify-center"
            style={{ minHeight: '100dvh', maxHeight: '100dvh', marginTop: 0 }}
        >
            {/* Container for trail images */}
            <div ref={containerRef} className="absolute inset-0 z-10 pointer-events-none" />

            {/* Scrolling Text */}
            <div ref={textWrapperRef} className="relative z-0 w-full whitespace-nowrap select-none">
                <h2
                    ref={textRef}
                    className="text-[20vw] font-black font-sans text-[#1F1919] leading-none tracking-tighter opacity-10"
                    style={{ fontFamily: "'Nohemi', sans-serif" }}
                >
                    NUCLEAR PAST EVENTS MOVE YOUR CURSOR TO EXPLORE
                </h2>
            </div>

            {/* Hover instruction / Center piece */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <p className="text-[#1F1919]/50 text-sm uppercase tracking-widest animate-pulse font-sans" style={{ fontFamily: "'Nohemi', sans-serif" }}>
                    Move your cursor to explore
                </p>
            </div>
        </section>
    );
}

