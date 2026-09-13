import { useCallback, useEffect, useRef, useState } from "react";

const SYMBOL_POOL = ['🍃', '🐘', '⛰️', '🌸', '☔', '🎋', '🦚', '🧣', '🪈', '🐅', '🌾', '🕊️'];
const PAIRS_BY_LEVEL = { 1: 2, 2: 3, 3: 4, 4: 6, 5: 8 };

function buildDeck(level) {
  const pairs = PAIRS_BY_LEVEL[level];
  const chosen = SYMBOL_POOL.slice(0, pairs);
  return [...chosen, ...chosen]
    .map((sym, i) => ({ id: i, sym, matched: false }))
    .sort(() => Math.random() - 0.5);
}

export function useGame(onRoundComplete) {
  const [level, setLevel] = useState(2);
  const [deck, setDeck] = useState(() => buildDeck(2));
  const [flipped, setFlipped] = useState([]); // array of card ids currently face-up, unmatched
  const [mistakes, setMistakes] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [locked, setLocked] = useState(false);
  const [message, setMessage] = useState('Tap two cards to find a matching pair.');
  const startRef = useRef(Date.now());
  const timerRef = useRef(null);

  const newRound = useCallback((atLevel) => {
    setDeck(buildDeck(atLevel));
    setFlipped([]);
    setMistakes(0);
    setElapsed(0);
    setLocked(false);
    setMessage('Tap two cards to find a matching pair.');
    startRef.current = Date.now();
  }, []);

  useEffect(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsed((Date.now() - startRef.current) / 1000);
    }, 100);
    return () => clearInterval(timerRef.current);
  }, [deck]);

  const flip = useCallback((id) => {
    if (locked) return;
    const card = deck.find(c => c.id === id);
    if (!card || card.matched || flipped.includes(id)) return;

    const nextFlipped = [...flipped, id];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setLocked(true);
      const [aId, bId] = nextFlipped;
      const a = deck.find(c => c.id === aId);
      const b = deck.find(c => c.id === bId);

      if (a.sym === b.sym) {
        const updated = deck.map(c => (c.id === aId || c.id === bId) ? { ...c, matched: true } : c);
        setDeck(updated);
        setFlipped([]);
        setLocked(false);

        const pairs = PAIRS_BY_LEVEL[level];
        const nowMatched = updated.filter(c => c.matched).length / 2;
        if (nowMatched === pairs) {
          clearInterval(timerRef.current);
          const timeTaken = (Date.now() - startRef.current) / 1000;
          const fast = pairs * 3, slow = pairs * 6;
          let nextLevel = level;
          let note;
          if (mistakes <= 1 && timeTaken < fast && level < 5) {
            nextLevel = level + 1;
            note = `moved up to level ${nextLevel}`;
          } else if ((mistakes >= 4 || timeTaken > slow) && level > 1) {
            nextLevel = level - 1;
            note = `eased down to level ${nextLevel}`;
          } else {
            note = `staying at level ${level}`;
          }
          setMessage(`Round done in ${timeTaken.toFixed(1)}s, ${mistakes} misses — ${note}.`);
          setLevel(nextLevel);
          onRoundComplete && onRoundComplete({ level: nextLevel, timeTaken, mistakes });
          setTimeout(() => newRound(nextLevel), 2200);
        }
      } else {
        setMistakes(m => m + 1);
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 700);
      }
    }
  }, [deck, flipped, locked, level, mistakes, newRound, onRoundComplete]);

  const restart = useCallback(() => newRound(level), [level, newRound]);

  return { deck, flipped, level, mistakes, elapsed, message, flip, restart };
}
