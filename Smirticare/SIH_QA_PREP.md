# SmritiCare — Technical Q&A Prep for SIH Judges

Organized by theme. Practice saying these out loud, in your own words —
memorized answers sound memorized. Where relevant, a "if they push
further" line tells you the honest next-level answer.

---

## Architecture & Tech Choices

**Q: Why Firebase instead of building your own backend?**
A: Three reasons specific to our context. First, Firestore has real
offline persistence and real-time sync built in — for rural Northeast
India where connectivity is unreliable, that's not a nice-to-have, it's
the core requirement. Second, it's serverless, so we're not managing
infrastructure as a small team under hackathon time pressure. Third, it
scales without us re-architecting — Google handles the scaling layer.
*If pushed:* We did build a custom Node/Express/SQLite backend first
and moved off it deliberately once we hit native-compilation friction
on Windows dev machines — Firebase removed that entire class of problem.

**Q: Why React instead of a simpler framework, or plain JavaScript?**
A: We actually started with plain HTML/CSS/JS for speed. We moved to
React once the app grew multiple pages and shared state (like the
selected language affecting every screen) — React's component model
and hooks made that maintainable. It's also the most common frontend
skill on our team, which matters for actually shipping.

**Q: Why not a native Android app (Kotlin/Java) instead of a web app wrapped in Capacitor?**
A: Speed of iteration and single codebase — one React codebase serves
web, and Capacitor wraps the same code for Android without a rewrite.
The trade-off is native apps can get slightly deeper OS integration
(e.g. more reliable background notifications), which is why our roadmap
has native local notifications as a specific next step, not something
we're pretending already works perfectly.

**Q: Is this actually AI? Where's the AI in "AI-based cognitive gaming"?**
A: We're upfront that not everything is machine-learning-based. The
adaptive game difficulty is a transparent rule engine — time and mistake
thresholds, not a trained model — chosen deliberately because it's fast,
explainable, and needs no training data to work correctly on day one.
The genuinely AI-adjacent piece is the Voice Assistant's speech
recognition (browser-native ASR) and text-to-speech. If the judges want
to see real ML, our honest answer is: that's a roadmap item, likely for
detecting engagement patterns over time — not implemented yet, and we
won't claim otherwise.

---

## Offline & Sync

**Q: How does offline mode actually work? Prove it's not simulated.**
A: Firestore caches reads and writes locally in the browser automatically.
When the app writes an event with no connection, it's saved to local
cache instantly and the UI updates immediately — then Firestore syncs it
to the server the moment connectivity returns, with zero code from us
managing that queue by hand. You can watch it live: open DevTools,
Network tab, set to "Offline," interact with the app, then switch back
to "Online" and watch the sync badge flip in real time.

**Q: What happens if two people edit the same reminder while both offline?**
A: Firestore's default conflict resolution is last-write-wins based on
timestamp. For this Phase 1, that's an acceptable trade-off since one
patient typically has one active caregiver at a time. *If pushed:* proper
multi-caregiver conflict handling is a Phase 3 item once real
multi-caregiver linking exists.

**Q: Does the reminder actually fire if the phone is off/app is closed?**
A: Not yet, and we're honest about that — right now reminders display
when the app is open. Real background firing needs native on-device
scheduled notifications (we've scaffolded the Capacitor Local
Notifications plugin for this), which is the next concrete build step,
not yet wired into the reminder flow.

---

## Voice & Language

**Q: How many languages do you actually support, fully working?**
A: Text/UI and reminder logic work in all six languages we've listed
(English, Assamese, Bodo, Khasi, Manipuri, Mizo). For actual spoken
voice: English works everywhere via any browser. Assamese, Bodo, and
Manipuri have a real path to genuine neural voice via AI4Bharat's
open-source Indic-TTS model — verified, not assumed. Khasi and Mizo
currently have **no** TTS solution from any provider we found — commercial
or open-source — because neither is among India's 22 constitutionally
scheduled languages, which is exactly why NLP tooling skips them. We say
this directly rather than claim voice support we can't back up.

