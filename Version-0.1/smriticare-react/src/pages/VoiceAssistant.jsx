import { useEffect, useRef, useState } from "react";
import { useCompanionContext } from "../context/CompanionContext";
import { useReminders } from "../hooks/useReminders";
import LanguageSelector from "../components/LanguageSelector";

function computeReply(transcript, nextReminder) {
  const t = transcript.toLowerCase();
  if (t.includes('today') || t.includes('reminder')) {
    if (!nextReminder) return "You have no reminders right now. You're all caught up.";
    return `Your next reminder is at ${nextReminder.scheduledTime}. It is time for ${nextReminder.title.toLowerCase()}.`;
  }
  if (t.includes('help')) {
    return "I'll let your caregiver know you need help. You can also open the Caregiver page to contact them directly.";
  }
  if (t.includes('activity') || t.includes('game')) {
    return "You can start today's Memory Recall activity from the Activities page.";
  }
  return "I'm still learning to understand that. You can ask what you need to do today, or ask for help.";
}

const SpeechRecognitionClass = typeof window !== 'undefined'
  ? (window.SpeechRecognition || window.webkitSpeechRecognition)
  : null;

export default function VoiceAssistant() {
  const companion = useCompanionContext();
  const { currentLang, setCurrentLang, speak, speaking } = companion;
  const { nextReminder } = useReminders();
  const [status, setStatus] = useState('idle'); // idle | listening | processing | error
  const [transcript, setTranscript] = useState([]); // [{ from: 'you'|'assistant', text }]
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!SpeechRecognitionClass) return;
    const recognition = new SpeechRecognitionClass();
    recognition.lang = currentLang.bcp;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const heard = event.results[0][0].transcript;
      setStatus('processing');
      setTranscript(t => [...t, { from: 'you', text: heard }]);
      setTimeout(() => {
        const reply = computeReply(heard, nextReminder);
        setTranscript(t => [...t, { from: 'assistant', text: reply }]);
        speak(reply, currentLang);
        setStatus('idle');
      }, 500);
    };
    recognition.onerror = () => setStatus('error');
    recognition.onend = () => setStatus(s => (s === 'listening' ? 'idle' : s));

    recognitionRef.current = recognition;
  }, [currentLang, nextReminder, speak]);

  const handleMicTap = () => {
    if (!SpeechRecognitionClass) { setStatus('error'); return; }
    if (status === 'listening') {
      recognitionRef.current.stop();
      setStatus('idle');
      return;
    }
    setStatus('listening');
    recognitionRef.current.start();
  };

  const statusLabel = {
    idle: 'Tap to speak',
    listening: 'Listening…',
    processing: 'Understanding…',
    error: SpeechRecognitionClass ? 'Please try again.' : 'Voice input isn\u2019t supported in this browser — try Chrome.'
  }[speaking ? 'speaking' : status] || (speaking ? 'Speaking…' : 'Tap to speak');

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Voice Assistant</h1>

      <div className="mb-6 max-w-xs">
        <label className="block text-xs font-bold text-ink/50 mb-1">Language</label>
        <LanguageSelector currentLang={currentLang} setCurrentLang={setCurrentLang} />
      </div>

      <div className="bg-card border border-border rounded-lg py-10 flex flex-col items-center mb-8">
        <p className="font-bold text-lg mb-6">How can I help?</p>
        <button
          onClick={handleMicTap}
          className={`w-24 h-24 rounded-full flex items-center justify-center border-2 ${
            status === 'listening' ? 'border-navy bg-navy/10 mic-listening' : 'border-navy bg-navy'
          }`}
        >
          <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" stroke={status === 'listening' ? '#22345C' : 'white'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
          </svg>
        </button>
        <p className="mt-4 text-sm font-semibold text-ink/60">{statusLabel}</p>
      </div>

      <section>
        <h2 className="text-lg font-bold mb-3">Recent conversation</h2>
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {transcript.length === 0 && (
            <p className="px-4 py-6 text-sm text-ink/50 text-center">Nothing yet — tap the microphone to start.</p>
          )}
          {transcript.slice(-6).map((entry, i) => (
            <div key={i} className="px-4 py-3">
              <p className="text-xs font-bold text-ink/40 mb-0.5">{entry.from === 'you' ? 'You' : 'Assistant'}</p>
              <p className="text-sm">{entry.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => transcript.length && speak(transcript[transcript.length - 1].text, currentLang)}
          className="border border-border font-bold rounded-md px-4 py-2 text-sm"
        >
          Replay
        </button>
        <button
          onClick={() => window.speechSynthesis && window.speechSynthesis.cancel()}
          className="border border-border font-bold rounded-md px-4 py-2 text-sm"
        >
          Stop
        </button>
      </div>
    </div>
  );
}
