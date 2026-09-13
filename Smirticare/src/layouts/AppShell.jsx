import { NavLink, Outlet } from "react-router-dom";
import LanguageSelector from "../components/LanguageSelector";
import { useCompanionContext } from "../context/CompanionContext";
import logo from "../assets/logo.jpg";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/reminders", label: "Reminders" },
  { to: "/activities", label: "Activities" },
  { to: "/voice", label: "Voice Assistant" },
  { to: "/caregiver", label: "Caregiver" },
  { to: "/settings", label: "Settings" }
];

// Same six destinations, shortened for the mobile bottom bar per the brief.
const MOBILE_NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/activities", label: "Activities" },
  { to: "/voice", label: "Voice" },
  { to: "/reminders", label: "Reminders" },
  { to: "/settings", label: "More" }
];

function NavIcon({ label }) {
  const common = { viewBox: "0 0 24 24", className: "w-5 h-5", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (label) {
    case "Home": return <svg {...common}><path d="M4 11.5 12 4l8 7.5" /><path d="M6.5 10v9a1 1 0 0 0 1 1H10v-5.5h4V20h2.5a1 1 0 0 0 1-1v-9" /></svg>;
    case "Reminders": return <svg {...common}><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></svg>;
    case "Activities": return <svg {...common}><path d="M5 19c8-1 12-6 13-13-8 1-13 5-13 13Z" /><path d="M6 18c3-5 6-8 11-11" /></svg>;
    case "Voice": case "Voice Assistant": return <svg {...common}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>;
    case "Caregiver": return <svg {...common}><circle cx="12" cy="8" r="3.2" /><path d="M5 20c1.5-4 4.2-6 7-6s5.5 2 7 6" /></svg>;
    case "Settings": case "More": return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M4 12h2M18 12h2M12 4v2M12 18v2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4" /></svg>;
    default: return null;
  }
}

export default function AppShell() {
  const companion = useCompanionContext();

  return (
    <div className="min-h-screen bg-ivory text-ink flex">
      {/* Desktop sidebar (1024px+) */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card px-4 py-6 flex-shrink-0">
        <div className="flex items-center gap-2 px-2 mb-8">
          <img src={logo} alt="SmritiCare" className="w-9 h-9 rounded-full object-cover" />
          <span className="font-bold text-lg text-navy">SmritiCare</span>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold ${
                  isActive ? 'bg-navy text-white' : 'text-ink/80 hover:bg-ivory'
                }`
              }
            >
              <NavIcon label={item.label} /> {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-border">
          <LanguageSelector variant="list" currentLang={companion.currentLang} setCurrentLang={companion.setCurrentLang} />
        </div>
      </aside>

      {/* Tablet navigation rail (768–1023px) */}
      <aside className="hidden md:flex lg:hidden flex-col items-center w-20 border-r border-border bg-card py-6 flex-shrink-0">
        <img src={logo} alt="SmritiCare" className="w-8 h-8 rounded-full object-cover mb-6" />
        <nav className="flex flex-col gap-2 flex-1">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-2.5 rounded-md text-[10px] font-semibold w-16 text-center ${
                  isActive ? 'bg-navy text-white' : 'text-ink/70 hover:bg-ivory'
                }`
              }
            >
              <NavIcon label={item.label} />
              {item.label.split(' ')[0]}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar: mobile logo + language, and desktop language/profile corner */}
        <header className="flex items-center justify-between px-4 md:px-8 py-3 border-b border-border bg-card md:bg-transparent">
          <div className="flex items-center gap-2 md:hidden">
            <img src={logo} alt="SmritiCare" className="w-7 h-7 rounded-full object-cover" />
            <span className="font-bold text-navy">SmritiCare</span>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-xs font-semibold text-ink/50">
              {companion.currentLang.label}
            </span>
            <LanguageSelector currentLang={companion.currentLang} setCurrentLang={companion.setCurrentLang} />
          </div>
        </header>

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-6 pb-24 md:pb-10">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navigation (below 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex z-40">
        {MOBILE_NAV_ITEMS.map(item => (
          <NavLink
            key={item.to} to={item.to} end={item.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${
                isActive ? 'text-navy' : 'text-ink/50'
              }`
            }
          >
            <NavIcon label={item.label} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
