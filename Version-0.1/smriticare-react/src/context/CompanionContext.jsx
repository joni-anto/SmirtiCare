import { createContext, useContext } from "react";
import { useCompanion } from "../hooks/useCompanion";

const CompanionContext = createContext(null);

export function CompanionProvider({ children }) {
  const companion = useCompanion();
  return <CompanionContext.Provider value={companion}>{children}</CompanionContext.Provider>;
}

export function useCompanionContext() {
  const ctx = useContext(CompanionContext);
  if (!ctx) throw new Error("useCompanionContext must be used inside CompanionProvider");
  return ctx;
}
