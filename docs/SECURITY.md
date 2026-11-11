# CHESSMIND ACADEMY — SECURITY ARCHITECTURE

---

## 1. Zero Trust AI Action Sanitization
- LLM output is strictly parsed as JSON and validated against TypeScript type guards (`isValidBoardAction`).
- No raw string from the AI is ever passed to `eval()`, `dangerouslySetInnerHTML`, or executed as DOM script.
- Board coordinates are strictly regex validated (`^[a-h][1-8]$`).
- Any move recommended by AI is checked against `chess.legal_moves()` before updating board state. If illegal, it is dropped and flagged.

---

## 2. API Key Protection
- No secret API keys (Gemini, Supabase service roles) are ever bundled into client-side code.
- Server-side environment variables (`GEMINI_API_KEY`) reside exclusively in server environments and proxy routes.
- Supabase client connections strictly use public anon keys guarded by PostgreSQL Row Level Security (RLS) policies based on `auth.uid()`.

---

## 3. Rate Limiting & Anti-Abuse
- AI coaching queries and hint requests have client-side debouncing and cooldown indicators.
- XP awards have anti-farming checks (XP only granted once per unique lesson completion or distinct puzzle solve).
