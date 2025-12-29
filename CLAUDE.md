# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"The Daily Undertaking" is an interactive fiction game with a vintage newspaper aesthetic. The project is built entirely with vanilla HTML, CSS, and JavaScript—no build tools or frameworks required for production. Development tooling (testing, linting) is managed via npm.

## Development Workflow

### Running the Application

This is a static website with no build process. To run:

```bash
# Development server (recommended)
npm run dev
# Then visit http://localhost:8000

# Or open in browser directly
open daily.html

# Or use Python directly
python3 -m http.server 8000
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode (for TDD)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

Tests are written using Jest with jsdom environment. Test files are located in:

- `tests/unit/` - Unit tests for individual functions
- `tests/integration/` - Integration tests for UI interactions

**Coverage**: Tests achieve **~87% code coverage** by loading the actual `script.js` file in a jsdom environment. The remaining uncovered lines are primarily async callbacks and edge cases.

### Code Quality

```bash
# JavaScript linting
npm run lint          # Check for errors
npm run lint:fix      # Auto-fix errors

# CSS linting
npm run style:lint    # Check CSS
npm run style:fix     # Auto-fix CSS

# Code formatting (Prettier)
npm run format        # Format all files
npm run format:check  # Check formatting without changing

# Pre-commit hooks (runs all linters + formatters)
npm run pre-commit
```

The project uses:

- **ESLint** with Airbnb base config for JavaScript
- **Stylelint** with standard config for CSS
- **Prettier** for consistent formatting
- **pre-commit hooks** configured in `.pre-commit-config.yaml` (runs on git commit)

### Directory Structure

```
/
├── daily.html              # Public news page (entry point)
├── landing.html            # Login/registration page
├── game.html               # Main game interface (authenticated)
├── index.html              # Redirect stub for backward compatibility
├── css/
│   ├── styles.css          # Shared newspaper-themed styling
│   ├── daily.css           # Daily news page specific styles
│   └── landing.css         # Landing page specific styles
├── js/
│   ├── script.js           # Game interface interactivity
│   ├── daily.js            # Daily news page interactivity
│   └── landing.js          # Landing page authentication logic
├── assets/
│   ├── images/
│   │   ├── characters/     # Character portraits
│   │   ├── items/          # Item images
│   │   └── textures/       # Background textures
│   └── data/               # Item metadata (JSON files)
├── tests/
│   ├── unit/               # Unit tests
│   └── integration/        # Integration tests
├── .github/workflows/      # CI/CD pipeline
└── package.json            # Dev dependencies & scripts
```

**Organization principles:**

- Code files (`css/`, `js/`) separated from assets
- Images categorized by type for easy scaling
- JSON metadata stored in `assets/data/` for future metadata integration
- Tests mirror the code structure in separate `tests/` directory
- No node_modules or build artifacts in production (static HTML/CSS/JS only)

## Architecture

### UI Layout System

The game interface uses a **3-column grid layout** defined in `game.html`:

1. **Left Panel (315px)**: Character information
   - Portrait display (from `assets/images/characters/`)
   - Stats with bars (HP/MP)
   - Character description in newspaper article style

2. **Center Panel (580px)**: Game interaction area
   - `#gameOutput` div - scrollable game text output (310px height)
   - `#commandInput` textarea - player command entry (80px height)
   - Text appears in vintage newspaper/terminal hybrid style

3. **Right Panel (350px)**: Game state panels
   - Collapsible sections (inventory, equipment, quests, skills, notes)
   - 3x3 inventory grid system
   - Equipment items with images and descriptions

### Collapsible Section System

All right-panel sections use a uniform collapsible pattern controlled by `toggleSection()` in `js/script.js`:

- Click `.section-header` to toggle `.collapsed` class
- CSS transitions handle expand/collapse animations
- Arrow indicators rotate via CSS transform

### Item System

Items exist in two forms:

1. **Inventory slots** (`.inventory-slot.filled`)
   - Data stored in `data-item-name` and `data-item-desc` attributes
   - Images loaded directly as `<img>` tags

2. **Equipment items** (`.equipment-item`)
   - Structured with `.equipment-image` and `.equipment-info` divs
   - Name and description in separate child elements

Both types open a detail modal on click via `openItemModal()`.

### Modal System

The item detail modal (`#itemModal`) displays enlarged item views:

