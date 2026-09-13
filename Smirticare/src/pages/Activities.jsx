import { useState } from "react";
import { useStore } from "../hooks/useStore";
import { useGame } from "../hooks/useGame";

const CATEGORIES = ["Memory", "Words", "Numbers", "Matching", "Stories", "Culture"];

function MemoryGame({ addEvent, onBack }) {
  const { deck, flipped, level, mistakes, elapsed, message, flip, restart } = useGame(
    (result) => addEvent('game_result', result)
  );
  const pairs = { 1: 2, 2: 3, 3: 4, 4: 6, 5: 8 }[level];
  const cols = pairs <= 3 ? pairs : (pairs <= 6 ? Math.ceil(deck.length / 2) : Math.ceil(deck.length / 3));

  return (
    <div>
      <button onClick={onBack} className="text-sm font-bold text-navy mb-4">&larr; Back to Activities</button>
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map(i => (
              <span key={i} className={`w-2.5 h-2.5 rounded-full ${i <= level ? 'bg-navy' : 'bg-border'}`} />
            ))}
          </div>
          <div className="flex gap-4 text-sm font-bold text-ink/60">
            <span>{elapsed.toFixed(1)}s</span>
            <span>{mistakes} miss</span>
          </div>
        </div>
        <div className="grid gap-2.5 justify-center mb-3" style={{ gridTemplateColumns: `repeat(${Math.min(cols, 5)}, 60px)` }}>
          {deck.map(card => {
            const isFaceUp = card.matched || flipped.includes(card.id);
            return (
              <button
                key={card.id}
                onClick={() => flip(card.id)}
                className={`w-[60px] h-[60px] rounded-md flex items-center justify-center text-2xl border ${
                  card.matched ? 'bg-success/10 border-success' : isFaceUp ? 'bg-navy text-white border-navy' : 'bg-ivory border-border'
                }`}
              >
                {isFaceUp ? card.sym : ''}
              </button>
            );
          })}
        </div>
        <p className="text-center font-semibold text-ink/60 min-h-[1.4em]">{message}</p>
        <button onClick={restart} className="block mx-auto mt-3 border border-border font-bold rounded-md px-5 py-2 text-sm">
          Restart round
        </button>
      </div>
    </div>
  );
}

export default function Activities() {
  const { addEvent } = useStore();
  const [activeCategory, setActiveCategory] = useState("Memory");
  const [playing, setPlaying] = useState(false);

  if (playing) return <MemoryGame addEvent={addEvent} onBack={() => setPlaying(false)} />;

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-1">Cognitive Activities</h1>
      <p className="text-ink/60 mb-6">Keep your mind active with simple daily activities.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-3 py-1.5 rounded-md text-sm font-semibold border ${
              activeCategory === c ? 'bg-navy border-navy text-white' : 'bg-card border-border text-ink/70'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeCategory === "Memory" && (
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="font-bold mb-1">Memory Recall</p>
            <p className="text-xs text-ink/50 mb-2">5 minutes</p>
            <p className="text-sm text-ink/70 mb-4">Remember a sequence of pictures.</p>
            <button onClick={() => setPlaying(true)} className="bg-navy text-white text-sm font-bold rounded-md px-4 py-2">
              Start
            </button>
          </div>
        )}
        {activeCategory === "Culture" && (
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="font-bold mb-1">Regional Culture Quiz</p>
            <p className="text-xs text-ink/50 mb-2">5 minutes</p>
            <p className="text-sm text-ink/70 mb-4">Questions about Northeast Indian culture.</p>
            <button disabled className="bg-border text-ink/40 text-sm font-bold rounded-md px-4 py-2 cursor-not-allowed">
              Coming soon
            </button>
          </div>
        )}
        {activeCategory !== "Memory" && activeCategory !== "Culture" && (
          <div className="bg-card border border-border rounded-lg p-5 sm:col-span-2 lg:col-span-3">
            <p className="text-sm text-ink/50">
              {activeCategory} activities are planned for a later phase — not built yet, shown here
              so the category structure is visible for review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
