'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedText from './AnimatedText';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const allLogos = [
    '/images/sponsors/Apave (300 x 165 px).png',
    '/images/sponsors/Assystem.jpg',
    '/images/sponsors/Atkins Logo.jpg',
    '/images/sponsors/boccard.jpg',
    '/images/sponsors/Bureau Veritas (1).png',
    '/images/sponsors/Celeros.jpg',
    '/images/sponsors/CNNC (1).jpg',
    '/images/sponsors/edf_logo.jpg',
    '/images/sponsors/EY..jpg',
    '/images/sponsors/Framatome.jpg',
    '/images/sponsors/Logo Flowerse (300 x 165 px) (2).jpg',
    '/images/sponsors/Logo site web resizing (2).jpg',
    '/images/sponsors/Logo site web resizing (3).jpg',
    '/images/sponsors/Logos Fortum (300 x 165 px).png',
    '/images/sponsors/Orano.jpg',
    '/images/sponsors/RR (1).jpg',
    '/images/sponsors/Urenco.png',
    '/images/sponsors/Westinghouse BLUE.jpg',
];

type LogoState = {
    current: number;
    next: number;
};

export default function LogosSection() {
    const sectionRef = useRef<HTMLElement>(null);
    // Inicializujeme s výchozími hodnotami, aby se loga zobrazila hned
    const [logoStates, setLogoStates] = useState<LogoState[]>(() => {
        return Array.from({ length: 8 }, (_, index) => ({
            current: index % allLogos.length,
            next: index % allLogos.length
        }));
    });
    const logoStatesRef = useRef<LogoState[]>([]);
    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const nextImageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const headerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const textSliderRef = useRef<HTMLDivElement>(null);

    // Aktualizujeme ref při změně logoStates
    useEffect(() => {
        logoStatesRef.current = logoStates;
    }, [logoStates]);

    // Animace text slideru - nekonečná animace zleva doprava jako na pasu
    useEffect(() => {
        if (!textSliderRef.current) return;

        const container = textSliderRef.current;
        const textElement = container.querySelector('h1');
        if (!textElement) return;

        // Počkáme na načtení fontů
        let tl: gsap.core.Timeline | null = null;

        document.fonts.ready.then(() => {
            const textWidth = textElement.offsetWidth;
            const gap = 80; // Mezera mezi texty

            // Duplikujeme text pre plynulý nekonečný prechod
            // Vyčistíme předchozí duplikáty pokud existují (pro hot reload)
            const existingDuplicates = container.querySelectorAll('[aria-hidden="true"]');
            existingDuplicates.forEach(el => el.remove());

            const texts = [textElement];
            const totalWidth = textWidth + gap;
            const screenWidth = window.innerWidth;
            
            // Vytvoríme 2 kópie pre plynulú slučku
            for (let i = 0; i < 2; i++) {
                const duplicatedText = textElement.cloneNode(true) as HTMLHeadingElement;
                duplicatedText.setAttribute('aria-hidden', 'true');
                duplicatedText.style.marginLeft = `${gap}px`;
                container.appendChild(duplicatedText);
                texts.push(duplicatedText);
            }

            // Nastavíme počáteční pozície - texty začínaú úplne vpravo (mimo viewport)
            // Prvý text začína úplne vpravo, ďalšie sú za ním
            texts.forEach((text, i) => {
                gsap.set(text, {
                    x: screenWidth + (i * totalWidth),
                    force3D: true,
                    willChange: 'transform'
                });
            });

            // Animácia - posun z prava do ľava (nekonečná slučka)
            // Použijeme jednoduchší prístup s jednou timeline a onRepeat
            // Ale resetujeme texty len keď je to potrebné a bez bliknutia
            tl = gsap.timeline({
                repeat: -1,
                ease: 'none',
                onRepeat: function() {
                    // Pri každom opakovaní resetujeme texty, ktoré zmizli vľavo
                    // Použijeme requestAnimationFrame pre plynulý prechod bez bliknutia
                    requestAnimationFrame(() => {
                        texts.forEach((text) => {
                            const currentX = gsap.getProperty(text, "x") as number;
                            // Ak text zmizol vľavo (je úplne mimo viewport - posledné písmeno zmizlo)
                            if (currentX < -textWidth) {
                                // Nájdeme najväčšiu x pozíciu (najpravejší text)
                                let maxX = -Infinity;
                                texts.forEach(t => {
                                    const tx = gsap.getProperty(t, "x") as number;
                                    if (tx > maxX && tx < screenWidth + totalWidth * 3) {
                                        maxX = tx;
                                    }
                                });
                                // Presunieme text na pravú stranu za najpravejší text
                                gsap.set(text, { 
                                    x: maxX + totalWidth,
                                    immediateRender: false
                                });
                            }
                        });
                    });
                }
            });

            // Animujeme všetky texty doľava o celú dĺžku textu
            // Text prejde celou obrazovkou z prava do ľava
            tl.to(texts, {
                x: `-=${totalWidth}`,
                duration: 15,
                ease: "none",
                force3D: true
            });
        });

        // Cleanup pre celý useEffect
        return () => {
            if (tl) tl.kill();
        };
    }, []);

    // Animace při načtení sekce
    useEffect(() => {
        if (!sectionRef.current || !headerRef.current || !gridRef.current) return;

        // Animace gridu s logy - stagger efekt
        const boxes = gridRef.current.children;
        gsap.fromTo(boxes,
            {
                y: 80,
                opacity: 0,
                scale: 0.9
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: 'power3.out',
                stagger: {
                    amount: 0.6,
                    from: 'random'
                },
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                }
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.vars.trigger === sectionRef.current ||
                    trigger.vars.trigger === headerRef.current ||
                    trigger.vars.trigger === gridRef.current) {
                    trigger.kill();
                }
            });
        };
    }, []);

    // Inicializace náhodných log pro každý box
    useEffect(() => {
        const usedIndices: number[] = [];
        const initialStates: LogoState[] = Array.from({ length: 8 }, () => {
            // Zajistíme, aby každé logo bylo jiné
            let logoIndex: number;
            do {
                logoIndex = Math.floor(Math.random() * allLogos.length);
            } while (usedIndices.includes(logoIndex) && usedIndices.length < allLogos.length);
            usedIndices.push(logoIndex);
            return { current: logoIndex, next: logoIndex };
        });
        setLogoStates(initialStates);
        logoStatesRef.current = initialStates;
    }, []);

    // Animace změny log - synchronizovaná pro všechna loga
    useEffect(() => {
        if (logoStates.length === 0) return;

        const interval = setInterval(() => {
            // Získáme aktuální stavy z refu
            const currentStates = logoStatesRef.current;
            if (currentStates.length === 0) return;

            const usedIndices = currentStates.map(state => state.current);

            // Vytvoříme nové stavy s novými logy
            const newStates = currentStates.map((state, index) => {
                // Najdeme nové logo, které se nikdy neopakuje
                const availableIndices = allLogos
                    .map((_, idx) => idx)
                    .filter(idx => idx !== state.current && !usedIndices.includes(idx));

                // Pokud nejsou dostupná loga, použijeme všechna kromě aktuálního
                const possibleIndices = availableIndices.length > 0
                    ? availableIndices
                    : allLogos.map((_, idx) => idx).filter(idx => idx !== state.current);

                const randomIndex = Math.floor(Math.random() * possibleIndices.length);
                const newIndex = possibleIndices[randomIndex];

                return {
                    ...state,
                    next: newIndex
                };
            });

            // Aktualizujeme state
            logoStatesRef.current = newStates;
            setLogoStates(newStates);

            // Počkáme na re-render a načtení obrázků
            // Použijeme requestAnimationFrame pro jistotu
            requestAnimationFrame(() => {
                newStates.forEach((state, index) => {
                    const currentImg = imageRefs.current[index];
                    const nextImg = nextImageRefs.current[index];

                    if (currentImg && nextImg) {
                        // Reset pozic před animací
                        gsap.set(nextImg, {
                            opacity: 1,
                            zIndex: 10,
                            y: '100%',
                            force3D: true
                        });
                        gsap.set(currentImg, {
                            zIndex: 0,
                            y: 0,
                            opacity: 1,
                            force3D: true
                        });

                        // Animace
                        const tl = gsap.timeline({
                            onComplete: () => {
                                // Po dokončení animace aktualizujeme current na next
                                setLogoStates(prevStates => {
                                    const updatedStates = [...prevStates];
                                    updatedStates[index] = {
                                        current: updatedStates[index].next,
                                        next: updatedStates[index].next // Dočasně stejné, změní se v dalším cyklu
                                    };
                                    logoStatesRef.current = updatedStates;
                                    return updatedStates;
                                });

                                // Reset transformací po update state (React překreslí s novým current)
                                // Ale musíme počkat na překreslení, takže to uděláme v dalším renderu implicitně
                                // nebo resetujeme styly ručně, ale React to přepíše
                            }
                        });

                        tl.to(currentImg, {
                            y: '-100%',
                            duration: 1.2,
                            ease: 'power3.inOut',
                            force3D: true
                        }, 0)
                            .to(nextImg, {
                                y: '0%',
                                duration: 1.2,
                                ease: 'power3.inOut',
                                force3D: true
                            }, 0);
                    }
                });
            });
        }, 3000);

        return () => {
            clearInterval(interval);
        };
    }, [logoStates.length]); // Pouze délka jako dependency

    return (
        <section ref={sectionRef} className="relative w-full bg-white pt-12 lg:pt-16 xl:pt-24 2xl:pt-32 pb-0">
            <div className="w-full">
                {/* Header - Text slider */}
                <div ref={headerRef} className="mb-8 lg:mb-12 xl:mb-16 2xl:mb-20 overflow-hidden w-full">
                    <div ref={textSliderRef} className="relative whitespace-nowrap flex items-center w-full">
                        <AnimatedText 
                            as="h1" 
                            className="text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-[#1F1919] leading-[1.0] inline-block whitespace-nowrap"
                            stagger={0.02}
                            start="top 90%"
                        >
                            Meet with 1000+ key players in the global nuclear industry
                        </AnimatedText>
                    </div>
                </div>

                {/* Grid 2x4 - 8 boxů s logy */}
                <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-0 px-4 lg:px-6 xl:px-12 2xl:px-16 pb-8 lg:pb-12 xl:pb-16 2xl:pb-20">
                    {Array.from({ length: 8 }).map((_, index) => {
                        // Fallback na index pokud logoStates ještě není inicializováno
                        const fallbackIndex = index % allLogos.length;
                        const logoState = logoStates[index];
                        const currentLogoIndex = logoState?.current ?? fallbackIndex;
                        const nextLogoIndex = logoState?.next ?? fallbackIndex;
                        const currentLogo = allLogos[currentLogoIndex] || allLogos[fallbackIndex];
                        const nextLogo = allLogos[nextLogoIndex] || allLogos[fallbackIndex];
                        const currentLogoName = currentLogo?.split('/').pop()?.replace(/\.[^/.]+$/, '').replace(/\s*\([^)]*\)/g, '') || `Sponsor ${index + 1}`;
                        const nextLogoName = nextLogo?.split('/').pop()?.replace(/\.[^/.]+$/, '').replace(/\s*\([^)]*\)/g, '') || `Sponsor ${index + 1}`;

                        return (
                            <div
                                key={index}
                                className={`relative w-full aspect-square bg-white outline outline-1 outline-gray-200 outline-offset-0 rounded-none group cursor-pointer overflow-hidden ${index === 0 ? 'rounded-tl-[16px]' : ''
                                    } ${index === 3 ? 'rounded-tr-[16px]' : ''
                                    } ${index === 4 ? 'rounded-bl-[16px]' : ''
                                    } ${index === 7 ? 'rounded-br-[16px]' : ''
                                    }`}
                            >
                                <div className="relative w-full h-full">
                                    {/* Aktuální logo */}
                                    <div
                                        ref={(el) => { imageRefs.current[index] = el; }}
                                        className="logo-wall__logo absolute inset-0"
                                        data-logo-wall-target-parent
                                        style={{
                                            opacity: 1,
                                            zIndex: 10,
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            width: '100%',
                                            height: '100%',
                                            backfaceVisibility: 'hidden',
                                            WebkitBackfaceVisibility: 'hidden',
                                            transform: 'translateZ(0)'
                                        }}
                                    >
                                        <Image
                                            src={currentLogo}
                                            alt={currentLogoName}
                                            fill
                                            className="object-contain p-10 grayscale transition-all duration-300 group-hover:grayscale-0"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            priority={index < 4}
                                            loading={index < 4 ? "eager" : "lazy"}
                                        />
                                    </div>

                                    {/* Následující logo (pro animaci) */}
                                    <div
                                        ref={(el) => { nextImageRefs.current[index] = el; }}
                                        className="logo-wall__logo absolute inset-0"
                                        data-logo-wall-target-parent
                                        style={{
                                            opacity: 1,
                                            zIndex: 0,
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            width: '100%',
                                            height: '100%',
                                            transform: 'translateY(100%) translateZ(0)',
                                            backfaceVisibility: 'hidden',
                                            WebkitBackfaceVisibility: 'hidden'
                                        }}
                                    >
                                        <Image
                                            src={nextLogo}
                                            alt={nextLogoName}
                                            fill
                                            className="object-contain p-10 grayscale transition-all duration-300 group-hover:grayscale-0"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
