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
        <footer ref={footerRef} className="relative w-full bg-[#121212] text-white py-12 lg:py-16">
            <div className="w-full px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-12">
                    {/* Left Column - Navigation */}
                    <div ref={(el) => { if (el) columnsRef.current[0] = el; }}>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/exhibit" className="flex items-center gap-12 text-white/70 text-[26px] hover:text-white transition-colors">
                                    <span className="text-white/50 text-xs">01</span>
                                    Exhibit
                                </Link>
                            </li>
                            <li>
                                <Link href="/program" className="flex items-center gap-12 text-white/70 text-[26px] hover:text-white transition-colors">
                                    <span className="text-white/50 text-xs">02</span>
                                    Program
                                </Link>
                            </li>
                            <li>
                                <Link href="/visit" className="flex items-center gap-12 text-white/70 text-[26px] hover:text-white transition-colors">
                                    <span className="text-white/50 text-xs">03</span>
                                    Visit
                                </Link>
                            </li>
                            <li>
                                <Link href="/network" className="flex items-center gap-12 text-white/70 text-[26px] hover:text-white transition-colors">
                                    <span className="text-white/50 text-xs">04</span>
                                    Network
                                </Link>
                            </li>
                            <li>
                                <Link href="/insights" className="flex items-center gap-12 text-white/70 text-[26px] hover:text-white transition-colors">
                                    <span className="text-white/50 text-xs">05</span>
                                    Insights
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Middle Column - News & Newsletter */}
                    <div ref={(el) => { if (el) columnsRef.current[1] = el; }}>
                        <div className="flex items-center gap-12 mb-6">
                            <span className="text-white/50 text-xs font-medium leading-none">06</span>
                            <AnimatedText as="h3" className="text-white text-[26px] flex items-center leading-none">News</AnimatedText>
                        </div>
                        
                        {/* News Headlines */}
                        <div className="space-y-4 mb-8 pl-[calc(12px+3rem)]">
                            <Link href="/news/leading-charge" className="block text-white/70 text-base hover:text-white transition-colors">
                                Leading the Charge into South Africa's Liberalised Energy Market
                                </Link>
                            <Link href="/news/unlocking-grid" className="block text-white/70 text-base hover:text-white transition-colors">
                                Unlocking Grid Access: How Congestion Curtailment Supports South Africa's Just...
                                </Link>
                    </div>

                        {/* Newsletter */}
                        <div className="mb-6 pl-[calc(12px+3rem)]">
                            <p className="text-white/70 text-base leading-relaxed mb-4">
                                Join our newsletter to stay updated on Anthem's latest news and releases. By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                        </p>
                            <form onSubmit={handleSubmit} className="relative">
                                <div className="flex items-center rounded-full border border-white/30 overflow-hidden">
                                <input
                                    type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="flex-1 px-6 py-4 bg-transparent text-white placeholder-white/50 text-base focus:outline-none"
                                        required
                                />
                                <button
                                    type="submit"
                                        className="px-6 py-4 bg-transparent hover:opacity-70 transition-opacity flex items-center justify-center"
                                        aria-label="Subscribe"
                                >
                                        <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.5 15L12.5 10L7.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                </button>
                            </div>
                        </form>
                        </div>
                    </div>

                    {/* Right Column - Contact Us */}
                    <div ref={(el) => { if (el) columnsRef.current[2] = el; }}>
                        <div className="flex items-center gap-12 mb-6">
                            <span className="text-white/50 text-xs font-medium leading-none">07</span>
                            <AnimatedText as="h3" className="text-white text-[26px] flex items-center leading-none">Contact Us</AnimatedText>
                        </div>
                        
                        <div className="space-y-4 pl-[calc(12px+3rem)]">
                            <div>
                                <Link href="/helpdesk" className="text-white/70 text-base hover:text-white transition-colors block">
                                    Helpdesk form
                                </Link>
                            </div>
                            
                            <div>
                                <Link href="/faq" className="text-white/70 text-base hover:text-white transition-colors block">
                                    FAQ
                                </Link>
                            </div>
                            
                            <div>
                                <p className="text-white/70 text-base leading-relaxed">
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
                <div className="pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-white/50 text-sm">
                            ©2025 design and development by wepeak.eu
                        </p>
                        <div className="flex flex-wrap gap-6">
                            <Link href="/privacy" className="text-white/50 text-sm hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/disclaimer" className="text-white/50 text-sm hover:text-white transition-colors">
                                Disclaimer
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
