# Design Guidelines - The Daily Undertaking

## Overview

The Daily Undertaking uses a vintage newspaper aesthetic throughout all interfaces. This document defines the design system that maintains visual consistency across the game interface (game.html/index.html), landing page (landing.html), and public news page (daily.html).

## Color Palette

### Core Colors (CSS Variables)

Defined in `css/styles.css`:

```css
--paper: #f5f1e8 /* Warm off-white background, simulates aged newspaper */
  --newsprint-black: #2b2b2b /* Primary text and borders, authentic newsprint ink */
  --ink-gray: #404040 /* Secondary text, less emphasis */ --faded-ink: #5a5a5a
  /* Tertiary text, timestamps, subtle elements */;
```

### Extended Palette (Landing Page)

Additional colors defined in `css/landing.css`:

```css
--accent-gold: #d4af37 /* CTA highlights, premium elements */ --error-red: #b91c1c
  /* Form validation errors */ --success-green: #059669 /* Success states, confirmations */;
```

### Color Usage Guidelines

- **Backgrounds**: Always use `var(--paper)` for primary backgrounds
- **Text**:
  - Primary content: `var(--newsprint-black)`
  - Secondary/supporting: `var(--ink-gray)`
  - Timestamps/metadata: `var(--faded-ink)`
- **Borders**: `var(--newsprint-black)` at 2-4px thickness
- **Accents**: `var(--accent-gold)` sparingly for emphasis
- **Interactive States**: Invert colors (black background, paper text) on hover/active

## Typography System

### Font Families

The project uses five distinct Google Fonts to create typographic hierarchy:

```css
/* Masthead & Titles - Ornate, Historical */
font-family: 'IM Fell English SC', serif;
/* Usage: Main title, ornamental headers */
/* Characteristics: Old English style, all-caps optimized */

/* Headlines & Section Headers - Bold, Classical */
font-family: 'Cinzel', serif;
/* Usage: Story titles, section headers, leaderboard names */
/* Characteristics: Classical proportions, high contrast */

/* Vintage Typewriter - Character */
font-family: 'Special Elite', cursive;
/* Usage: Subtitles, bylines, metadata, archive dates */
/* Characteristics: Typewriter texture, slightly irregular */

/* Body Copy - Elegant, Readable */
font-family: 'EB Garamond', serif;
/* Usage: Article text, descriptions, long-form content */
/* Characteristics: Excellent readability, classical proportions */

/* Technical/Monospace - Modern Twist */
font-family: 'Courier Prime', monospace;
/* Usage: Character descriptions, navigation, footer text */
/* Characteristics: Clean monospace, vintage typewriter feel */

/* Terminal Output - Code-like */
font-family: 'Inconsolata', monospace;
/* Usage: Game output text, command responses */
/* Characteristics: Modern monospace, optimized for screens */
```

### Type Scale & Hierarchy

#### Display Sizes (Headlines)

- **Masthead Title**: 56px (daily.html), 48px (game interface)
  - `font-weight: 900`, `letter-spacing: 4px`, uppercase
- **Story Headlines**: 38px (lead story), 32px (responsive)
  - `font-weight: 700`, `letter-spacing: 0.5px`
- **Section Headers**: 24px
  - `font-weight: 700`, `letter-spacing: 3px`, uppercase

#### Body Sizes

- **Story Content**: 17px, `line-height: 1.8`
- **News Excerpts**: 15px, `line-height: 1.7`
- **Character Descriptions**: 14px, `line-height: 1.6`

#### Small Sizes (Metadata)

- **Bylines & Subtitles**: 11px, `letter-spacing: 1.5-2px`, uppercase
- **Footer Text**: 11px, `line-height: 1.7`

### Special Typography Effects

#### Drop Cap

Used on first paragraph of lead story:

```css
.story-content p:first-child::first-letter {
  font-family: 'Cinzel', serif;
  font-size: 62px;
  line-height: 0.85;
  float: left;
  margin: 8px 10px 0 0;
  font-weight: 700;
  color: var(--newsprint-black);
}
```

#### Ornamental Dividers

Decorative elements using Unicode characters:

```css
content: '✦'; /* Decorative star for corners */
content: '•'; /* Bullet separator */
```

## Layout Systems

### Fixed Game Interface (game.html/index.html)

**Container**: 1250px × 590px, centered viewport

- **Purpose**: Simulates a physical newspaper interface, non-scrolling
- **Grid**: 3-column layout
  - Left Panel: 315px (character info)
  - Center Panel: 580px (game output/input)
  - Right Panel: 350px (inventory, equipment, quests)

```css
.container {
  width: 1250px;
  height: 590px;
  margin: 50px auto;
  position: relative;
}
```

### Scrollable News Page (daily.html)

**Container**: 90% width, max-width 1600px, natural height

- **Purpose**: Authentic broadsheet newspaper reading experience
- **Scroll**: Vertical, full viewport height

```css
body {
  min-height: 100vh;
  overflow-y: scroll;
}

.container {
  width: 90%;
  max-width: 1600px;
  height: auto;
  margin: 0 auto;
  padding: 40px 60px 60px;
}
```

### Landing Page (landing.html)

**Container**: Same as game interface (1250px × 590px)

- **Purpose**: Authentication forms, centered content
- **Layout**: Single-column, vertically centered

### Spacing System

#### Vertical Rhythm

- **Section Separation**: 50-60px margins between major sections
- **Content Blocks**: 30-40px margins for subsections
- **Related Content**: 15-25px margins for grouped elements
- **Inline Spacing**: 8-18px margins between paragraphs

#### Padding Scale

- **Large Containers**: 40-60px
- **Medium Elements**: 25-35px
- **Small Components**: 15-20px
- **Tight Spacing**: 6-12px

#### Gaps (Grid/Flex)

- **News Grid**: 30px gap between items
- **Column Layout**: 45px column-gap for text
- **Form Elements**: 20px gap between fields

## Image Sizing & Aspect Ratios

### Overview

All images in The Daily Undertaking follow a strict canonical sizing system. This ensures visual consistency, optimizes asset generation, and maintains authentic newspaper aesthetic proportions. **Every image container must conform to one of the predefined sizes below.**

### Canonical Generation Sizes

These are the source dimensions for AI-generated assets:

#### Square (1:1)

- **1024 × 1024** - Primary square generation size

#### Portrait

- **9:16** → 720 × 1280 or 896 × 1600
- **2:3** → 832 × 1280

#### Landscape

- **16:9** → 1280 × 720 or 1600 × 896
- **3:2** → 1280 × 832 or 1536 × 1024

### UI Size Palette

> **Critical Rule**: All image containers MUST use one of these exact sizes. All sizes preserve native generation aspect ratios. If it's not listed here, it doesn't exist.

#### 🟦 Square (1:1) — Identity & Objects

**XS — 128 × 128**

- **Source**: 1024² ÷ 8
- **Use for**: Item icons, inline references, inventory lists
- **Reads as**: _Object. Evidence._

```css
.item-icon {
  width: 128px;
  height: 128px;
}
```

**S — 256 × 256** ⭐ Primary Square Size

- **Source**: 1024² ÷ 4
- **Use for**: Character portraits, "Person of Record" images, key NPCs
- **Reads as**: _This individual is noted._

```css
.character-portrait {
  width: 256px;
  height: 256px;
}
```

**M — 384 × 384**

- **Source**: 1536² ÷ 4 (or upscale of 1024²)
- **Use for**: Focus portraits, inspection views, dramatic pauses
- **Reads as**: _Pay attention._

```css
.portrait-focus {
  width: 384px;
  height: 384px;
}
```

#### 🟩 Portrait (9:16 / 2:3) — People & Pressure

