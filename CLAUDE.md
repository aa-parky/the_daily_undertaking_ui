# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**The Daily Undertaking** is a browser-based interactive fiction game with a vintage newspaper aesthetic. Built entirely with vanilla HTML, CSS, and JavaScript—no frameworks, no build process, just pure web fundamentals enhanced with modern development tooling.

**Key Principle**: Zero runtime dependencies. All production code is pure HTML/CSS/JS that runs directly in the browser.

## Development Commands

### Essential Commands

```bash
# Development server (use this to test the application)
npm run dev                 # Start Python HTTP server on port 8000

# Testing
npm test                    # Run all Jest tests (unit + integration)
npm run test:watch          # Run tests in watch mode for TDD
npm run test:coverage       # Run tests with coverage report (~87% coverage target)

# Code Quality (run before committing)
npm run lint                # Check JavaScript with ESLint (Airbnb config)
npm run lint:fix            # Auto-fix ESLint issues
npm run style:lint          # Check CSS with Stylelint
npm run style:fix           # Auto-fix CSS issues
npm run format              # Format all files with Prettier
npm run format:check        # Check formatting without changes

# Pre-commit (runs automatically on git commit)
npm run pre-commit          # Run all pre-commit hooks manually
```

### Testing Individual Files

```bash
# Run a single test file
npm test -- tests/unit/script.test.js
npm test -- tests/integration/ui-integration.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="modal"
```

## Architecture

### Three-Page Application Structure

The application uses a minimal multi-page architecture with no routing library:

1. **daily.html** - Public news page (entry point, no authentication required)
   - Read-only content with headlines, articles, archives, leaderboards
   - Login/register buttons open modal popups
   - Serves as marketing/world-building landing page

2. **game.html** - Main game interface (authenticated gameplay)
   - Interactive fiction command input/output
   - Character panel with stats (HP/Mana bars)
   - Inventory system (3x3 grid in right sidebar)
   - Equipment panel, quests, notes, skills sections
   - All collapsible sections in right sidebar

3. **index.html** - Minimal redirect/landing (legacy, not actively used)

### CSS Architecture: "Vocabulary vs. Sentences"

The CSS follows a **semantic layering philosophy** where each file has a distinct responsibility:

**Foundation Layer** (`css/shared-base.css` - 269 lines):

- Global tokens (inks, paper, typography roles)
- Minimal reset + sane defaults
- Neutral utilities + semantic hooks
- Shared micro-components truly used across pages
- **Rule**: Defines vocabulary. NO page layouts, NO page-specific components.

**Typography Layer** (`css/fonts.css` - 91 lines):

- `@font-face` declarations for all custom fonts
- Loads: IM Fell English SC, Libre Baskerville, Crimson Text, Courier Prime, Special Elite

**Page-Specific Layers**:

- `css/daily.layout.css` (400 lines) - Grid system, article columns, masthead structure for daily.html
- `css/daily.theme.css` (183 lines) - Theme decisions, component styling for daily.html
- `css/game.css` (517 lines) - Complete styling for game.html (layout + theme combined)

**Design Principle**: Pages compose meaning using shared primitives. Typography is **role-based** (masthead, headline, body, record, console, accent, symbols) not appearance-based.

### JavaScript Architecture

**Two-File Module System**:

1. **`js/script.js`** (136 lines) - Game UI interactions
   - Collapsible section toggles
   - Command input handling (Enter to submit, Shift+Enter for multiline)
   - Item modal system (click inventory/equipment items for detail view)
   - Keyboard shortcuts (Escape to close modals)
   - Menu navigation
   - **Note**: Functions exported to `window` object for testing since no module bundler is used

2. **`js/popup-manager.js`** (791 lines) - ES6 module for form validation & popups
   - Shared validation functions (username, email, password)
   - Form popup lifecycle management
   - Password strength indicators
   - Real-time field validation with error messaging
   - Used by login/register forms in `popups/daily/` directory
   - **Imports**: Use `import { validateUsername, showFieldError } from './popup-manager.js'`

**No bundler**: JavaScript files are loaded via `<script>` tags in HTML. popup-manager.js uses ES6 modules (`type="module"`).

### Modal Popup System

Popups are **embedded HTML fragments** loaded into the main page:

- `popups/daily/daily-login.html` - Login form with vintage classified ad styling
- `popups/daily/daily-register.html` - Registration form with password strength meter

Pattern: Forms use semantic HTML with ARIA attributes, validated by popup-manager.js functions.

### Testing Strategy

**Framework**: Jest with jsdom (no browser required)

**Test Organization**:

- `tests/unit/` - Unit tests for individual functions (script.js, popup-manager.js)
- `tests/integration/` - Integration tests for complete user flows (form submission, UI interactions)
- `tests/setup.js` - Global test configuration

