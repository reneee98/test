'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isDarkBackground, setIsDarkBackground] = useState(false);
    const [isCompact, setIsCompact] = useState(false);
    const [navbarBg, setNavbarBg] = useState('transparent');
    const lastScrollYRef = useRef(0);
    const navRef = useRef<HTMLElement>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const scrollDifference = currentScrollY - lastScrollYRef.current;

            // Ak sme na vrchu stránky, vždy zobraz navbar
            if (currentScrollY < 100) {
                setIsVisible(true);
                setIsCompact(false);
            }
            // Scrollujeme dole - skry navbar
            else if (scrollDifference > 5) {
                setIsVisible(false);
            }
            // Scrollujeme hore - zobraz kompaktný navbar
            else if (scrollDifference < -5) {
                setIsVisible(true);
                setIsCompact(true);
            }

            lastScrollYRef.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Real-time detekcia pozadia a dynamická zmena pozadia lišty
    useEffect(() => {
        const detectBackground = () => {
            if (!navRef.current) return;

            const navRect = navRef.current.getBoundingClientRect();
            const checkPoints = [
                { x: window.innerWidth / 4, y: navRect.bottom + 5 },
                { x: window.innerWidth / 2, y: navRect.bottom + 5 },
                { x: (window.innerWidth * 3) / 4, y: navRect.bottom + 5 },
            ];

            let totalR = 0, totalG = 0, totalB = 0, validPoints = 0;
            let foundDark = false;

            checkPoints.forEach(point => {
                const element = document.elementFromPoint(point.x, point.y);
                if (!element || navRef.current?.contains(element)) return;

                let currentEl: Element | null = element;
                let bgColor: string | null = null;

                // Prechádzame cez elementy a ich rodičov, kým nenájdeme pozadie
                while (currentEl && !bgColor) {
                    const style = window.getComputedStyle(currentEl);
                    bgColor = style.backgroundColor;
                    const bgClass = currentEl.className;

                    // Kontrola tmavých tried
                    if (
                        bgClass.includes('bg-[#121212]') ||
                        bgClass.includes('bg-[#1D1D1D]') ||
                        bgClass.includes('bg-[#1F1919]') ||
                        bgClass.includes('bg-[#0a0a0a]') ||
                        bgClass.includes('bg-black') ||
                        bgClass.includes('bg-gray-900') ||
                        bgClass.includes('bg-neutral-900')
                    ) {
                        foundDark = true;
                    }

                    // Parsovanie RGB farby
                    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                        const rgbMatch = bgColor.match(/\d+/g);
                        if (rgbMatch && rgbMatch.length >= 3) {
                            const r = parseInt(rgbMatch[0]);
                            const g = parseInt(rgbMatch[1]);
                            const b = parseInt(rgbMatch[2]);
                            const a = rgbMatch[3] ? parseFloat(rgbMatch[3]) : 1;

                            // Ak je alpha < 0.5, pokračujeme hľadaním
                            if (a < 0.5) {
                                currentEl = currentEl.parentElement;
                                continue;
                            }

                            totalR += r;
                            totalG += g;
                            totalB += b;
                            validPoints++;

                            // Kontrola tmavého pozadia
                            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                            if (brightness < 50) {
                                foundDark = true;
                            }
                        }
                        break;
                    }

                    currentEl = currentEl.parentElement;
                }
            });

            setIsDarkBackground(foundDark);

            // Vypočítame priemernú farbu pozadia
            if (validPoints > 0) {
                const avgR = Math.round(totalR / validPoints);
                const avgG = Math.round(totalG / validPoints);
                const avgB = Math.round(totalB / validPoints);
                const brightness = (avgR * 299 + avgG * 587 + avgB * 114) / 1000;

                // Ak je pozadie tmavé, lišta bude tmavá, ak svetlé, lišta bude svetlá
                if (isCompact) {
                    if (brightness < 50) {
                        // Tmavé pozadie - tmavá lišta
                        setNavbarBg(`rgba(${0}, ${0}, ${0}, 0.8)`);
                    } else if (brightness > 200) {
                        // Veľmi svetlé pozadie - svetlá lišta
                        setNavbarBg(`rgba(${255}, ${255}, ${255}, 0.9)`);
                    } else {
                        // Stredné pozadie - stredná lišta
                        setNavbarBg(`rgba(${avgR}, ${avgG}, ${avgB}, 0.8)`);
                    }
                } else {
                    setNavbarBg('transparent');
                }
            }
        };

        // Detekcia pri scrolle a resize
        const throttledDetect = () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            animationFrameRef.current = requestAnimationFrame(detectBackground);
        };

        window.addEventListener('scroll', throttledDetect, { passive: true });
        window.addEventListener('resize', throttledDetect, { passive: true });
        
        // Počiatočná detekcia
        detectBackground();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            window.removeEventListener('scroll', detectBackground);
            window.removeEventListener('resize', detectBackground);
        };
    }, [isCompact]);

    // Na vrchu stránky (rozbalené menu) vždy čierne linky; pri scrolle (kompaktná lišta) podľa pozadia
    const getTextColor = () => {
        if (!isCompact) {
            return 'text-[#1F1919]';
        }
        const bgMatch = navbarBg.match(/\d+/g);
        if (bgMatch && bgMatch.length >= 3) {
            const r = parseInt(bgMatch[0]);
            const g = parseInt(bgMatch[1]);
            const b = parseInt(bgMatch[2]);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness < 128 ? 'text-white' : 'text-[#1F1919]';
        }
        return 'text-white';
    };

    const textColorClass = getTextColor();
    const hamburgerBgClass = isCompact
        ? (textColorClass === 'text-white' ? 'bg-white' : 'bg-[#1F1919]')
        : 'bg-[#1F1919]';

    return (
        <nav 
            ref={navRef}
            className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between transition-all duration-300 ease-in-out ${
                isVisible ? 'translate-y-0' : '-translate-y-full'
            } ${
                isCompact
                    ? 'px-6 lg:px-12 py-3 lg:py-3.5 backdrop-blur-xl border-b border-white/10 shadow-2xl'
                    : 'px-4 lg:px-5 xl:px-6 2xl:px-8 py-4 lg:py-5 xl:py-6 2xl:py-8 min-h-[72px] lg:min-h-[80px] xl:min-h-[96px] 2xl:min-h-[120px]'
            }`}
            style={isCompact ? { backgroundColor: navbarBg } : {}}
        >
            {/* Left Links */}
            <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
                <AboutDropdown textColorClass={textColorClass} isCompact={isCompact} />
                <ExhibitionDropdown textColorClass={textColorClass} isCompact={isCompact} />
                <ProgramDropdown textColorClass={textColorClass} isCompact={isCompact} />
            </div>

            {/* Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/images/LogoWNE25Dates_dea1f1b6-70a0-4c01-a7ea-3738839c479d-1-1024x985 1.png"
                        alt="Logo"
                        width={360}
                        height={360}
                        className={`w-auto object-contain transition-all duration-300 ${
                            isCompact 
                                ? 'h-8 lg:h-10' 
                                : 'h-12 lg:h-14 xl:h-16 2xl:h-24'
                        }`}
                        priority
                    />
                </Link>
            </div>

            {/* Right Links */}
            <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
                <NavLink href="/visit" textColor={textColorClass} isCompact={isCompact}>Visit</NavLink>
                <NavLink href="/network" textColor={textColorClass} isCompact={isCompact}>Network</NavLink>
                <NavLink href="/insights" textColor={textColorClass} isCompact={isCompact}>Insights</NavLink>
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

const ABOUT_SUBPAGES: { label: string; href: string }[] = [
    { label: 'WNE', href: '/about' },
    { label: 'Team', href: '/about/team' },
    { label: 'Editions', href: '/about/editions' },
    { label: 'Sustainability', href: '/about/sustainability' },
];

const EXHIBITION_SUBPAGES: { label: string; href: string }[] = [
    { label: 'Themes', href: '/exhibit/themes' },
    { label: 'Sponsors', href: '/exhibit/sponsors' },
    { label: 'Exhibitors', href: '/exhibit/exhibitors' },
    { label: 'Pavilions', href: '/exhibit/pavilions' },
];

const PROGRAM_SUBPAGES: { label: string; href: string }[] = [
    { label: 'Official Program', href: '/program' },
    { label: 'Speakers', href: '/program/speakers' },
    { label: 'Awards', href: '/program/awards' },
    { label: 'Startups', href: '/program/startups' },
];

type AboutDropdownProps = {
    textColorClass: string;
    isCompact: boolean;
};

const AboutDropdown = ({ textColorClass, isCompact }: AboutDropdownProps) => {
    const isDark = textColorClass === 'text-white';
    const hoverTextColor = isDark ? 'hover:text-white/90' : 'hover:text-[#1F1919]/80';
    const hoverBgColor = isDark ? 'hover:bg-white/10' : 'hover:bg-[#1F1919]/10';
    const triggerClasses = `rounded-full font-medium transition-all duration-300 ${textColorClass} ${
        isCompact
            ? `px-3 lg:px-4 py-1 lg:py-1.5 text-xs lg:text-sm ${hoverBgColor} ${hoverTextColor}`
            : 'px-3 lg:px-4 xl:px-5 2xl:px-6 py-1.5 lg:py-2 xl:py-2.5 2xl:py-3 text-sm lg:text-sm xl:text-base 2xl:text-lg hover:bg-white/20'
    }`;
    const panelClasses = isDark
        ? 'bg-[#1F1919] rounded-2xl shadow-[4px_4px_0_0_rgba(215,223,33,0.15)] border border-white/5'
        : 'bg-white rounded-2xl shadow-[4px_4px_0_0_rgba(31,25,25,0.06)] border border-[#1F1919]/5';
    const itemHoverBg = isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100';

    return (
        <div className="relative group">
            <Link
                href="/about"
                className={triggerClasses}
                aria-haspopup="true"
                aria-label="About – submenu on hover"
            >
                About
            </Link>
            <div
                className="absolute left-0 top-full pt-2 opacity-0 invisible scale-95 origin-top-left group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:scale-100 transition-all duration-200 ease-out min-w-[200px]"
                role="menu"
                aria-label="About subpages"
            >
                <div className={`${panelClasses} py-2 px-1.5 backdrop-blur-sm`}>
                    {ABOUT_SUBPAGES.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            role="menuitem"
                            className={`block px-5 py-3 mx-1 rounded-lg text-sm lg:text-base font-medium ${textColorClass} ${itemHoverBg} transition-colors duration-150`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

type ExhibitionDropdownProps = {
    textColorClass: string;
    isCompact: boolean;
};

const ExhibitionDropdown = ({ textColorClass, isCompact }: ExhibitionDropdownProps) => {
    const isDark = textColorClass === 'text-white';
    const hoverTextColor = isDark ? 'hover:text-white/90' : 'hover:text-[#1F1919]/80';
    const hoverBgColor = isDark ? 'hover:bg-white/10' : 'hover:bg-[#1F1919]/10';
    const triggerClasses = `rounded-full font-medium transition-all duration-300 ${textColorClass} ${
        isCompact
            ? `px-3 lg:px-4 py-1 lg:py-1.5 text-xs lg:text-sm ${hoverBgColor} ${hoverTextColor}`
            : 'px-3 lg:px-4 xl:px-5 2xl:px-6 py-1.5 lg:py-2 xl:py-2.5 2xl:py-3 text-sm lg:text-sm xl:text-base 2xl:text-lg hover:bg-white/20'
    }`;
    const panelClasses = isDark
        ? 'bg-[#1F1919] rounded-2xl shadow-[4px_4px_0_0_rgba(215,223,33,0.15)] border border-white/5'
        : 'bg-white rounded-2xl shadow-[4px_4px_0_0_rgba(31,25,25,0.06)] border border-[#1F1919]/5';
    const itemHoverBg = isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100';

    return (
        <div className="relative group">
            <Link
                href="/exhibit"
                className={triggerClasses}
                aria-haspopup="true"
                aria-label="Exhibition – submenu on hover"
            >
                Exhibition
            </Link>
            <div
                className="absolute left-0 top-full pt-2 opacity-0 invisible scale-95 origin-top-left group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:scale-100 transition-all duration-200 ease-out min-w-[200px]"
                role="menu"
                aria-label="Exhibition subpages"
            >
                <div className={`${panelClasses} py-2 px-1.5 backdrop-blur-sm`}>
                    {EXHIBITION_SUBPAGES.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            role="menuitem"
                            className={`block px-5 py-3 mx-1 rounded-lg text-sm lg:text-base font-medium ${textColorClass} ${itemHoverBg} transition-colors duration-150`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

type ProgramDropdownProps = {
    textColorClass: string;
    isCompact: boolean;
};

const ProgramDropdown = ({ textColorClass, isCompact }: ProgramDropdownProps) => {
    const isDark = textColorClass === 'text-white';
    const hoverTextColor = isDark ? 'hover:text-white/90' : 'hover:text-[#1F1919]/80';
    const hoverBgColor = isDark ? 'hover:bg-white/10' : 'hover:bg-[#1F1919]/10';
    const triggerClasses = `rounded-full font-medium transition-all duration-300 ${textColorClass} ${
        isCompact
            ? `px-3 lg:px-4 py-1 lg:py-1.5 text-xs lg:text-sm ${hoverBgColor} ${hoverTextColor}`
            : 'px-3 lg:px-4 xl:px-5 2xl:px-6 py-1.5 lg:py-2 xl:py-2.5 2xl:py-3 text-sm lg:text-sm xl:text-base 2xl:text-lg hover:bg-white/20'
    }`;
    const panelClasses = isDark
        ? 'bg-[#1F1919] rounded-2xl shadow-[4px_4px_0_0_rgba(215,223,33,0.15)] border border-white/5'
        : 'bg-white rounded-2xl shadow-[4px_4px_0_0_rgba(31,25,25,0.06)] border border-[#1F1919]/5';
    const itemHoverBg = isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100';

    return (
        <div className="relative group">
            <Link
                href="/program"
                className={triggerClasses}
                aria-haspopup="true"
                aria-label="Program – submenu on hover"
            >
                Program
            </Link>
            <div
                className="absolute left-0 top-full pt-2 opacity-0 invisible scale-95 origin-top-left group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:scale-100 transition-all duration-200 ease-out min-w-[200px]"
                role="menu"
                aria-label="Program subpages"
            >
                <div className={`${panelClasses} py-2 px-1.5 backdrop-blur-sm`}>
                    {PROGRAM_SUBPAGES.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            role="menuitem"
                            className={`block px-5 py-3 mx-1 rounded-lg text-sm lg:text-base font-medium ${textColorClass} ${itemHoverBg} transition-colors duration-150`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

type NavLinkProps = {
    href: string;
    children: React.ReactNode;
    active?: boolean;
    textColor: string;
    isCompact?: boolean;
};

const NavLink = ({ href, children, active, textColor, isCompact }: NavLinkProps) => {
    // Určíme hover farbu podľa textColor
    const hoverTextColor = textColor === 'text-white' 
        ? 'hover:text-white/90' 
        : 'hover:text-[#1F1919]/80';
    
    const hoverBgColor = textColor === 'text-white'
        ? 'hover:bg-white/10'
        : 'hover:bg-[#1F1919]/10';

    return (
        <Link
            href={href}
            className={`rounded-full font-medium transition-all duration-300 ${textColor} ${
                isCompact 
                    ? `px-3 lg:px-4 py-1 lg:py-1.5 text-xs lg:text-sm ${hoverBgColor} ${hoverTextColor}` 
                    : 'px-3 lg:px-4 xl:px-5 2xl:px-6 py-1.5 lg:py-2 xl:py-2.5 2xl:py-3 text-sm lg:text-sm xl:text-base 2xl:text-lg hover:bg-white/20'
            } ${
                active ? 'bg-white/80 backdrop-blur-sm' : ''
            }`}
        >
            {active && <span className="inline-block w-1.5 h-1.5 lg:w-2 lg:h-2 bg-current rounded-full mr-2 mb-0.5"></span>}
            {children}
        </Link>
    );
};
