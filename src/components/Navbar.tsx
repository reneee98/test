'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isDarkBackground, setIsDarkBackground] = useState(false);
    const lastScrollYRef = useRef(0);
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const scrollDifference = currentScrollY - lastScrollYRef.current;

            // Ak sme na vrchu stránky, vždy zobraz navbar
            if (currentScrollY < 100) {
                setIsVisible(true);
            }
            // Scrollujeme dole - skry navbar
            else if (scrollDifference > 5) {
                setIsVisible(false);
            }
            // Scrollujeme hore - zobraz navbar
            else if (scrollDifference < -5) {
                setIsVisible(true);
            }

            lastScrollYRef.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Detekcia farby pozadia pod navbarom
    useEffect(() => {
        const checkBackground = () => {
            if (!navRef.current) return;

            const navRect = navRef.current.getBoundingClientRect();
            const navCenter = navRect.top + navRect.height / 2;

            // Nájdeme element pod stredom navbaru
            const elementsAtPoint = document.elementsFromPoint(window.innerWidth / 2, navCenter);

            // Hľadáme tmavé pozadie
            let foundDark = false;
            for (const el of elementsAtPoint) {
                if (el === navRef.current || navRef.current.contains(el)) continue;

                const bgColor = window.getComputedStyle(el).backgroundColor;
                const bgClass = el.className;

                // Kontrola tmavých tried alebo farieb
                if (
                    bgClass.includes('bg-[#121212]') ||
                    bgClass.includes('bg-[#1D1D1D]') ||
                    bgClass.includes('bg-[#1F1919]') ||
                    bgClass.includes('bg-black') ||
                    bgClass.includes('bg-gray-900') ||
                    bgClass.includes('bg-neutral-900') ||
                    bgColor === 'rgb(18, 18, 18)' ||
                    bgColor === 'rgb(29, 29, 29)' ||
                    bgColor === 'rgb(31, 25, 25)' ||
                    bgColor === 'rgb(0, 0, 0)' ||
                    bgColor.startsWith('rgba(31, 25, 25') ||
                    bgColor.startsWith('rgba(0, 0, 0')
                ) {
                    foundDark = true;
                    break;
                }

                // Ak má element nepriehľadné pozadie, prestaneme hľadať
                if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                    break;
                }
            }

            setIsDarkBackground(foundDark);
        };

        // Kontrola pri scrolle
        window.addEventListener('scroll', checkBackground, { passive: true });
        
        // Počiatočná kontrola
        checkBackground();

        // Kontrola pri resize
        window.addEventListener('resize', checkBackground, { passive: true });

        return () => {
            window.removeEventListener('scroll', checkBackground);
            window.removeEventListener('resize', checkBackground);
        };
    }, []);

    const textColorClass = isDarkBackground ? 'text-white' : 'text-[#1F1919]';
    const hamburgerBgClass = isDarkBackground ? 'bg-white' : 'bg-[#1F1919]';

    return (
        <nav 
            ref={navRef}
            className={`fixed top-0 left-0 w-full z-50 px-4 lg:px-6 xl:px-8 2xl:px-12 py-6 lg:py-8 xl:py-10 2xl:py-12 flex items-center justify-between min-h-[100px] lg:min-h-[120px] xl:min-h-[140px] 2xl:min-h-[160px] transition-all duration-300 ease-in-out ${
                isVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            {/* Left Links */}
            <div className="hidden md:flex items-center gap-2">
                <NavLink href="/about" textColor={textColorClass}>About</NavLink>
                <NavLink href="/exhibit" textColor={textColorClass}>Exhibit</NavLink>
                <NavLink href="/program" textColor={textColorClass}>Program</NavLink>
            </div>

            {/* Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/images/LogoWNE25Dates_dea1f1b6-70a0-4c01-a7ea-3738839c479d-1-1024x985 1.png"
                        alt="Logo"
                        width={360}
                        height={360}
                        className="h-16 lg:h-20 xl:h-24 2xl:h-28 w-auto object-contain"
                        priority
                    />
                </Link>
            </div>

            {/* Right Links */}
            <div className="hidden md:flex items-center gap-2">
                <NavLink href="/visit" textColor={textColorClass}>Visit</NavLink>
                <NavLink href="/network" textColor={textColorClass}>Network</NavLink>
                <NavLink href="/insights" textColor={textColorClass}>Insights</NavLink>
            </div>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                tabIndex={0}
            >
                <div className={`w-6 h-0.5 ${hamburgerBgClass} mb-1 transition-colors duration-300`}></div>
                <div className={`w-6 h-0.5 ${hamburgerBgClass} mb-1 transition-colors duration-300`}></div>
                <div className={`w-6 h-0.5 ${hamburgerBgClass} transition-colors duration-300`}></div>
            </button>
        </nav>
    );
}

type NavLinkProps = {
    href: string;
    children: React.ReactNode;
    active?: boolean;
    textColor: string;
};

const NavLink = ({ href, children, active, textColor }: NavLinkProps) => {
    return (
        <Link
            href={href}
            className={`px-4 lg:px-5 xl:px-6 2xl:px-7 py-2 lg:py-2.5 xl:py-3 rounded-full text-sm lg:text-base xl:text-lg 2xl:text-xl font-medium transition-colors duration-300 ${textColor} ${
                active ? 'bg-white/80 backdrop-blur-sm' : 'hover:bg-white/20'
                }`}
        >
            {active && <span className="inline-block w-1.5 h-1.5 lg:w-2 lg:h-2 bg-current rounded-full mr-2 mb-0.5"></span>}
            {children}
        </Link>
    );
};
