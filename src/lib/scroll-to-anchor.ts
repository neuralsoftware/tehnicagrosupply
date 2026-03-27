import type { MouseEvent } from 'react';

/** Ancoră formular contact pe homepage, produse etc. */
export const CONTACT_SECTION_ID = 'contact';

/**
 * Scroll lin către un element după id (respectă `scroll-padding-top` din `globals.css`).
 */
export function scrollToIdSmooth(elementId: string): void {
    if (typeof document === 'undefined') return;
    const el = document.getElementById(elementId);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/** Handler pentru `<a href="#contact">`: evită saltul instant cât timp `html { scroll-behavior: auto }`. */
export function onHashLinkClickSmooth(
    e: MouseEvent<HTMLAnchorElement>,
    hash: string
): void {
    const id = hash.startsWith('#') ? hash.slice(1) : hash;
    if (!id) return;
    e.preventDefault();
    scrollToIdSmooth(id);
}
