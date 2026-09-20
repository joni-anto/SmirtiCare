import { useCallback, useEffect, useState } from "react";

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

  const speak = useCallback((text, lang) => {
    if (!window.speechSynthesis || !voiceEnabled) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang.bcp;
    const voice = pickVoiceFor(lang);
    if (voice) utter.voice = voice;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }, [voiceEnabled]);

  return { currentLang, setCurrentLang, speaking, voiceStatus, speak, voiceEnabled, setVoiceEnabled };
}
