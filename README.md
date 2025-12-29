# The Daily Undertaking

> An interactive fiction game with a vintage newspaper aesthetic

[![CI/CD Pipeline](https://github.com/aa-parky/the_daily_undertaking_ui/actions/workflows/ci.yml/badge.svg)](https://github.com/aa-parky/the_daily_undertaking_ui/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/aa-parky/the_daily_undertaking_ui/branch/main/graph/badge.svg)](https://codecov.io/gh/aa-parky/the_daily_undertaking_ui)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/aa-parky/the_daily_undertaking_ui/pulls)

## 📰 Overview

**The Daily Undertaking** is a browser-based interactive fiction game that combines classic text adventure gameplay with a distinctive vintage newspaper aesthetic. Players navigate through an immersive narrative experience where every interaction feels like uncovering stories from a weathered broadsheet.

Built entirely with vanilla HTML, CSS, and JavaScript—no frameworks, no build process, just pure web fundamentals enhanced with modern development tooling.

## ✨ Features

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
open index.html
# or double-click index.html in your file browser
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

```
the_daily_undertaking_ui/
├── index.html              # Main UI structure (3-column layout)
├── css/
│   └── styles.css          # Newspaper-themed styling
├── js/
│   └── script.js           # Client-side interactivity
├── assets/
│   ├── images/
│   │   ├── characters/     # Character portraits
│   │   ├── items/          # Item images
│   │   └── textures/       # Background textures
│   └── data/               # Item metadata (JSON)
├── tests/
│   ├── unit/               # Unit tests
│   └── integration/        # Integration tests
└── .github/
    └── workflows/          # CI/CD pipeline
```

## 🎨 Design System

### Color Palette

```css
--paper: #f5f1e8 /* Aged paper background */ --newsprint-black: #2b2b2b
  /* Primary text and borders */ --ink-gray: #404040 /* Secondary elements */ --faded-ink: #5a5a5a
  /* Tertiary text */;
```

### Typography

- **Masthead**: IM Fell English SC (ornate, all-caps)
- **Headers**: Cinzel, Special Elite (vintage typewriter)
- **Body**: EB Garamond (classic serif)
- **Character Info**: Courier Prime (typewriter monospace)
- **Game Output**: Inconsolata (modern monospace)

### Layout

Fixed 3-column newspaper layout (1250x590px):

- **Left (315px)**: Character information with portrait and stats
- **Center (580px)**: Game output and command input
- **Right (350px)**: Collapsible panels for inventory, equipment, quests, skills, notes

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

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Contribution Guidelines

- Follow existing code style (enforced by ESLint/Prettier)
- Add tests for new functionality
- Update documentation as needed
- Ensure all CI checks pass
- Keep the vanilla JS/CSS/HTML approach (no frameworks)

## 📝 Browser Compatibility

- **Chrome/Edge** - Fully supported
- **Firefox** - Fully supported
- **Safari** - Supported (blur filters removed for compatibility)

## 📄 License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

Key points of GPL-3.0:

- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Patent use allowed
- ⚠️ Disclose source - Source code must be made available when distributing
- ⚠️ License and copyright notice - Must include original license
- ⚠️ Same license - Modifications must use the same GPL-3.0 license
- ⚠️ State changes - Document changes made to the code

## 🙏 Acknowledgments

- Typography: Google Fonts (IM Fell English SC, Cinzel, EB Garamond, Courier Prime, Inconsolata, Special Elite)
- Inspired by classic interactive fiction and vintage newspaper design
- Built with modern web standards and zero runtime dependencies

## 📧 Contact

Project Link: [https://github.com/aa-parky/the_daily_undertaking_ui](https://github.com/aa-parky/the_daily_undertaking_ui)

---

<p align="center">
  <strong>Built with ☕ and vanilla web technologies</strong>
</p>