**S — 208 × 320** ⭐ Primary Portrait Size

- **Source**: 832×1280 ÷ 4
- **Use for**: Full goblin figures, NPC encounters, social interactions
- **Reads as**: _You are being evaluated._

```css
.npc-portrait {
  width: 208px;
  height: 320px;
}
```

**M — 256 × 384**

- **Source**: Clean proportional upscale
- **Use for**: Important encounters, character moments, procedural unease
- **Reads as**: _You should remember this._

```css
.encounter-portrait {
  width: 256px;
  height: 384px;
}
```

#### 🟨 Landscape (16:9) — Events & Situations

**S — 320 × 180** ⭐ Primary Landscape Size

- **Source**: 1280×720 ÷ 4
- **Use for**: Article headers, Matters Requiring Attention, environmental context
- **Reads as**: _This is happening._

```css
.article-header {
  width: 320px;
  height: 180px;
}
```

**M — 480 × 270**

- **Source**: 1280×720 ÷ 2.67 (still clean)
- **Use for**: Major story beats, shared events, fractured narratives
- **Reads as**: _This affected more than one person._

```css
.story-beat {
  width: 480px;
  height: 270px;
}
```

#### 🟧 Landscape (3:2) — Records & Places

**M — 384 × 256** ⭐ Primary Ledger Size

- **Source**: 1536×1024 ÷ 4
- **Use for**: Maps, diagrams, notices, plans, layouts
- **Reads as**: _This has been documented._
- **Note**: This ratio feels "ledger-y" and works well for official documents

```css
.document-image {
  width: 384px;
  height: 256px;
}
```

**L — 320 × 208**

- **Source**: 1280×832 ÷ 4
- **Use for**: Alternative document size, smaller maps
- **Reads as**: _Supporting documentation._

```css
.document-small {
  width: 320px;
  height: 208px;
}
```

### Quick Reference Table

| Size | Ratio | Dimensions | Primary Use       |
| ---- | ----- | ---------- | ----------------- |
| XS   | 1:1   | 128×128    | Items             |
| S    | 1:1   | 256×256    | Portraits ⭐      |
| M    | 1:1   | 384×384    | Focus             |
| S    | 2:3   | 208×320    | NPCs ⭐           |
| M    | 2:3   | 256×384    | Encounters        |
| S    | 16:9  | 320×180    | Articles ⭐       |
| M    | 16:9  | 480×270    | Events            |
| M    | 3:2   | 384×256    | Maps/Documents ⭐ |
| L    | 3:2   | 320×208    | Small Documents   |

⭐ = Primary recommended size for each category

### CSS Image Handling

#### Core Image Rule

**Always use this pattern** for images to preserve aspect ratios:

```css
.ui-image {
  width: 100%;
  height: auto;
  object-fit: contain; /* or cover, intentionally chosen */
}
```

**Never**:

- Stretch to both width and height simultaneously
- Let the container define a conflicting aspect ratio
- Hard-code both width and height unless it matches the palette

#### Aspect Ratio Containers

Use these utility classes for image containers:

```css
.ui-frame--square {
  aspect-ratio: 1 / 1;
}

.ui-frame--portrait {
  aspect-ratio: 2 / 3;
}

.ui-frame--wide {
  aspect-ratio: 16 / 9;
}

.ui-frame--ledger {
  aspect-ratio: 3 / 2;
}
```

**Usage Pattern**:

```html
<!-- Character portrait -->
<div class="ui-frame--square" style="width: 256px;">
  <img src="portrait.png" class="ui-image" alt="Character Name" />
</div>

<!-- Article header -->
<div class="ui-frame--wide" style="width: 320px;">
  <img src="event.png" class="ui-image" alt="Event Description" />
</div>

<!-- Document/map -->
<div class="ui-frame--ledger" style="width: 384px;">
  <img src="map.png" class="ui-image" alt="Location Map" />
</div>
```

