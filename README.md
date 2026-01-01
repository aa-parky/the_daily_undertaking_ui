# The Daily Undertaking

> An interactive fiction game with a vintage newspaper aesthetic

[![CI/CD Pipeline](https://github.com/aa-parky/the_daily_undertaking_ui/actions/workflows/ci.yml/badge.svg)](https://github.com/aa-parky/the_daily_undertaking_ui/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/aa-parky/the_daily_undertaking_ui/branch/main/graph/badge.svg)](https://codecov.io/gh/aa-parky/the_daily_undertaking_ui)
[![HTML5 Validated](https://img.shields.io/badge/HTML5-Validated-orange.svg)](https://github.com/aa-parky/the_daily_undertaking_ui/actions/workflows/ci.yml)
[![CSS Lint](https://img.shields.io/badge/CSS-Stylelint%20%E2%9C%93-success.svg)](https://github.com/aa-parky/the_daily_undertaking_ui/actions/workflows/ci.yml)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

## 📰 Overview

**The Daily Undertaking** is a browser-based interactive fiction game that combines classic text adventure gameplay with a distinctive vintage newspaper aesthetic. Players navigate through an immersive narrative experience where every interaction feels like uncovering stories from a weathered broadsheet.

Built entirely with vanilla HTML, CSS, and JavaScript—no frameworks, no build process, just pure web fundamentals enhanced with modern development tooling.

## ✨ Features

- **📰 Public News Page** - Read-only daily news feed with headlines, world lore, archives, and leaderboards—no login required
- **🔐 Authentication System** - Login and registration pages with form validation and demo credentials
- **🎨 Vintage Newspaper Design** - Authentic period typography and layout inspired by early 20th-century broadsheets
- **📜 Interactive Fiction Engine** - Text-based adventure with command input and rich narrative responses
- **🎒 Inventory System** - Visual 3x3 grid inventory with item details and descriptions
- **⚔️ Equipment Management** - Track equipped items with detailed information panels
- **📊 Character Stats** - Real-time health and mana bars with vintage styling
- **📝 Quest & Notes System** - Collapsible panels for tracking objectives and discoveries
- **🎯 Modal Item Inspection** - Click any item for enlarged view and full description
- **⌨️ Keyboard Navigation** - Enter to submit commands, Escape to close modals, Shift+Enter for multiline

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or 20.x (for development tools only)
- A modern web browser
- Python 3.x (optional, for local server)

### Installation

```bash
# Clone the repository
git clone https://github.com/aa-parky/the_daily_undertaking_ui.git
cd the_daily_undertaking_ui

# Install development dependencies
npm install
```

### Running the Application

**Option 1: Development Server (Recommended)**

```bash
npm run dev
# Visit http://localhost:8000
```

**Option 2: Direct Browser**

```bash
open daily.html
# or double-click daily.html in your file browser
```

**Option 3: Python Simple Server**

```bash
python3 -m http.server 8000
# Visit http://localhost:8000
```

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev                 # Start server on port 8000

# Testing
npm test                    # Run all tests
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run tests with coverage report

# Code Quality
npm run lint                # Check JavaScript with ESLint
npm run lint:fix            # Auto-fix ESLint issues
npm run style:lint          # Check CSS with Stylelint
npm run style:fix           # Auto-fix CSS issues
npm run format              # Format all files with Prettier
npm run format:check        # Check formatting without changes

# Pre-commit
npm run pre-commit          # Run all pre-commit hooks
```

### Development Workflow

1. **Make changes** to HTML, CSS, or JavaScript files
2. **Run linters** - `npm run lint && npm run style:lint`
3. **Format code** - `npm run format`
4. **Run tests** - `npm test`
5. **Commit** - Pre-commit hooks run automatically

### Project Structure

The application uses a three-page architecture:

1. **daily.html** - Public news page (entry point, no authentication)
2. **game.html** - Main game interface (authenticated gameplay)

## 🎨 Design System

The Daily Undertaking UI uses a restrained, print-first design system inspired by newsprint, archival records, and mechanical typesetting.

The goal is **legibility, restraint, and semantic clarity** rather than decoration.

The shared design system defines _vocabulary_, not layout.

Pages compose meaning using these primitives.

---

### Color Palette

The palette is intentionally narrow and semantic. Colors are named by _function_, not appearance.

**Inks (Text & Marks)**

- **Newsprint Black** — primary reading ink
- **Newsprint Gray / Faded** — secondary and de-emphasised content
- **Accent / Warning / Error / Success** — deliberately unified to avoid UI “noise”

This ensures emphasis is conveyed through **structure and hierarchy**, not colour saturation.

**Paper & Surfaces**

- **Paper** — warm off-white base for reading surfaces
- **Muted Paper** — subtle contrast for inset areas
- **Backdrop** — dark neutral used sparingly for non-paper contexts

**Rules & Dividers**

- Hairline rules replace boxes and panels
- Multiple strengths allow hierarchy without visual clutter

**Shadows & Overlays**

- Extremely soft, print-like shadows
- Overlays mimic ink bleed and paper translucency rather than modern UI depth

Overall, the system avoids pure white and pure grey UI conventions, favouring a tactile, editorial feel.

---

### Typography

Typography is role-based and semantic, not decorative.

Fonts are chosen to echo **print history, ledgers, and archival records** while remaining readable on modern screens.

**Primary Roles**

- **Masthead** — formal, characterful serif for titles and identity
- **Headline** — readable editorial serif for section headers
- **Body** — book-style serif optimised for long reading
- **Record / Data / Console** — monospaced faces for logs, registers, and system output
- **Accent** — typewriter-influenced face for stamps, signatures, and marginalia
- **Symbols** — historical serif for typographic marks and glyphs

**Rhythm & Scale**

- Conservative base size and tight line height
- Optimised for column reading rather than expansive layouts
- Vertical rhythm favours consistency over dramatic contrast

Typography is expected to _inherit context_.

Styling decisions belong to the page or component level, not the global system.

### Typography

The system uses **role-based typography**. Fonts are assigned by _purpose_, not by component, allowing pages to compose tone through context rather than hard styling.

| **Role**     | **CSS Token**   | **Font Stack**                           | **Intended Use**                                     |
| ------------ | --------------- | ---------------------------------------- | ---------------------------------------------------- |
| **Masthead** | --font-masthead | IM Fell English SC, serif                | Publication titles, mastheads, formal identity marks |
| **Headline** | --font-headline | Libre Baskerville, serif                 | Article headings, section titles, editorial emphasis |
| **Body**     | --font-body     | Crimson Text, serif                      | Primary reading text, long-form content              |
| **Record**   | --font-record   | Courier Prime, system monospace fallback | Ledgers, registers, archival records                 |
| **Data**     | --font-data     | Courier Prime, system monospace fallback | Tables, figures, structured data                     |
| **Console**  | --font-console  | Courier Prime, system monospace fallback | System output, logs, terminal-style UI               |
| **Accent**   | --font-accent   | Special Elite, monospace fallback        | Stamps, signatures, marginal notes                   |
| **Symbols**  | --font-symbols  | IM Fell English, serif                   | Typographic marks, reference glyphs                  |

---

#### Typographic Principles

- **Semantic first** — font choice reflects _meaning_, not appearance
- **Contextual inheritance** — typography adapts to where it appears
- **Print-inspired rhythm** — optimised for reading, not UI spectacle
- **Minimal hierarchy** — structure carries emphasis more than size or weight

Global font sizing and rhythm are intentionally conservative to support dense, column-based reading without fatigue.

### Layout

## 🧪 Testing

The project uses **Jest** with **jsdom** for testing UI behavior:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode for TDD
npm run test:watch
```

**Test Coverage**: Tests achieve **~87% code coverage** by loading the actual `script.js` file in a jsdom environment (11 tests covering modals, sections, commands, inventory, equipment, and keyboard interactions).

**Test Suites**:

- `tests/unit/script.test.js` - Unit tests for individual functions
- `tests/integration/ui-integration.test.js` - Integration tests for complete user flows

## 🔧 Tech Stack

### Production (Zero Dependencies)

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **Vanilla JavaScript** - ES6+, DOM manipulation

### Development Tools

- **Jest** - Testing framework
- **ESLint** - JavaScript linting (Airbnb config)
- **Stylelint** - CSS linting
- **Prettier** - Code formatting
- **Pre-commit** - Git hooks for quality checks
- **GitHub Actions** - CI/CD pipeline

## 🔄 CI/CD Pipeline

Automated checks run on every push and pull request:

1. **Quality Checks** - ESLint, Stylelint, Prettier (Node 18.x & 20.x)
2. **Tests** - Jest with coverage reporting to Codecov
3. **Security Scan** - Trivy vulnerability scanner
4. **Build Verification** - Server start and HTML5 validation

All checks must pass before merging.

## 🎯 Key Features Explained

### Command System

Type commands in the input area and press Enter to submit. The game processes your input and responds with narrative text. Use Shift+Enter for multi-line commands.

### Item Modals

Click any item in your inventory or equipment to open a detailed modal view with:

- Enlarged item image
- Full item name
- Complete description
- Click outside or press Escape to close

### Collapsible Sections

All right-panel sections (Satchel, Rubbish, Quests, Skills, Notes) can be collapsed by clicking their headers to manage screen space.

### Stats Bars

Health (HP) and Mana (MP) are displayed as visual bars with percentage widths. Update dynamically by modifying the `style="width: X%"` attribute on `.stat-bar-fill` elements.

## 🚧 Future Development

- [ ] LLM integration for dynamic narrative generation
- [ ] Backend MUD server connection
- [ ] Save/load game state
- [ ] Character creation system
- [ ] Combat mechanics
- [ ] Spell/skill system implementation
- [ ] Quest tracking and completion
- [ ] Map navigation interface

## 📝 Browser Compatibility

- **Chrome/Edge** - Fully supported
- **Safari** - Supported

## 📄 License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Typography: Google Fonts (IM Fell English SC, EB Garamond, Courier Prime, Special Elite)
- Inspired by classic interactive fiction and vintage newspaper design
- Built with modern web standards and zero runtime dependencies

## 📧 Contact

Project Link: [https://github.com/aa-parky/the_daily_undertaking_ui](https://github.com/aa-parky/the_daily_undertaking_ui)

---

<p align="center">
  <strong>Built with ☕ and vanilla web technologies</strong>
</p>
