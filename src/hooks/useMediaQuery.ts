import { useState, useEffect } from "react";

/**
 * Custom hook to check if a media query matches
 * @param query The media query to check, e.g. '(max-width: 640px)'
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    // Check if window is defined (for SSR)
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    // Skip in SSR context
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);

    // Initial check
    setMatches(mediaQuery.matches);

    // Event listener callback
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    // Older browsers
    else {
      // @ts-ignore - older browsers support
      mediaQuery.addListener(handleChange);
      return () => {
        // @ts-ignore - older browsers support
        mediaQuery.removeListener(handleChange);
      };
    }
  }, [query]);

  return matches;
}