### UI Scaling from Generation Sizes

#### Clean Divisor Method

When scaling generated images for UI display, always use clean divisors:

**Square (1024×1024)**

- ÷ 4 = **256×256** ✅ (Primary UI size)
- ÷ 8 = 128×128 (Small icons)

**Portrait (832×1280)**

- ÷ 4 = **208×320** ✅ (Primary portrait)

**Landscape 16:9 (1280×720)**

- ÷ 4 = **320×180** ✅ (Primary landscape)

**Landscape 3:2 (1536×1024)**

- ÷ 4 = **384×256** ✅ (Primary ledger)

### Design Intent by Size

Each size category communicates a specific intent to the player:

- **128×128**: _This is an object, evidence, a thing._
- **256×256**: _This person is noted in the Registry._
- **384×384**: _Stop. Pay attention to this._
- **208×320**: _You are being evaluated by this character._
- **256×384**: _This moment matters. Remember it._
- **320×180**: _This is happening now._
- **480×270**: _This event affected multiple people._
- **384×256**: _This has been officially documented._

### Implementation Guidelines

1. **Never improvise sizes** - Use only the canonical palette
2. **Match aspect ratio to content type**:
   - People → Square or Portrait
   - Events → Landscape 16:9
   - Documents → Landscape 3:2
3. **Use clean divisors** when scaling from generation sizes
4. **Apply CSS aspect-ratio** to containers for flexibility
5. **Let images scale responsively** within their containers
6. **Test at intended display size** during asset generation

## Component Library

### Buttons

#### Primary CTA (Play Button)

```css
.play-button {
  background: var(--newsprint-black);
  color: var(--paper);
  font-family: 'Cinzel', serif;
  font-size: 16px;
  font-weight: 700;
  padding: 18px 45px;
  border: 3px solid var(--newsprint-black);
  box-shadow: 4px 4px 0 rgb(43 43 43 / 25%);
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.2s ease;
}

.play-button:hover {
  background: var(--paper);
  color: var(--newsprint-black);
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 rgb(43 43 43 / 25%);
}
```

**Usage**: Primary calls-to-action, game start buttons

#### Submit Buttons (Forms)

```css
.submit-button {
  background: var(--newsprint-black);
  color: var(--paper);
  font-family: 'Courier Prime', monospace;
  font-size: 14px;
  font-weight: 700;
  padding: 14px 32px;
  border: 2px solid var(--newsprint-black);
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.2s ease;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

**Usage**: Form submissions, authentication actions

### Navigation Links

#### Masthead Navigation

```css
.nav-link {
  color: var(--newsprint-black);
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 700;
  padding: 6px 14px;
  transition: all 0.2s ease;
  display: inline-block;
}

.nav-link:hover,
.nav-link.active {
  background: var(--newsprint-black);
  color: var(--paper);
}
```

**Usage**: Top navigation, page switching

### Cards & Content Blocks

#### News Item Cards

```css
.news-item {
  border: 3px solid var(--newsprint-black);
  padding: 25px;
  background: var(--paper);
  box-shadow: 2px 2px 0 rgb(43 43 43 / 10%);
  transition: all 0.3s ease;
}

.news-item:hover {
  box-shadow: 5px 5px 0 rgb(43 43 43 / 18%);
  transform: translate(-2px, -2px);
}
```

**Usage**: Grid layouts, preview cards

#### Lead Story Box

```css
.lead-story {
  border: 4px double var(--newsprint-black);
  padding: 45px 55px 50px;
  background: var(--paper);
  box-shadow:
    inset 0 0 0 1px var(--newsprint-black),
    4px 4px 0 rgb(43 43 43 / 12%);
  position: relative;
}
```

**Usage**: Featured content, hero sections

### Forms

#### Text Inputs

```css
.form-input {
  width: 100%;
  padding: 14px 16px;
  font-family: 'EB Garamond', serif;
  font-size: 16px;
  border: 2px solid var(--newsprint-black);
  background: var(--paper);
  color: var(--newsprint-black);
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-gold);
  box-shadow: 0 0 0 3px rgb(212 175 55 / 20%);
}

