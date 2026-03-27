/**
 * Căi centralizate în bucket `tehnicagro` (Storage site, nu CRM).
 *
 * - Categorii: `video/{slug}/banner-*.mp4` → vezi `getCategoryBannerMp4PublicUrl`.
 * - Piese: slug-ul folderului = ruta site (`/piese-schimb`), nu apare în admin categorii.
 * - Home (VideoGallery): `video/home-showcase/` — clipuri demonstrative MP4.
 */

/** Slug folder Storage pentru pagina /piese-schimb (banner opțional `banner-*.mp4`). */
export const PIESE_SCHIMB_BANNER_SLUG = 'piese-schimb';

/** Foldere suplimentare pentru `npm run sync-site-folders` (în afara categoriilor din catalog). */
export const EXTRA_VIDEO_FOLDER_SLUGS: string[] = [PIESE_SCHIMB_BANNER_SLUG, 'home-showcase'];

export const HOME_SHOWCASE_STORAGE = {
    /** Filmare Avers-Agro Multisem ADS (secțiunea „în acțiune” de pe home). */
    aversAds: 'video/home-showcase/showcase-avers-ads.mp4',
    /** Filmare Fliegl Chain Disc KSE pe teren (pregătire / lucrare sol). */
    flieglKseTeren: 'video/home-showcase/showcase-fliegl-kse-teren.mp4',
} as const;