**Q: Why not use [some commercial TTS service] then?**
A: We checked specifically — most commercial Indian-language TTS
(Sarvam's Bulbul, Google, Azure) cover 10-11 mainstream languages and
don't include Assamese, Bodo, Manipuri, Khasi, or Mizo at all. AI4Bharat's
open-source Indic-TTS is the one option that actually covers three of
our six — but it's self-hosted, not a hosted API, so integrating it is
real infrastructure work, correctly scoped as a next phase rather than
something we'd fake having today.

**Q: Why not use a proper regional TTS model instead of the browser's built-in voice?**
A: Cost and integration time, for this stage. Browser-native Web Speech
API is free and zero-setup, which let us validate the whole interaction
flow fast. Production deployment would swap in a dedicated regional TTS
service (e.g. AI4Bharat's IndicTTS) for guaranteed voice coverage across
all six languages — that's an integration, not a redesign, since our
architecture already isolates the TTS call in one place.

**Q: Does the voice assistant really understand natural speech, or is it keyword matching?**
A: Right now, honestly, it's pattern matching on keywords (e.g. "today,"
"reminder," "help") mapped to real data from Firestore — so the *data*
in the response is real, but the language understanding is simple by
design at this stage, not an NLU model. We chose that because it's
instant, needs no training data, and is fully explainable if something
goes wrong — important for a healthcare-adjacent product.

---

## Data, Privacy & Security

**Q: Is patient data secure? What about family photos and personal memories?**
A: Right now we're in Firestore's test mode for development speed, which
means security rules aren't locked down yet — we're upfront that this
is a known gap, not a finished security posture. Before any real deployment,
this needs: Firestore Security Rules restricting a caregiver to only
their linked patients, real authentication (Firebase Auth), and private
storage rules for any uploaded family media. This is explicitly Phase 3
in our roadmap, not skipped by accident.

**Q: How do you handle authentication? Can anyone access any patient's data right now?**
A: Currently yes, in this prototype — there's one fixed demo patient ID
with no login, which is a deliberate simplification to demo the actual
UX flows quickly. Real caregiver-patient linking and authentication is
explicitly scoped as the next phase, not something we're glossing over.

---

## Scalability & Cost

**Q: What happens to your Firebase bill at scale — is this sustainable for a government deployment?**
A: Firestore's free tier covers a meaningful pilot (50K reads/20K writes
per day free). At real scale, cost is usage-based and predictable, and
for a govt-backed rollout, Firebase also offers enterprise pricing and
India-region data residency options worth negotiating directly if this
moves past pilot stage.

**Q: How would this scale to thousands of patients across multiple NER states?**
A: Firestore itself scales horizontally without us re-architecting.
The part that needs real design work at that scale is caregiver-patient
linking (many-to-many relationships) and regional content management
(different cultural content per state) — both are named, scoped items
in our roadmap, not assumed to "just work."

---

## Accessibility & Design

**Q: How do you know this is actually usable by elderly, low-literacy users? Have you tested with real users?**
A: Honestly, not yet with real elderly users in the field — that's the
most important next step before this goes further, and we say so
directly rather than claim validation we don't have. What we did do:
follow accessibility principles directly (44px+ touch targets, 16px+
body text, high contrast, voice-first interaction, no icon-only
navigation) and design against a concrete test — "would someone
understand this without anyone explaining it" — for every screen.

**Q: Why not just use WhatsApp/existing apps caregivers already know?**
A: Existing tools (WhatsApp, generic reminder apps) aren't built for
dementia-specific cognitive engagement, aren't in Northeast Indian
regional languages, and don't give caregivers structured completion
tracking. We're not replacing communication tools — we're adding the
specific caregiving workflow layer those tools don't have.

---

## If They Try to Catch You Out

**Q: You've clearly changed your UI design several times — was this actually thought through, or just AI-generated churn?**
A: Be honest and confident here, don't get defensive: "We iterated on
visual direction as we clarified who we were actually designing for —
final direction is deliberately restrained and structured, closer to a
healthcare app than a concept app, because trust and clarity matter more
than novelty for this user base." Then move on — don't over-explain.

**Q: What's the single biggest technical risk in your current build?**
A: Good honest answer: real offline reminder firing (background
notifications when the app is closed) and locking down Firestore
security rules before any real patient data touches this — both are
named, both are next, neither is pretended to be solved.

---

## General Delivery Advice

- If you don't know an answer: **"That's a great question — that's
  actually on our roadmap for Phase X, we haven't built that yet"** is a
  completely acceptable, credible answer. Judges respect honesty about
  scope far more than confident guessing.
- Never claim something works if you can't demo it live on request.
- If two judges ask the same question different ways, they're often
  testing consistency — give the same honest answer both times.