.form-input.error {
  border-color: var(--error-red);
}
```

#### Validation States

- **Error**: Red border (`--error-red`), shake animation
- **Success**: Green border (`--success-green`), checkmark icon
- **Focus**: Gold highlight (`--accent-gold` with 20% opacity shadow)

### Tables

#### Leaderboard Style

```css
.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
  border: 3px solid var(--newsprint-black);
  box-shadow: inset 0 0 0 1px var(--newsprint-black);
}

.leaderboard-table thead {
  background: var(--newsprint-black);
  color: var(--paper);
}

.leaderboard-table th {
  padding: 18px 15px;
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.leaderboard-entry {
  border-bottom: 1px solid rgb(43 43 43 / 20%);
  transition: background 0.2s ease;
}

.leaderboard-entry:hover {
  background: rgb(43 43 43 / 5%);
}
```

### Modals

#### Item Detail Modal

```css
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(43 43 43 / 85%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 1000;
}

.modal.active {
  opacity: 1;
  pointer-events: all;
}

.modal-content {
  background: var(--paper);
  padding: 40px;
  border: 4px double var(--newsprint-black);
  max-width: 500px;
  position: relative;
  animation: stampAppear 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

**Animation**: Stamp-like appearance effect on open

## Border & Shadow Treatments

### Border Styles

#### Single Solid Borders

- **Thick**: 3-4px for primary containers and cards
- **Medium**: 2px for buttons and form inputs
- **Thin**: 1px for subtle dividers and cell borders

#### Double Borders

Used for special emphasis (lead story, section headers):

```css
border: 4px double var(--newsprint-black);
```

#### Inset Borders

Creates "frame within frame" effect:

```css
box-shadow: inset 0 0 0 1px var(--newsprint-black);
```

### Shadow Patterns

#### Offset Drop Shadow

Creates depth, simulates paper layers:

```css
box-shadow: 4px 4px 0 rgb(43 43 43 / 25%);
```

**Hover State**: Reduce shadow and translate element to simulate pressing:

```css
transform: translate(2px, 2px);
box-shadow: 2px 2px 0 rgb(43 43 43 / 25%);
```

#### Soft Container Shadow

For major page containers:

```css
box-shadow:
  0 4px 6px rgb(0 0 0 / 10%),
  0 8px 20px rgb(0 0 0 / 15%);
```

#### Focus Shadow

For interactive form elements:

```css
box-shadow: 0 0 0 3px rgb(212 175 55 / 20%);
```

## Interactive States

### Hover Effects

#### Navigation Links

- Background: Invert to black
- Text: Invert to paper color
- Transition: 0.2s ease

#### Cards & Items

- Transform: `translate(-2px, -2px)` (lift effect)
- Shadow: Increase from 2px to 5px
- Transition: 0.3s ease

#### Buttons

- Transform: `translate(2px, 2px)` (press effect)
- Shadow: Decrease from 4px to 2px
- Transition: 0.2s ease

### Active States

#### Menu Items

```css
.menu-item.active {
  background: var(--newsprint-black);
  color: var(--paper);
  border-color: var(--newsprint-black);
}
```

#### Form Focus

- Border color changes to `--accent-gold`
- Outline removed, replaced with box-shadow ring
- Smooth transition: 0.2s ease

### Disabled States

```css
.disabled,
:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

## Animation Patterns

### Keyframe Animations

#### Fade In

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Usage**: Content reveal, page load

#### Shake (Error State)

```css
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}
```

**Usage**: Form validation errors

#### Spin (Loading)

```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

**Usage**: Loading spinners

#### Stamp Appear (Modal)

```css
@keyframes stampAppear {
  0% {
    transform: scale(0.8) rotate(-3deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.05) rotate(1deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}
```

**Usage**: Modal appearance, dramatic reveals

### Transition Guidelines

- **Standard Duration**: 0.2s for most interactions
- **Longer Duration**: 0.3s for larger elements (cards, modals)
- **Timing Function**: `ease` for general use, `cubic-bezier(0.175, 0.885, 0.32, 1.275)` for bounce effects
- **Properties to Transition**: `all`, `opacity`, `transform`, `background`, `border-color`, `box-shadow`

## Multi-Column Text Layout

Used for newspaper-style article text:

```css
.story-content {
  column-count: 3;
  column-gap: 45px;
  column-rule: 1px solid rgb(43 43 43 / 20%);
  text-align: justify;
}

.story-content p {
  break-inside: avoid;
}
```

**Responsive Behavior**:

- Desktop (>1400px): 3 columns
- Tablet (1100-1400px): 2 columns
- Mobile (<1100px): 1 column

## Responsive Breakpoints

### Daily.html (Scrollable News Page)

```css
@media (width <= 1400px) {
  .container {
    width: 95%;
    padding: 30px 40px 50px;
  }
  .story-content {
    column-count: 2;
  }
  .title {
    font-size: 48px;
  }
  .story-title {
    font-size: 32px;
  }
}

@media (width <= 1100px) {
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .story-content {
    column-count: 1;
  }
  .lead-story {
    padding: 35px 40px 40px;
  }
}

@media (width <= 768px) {
  .container {
    width: 100%;
    padding: 20px 25px 40px;
    border-left: none;
    border-right: none;
  }
  .title {
    font-size: 36px;
    letter-spacing: 2px;
  }
  .story-title {
    font-size: 24px;
  }
  .news-grid {
    grid-template-columns: 1fr;
  }
}
```

### Landing Page

```css
@media (width <= 1280px) {
  body {
    padding: 20px;
  }
  .container {
    width: 100%;
    margin: 0;
  }
}

@media (width <= 768px) {
  .container {
    border-left: none;
    border-right: none;
  }
  .form-content {
    padding: 25px;
  }
}
```

**Note**: Game interface (game.html/index.html) is intentionally non-responsive with fixed 1250×590 dimensions.

## Background Textures

### Paper Texture

Applied to all containers for authentic newspaper feel:

```css
background-image: url('../assets/images/textures/assult.png');
```

**Note**: Semi-transparent PNG texture tiles seamlessly across backgrounds.

## Browser Compatibility

### Safari-Specific Adjustments

**Issue**: Safari has performance issues with CSS `filter: blur()`

**Solution**: All blur filters removed from production CSS. Comments indicate removed filters:

```css
/* filter: blur removed for Safari compatibility */
```

**Affected Components**: Originally used on modal overlays and background elements.

### Cross-Browser Testing Priority

1. Chrome/Edge (primary development target)
2. Firefox
3. Safari (macOS/iOS)

## Accessibility Considerations

### Semantic HTML

- Use proper heading hierarchy (h1 → h2 → h3)
- `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>` elements
- Forms use `<label>` elements with proper `for` attributes

### Color Contrast

- Primary text on paper background: 12.6:1 ratio (exceeds WCAG AAA)
- Inverted hover states: 12.6:1 ratio
- All text meets WCAG AA standards minimum

### Focus States

- Custom focus styles with visible `box-shadow` rings
- Never remove outline without replacement
- Focus indicators use `--accent-gold` for visibility

### Form Validation

- Error messages displayed as text, not just color
- Success/error states include icons and text
- Required fields marked with asterisk and aria-required

## Design Principles

### 1. Authentic Period Aesthetic

- All design decisions reference vintage newspaper design (1920s-1950s)
- Typography choices reflect historical printing techniques
- Layout mimics broadsheet newspaper structure
- Textures simulate aged paper and newsprint ink

### 2. Consistency Through Variables

- All colors defined as CSS custom properties
- Reusable spacing scale
- Consistent border weights and shadow patterns
- Typography scale maintained across all pages

### 3. Functional Decoration

- Ornamental elements serve visual hierarchy
- Drop caps guide reading entry points
- Borders create clear content boundaries
- Shadows indicate interactive elements and depth

### 4. Progressive Enhancement

- Core content accessible without JavaScript
- CSS transitions enhance but don't block interaction
- Forms work with basic HTML5 validation
- Responsive design maintains readability at all sizes

### 5. Performance Considerations

- No blur filters (Safari compatibility)
- CSS animations use transform/opacity (GPU-accelerated)
- Minimal JavaScript for core functionality
- Static assets, no build process required

## Usage Examples

### Creating a New Section Header

```html
<h2 class="section-header">Your Section Title</h2>
```

```css
.section-header {
  font-family: 'Cinzel', serif;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin: 0 0 35px;
  padding: 18px 0;
  border-top: 4px double var(--newsprint-black);
  border-bottom: 4px double var(--newsprint-black);
  color: var(--newsprint-black);
}
```

### Creating a Card Component

```html
<article class="content-card">
  <h3 class="card-title">Card Title</h3>
  <p class="card-excerpt">Card content text...</p>
</article>
```

```css
.content-card {
  border: 3px solid var(--newsprint-black);
  padding: 25px;
  background: var(--paper);
  box-shadow: 2px 2px 0 rgb(43 43 43 / 10%);
  transition: all 0.3s ease;
}

.content-card:hover {
  box-shadow: 5px 5px 0 rgb(43 43 43 / 18%);
  transform: translate(-2px, -2px);
}

.card-title {
  font-family: 'Cinzel', serif;
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 15px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--newsprint-black);
}

.card-excerpt {
  font-family: 'EB Garamond', serif;
  font-size: 15px;
  line-height: 1.7;
  color: var(--ink-gray);
  margin: 0;
}
```

### Creating a Form Input

```html
<div class="form-group">
  <label for="username" class="form-label">Username</label>
  <input type="text" id="username" class="form-input" required aria-required="true" />
  <span class="form-error" id="username-error"></span>
</div>
```

```css
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-family: 'Courier Prime', monospace;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  color: var(--newsprint-black);
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  font-family: 'EB Garamond', serif;
  font-size: 16px;
  border: 2px solid var(--newsprint-black);
  background: var(--paper);
  color: var(--newsprint-black);
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-gold);
  box-shadow: 0 0 0 3px rgb(212 175 55 / 20%);
}

.form-input.error {
  border-color: var(--error-red);
  animation: shake 0.4s ease;
}

.form-error {
  display: block;
  font-family: 'Courier Prime', monospace;
  font-size: 11px;
  color: var(--error-red);
  margin-top: 6px;
}
```

## File Organization

```
css/
├── styles.css      # Base styles, game interface (game.html)
├── landing.css     # Landing page styles (landing.html)
└── daily.css       # Public news page styles (daily.html)
```

**Cascade Order**:

1. Base styles loaded first (styles.css)
2. Page-specific styles loaded second (landing.css or daily.css)
3. Page-specific styles override base styles where needed

**CSS Variables**: Defined in styles.css `:root` and extended in landing.css `:root` for additional colors.

## Future Considerations

### Potential Enhancements

- Dark mode variant (invert paper/ink colors)
- Print stylesheet for authentic newspaper printing
- High contrast mode for accessibility
- Animation preferences respect `prefers-reduced-motion`

### Scalability

- CSS variables allow theme variants
- Modular component approach supports new pages
- Consistent naming conventions enable easy extension
- Design tokens documented for design-to-code handoff

---

**Last Updated**: December 29, 2025
**Version**: 1.0
**Maintainer**: The Daily Undertaking Development Team