- Activated by clicking filled inventory slots or equipment items
- Closed via close button, clicking outside, or pressing Escape
- Extracts data from either inventory or equipment item structure

### Command Input System

Player input handled via `#commandInput` textarea:

- Enter key submits command (Shift+Enter for new line)
- Commands appended to `#gameOutput` as `.output-text` divs
- Auto-scroll to bottom on new content
- Currently shows placeholder response (LLM integration pending)

## Visual Design System

### Theme

Vintage newspaper aesthetic with custom CSS variables defined in `:root`:

```
--paper: #f5f1e8 (background)
--newsprint-black: #2b2b2b (primary text/borders)
--ink-gray: #404040 (secondary elements)
--faded-ink: #5a5a5a (tertiary text)
```

### Typography

Multiple Google Fonts create the newspaper feel:

- **Masthead title**: "IM Fell English SC" (ornate, all-caps)
- **Subtitles/headers**: "Cinzel" and "Special Elite" (vintage typewriter)
- **Body text**: "EB Garamond" (classic serif)
- **Character descriptions**: "Courier Prime" (typewriter monospace)
- **Game output**: "Inconsolata" (modern monospace for terminal feel)

### Background Texture

Paper texture applied via `assets/images/textures/assult.png` as a tiled background image on `.container`. CSS uses relative path from `css/styles.css`.

## Key Implementation Details

### Safari Compatibility

All CSS `filter: blur()` properties have been removed for Safari compatibility. This is noted throughout `css/styles.css` with comments like `/* filter: blur removed for Safari compatibility */`.

### Fixed Dimensions

The container has fixed dimensions (1250x590px) centered on viewport, simulating a physical newspaper layout. Not responsive by design.

### Stat Bars

HP/MP bars use inline `style="width: X%"` for fill percentages. To update stats dynamically, modify the width of `.stat-bar-fill` elements.

### Menu System

Top navigation (`.sub-masthead .menu-item`) currently only toggles `.active` class and logs to console. Full menu functionality not yet implemented.

## Asset Organization

Game assets are organized by type:

**Images:**

- `assets/images/characters/` - Character portraits (e.g., `brigg_fenwick.png`, `brigg_fenwick_bk.png`)
- `assets/images/items/` - Item images (e.g., `stick.png`, `key.png`, `pebble.png`, `token.png`, `receipt.png`)
- `assets/images/textures/` - Background textures (e.g., `assult.png`)

**Data:**

- `assets/data/` - Item metadata in JSON format (e.g., `stick.json`, `key.json`)
- JSON files follow naming pattern `[item_name].json`
- Currently not loaded by UI but positioned for future metadata integration

All image paths in HTML use full paths from project root (e.g., `assets/images/items/key.png`). CSS paths are relative to the CSS file location.

## Testing Strategy

### Writing Tests

When adding new functionality to `js/script.js`, create corresponding tests in `tests/unit/script.test.js`. The test suite uses:

- **@testing-library/jest-dom** for DOM assertions
- **jsdom** environment to simulate browser DOM
- Inline function mocking (functions defined within tests, not imported from script.js)

Current test coverage includes:

- `toggleSection()` - Collapsible section toggling
- `openItemModal()` - Modal population for equipment and inventory items
- `closeItemModal()` - Modal closing
- Command input handling (Enter vs Shift+Enter)
- Menu item active state toggling

**Testing Approach**: Tests load the actual `script.js` file using `require()` in a jsdom environment. The DOM is set up before loading the script, and DOMContentLoaded is triggered to initialize event listeners. Functions are exposed on the `window` object for testing (`window.toggleSection`, `window.openItemModal`, `window.closeItemModal`).

### CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on push/PR to main/develop:

1. **Quality Checks** - ESLint, Stylelint, Prettier (on Node 18.x, 20.x)
2. **Tests** - Jest with coverage reporting to Codecov
3. **Security Scan** - Trivy vulnerability scanner
4. **Build Verification** - Starts Python server and validates HTML5

All checks must pass before merging. Coverage threshold failures will fail the build.

## Integration Points

The comment in `js/script.js:36` indicates where LLM integration should occur:

```javascript
// Simulate response (in real app, this would call your LLM)
```

Command processing should replace the setTimeout placeholder with actual game logic/API calls to a backend MUD server.
