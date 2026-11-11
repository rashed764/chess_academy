# CHESSMIND ACADEMY — DESIGN SYSTEM

**Aesthetic Direction:** Grandmaster Academy & Classical University  
**Palette:** Dark Obsidian, Deep Charcoal, Warm Ivory, Muted Antique Gold

---

## 1. Color Palette Tokens

| Token Name | Hex Value | Semantic Usage |
|---|---|---|
| `--color-bg-deep` | `#0B1220` | Page background, root canvas, dark voids |
| `--color-surface` | `#121D2E` | Cards, panels, sidebar backgrounds |
| `--color-surface-elevated` | `#19273A` | Modals, active list items, tooltips, dialogs |
| `--color-surface-hover` | `#22344D` | Hover states for cards and controls |
| `--color-accent-gold` | `#D6B56D` | Primary CTAs, active badges, highlights, rank stars |
| `--color-accent-gold-hover` | `#E5C782` | Interactive button hover |
| `--color-accent-gold-muted` | `rgba(214,181,109,0.15)` | Subtle badges, active tabs, glow accents |
| `--color-ivory` | `#F3F0E8` | Primary text headings and body high-contrast |
| `--color-text-secondary` | `#AAB5C4` | Subtitles, labels, descriptions |
| `--color-text-muted` | `#728096` | Minor annotations, timestamps |
| `--color-board-light` | `#ECE2C6` | Chessboard light squares (maple wood feel) |
| `--color-board-dark` | `#8C6747` | Chessboard dark squares (walnut wood feel) |

---

## 2. Typography Hierarchy

1. **Brand / Stage Titles:** `'Cinzel', serif` — Grand, timeless, academy prestige.
2. **Body & UI Elements:** `'Inter', sans-serif` — Crisp, legible at small viewports.
3. **Notation & FEN:** `'JetBrains Mono', monospace` — Standard algebraic moves (`1. e4 e5 2. Nf3 Nc6`).

---

## 3. Chessboard Component Specification

- **Responsive Viewport Handling:** Board scales automatically to fit available panel width while maintaining 1:1 aspect ratio.
- **Coordinate Markings:** Files `a-h` and ranks `1-8` with subtle contrasting colors.
- **Interaction Models:** Both click-to-select + click-destination and pointer drag-and-drop.
- **Visual Cues:**
  - Selected square: Gold border outline.
  - Legal move targets: Centered translucent gold dot (empty) or target ring (captures).
  - Check state: Red pulsating radial glow on attacked king.
  - Last move: Subtle amber tint on source and destination squares.
  - Tactical arrows: SVG overlay with directional arrowhead.
