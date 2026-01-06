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

    // As a fallback, inject minimal inline styles to ensure images and body don't overflow
    const existingStyle = doc.querySelector('style[data-mobile-inline="true"]');
    if (!existingStyle) {
      const style = doc.createElement('style');
      style.setAttribute('data-mobile-inline', 'true');
      style.textContent = `
        html, body { max-width: 100%; overflow-x: hidden; -webkit-text-size-adjust: 100%; }
        *, *::before, *::after { box-sizing: border-box; }
        img, video, canvas, svg { max-width: 100%; height: auto; }
        iframe { max-width: 100%; }
      `;
      doc.head.appendChild(style);
    }
  } catch (e) {
    // Silently ignore to avoid breaking module loading
    console.warn('Mobile override injection failed:', e);
  }
}
