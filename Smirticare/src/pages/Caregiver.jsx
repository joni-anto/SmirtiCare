import { useState } from "react";
import { useStore } from "../hooks/useStore";

export default function Caregiver() {
  const { queue, addEvent } = useStore();
  const [messageSent, setMessageSent] = useState(false);
  const instructions = queue.filter(e => e.type === 'caregiver_message' || e.type === 'medicine_ack');

  const logDemo = async (type, payload) => {
    await addEvent(type, payload);
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Caregiver</h1>

      <div className="bg-card border border-border rounded-lg p-5 mb-6">
        <p className="text-xs font-bold text-ink/50 mb-1">CONNECTED CAREGIVER</p>
        <p className="font-bold text-lg">Rina Devi</p>
        <p className="text-sm text-ink/60 mb-1">Daughter</p>
        <p className="text-sm font-semibold text-success">● Online</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <button
          onClick={() => logDemo('caregiver_call', {})}
          className="bg-navy text-white font-bold rounded-md py-3 text-sm"
        >
          Call
        </button>
        <button
          onClick={() => { logDemo('caregiver_message', { text: 'Checking in' }); setMessageSent(true); setTimeout(() => setMessageSent(false), 3000); }}
          className="bg-card border border-border font-bold rounded-md py-3 text-sm"
        >
          Send Message
        </button>
        <button
          onClick={() => logDemo('help_request', {})}
          className="bg-alert/10 border border-alert text-alert font-bold rounded-md py-3 text-sm"
        >
          Request Help
        </button>
      </div>
      {messageSent && <p className="text-sm text-success font-semibold mb-6">Message sent to your caregiver.</p>}
      <p className="text-xs text-ink/40 mb-8">
        These actions log an event for the demo — real calling/messaging infrastructure is a later phase.
      </p>

      <h2 className="text-lg font-bold mb-3">Recent caregiver instructions</h2>
      <div className="bg-card border border-border rounded-lg divide-y divide-border">
        {instructions.length === 0 && (
          <p className="px-4 py-6 text-sm text-ink/50 text-center">No recent instructions.</p>
        )}
        {instructions.map(item => (
          <div key={item.id} className="px-4 py-3">
            <p className="text-sm font-semibold">{item.type === 'medicine_ack' ? 'Medicine reminder acknowledged' : 'Message sent'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
