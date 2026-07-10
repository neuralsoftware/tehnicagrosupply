'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface FadeInProps {
    children: ReactNode;
    className?: string;
    /** Întârziere tranziție, în secunde (echivalent transition.delay din framer-motion). */
    delay?: number;
    /** Apelat o singură dată, când elementul intră în viewport (ex: tracking fbq). */
    onEnter?: () => void;
}

/**
 * Fade-in la scroll, fără framer-motion și fără să ascundă conținutul înainte de hidratare.
 *
 * HTML-ul servit de server este complet vizibil — imaginea hero / titlul (elementul LCP)
 * se afișează imediat, nu după descărcarea JavaScript-ului. Animația se aplică doar
 * elementelor aflate sub fold în momentul hidratării, când intră în viewport.
 * Stilurile sunt aplicate direct pe element (fără re-randări React).
 */
export function FadeIn({ children, className, delay = 0, onEnter }: FadeInProps) {
    const ref = useRef<HTMLDivElement>(null);
    const enteredRef = useRef(false);
    const onEnterRef = useRef(onEnter);

    useEffect(() => {
        onEnterRef.current = onEnter;
    }, [onEnter]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const fireEnter = () => {
            if (!enteredRef.current) {
                enteredRef.current = true;
                onEnterRef.current?.();
            }
        };

        const reducedMotion =
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Elementele deja vizibile la încărcare rămân vizibile (nu stricăm LCP).
        const rect = el.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (inViewport || reducedMotion || typeof IntersectionObserver === 'undefined') {
            fireEnter();
            return;
        }

        el.style.opacity = '0';
        el.style.transform = 'translateY(14px)';
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    el.style.transition = `opacity 0.45s ease-out ${delay}s, transform 0.45s ease-out ${delay}s`;
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                    fireEnter();
                    observer.disconnect();
                }
            },
            { rootMargin: '0px 0px -8% 0px' }
        );
        observer.observe(el);
        return () => {
            observer.disconnect();
            // Nu lăsa elementul ascuns dacă efectul se re-execută înainte de intersecție.
            el.style.opacity = '';
            el.style.transform = '';
            el.style.transition = '';
        };
    }, [delay]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}
