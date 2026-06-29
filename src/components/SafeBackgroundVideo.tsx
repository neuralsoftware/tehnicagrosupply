'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

interface SafeBackgroundVideoProps {
    src: string;
    className: string;
    poster?: string;
    ariaLabel?: string;
    loading?: 'eager' | 'lazy';
    minViewportWidth?: number;
    preload?: 'none' | 'metadata' | 'auto';
    rootMargin?: string;
}

function subscribeToViewport(minViewportWidth: number | undefined, onStoreChange: () => void) {
    if (minViewportWidth === undefined) return () => undefined;

    const mediaQuery = window.matchMedia(`(min-width: ${minViewportWidth}px)`);
    mediaQuery.addEventListener('change', onStoreChange);
    return () => mediaQuery.removeEventListener('change', onStoreChange);
}

function getViewportSnapshot(minViewportWidth: number | undefined) {
    if (minViewportWidth === undefined) return true;
    return window.matchMedia(`(min-width: ${minViewportWidth}px)`).matches;
}

function getServerViewportSnapshot(minViewportWidth: number | undefined) {
    return minViewportWidth === undefined;
}

export function SafeBackgroundVideo({
    src,
    className,
    poster,
    ariaLabel,
    loading = 'eager',
    minViewportWidth,
    preload = 'metadata',
    rootMargin = '300px 0px',
}: SafeBackgroundVideoProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [failed, setFailed] = useState(false);
    const [lazyLoadRequested, setLazyLoadRequested] = useState(false);
    const matchesViewport = useSyncExternalStore(
        (onStoreChange) => subscribeToViewport(minViewportWidth, onStoreChange),
        () => getViewportSnapshot(minViewportWidth),
        () => getServerViewportSnapshot(minViewportWidth)
    );

    useEffect(() => {
        if (!matchesViewport || loading === 'eager') return;

        const target = containerRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setLazyLoadRequested(true);
                    observer.disconnect();
                }
            },
            { rootMargin, threshold: 0.01 }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [loading, matchesViewport, rootMargin]);

    if (failed) return null;

    const shouldLoad = matchesViewport && (loading === 'eager' || lazyLoadRequested);

    return (
        <div ref={containerRef} className={className} aria-hidden={ariaLabel ? undefined : 'true'}>
            {shouldLoad ? (
                <video
                    className="h-full w-full object-cover"
                    src={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload={preload}
                    poster={poster}
                    aria-label={ariaLabel}
                    aria-hidden={ariaLabel ? undefined : 'true'}
                    onError={() => setFailed(true)}
                />
            ) : null}
        </div>
    );
}
