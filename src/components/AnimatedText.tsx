'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

type AnimatedTextProps = {
    children: string;
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
    delay?: number;
    stagger?: number;
    duration?: number;
    start?: string;
    effect?: 'routine' | 'flip' | 'blur' | 'scale';
};

const AnimatedText = ({
    children,
    className = '',
    as: Tag = 'h2',
    delay = 0,
    stagger = 0.042,
    duration = 1,
    start = 'top bottom',
    effect = 'routine',
}: AnimatedTextProps) => {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined' || !containerRef.current) return;

        // Split text into words and chars
        const container = containerRef.current;
        const text = children;
        
        // Clear and rebuild content with proper splitting
        container.innerHTML = '';
        
        const words = text.split(' ');
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word inline-block whitespace-nowrap';
            
            word.split('').forEach((char) => {
                // Create char-wrap (mask)
                const charWrap = document.createElement('span');
                charWrap.className = 'char-wrap inline-block relative overflow-hidden';
                
                // Create char element
                const charSpan = document.createElement('span');
                charSpan.className = 'char inline-block';
                charSpan.textContent = char;
                charSpan.style.willChange = 'transform';
                
                charWrap.appendChild(charSpan);
                wordSpan.appendChild(charWrap);
            });
            
            container.appendChild(wordSpan);
            
            // Add space between words
            if (wordIndex < words.length - 1) {
                const space = document.createElement('span');
                space.className = 'inline-block';
                space.innerHTML = '&nbsp;';
                container.appendChild(space);
            }
        });
        
        const chars = container.querySelectorAll('.char');
        
        let animation: gsap.core.Tween | gsap.core.Timeline;
        
        // "The Routine" effect from Codrops
        if (effect === 'routine') {
            animation = gsap.fromTo(chars, 
                { 
                    'will-change': 'transform', 
                    transformOrigin: '0% 50%',
                    xPercent: 105,
                }, 
                {
                    duration: duration,
                    ease: 'expo',
                    xPercent: 0,
                    stagger: stagger,
                    delay: delay,
                    scrollTrigger: {
                        trigger: container,
                        start: start,
                        end: 'top top+=10%',
                        toggleActions: 'play none none reverse',
                    }
                }
            );
        } 
        // 3D Flip effect (effect6 from Codrops)
        else if (effect === 'flip') {
            // Set perspective on parent
            chars.forEach(char => {
                const parent = char.parentNode as HTMLElement;
                if (parent) parent.style.perspective = '2000px';
            });
            
            animation = gsap.fromTo(chars, 
                { 
                    'will-change': 'opacity, transform', 
                    opacity: 0, 
                    rotationX: -90,
                    yPercent: 50
                },
                {
                    ease: 'power1.inOut',
                    opacity: 1,
                    rotationX: 0,
                    yPercent: 0,
                    duration: duration,
                    stagger: stagger,
                    delay: delay,
                    scrollTrigger: {
                        trigger: container,
                        start: start,
                        end: 'bottom center-=30%',
                        toggleActions: 'play none none reverse',
                    }
                }
            );
        }
        // Blur effect (effect10 from Codrops)
        else if (effect === 'blur') {
            animation = gsap.fromTo(chars, 
                { 
                    'will-change': 'opacity', 
                    opacity: 0,
                    filter: 'blur(20px)'
                },
                {
                    duration: duration,
                    ease: 'power1.inOut',
                    opacity: 1,
                    filter: 'blur(0px)',
                    stagger: { each: stagger, from: 'random' },
                    delay: delay,
                    scrollTrigger: {
                        trigger: container,
                        start: start,
                        end: 'center center',
                        toggleActions: 'play none none reverse',
                    }
                }
            );
        }
        // Scale effect (effect1 from Codrops)
        else if (effect === 'scale') {
            animation = gsap.fromTo(chars, 
                { 
                    'will-change': 'opacity, transform', 
                    opacity: 0, 
                    scale: 0.6,
                    rotationZ: () => gsap.utils.random(-20, 20)
                },
                {
                    ease: 'power4',
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    stagger: stagger,
                    delay: delay,
                    scrollTrigger: {
                        trigger: container,
                        start: start,
                        end: '+=50%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        }

        return () => {
            if (animation) {
                const st = (animation as gsap.core.Tween).scrollTrigger;
                if (st) st.kill();
                animation.kill();
            }
        };
    }, [children, delay, stagger, duration, start, effect]);

    return (
        <Tag
            ref={containerRef as React.RefObject<HTMLHeadingElement>}
            className={className}
            aria-label={children}
        >
            {children}
        </Tag>
    );
};

export default AnimatedText;
