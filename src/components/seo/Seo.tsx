import { useEffect } from 'react';
import { BUSINESS, SITE_URL } from '../../lib/siteContent';

/**
 * Dependency-free document <head> manager for this client-rendered SPA.
 *
 * Each page renders <Seo /> with its own metadata; on mount/route change we
 * imperatively upsert the title, description, canonical, Open Graph / Twitter
 * tags and a single JSON-LD structured-data block. Kept tiny on purpose — no
 * react-helmet dependency, which also avoids conflicts with the single-file
 * Vite build.
 */

export interface SeoProps {
  title: string;
  description: string;
  /** Route path, e.g. "/pricing" — used to build the canonical URL. */
  path: string;
  image?: string;
  keywords?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
  /** JSON-LD object(s) describing the page (Service, FAQPage, etc.). */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function Seo({ title, description, path, image, keywords, noindex, type = 'website', jsonLd }: SeoProps) {
  useEffect(() => {
    const fullTitle = title.includes('Clean9ja') ? title : `${title} | Clean9ja`;
    const url = `${SITE_URL}${path === '/' ? '' : path}`;
    const img = image || BUSINESS.image;

    document.title = fullTitle;

    upsertMeta('name', 'description', description);
    if (keywords) upsertMeta('name', 'keywords', keywords);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    upsertLink('canonical', url);

    // Open Graph
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', img);
    upsertMeta('property', 'og:site_name', 'Clean9ja');
    upsertMeta('property', 'og:locale', 'en_NG');

    // Twitter
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', img);

    // JSON-LD structured data (single managed block).
    let script = document.getElementById('seo-jsonld') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script');
        script.id = 'seo-jsonld';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }
  }, [title, description, path, image, keywords, noindex, type, jsonLd]);

  return null;
}
