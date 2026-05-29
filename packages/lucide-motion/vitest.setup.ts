import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement matchMedia, which motion's `useReducedMotion`
// reads. Default to "no reduced motion" so render tests that don't care
// about the OS preference behave normally; tests that need reduced motion
// use the `reducedMotion="always"` prop, which bypasses matchMedia.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}
