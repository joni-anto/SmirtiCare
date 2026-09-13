import { useCallback, useEffect, useRef, useState } from "react";
import { fetchNeuralTTS } from "../services/ttsClient";

export const LANGUAGES = [
  { code: 'en', label: 'English', bcp: 'en-US', text: "Good morning. I'm here whenever you'd like to talk or play." },
  { code: 'as', label: 'অসমীয়া', bcp: 'as-IN', text: 'শুভ ৰাতিপুৱা। আপুনি যেতিয়াই কথা পাতিব বিচাৰে, মই ইয়াতে আছোঁ।' },
  { code: 'brx', label: 'बड़ो', bcp: 'brx-IN', text: 'सानसे! नों जायखि खोमोरनो हागोन, आं दं।' },
  { code: 'kha', label: 'Khasi', bcp: 'kha', text: 'Khublei. Nga don shaphrang ban ïalade katba phi kwah.' },
  { code: 'mni', label: 'ꯃꯤꯇꯩꯂꯣꯟ', bcp: 'mni-IN', text: 'নুংশিৎলগী নমস্কার। নহাক্না মখোয় মথৌ তারবা মতমদা ঐহাক্না লৈরি।' },
  { code: 'lus', label: 'Mizo ṭawng', bcp: 'lus', text: 'Chibai. In beisei apiangin, ka awm reng ang.' }
];

function pickVoiceFor(lang) {
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find(v => v.lang && v.lang.toLowerCase().startsWith(lang.bcp.split('-')[0].toLowerCase())) || null;
}

export function useCompanion() {
  const [currentLang, setCurrentLang] = useState(LANGUAGES[0]);
  const [speaking, setSpeaking] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const intervalRef = useRef(null);

  const refreshVoiceStatus = useCallback((lang) => {
    const voice = pickVoiceFor(lang);
    setVoiceStatus(
      voice
        ? `Browser voice found for ${lang.label} (${voice.name}) — will speak aloud.`
        : `No browser voice installed for ${lang.label} — caption shown, production build uses a real regional TTS model instead.`
    );
  }, []);

  useEffect(() => {
    refreshVoiceStatus(currentLang);
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => refreshVoiceStatus(currentLang);
    }
  }, [currentLang, refreshVoiceStatus]);

  // Browser TTS — always available offline, but voice coverage for most
  // NER languages is spotty depending on the device.
  const speakWithBrowserVoice = useCallback((text, lang) => {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang.bcp;
    const voice = pickVoiceFor(lang);
    if (voice) utter.voice = voice;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }, []);

  // Neural TTS first (real regional voice quality), falling back to the
  // browser voice if there's no connection, no endpoint configured yet,
  // or the request fails for any reason. This fallback is not optional —
  // the whole point of this app is working without a connection, so
  // voice output can never hard-depend on a network call.
  const speak = useCallback(async (text, lang) => {
    if (!voiceEnabled) return;
    setSpeaking(true);
    try {
      const audioUrl = await fetchNeuralTTS(text, lang.bcp);
      const audio = new Audio(audioUrl);
      audio.onended = () => setSpeaking(false);
      audio.onerror = () => { setSpeaking(false); speakWithBrowserVoice(text, lang); };
      await audio.play();
    } catch (e) {
      // Expected in three real cases: offline, endpoint not set up yet,
      // or the provider call failed — silently degrade, don't break voice.
      speakWithBrowserVoice(text, lang);
    }
  }, [voiceEnabled, speakWithBrowserVoice]);

  // Ambient proactive check-in — the assistant speaks on its own cadence,
  // not only when tapped. Demo cadence is fast (45s) so it's visible live.
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      speak(currentLang.text, currentLang);
    }, 45000);
    return () => clearInterval(intervalRef.current);
  }, [currentLang, speak]);

  return { currentLang, setCurrentLang, speaking, voiceStatus, speak, voiceEnabled, setVoiceEnabled };
}
