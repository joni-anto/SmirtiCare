import { useState } from "react";
import { useCompanionContext } from "../context/CompanionContext";

function ToggleRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-sm font-semibold">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full relative transition-colors ${value ? 'bg-navy' : 'bg-border'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${value ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

function SelectRow({ label, value, options, onChange }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-sm font-semibold">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} className="text-sm border border-border rounded-md px-2 py-1">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function Settings() {
  const { voiceEnabled, setVoiceEnabled } = useCompanionContext();
  const [autoDetect, setAutoDetect] = useState(true);
  const [speed, setSpeed] = useState('Normal');
  const [volume, setVolume] = useState('80%');
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Settings</h1>

      <h2 className="text-xs font-bold uppercase tracking-wide text-ink/40 mb-2">Voice Assistant</h2>
      <div className="bg-card border border-border rounded-lg divide-y divide-border mb-6">
        <ToggleRow label="Voice enabled" value={voiceEnabled} onChange={setVoiceEnabled} />
        <ToggleRow label="Auto language detection" value={autoDetect} onChange={setAutoDetect} />
        <SelectRow label="Speech speed" value={speed} options={["Slow", "Normal", "Fast"]} onChange={setSpeed} />
        <SelectRow label="Voice volume" value={volume} options={["50%", "80%", "100%"]} onChange={setVolume} />
      </div>
      <p className="text-xs text-ink/40 mb-6 px-1">
        "Voice enabled" is fully wired — turn it off and the assistant stays silent everywhere in the
        app. Speed and volume are shown for the settings layout but not yet connected to the real
        speech engine.
      </p>

      <h2 className="text-xs font-bold uppercase tracking-wide text-ink/40 mb-2">Accessibility</h2>
      <div className="bg-card border border-border rounded-lg divide-y divide-border mb-6">
        <ToggleRow label="Large text" value={largeText} onChange={setLargeText} />
        <ToggleRow label="High contrast" value={highContrast} onChange={setHighContrast} />
      </div>
    </div>
  );
}
