'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedText from './AnimatedText';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const columnsRef = useRef<HTMLDivElement[]>([]);
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle newsletter subscription
        console.log('Newsletter subscription:', email);
        setEmail('');
    };

    useEffect(() => {
        if (!footerRef.current) return;

        // Animace sloupců
        columnsRef.current.forEach((col, index) => {
            if (!col) return;
            gsap.fromTo(col,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <footer ref={footerRef} className="relative w-full bg-[#121212] text-white py-10 lg:py-12 xl:py-16 2xl:py-20">
            <div className="w-full px-4 lg:px-6 xl:px-12 2xl:px-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 mb-10 lg:mb-12 xl:mb-14 2xl:mb-16">
                    {/* Left Column - Navigation */}
                    <div ref={(el) => { if (el) columnsRef.current[0] = el; }}>
                        <ul className="space-y-3 lg:space-y-4 xl:space-y-5 2xl:space-y-6">
                            <li>
                                <Link href="/exhibit" className="flex items-center gap-8 lg:gap-12 xl:gap-14 2xl:gap-16 text-white/70 text-xl lg:text-2xl xl:text-[26px] 2xl:text-3xl hover:text-white transition-colors">
                                    <span className="text-white/50 text-xs lg:text-sm xl:text-base">01</span>
                                    Exhibit
                                </Link>
                            </li>
                            <li>
                                <Link href="/program" className="flex items-center gap-8 lg:gap-12 xl:gap-14 2xl:gap-16 text-white/70 text-xl lg:text-2xl xl:text-[26px] 2xl:text-3xl hover:text-white transition-colors">
                                    <span className="text-white/50 text-xs lg:text-sm xl:text-base">02</span>
                                    Program
                                </Link>
                            </li>
                            <li>
                                <Link href="/visit" className="flex items-center gap-8 lg:gap-12 xl:gap-14 2xl:gap-16 text-white/70 text-xl lg:text-2xl xl:text-[26px] 2xl:text-3xl hover:text-white transition-colors">
                                    <span className="text-white/50 text-xs lg:text-sm xl:text-base">03</span>
                                    Visit
                                </Link>
                            </li>
                            <li>
                                <Link href="/network" className="flex items-center gap-8 lg:gap-12 xl:gap-14 2xl:gap-16 text-white/70 text-xl lg:text-2xl xl:text-[26px] 2xl:text-3xl hover:text-white transition-colors">
                                    <span className="text-white/50 text-xs lg:text-sm xl:text-base">04</span>
                                    Network
                                </Link>
                            </li>
                            <li>
                                <Link href="/insights" className="flex items-center gap-8 lg:gap-12 xl:gap-14 2xl:gap-16 text-white/70 text-xl lg:text-2xl xl:text-[26px] 2xl:text-3xl hover:text-white transition-colors">
                                    <span className="text-white/50 text-xs lg:text-sm xl:text-base">05</span>
                                    Insights
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Middle Column - News & Newsletter */}
                    <div ref={(el) => { if (el) columnsRef.current[1] = el; }}>
                        <div className="flex items-center gap-8 lg:gap-12 xl:gap-14 2xl:gap-16 mb-4 lg:mb-6 xl:mb-8 2xl:mb-10">
                            <span className="text-white/50 text-xs lg:text-sm xl:text-base font-medium leading-none">06</span>
                            <AnimatedText as="h3" className="text-white text-xl lg:text-2xl xl:text-[26px] 2xl:text-3xl flex items-center leading-none">Newsletter</AnimatedText>
                        </div>
                        
                        {/* Newsletter */}
                        <div className="mb-6 lg:mb-8 xl:mb-10 2xl:mb-12 pl-[calc(12px+2rem)] lg:pl-[calc(12px+3rem)] xl:pl-[calc(12px+3.5rem)] 2xl:pl-[calc(12px+4rem)]">
                            <form onSubmit={handleSubmit} className="relative">
                                <div className="flex items-center rounded-full border border-white/30 overflow-hidden">
                                <input
                                    type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="flex-1 px-4 lg:px-6 xl:px-8 2xl:px-10 py-3 lg:py-4 xl:py-5 2xl:py-6 bg-transparent text-white placeholder-white/50 text-sm lg:text-base xl:text-lg 2xl:text-xl focus:outline-none"
                                        required
                                />
                                <button
                                    type="submit"
                                        className="px-4 lg:px-6 xl:px-8 2xl:px-10 py-3 lg:py-4 xl:py-5 2xl:py-6 bg-transparent hover:opacity-70 transition-opacity flex items-center justify-center"
                                        aria-label="Subscribe"
                                >
                                        <svg width="20" height="20" className="lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.5 15L12.5 10L7.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                </button>
                            </div>
                        </form>
                        </div>
                    </div>

                    {/* Right Column - Contact Us */}
                    <div ref={(el) => { if (el) columnsRef.current[2] = el; }}>
                        <div className="flex items-center gap-8 lg:gap-12 xl:gap-14 2xl:gap-16 mb-4 lg:mb-6 xl:mb-8 2xl:mb-10">
                            <span className="text-white/50 text-xs lg:text-sm xl:text-base font-medium leading-none">07</span>
                            <AnimatedText as="h3" className="text-white text-xl lg:text-2xl xl:text-[26px] 2xl:text-3xl flex items-center leading-none">Contact Us</AnimatedText>
                        </div>
                        
                        <div className="space-y-3 lg:space-y-4 xl:space-y-5 2xl:space-y-6 pl-[calc(12px+2rem)] lg:pl-[calc(12px+3rem)] xl:pl-[calc(12px+3.5rem)] 2xl:pl-[calc(12px+4rem)]">
                            <div>
                                <Link href="/helpdesk" className="text-white/70 text-sm lg:text-base xl:text-lg 2xl:text-xl hover:text-white transition-colors block">
                                    Helpdesk form
                                </Link>
                            </div>
                            
                            <div>
                                <Link href="/faq" className="text-white/70 text-sm lg:text-base xl:text-lg 2xl:text-xl hover:text-white transition-colors block">
                                    FAQ
                                </Link>
                            </div>
                            
                            <div>
                                <p className="text-white/70 text-sm lg:text-base xl:text-lg 2xl:text-xl leading-relaxed">
                                    <a href="tel:+33147565120" className="text-white hover:text-white/80 transition-colors">
                                        (+33) 1 47 56 51 20
                                    </a>
                                    . Our telephone service is open from Monday to Friday, 9am to 6pm CET.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 lg:pt-10 xl:pt-12 2xl:pt-16 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 lg:gap-6 xl:gap-8">
                        <p className="text-white/50 text-sm lg:text-base xl:text-lg 2xl:text-xl">
                            ©2025 design and development by wepeak.eu
                        </p>
                        <div className="flex flex-wrap gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
                            <Link href="/privacy" className="text-white/50 text-sm lg:text-base xl:text-lg 2xl:text-xl hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/disclaimer" className="text-white/50 text-sm lg:text-base xl:text-lg 2xl:text-xl hover:text-white transition-colors">
                                Disclaimer
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