**Important Quirk**: Tests load the actual `script.js` file in a jsdom environment rather than importing modules (because script.js is not modularized). Coverage is achieved by simulating DOM interactions.

**Coverage Target**: ~87% code coverage (see jest.config.js for disabled thresholds due to non-modular architecture)

### Color System

**Ink-based semantic palette** (not RGB-first):

- `--ink-newsprint-black`, `--ink-newsprint-gray`, `--ink-newsprint-faded` - Primary text colors
- `--paper`, `--paper-muted` - Warm off-white backgrounds
- `--rule`, `--rule-muted`, `--rule-faint` - Hairline dividers
- `--ink-accent` (unified for warnings/errors/success to reduce UI noise)

**Design Philosophy**: Emphasis conveyed through structure and hierarchy, not color saturation. Mimics print aesthetics.

### Typography Roles

Fonts are assigned by **purpose, not component**:

| Role     | CSS Variable      | Use Case                             |
| -------- | ----------------- | ------------------------------------ |
| Masthead | `--font-masthead` | Publication titles, formal identity  |
| Headline | `--font-headline` | Article headings, section titles     |
| Body     | `--font-body`     | Primary reading text                 |
| Record   | `--font-record`   | Ledgers, registers, archival records |
| Console  | `--font-console`  | System output, logs, terminal UI     |
| Accent   | `--font-accent`   | Stamps, signatures, marginal notes   |
| Symbols  | `--font-symbols`  | Typographic marks, glyphs            |

## Code Style & Conventions

### JavaScript

- **ESLint**: Airbnb base config with browser globals
- **Conventions**: ES6+, avoid `var`, use `const`/`let`, prefer arrow functions
- **Console**: `console.log` is allowed (ESLint `no-console: "off"`)
- **Globals**: `openItemModal`, `closeItemModal`, `toggleSection` exposed to window for HTML onclick handlers

### CSS

- **Stylelint**: Standard config
- **BEM-like naming**: `.component-element--modifier` pattern used loosely
- **Custom properties**: All design tokens live in `:root` of shared-base.css
- **No utility classes**: Semantic class names only

### HTML

- **Semantic markup**: Use `<article>`, `<section>`, `<aside>`, etc.
- **Accessibility**: ARIA labels required for interactive elements
- **Validation**: HTML5 validated in CI pipeline

## CI/CD Pipeline

**GitHub Actions** runs on every push/PR to `main` or `develop`:

1. **Quality Checks** (Node 18.x & 20.x matrix)
   - ESLint (must pass)
   - Stylelint (must pass)
   - Prettier format check (must pass)

2. **Tests**
   - Jest with coverage reporting
   - Coverage uploaded to Codecov

3. **Security Scan**
   - Trivy vulnerability scanner

4. **Build Verification**
   - Python server start test
   - HTML5 validation

**All checks must pass** before merging.

## Current Limitations & Planned Features

**Not Yet Implemented**:

- LLM integration for dynamic narrative (command responses are placeholder text)
- Backend MUD server connection (all game logic is client-side stubs)
- Save/load game state (no persistence)
- Character creation system
- Combat mechanics (stats bars are static)
- Spell/skill system (UI only)
- Quest tracking logic (collapsible sections exist but no data model)

**Active Development Pattern**: UI-first approach. Build the interface, then wire up backend later.

## File Locations Reference

```
the_daily_undertaking_ui/
├── css/
│   ├── shared-base.css      # Global tokens + reset
│   ├── fonts.css            # @font-face declarations
│   ├── daily.layout.css     # daily.html grid system
│   ├── daily.theme.css      # daily.html theming
│   └── game.css             # game.html complete styling
├── js/
│   ├── script.js            # Game UI interactions
│   └── popup-manager.js     # Form validation (ES6 module)
├── popups/daily/
│   ├── daily-login.html     # Login form popup
│   └── daily-register.html  # Register form popup
├── tests/
│   ├── unit/                # Unit tests
│   ├── integration/         # Integration tests
│   └── setup.js             # Test configuration
├── daily.html               # Public news page (entry point)
├── game.html                # Main game interface
├── index.html               # Minimal redirect
└── assets/                  # Images, fonts, etc.
```

## Design Philosophy

**Print-first, digital-second**: The interface mimics vintage newspaper layout and typography. Interactions should feel tactile and archival, not slick and modern.

**Restrained palette**: Avoid pure white, pure black, or saturated colors. Use newsprint inks and warm paper tones.

**Structure over decoration**: Emphasis through hierarchy and spacing, not color or effects.

**Semantic clarity**: Every CSS class and HTML element should describe meaning, not appearance.
