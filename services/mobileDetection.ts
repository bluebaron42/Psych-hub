export function detectIsMobile(): boolean {
  // Prefer UA-CH when available
  const uaData = (navigator as any).userAgentData;
  if (uaData && typeof uaData.mobile === 'boolean') {
    return uaData.mobile;
  }

  const ua = navigator.userAgent || '';
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  // Common mobile indicators
  const mobileHints = /(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/i.test(ua);

  // Narrow viewport heuristic
  const narrow = Math.min(window.innerWidth, window.innerHeight) <= 850;

  return Boolean(mobileHints || (isTouch && narrow));
}

export function onViewportChange(cb: () => void) {
  const handler = () => cb();
  window.addEventListener('resize', handler);
  window.addEventListener('orientationchange', handler);
  return () => {
    window.removeEventListener('resize', handler);
    window.removeEventListener('orientationchange', handler);
  };
}
