import { Link } from "react-router-dom";
import { useCompanionContext } from "../context/CompanionContext";
import { useReminders } from "../hooks/useReminders";

export default function Home() {
  const companion = useCompanionContext();
  const { reminders, nextReminder, markDone } = useReminders();
  const todaysReminders = reminders.filter(r => r.status !== 'completed').slice(0, 2);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-1">Good morning</h1>
      <p className="text-ink/60 mb-6">How can we help you today?</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <Link to="/voice" className="bg-navy text-white rounded-lg px-5 py-4 font-bold text-center hover:bg-navyDark">
          Speak
        </Link>
        <Link to="/reminders" className="bg-card border border-border rounded-lg px-5 py-4 font-bold text-center hover:bg-ivory">
          My Reminders
        </Link>
        <Link to="/activities" className="bg-card border border-border rounded-lg px-5 py-4 font-bold text-center hover:bg-ivory">
          Activities
        </Link>
      </div>

      <div className="woven-divider rounded-full mb-8" />

      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Today's Reminders</h2>
          <Link to="/reminders" className="text-sm font-semibold text-navy">View all</Link>
        </div>
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {todaysReminders.length === 0 && (
            <p className="px-4 py-4 text-sm text-ink/50">No reminders right now.</p>
          )}
          {todaysReminders.map(r => (
            <div key={r.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-bold text-sm">{r.scheduledTime} &nbsp; {r.title}</p>
                <p className="text-xs text-ink/50">{r.description}</p>
              </div>
              <button
                onClick={() => markDone(r.id)}
                className="text-xs font-bold border border-border rounded-md px-3 py-1.5 hover:bg-ivory"
              >
                Complete
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">Today's Activity</h2>
        <div className="bg-card border border-border rounded-lg px-5 py-4 flex items-center justify-between">
          <div>
            <p className="font-bold">Memory Recall</p>
            <p className="text-sm text-ink/60">Complete today's 5-minute activity.</p>
          </div>
          <Link to="/activities" className="bg-navy text-white text-sm font-bold rounded-md px-4 py-2 flex-shrink-0">
            Start
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">Caregiver</h2>
        <div className="bg-card border border-border rounded-lg px-5 py-4 flex items-center justify-between">
          <p className="text-sm text-ink/70">Your caregiver is available.</p>
          <Link to="/caregiver" className="border border-border text-sm font-bold rounded-md px-4 py-2 flex-shrink-0 hover:bg-ivory">
            Contact
          </Link>
        </div>
      </section>
    </div>
  );
}
