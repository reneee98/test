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
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-white/50 text-sm font-medium">01</span>
                            <AnimatedText as="h3" className="text-white font-bold text-lg">Our Story</AnimatedText>
                        </div>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/team" className="flex items-center gap-2 text-white/70 text-sm hover:text-white transition-colors underline">
                                    <span className="text-white/50 text-sm">02</span>
                                    Our Team
                                </Link>
                            </li>
                            <li>
                                <Link href="/projects" className="flex items-center gap-2 text-white/70 text-sm hover:text-white transition-colors underline">
                                    <span className="text-white/50 text-sm">03</span>
                                    Our Projects
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="flex items-center gap-2 text-white/70 text-sm hover:text-white transition-colors underline">
                                    <span className="text-white/50 text-sm">04</span>
                                    Careers
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Middle Column - News & Newsletter */}
                    <div ref={(el) => { if (el) columnsRef.current[1] = el; }}>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-white/50 text-sm font-medium">04</span>
                            <AnimatedText as="h3" className="text-white font-bold text-lg">News</AnimatedText>
                        </div>
                        
                        {/* News Headlines */}
                        <div className="space-y-4 mb-8">
                            <Link href="/news/leading-charge" className="block text-white/70 text-sm hover:text-white transition-colors underline">
                                Leading the Charge into South Africa's Liberalised Energy Market
                                </Link>
                            <Link href="/news/unlocking-grid" className="block text-white/70 text-sm hover:text-white transition-colors underline">
                                Unlocking Grid Access: How Congestion Curtailment Supports South Africa's Just...
                                </Link>
                    </div>

                        {/* Newsletter */}
                        <div className="mb-6">
                            <p className="text-white/70 text-sm leading-relaxed mb-4">
                                Join our newsletter to stay updated on Anthem's latest news and releases. By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                        </p>
                            <form onSubmit={handleSubmit} className="relative">
                                <div className="flex items-center rounded-full border border-white/30 bg-white/5 overflow-hidden">
                                <input
                                    type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="flex-1 px-4 py-3 bg-transparent text-white placeholder-white/50 text-sm focus:outline-none"
                                        required
                                />
                                <button
                                    type="submit"
                                        className="px-4 py-3 bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                                        aria-label="Subscribe"
                                >
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.5 15L12.5 10L7.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                </button>
                            </div>
                        </form>
                        </div>
                    </div>

                    {/* Right Column - Contact Us */}
                    <div ref={(el) => { if (el) columnsRef.current[2] = el; }}>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-white/50 text-sm font-medium">06</span>
                            <AnimatedText as="h3" className="text-white font-bold text-lg">Contact Us</AnimatedText>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <p className="text-white/70 text-sm leading-relaxed mb-2">
                                    Have a question or need some information? Send us an email at{' '}
                                    <a href="mailto:info@anthem.co.za" className="text-white underline hover:text-white/80 transition-colors">
                                        info@anthem.co.za
                                    </a>
                                    .
                                </p>
                            </div>
                            
                            <div>
                                <p className="text-white/70 text-sm leading-relaxed mb-2">
                                    Want to chat with us directly? Give us a call at{' '}
                                    <a href="tel:+27216701400" className="text-white underline hover:text-white/80 transition-colors">
                                        +27 21 670 1400
                                    </a>
                                    .
                                </p>
                            </div>
                            
                            <div>
                                <p className="text-white/70 text-sm leading-relaxed">
                                    2nd Floor Fernwood House,<br />
                                    the Oval,<br />
                                    1 Oakdale Rd,<br />
                                    Newlands,<br />
                                    Cape Town
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-white/50 text-sm">
                            ©2025 by Anthem, All Rights Reserved.
                        </p>
                        <div className="flex flex-wrap gap-6">
                            <Link href="/privacy" className="text-white/50 text-sm hover:text-white transition-colors underline">
                                Privacy Policy
                            </Link>
                            <Link href="/disclaimer" className="text-white/50 text-sm hover:text-white transition-colors underline">
                                Disclaimer
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
