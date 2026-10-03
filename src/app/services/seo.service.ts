import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  robots?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly defaultBaseUrl = 'https://chalamaji.com';
  private readonly defaultImage = 'https://res.cloudinary.com/djha4r2ys/image/upload/v1791024228/40a10a2f-fd5e-4c7a-b566-fc05f259df78.png';
  private readonly siteName = 'Chalamaji Infra Projects';

  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Updates all SEO meta tags, canonical link, and optional JSON-LD structured data
   */
  updateSeo(config: SeoConfig): void {
    // 1. Document Title
    this.titleService.setTitle(config.title);

    // 2. Standard Meta Tags
    this.metaService.updateTag({ name: 'description', content: config.description });
    if (config.keywords) {
      this.metaService.updateTag({ name: 'keywords', content: config.keywords });
    }
    this.metaService.updateTag({
      name: 'robots',
      content: config.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    });

    // 3. Open Graph Tags
    const canonical = config.canonicalUrl || this.defaultBaseUrl;
    const ogImage = config.ogImage || this.defaultImage;
    const ogType = config.ogType || 'website';

    this.metaService.updateTag({ property: 'og:site_name', content: this.siteName });
    this.metaService.updateTag({ property: 'og:title', content: config.title });
    this.metaService.updateTag({ property: 'og:description', content: config.description });
    this.metaService.updateTag({ property: 'og:url', content: canonical });
    this.metaService.updateTag({ property: 'og:image', content: ogImage });
    this.metaService.updateTag({ property: 'og:type', content: ogType });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // 4. Twitter / X Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: config.title });
    this.metaService.updateTag({ name: 'twitter:description', content: config.description });
    this.metaService.updateTag({ name: 'twitter:image', content: ogImage });

    // 5. Canonical Link Element
    this.setCanonicalUrl(canonical);

    // 6. Dynamic JSON-LD Structured Data
    if (config.jsonLd) {
      this.setJsonLd(config.jsonLd);
    }
  }

  /**
   * Protects internal or private pages from search engine indexing
   */
  setNoIndex(title: string = 'Admin Portal | Chalamaji Infra'): void {
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'robots', content: 'noindex, nofollow, noarchive' });
    this.metaService.updateTag({ name: 'googlebot', content: 'noindex, nofollow' });
  }

  /**
   * Updates or appends the canonical <link rel="canonical" href="..."> in <head>
   */
  private setCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  /**
   * Updates or injects a dedicated page JSON-LD <script> tag in <head>
   */
  private setJsonLd(schemaData: Record<string, any> | Array<Record<string, any>>): void {
    const scriptId = 'app-dynamic-jsonld';
    let script: HTMLScriptElement | null = this.document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = this.document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(schemaData, null, 2);
  }
}
