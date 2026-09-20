import { createContext, useContext, useEffect, useState } from "react";

const AccessibilityContext = createContext(null);

export function AccessibilityProvider({ children }) {
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Scaling the root font-size affects every Tailwind text-* utility at
  // once, since they're all rem-based — this is what makes "Large text"
  // actually enlarge every page instead of doing nothing.
  useEffect(() => {
    document.documentElement.style.fontSize = largeText ? '118%' : '';
  }, [largeText]);

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  return (
    <AccessibilityContext.Provider value={{ largeText, setLargeText, highContrast, setHighContrast }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used inside AccessibilityProvider");
  return ctx;
}
