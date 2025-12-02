'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Rozšírenie Window interface pre Lenis
declare global {
    interface Window {
        lenis?: Lenis;
    }
}

export default function SmoothScroll() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
        });

        // Uložíme Lenis do window pre globálny prístup
        window.lenis = lenis;

        // Sync Lenis s GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // Refresh ScrollTrigger
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);

        return () => {
            lenis.destroy();
            window.lenis = undefined;
        };
    }, []);

    return null;
}
