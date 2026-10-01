# SAKHI — PROJECT LOCK & PRODUCT SPECIFICATION

**Tagline:** Your Voice. Your Language. Your Digital Independence.  
**Challenge:** "The Invisible Woman"  
**Hackathon Target:** 4-Hour Solo Hackathon (2-Hour Active Build)  
**Status:** LOCKED 🔒

---

## 1. Executive Summary & Selected Scheme

### Challenge Understanding
Millions of women in rural India face a triple barrier: **Language** (no English), **Digital Literacy** (no smartphone experience), and **Social Isolation** (no one to ask without judgment or dependency). Standard chatbots fail because they output paragraphs of bureaucratic text translated word-for-word.

### Selected Government Service for Demo
**Pradhan Mantri Matru Vandana Yojana (PMMVY)**  
*(Maternity Benefit Scheme providing direct cash transfers of ₹5,000–₹6,000 to first-time & eligible pregnant/lactating mothers).*

#### Why PMMVY is Feasible & Ideal for Demo:
1. **High Impact:** Directly empowers underprivileged rural women with financial independence during pregnancy.
2. **Clear 3-Stage Workflow:** Eligibility check → Document readiness → Registration/Anganwadi verification.
3. **Complex Form digital barrier:** The actual government portal (PMMVY-CAS) is hostile to non-literate users. Translating this specific digital experience proves SAKHI's core value proposition instantly.

---

## 2. Core Differentiator: Digital Experience Translation
Instead of translating text from English to regional languages (e.g. Tamil/Hindi), **SAKHI translates the DIGITAL EXPERIENCE itself**:
- Replaces complex text forms with **audio-guided visual story cards**.
- Uses 5th-grade local analogies (e.g., "Take out the green book from the bank").
- Features a prominent **"I'm Stuck" (புரியல / உதவி)** button that instantly breaks down the active step into micro-steps with simpler voice guidance.

---

## 3. Product Scope & Priority Matrix (P0, P1, P2)

### P0 (Core MVP - Next 2 Hours - Non-negotiable)
- [x] **Voice-First Interaction:** Speech-to-Text (STT) input in Tamil/Hindi/English and Text-to-Speech (TTS) voice playback.
- [x] **Digital Experience Navigator:** 3-step visual guided flow for PMMVY (Eligibility → Document Audit → Action Plan).
- [x] **"I'm Stuck" Engine:** One-click instant re-explanation using Gemini with simplified real-world analogies.
- [x] **Multilingual UI & Audio Toggle:** Instant switching between Tamil, Hindi, and English.
- [x] **Personalized Action Card ("Sahayata Card"):** Printable/shareable summary card for the local Anganwadi/ASHA worker.
- [x] **Demo Mode Safeguard:** Pre-loaded audio/transcript fallbacks for flawless 3-minute hackathon presentation.

### P1 (Nice to Have - Hour 3 if ahead of schedule)
- [ ] **Document Camera Check Simulator:** Take/upload a photo of bank passbook/Aadhaar; Gemini vision checks if passbook photo/IFSC is visible.
- [ ] **Supabase Session Persistence:** Save user progress so she can resume later.

### P2 (Explicitly OUT OF SCOPE — DO NOT BUILD)
- ❌ Direct automated submission to official government portals (requires live OTP/Aadhaar biometrics).
- ❌ Generic chatbot interface with continuous scrolling text messages.
- ❌ Broad support for 50+ different schemes (focus deeply on PMMVY).
- ❌ User registration / phone number OTP authentication wall.

---

## 4. Core User Journey (The 3-Minute Story Flow)

1. **Warm Voice Welcome (0:00 - 0:20)**
   - User opens SAKHI on phone. SAKHI speaks in warm Tamil/Hindi:  
     *"வணக்கம்! நான் சகி. கர்ப்பிணி உதவித்தொகை ₹5000 வாங்க நான் உங்களுக்கு உதவி செய்கிறேன்."*

2. **Voice Request & Intent Recognition (0:20 - 0:45)**
   - User taps big microphone button and speaks naturally:  
     *"எனக்கு முதல் குழந்தை பிறக்கப்போகுது, அரசாங்கத்துல தையல்/பணம் தருவாங்களாமே, அது எப்படி வாங்குறது?"*

3. **Digital Experience Translation (0:45 - 1:30)**
   - SAKHI skips complex government portals and displays **3 Big Visual Step Cards**:
     - Card 1: Eligibility Check (ஆதார் & வயது சரிபார்ப்பு)
     - Card 2: 3 Simple Documents (வங்கி கணக்கு, ஆதார், தாய் சேய் அட்டை)
     - Card 3: Local Anganwadi Action (அங்கன்வாடி மையம் செல்லுதல்)

4. **Interactive Step & "I'm Stuck" Trigger (1:30 - 2:15)**
   - SAKHI explains Step 2: "Check if your bank account is linked to Aadhaar."
   - User feels confused and clicks the big red **"I'm Stuck" (புரியல)** button.
   - SAKHI instantly changes voice tone and simplifies:  
     *"கவலைப்படாதீங்க! உங்கள் வங்கி புத்தகத்தின் முதல் பக்கத்தை எடுங்கள். அதில் உங்கள் படம் இருக்கிறதா என்று பாருங்கள்."*

5. **Sahayata Action Pass Generation (2:15 - 3:00)**
   - SAKHI generates a clean, single-page **Sahayata Slip** with audio notes that the user can show directly to her nearest ASHA/Anganwadi worker.

---

## 5. System Architecture

```
[ User (Voice / Touch) ]
         │
         ▼
[ Web Speech API (Client STT/TTS) ] ◄── (Fallback: Gemini TTS)
         │
         ▼
[ Next.js 15 App Router / Tailwind CSS ]
         │
         ├──► /api/sakhi/navigate (Gemini 2.5 Flash + System Prompt)
         │       └── Translates request -> Visual Steps + Simple Audio Scripts
         │
         └──► /api/sakhi/stuck (Gemini Simplification Engine)
                 └── Re-translates current step into micro-analogy
         │
         ▼
[ Supabase (Optional Session Logs & Scheme Master Data) ]
```

---

## 6. Strongest Novelty Feature
**"Dynamic Experience Translation with 'I'm Stuck' Micro-Analogy Engine"**  
Unlike traditional LLM wrappers that dump text summaries, SAKHI acts as a real-time empathetic proxy human that visually decomposes government bureaucracy into 1-click micro-actions and changes explanation depth dynamically when a user expresses confusion.

---

## 7. Security & Accessibility Guidelines
- **Privacy First:** Zero PII storage on server; audio processed in-memory.
- **High Contrast & Accessible UI:** Minimum 60px touch targets, warm comforting color scheme (Saffron/Emerald/Warm Off-White).
- **High Volume Audio Toggle:** Clear visual voice indicator and replay buttons on every card.

---

## 8. 2-Hour Rapid Implementation Roadmap

| Time Slot | Module / Focus | Deliverables |
| :--- | :--- | :--- |
| **00:00 - 00:30** | Project Setup & Design Tokens | Next.js + Tailwind layout, color scheme, voice button component, audio hooks. |
| **00:30 - 01:00** | Gemini AI Route & Prompts | `/api/sakhi/navigate` & `/api/sakhi/stuck` routes with strict structured JSON output. |
| **01:00 - 01:45** | Core Experience UI & Voice Integration | Step card navigator, speech synthesis/recognition hooks, "I'm Stuck" interaction state. |
| **01:45 - 02:00** | Sahayata Card & Demo Safeguards | Final action summary card, fallback audio clips, end-to-end flow test. |
