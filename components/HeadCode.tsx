'use client';

import { useEffect } from 'react';

interface HeadCodeProps {
  code: string | null;
}

/**
 * Component to inject HTML code into the document head
 * Uses useEffect to inject scripts, meta tags, and other elements after component mounts
 * This is necessary because Next.js App Router doesn't allow arbitrary HTML in the <head> tag
 */
export function HeadCode({ code }: HeadCodeProps) {
  useEffect(() => {
    if (!code) return;

    // Create a temporary container to parse the HTML
    // Using a document fragment approach to preserve structure
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = code;

    // Extract and inject scripts (must be done first for proper execution order)
    const scripts = Array.from(tempDiv.querySelectorAll('script'));
    scripts.forEach((script) => {
      // Check if script already exists to avoid duplicates
      const existingScript = document.querySelector(
        `script[src="${script.getAttribute('src')}"]`
      );
      if (existingScript) return;

      const newScript = document.createElement('script');
      
      // Copy all attributes
      Array.from(script.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      
      // Copy innerHTML/textContent
      if (script.innerHTML) {
        newScript.innerHTML = script.innerHTML;
      } else if (script.textContent) {
        newScript.textContent = script.textContent;
      }
      
      // Append to head
      document.head.appendChild(newScript);
    });

    // Extract and inject meta tags
    const metaTags = Array.from(tempDiv.querySelectorAll('meta'));
    metaTags.forEach((meta) => {
      // Check if meta tag already exists
      const name = meta.getAttribute('name');
      const property = meta.getAttribute('property');
      const httpEquiv = meta.getAttribute('http-equiv');
      
      let existingMeta: Element | null = null;
      if (name) {
        existingMeta = document.querySelector(`meta[name="${name}"]`);
      } else if (property) {
        existingMeta = document.querySelector(`meta[property="${property}"]`);
      } else if (httpEquiv) {
        existingMeta = document.querySelector(`meta[http-equiv="${httpEquiv}"]`);
      }
      
      if (existingMeta) {
        // Update existing meta tag
        Array.from(meta.attributes).forEach((attr) => {
          existingMeta!.setAttribute(attr.name, attr.value);
        });
        return;
      }

      const newMeta = document.createElement('meta');
      Array.from(meta.attributes).forEach((attr) => {
        newMeta.setAttribute(attr.name, attr.value);
      });
      document.head.appendChild(newMeta);
    });

    // Extract and inject link tags
    const linkTags = Array.from(tempDiv.querySelectorAll('link'));
    linkTags.forEach((link) => {
      const href = link.getAttribute('href');
      const rel = link.getAttribute('rel');
      
      // Check if link already exists
      if (href && rel) {
        const existingLink = document.querySelector(`link[href="${href}"][rel="${rel}"]`);
        if (existingLink) return;
      }

      const newLink = document.createElement('link');
      Array.from(link.attributes).forEach((attr) => {
        newLink.setAttribute(attr.name, attr.value);
      });
      document.head.appendChild(newLink);
    });

    // Extract and inject style tags
    const styleTags = Array.from(tempDiv.querySelectorAll('style'));
    styleTags.forEach((style) => {
      const newStyle = document.createElement('style');
      if (style.innerHTML) {
        newStyle.innerHTML = style.innerHTML;
      } else if (style.textContent) {
        newStyle.textContent = style.textContent;
      }
      document.head.appendChild(newStyle);
    });

    // Handle HTML comments (for tracking/analytics comments)
    // Comments are preserved in the original code but won't be injected separately
    // They're typically part of script tags or meta tags

  }, [code]);

  return null; // This component doesn't render anything
}

