export function injectMobileOverridesIntoIframe(iframe: HTMLIFrameElement | null) {
  if (!iframe) return;
  try {
    const win = iframe.contentWindow;
    const doc = iframe.contentDocument || win?.document;
    if (!doc) return;

    // Ensure same-origin access before manipulating
    try {
      // Accessing location.href will throw on cross-origin
      void win?.location.href;
    } catch {
      return;
    }

    // Add or update viewport meta for better mobile scaling
    const existingViewport = doc.querySelector('meta[name="viewport"]');
    const viewportContent = 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover';
    if (existingViewport) {
      existingViewport.setAttribute('content', viewportContent);
    } else {
      const meta = doc.createElement('meta');
      meta.setAttribute('name', 'viewport');
      meta.setAttribute('content', viewportContent);
      doc.head.appendChild(meta);
    }

    // Inject a global mobile override stylesheet
    const existingLink = doc.querySelector('link[data-mobile-override="true"]');
    if (!existingLink) {
      const link = doc.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', '/mobile-override.css');
      link.setAttribute('data-mobile-override', 'true');
      doc.head.appendChild(link);
    }

    // Inject media-query scoped inline styles (only apply on mobile viewports)
    const existingStyle = doc.querySelector('style[data-mobile-inline="true"]');
    if (!existingStyle) {
      const style = doc.createElement('style');
      style.setAttribute('data-mobile-inline', 'true');
      style.textContent = `
        @media (max-width: 850px) {
          html, body {
            max-width: 100% !important;
            width: 100% !important;
            overflow-x: hidden !important;
            -webkit-text-size-adjust: 100%;
            margin: 0 !important;
            padding: 0 !important;
          }
          *, *::before, *::after { box-sizing: border-box; }
          img, video, canvas, svg { max-width: 100% !important; height: auto !important; }
          iframe { max-width: 100% !important; width: 100% !important; }
          /* Hide sidebars on mobile */
          [class*="sidebar"], [class*="nav-side"], [class*="aside"], [class*="menu-side"], nav[class*="side"] { display: none !important; }
          /* Force single column on small screens */
          [class*="grid"], [class*="flex"] { flex-direction: column !important; }
        }
      `;
      doc.head.appendChild(style);
    }
  } catch (e) {
    // Silently ignore to avoid breaking module loading
    console.warn('Mobile override injection failed:', e);
  }
}
