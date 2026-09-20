import { useState } from "react";
import { useReminders } from "../hooks/useReminders";
import { LANGUAGES } from "../hooks/useCompanion";

const TABS = ["Today", "Upcoming", "Completed"];
const REMINDER_TYPES = ['medicine', 'appointment', 'meal', 'water', 'exercise', 'custom'];

function AddReminderForm({ addReminder, onClose }) {
  const [title, setTitle] = useState('Morning Medicine');
  const [description, setDescription] = useState('Take your morning medication.');
  const [type, setType] = useState('medicine');
  const [scheduledTime, setScheduledTime] = useState('08:00');
  const [repeatPattern, setRepeatPattern] = useState('daily');
  const [language, setLanguage] = useState(LANGUAGES[0].code);
  const [saving, setSaving] = useState(false);
  const inputClass = "w-full border border-border rounded-md px-3 py-2 text-sm focus:border-navy focus:outline-none";

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await addReminder({ title, description, type, scheduledTime, repeatPattern, language, voiceEnabled: true });
    setSaving(false);
    onClose();
  };

  return (
    <form onSubmit={handleSave} className="bg-card border border-border rounded-lg p-5 mb-6">
      <h3 className="font-bold mb-4">Add Reminder</h3>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-bold text-ink/50 mb-1">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-bold text-ink/50 mb-1">Time</label>
          <input type="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} className={inputClass} />
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-xs font-bold text-ink/50 mb-1">Description</label>
        <input value={description} onChange={e => setDescription(e.target.value)} className={inputClass} />
      </div>
      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-xs font-bold text-ink/50 mb-1">Type</label>
          <select value={type} onChange={e => setType(e.target.value)} className={inputClass}>
            {REMINDER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-ink/50 mb-1">Repeat</label>
          <select value={repeatPattern} onChange={e => setRepeatPattern(e.target.value)} className={inputClass}>
            <option value="daily">Every day</option>
            <option value="once">Once</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-ink/50 mb-1">Language</label>
          <select value={language} onChange={e => setLanguage(e.target.value)} className={inputClass}>
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="bg-navy text-white font-bold rounded-md px-4 py-2 text-sm disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Reminder'}
        </button>
        <button type="button" onClick={onClose} className="border border-border font-bold rounded-md px-4 py-2 text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function Reminders() {
  const { reminders, addReminder, markDone } = useReminders();
  const [tab, setTab] = useState("Today");
  const [showForm, setShowForm] = useState(false);

  const filtered = reminders.filter(r => {
    if (tab === "Completed") return r.status === "completed";
    if (tab === "Upcoming") return r.status === "snoozed";
    return r.status === "pending";
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">My Reminders</h1>
        <button
          onClick={() => setShowForm(v => !v)}
          className="bg-navy text-white text-sm font-bold rounded-md px-4 py-2"
        >
          + Add Reminder
        </button>
      </div>

      {showForm && <AddReminderForm addReminder={addReminder} onClose={() => setShowForm(false)} />}

      <div className="flex gap-1 mb-4 border-b border-border">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-bold border-b-2 -mb-px ${
              tab === t ? 'border-navy text-navy' : 'border-transparent text-ink/50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg divide-y divide-border">
        {filtered.length === 0 && (
          <p className="px-4 py-6 text-sm text-ink/50 text-center">Nothing here yet.</p>
        )}
        {filtered.map(r => (
          <div key={r.id} className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="font-bold">{r.scheduledTime} &nbsp; {r.title}</p>
              <p className="text-sm text-ink/50">{r.repeatPattern === 'daily' ? 'Every day' : 'Once'}</p>
            </div>
            {r.status !== 'completed' && (
              <button
                onClick={() => markDone(r.id)}
                className="text-sm font-bold border border-border rounded-md px-3 py-1.5 hover:bg-ivory flex-shrink-0"
              >
                Complete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
