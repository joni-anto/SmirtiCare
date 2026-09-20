import { Routes, Route } from "react-router-dom";
import AppShell from "./layouts/AppShell";
import { CompanionProvider } from "./context/CompanionContext";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import Home from "./pages/Home";
import Reminders from "./pages/Reminders";
import Activities from "./pages/Activities";
import VoiceAssistant from "./pages/VoiceAssistant";
import Caregiver from "./pages/Caregiver";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <AccessibilityProvider>
      <CompanionProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/voice" element={<VoiceAssistant />} />
            <Route path="/caregiver" element={<Caregiver />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </CompanionProvider>
    </AccessibilityProvider>
  );
}
