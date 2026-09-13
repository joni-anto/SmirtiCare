/**
 * ttsClient.js
 * Talks to YOUR backend proxy (never a TTS provider directly from the
 * browser — that would expose your API key to anyone who opens DevTools).
 *
 * Point NEURAL_TTS_ENDPOINT at a small server function you control, which
 * itself calls Sarvam/AI4Bharat/Google/Azure with the key held server-side,
 * and returns raw audio bytes.
 */
const NEURAL_TTS_ENDPOINT = import.meta.env.VITE_TTS_ENDPOINT || null;

export async function fetchNeuralTTS(text, bcpLang) {
  if (!NEURAL_TTS_ENDPOINT) {
    throw new Error('No TTS endpoint configured (VITE_TTS_ENDPOINT unset)');
  }
  const res = await fetch(NEURAL_TTS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, lang: bcpLang })
  });
  if (!res.ok) throw new Error(`TTS request failed: ${res.status}`);
  const audioBlob = await res.blob();
  return URL.createObjectURL(audioBlob);
}
