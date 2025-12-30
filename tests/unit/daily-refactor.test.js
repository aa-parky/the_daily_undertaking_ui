/**
 * @jest-environment jsdom
 */

/* eslint-env node */

const fs = require('fs');
const path = require('path');

describe('Daily.html CSS Refactoring - Layout Preservation Tests', () => {
  let dailyHTML;
  let dailyCSS;
  let sharedBaseCSS;

  beforeAll(() => {
    // Load the HTML and CSS files
    dailyHTML = fs.readFileSync(path.join(__dirname, '../../daily.html'), 'utf8');
    dailyCSS = fs.readFileSync(path.join(__dirname, '../../css/daily.css'), 'utf8');
    sharedBaseCSS = fs.readFileSync(path.join(__dirname, '../../css/shared-base.css'), 'utf8');
  });

  beforeEach(() => {
    document.documentElement.innerHTML = dailyHTML;

    // Inject both stylesheets in correct order
    const sharedTag = document.createElement('style');
    sharedTag.textContent = sharedBaseCSS;
    document.head.appendChild(sharedTag);

    const dailyTag = document.createElement('style');
    dailyTag.textContent = dailyCSS;
    document.head.appendChild(dailyTag);
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });

  describe('Stylesheet Loading', () => {
    test('daily.html loads shared-base.css first, then daily.css', () => {
      const linkTags = dailyHTML.match(/<link[^>]*stylesheet[^>]*>/gi);
      expect(linkTags).toBeTruthy();

      const stylesheetLinks = linkTags.filter((tag) => tag.includes('href="css/'));
      expect(stylesheetLinks[0]).toContain('shared-base.css');
      expect(stylesheetLinks[1]).toContain('daily.css');
    });
  });

  describe('CSS Variables - Unified Color System', () => {
    test('shared-base.css defines base color palette with values', () => {
      expect(sharedBaseCSS).toContain('--color-paper: #f2efe9');
      expect(sharedBaseCSS).toContain('--color-page-bg: #2a2a2a');
      expect(sharedBaseCSS).toContain('--color-text: #1a1a1a');
      expect(sharedBaseCSS).toContain('--color-border: #2c2c2c');
      expect(sharedBaseCSS).toContain('--color-accent: #8b0000');
      expect(sharedBaseCSS).toContain('--color-muted: #d6d1c7');
    });

    test('shared-base.css defines legacy color aliases', () => {
      expect(sharedBaseCSS).toContain('--paper: var(--color-paper)');
      expect(sharedBaseCSS).toContain('--bg-color: var(--color-paper)');
      expect(sharedBaseCSS).toContain('--newsprint-black: var(--color-border)');
      expect(sharedBaseCSS).toContain('--ink-gray: var(--color-text-secondary)');
      expect(sharedBaseCSS).toContain('--text-color: var(--color-text)');
    });

    test('daily.css does NOT redefine color variables', () => {
      expect(dailyCSS).not.toContain(':root {');
      expect(dailyCSS).not.toContain('--bg-color:');
      expect(dailyCSS).not.toContain('--text-color:');
    });
  });

  describe('CSS Variables - Unified Typography System', () => {
    test('shared-base.css defines typography variables', () => {
      expect(sharedBaseCSS).toContain('--font-masthead:');
      expect(sharedBaseCSS).toContain('--font-headline:');
      expect(sharedBaseCSS).toContain('--font-body:');
      expect(sharedBaseCSS).toContain('--font-record:');
      expect(sharedBaseCSS).toContain('--font-data:');
      expect(sharedBaseCSS).toContain('--font-console:');
      expect(sharedBaseCSS).toContain('--font-symbols:');
      expect(sharedBaseCSS).toContain('--font-accent:');
    });

    test('daily.css does NOT redefine typography variables', () => {
      expect(dailyCSS).not.toContain('--font-masthead:');
      expect(dailyCSS).not.toContain('--font-headline:');
    });
  });

  describe('Utility Classes', () => {
    test('shared-base.css defines utility classes', () => {
      expect(sharedBaseCSS).toContain('.text-center');
      expect(sharedBaseCSS).toContain('.text-right');
      expect(sharedBaseCSS).toContain('.font-bold');
      expect(sharedBaseCSS).toContain('.italic');
      expect(sharedBaseCSS).toContain('.uppercase');
    });

    test('daily.css does NOT duplicate utility classes', () => {
      expect(dailyCSS).not.toContain('.text-center {');
      expect(dailyCSS).not.toContain('.font-bold {');
      expect(dailyCSS).not.toContain('.italic {');
    });
  });

  describe('BEM Classes for Inline Styles', () => {
    test('shared-base.css defines daily-specific BEM classes', () => {
      expect(sharedBaseCSS).toContain('.daily-character__title');
      expect(sharedBaseCSS).toContain('.daily-registry__title');
      expect(sharedBaseCSS).toContain('.daily-registry__description');
      expect(sharedBaseCSS).toContain('.daily-pipeworks');
      expect(sharedBaseCSS).toContain('.daily-pipeworks__item');
      expect(sharedBaseCSS).toContain('.daily-list--square');
      expect(sharedBaseCSS).toContain('.daily-img--orrin-crop');
      expect(sharedBaseCSS).toContain('.daily-img--mistress-crop');
      expect(sharedBaseCSS).toContain('.daily-position-relative');
    });
  });

  describe('No Inline Styles in HTML', () => {
    test('no inline styles on h4 elements', () => {
      const h4Elements = document.querySelectorAll('h4');
      h4Elements.forEach((h4) => {
        expect(h4.hasAttribute('style')).toBe(false);
      });
    });

    test('no inline styles on h5 elements', () => {
      const h5Elements = document.querySelectorAll('h5');
      h5Elements.forEach((h5) => {
        expect(h5.hasAttribute('style')).toBe(false);
      });
    });

    test('no inline styles on images', () => {
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        expect(img.hasAttribute('style')).toBe(false);
      });
    });

    test('no inline styles on ul elements', () => {
      const lists = document.querySelectorAll('ul');
      lists.forEach((ul) => {
        expect(ul.hasAttribute('style')).toBe(false);
      });
    });

    test('no inline styles on p elements in pipeworks section', () => {
      const pipeworksDiv = document.querySelector('.daily-pipeworks');
      expect(pipeworksDiv).toBeTruthy();

      const pElements = pipeworksDiv.querySelectorAll('p');
      pElements.forEach((p) => {
        expect(p.hasAttribute('style')).toBe(false);
      });
    });
  });

  describe('HTML Structure - BEM Classes Applied', () => {
    test('free-stamp wrapper has position-relative class', () => {
      const wrapper = document.querySelector('.daily-position-relative');
      expect(wrapper).toBeTruthy();
      expect(wrapper.querySelector('.free-stamp')).toBeTruthy();
    });

    test('character title uses BEM class', () => {
      const title = document.querySelector('.daily-character__title');
      expect(title).toBeTruthy();
      expect(title.textContent).toContain('The Mistress of Mayhem');
    });

    test('registry title uses BEM class', () => {
      const title = document.querySelector('.daily-registry__title');
      expect(title).toBeTruthy();
      expect(title.textContent).toContain('Registry of Notable Mis-Adventures');
    });

    test('registry description uses BEM class', () => {
      const desc = document.querySelector('.daily-registry__description');
      expect(desc).toBeTruthy();
      expect(desc.textContent).toContain('Filed for reference, not encouragement');
    });

    test('Orrin Pike image has crop class', () => {
      const orrinImg = document.querySelector('img[alt="Orrin Pike"].daily-img--orrin-crop');
      expect(orrinImg).toBeTruthy();
    });

    test('Mistress image has crop class', () => {
      const mistressImg = document.querySelector(
        'img[alt="Mistress of Mayhem"].daily-img--mistress-crop',
      );
      expect(mistressImg).toBeTruthy();
    });

    test('pipeworks container uses BEM class', () => {
      const pipeworks = document.querySelector('.daily-pipeworks');
      expect(pipeworks).toBeTruthy();
    });

    test('pipeworks items use BEM class', () => {
      const items = document.querySelectorAll('.daily-pipeworks__item');
      expect(items.length).toBe(4);
    });

    test('sidebar lists with square bullets use modifier class', () => {
      const squareLists = document.querySelectorAll('.daily-list--square');
      expect(squareLists.length).toBeGreaterThan(0);
    });
  });

  describe('Layout Preservation', () => {
    test('container has max-width defined in daily.css', () => {
      expect(dailyCSS).toContain('max-width: 1200px');
    });

    test('content-grid maintains 2fr/1fr layout at 1024px breakpoint', () => {
      expect(dailyCSS).toContain('grid-template-columns: 2fr 1fr');
      expect(dailyCSS).toContain('@media (width >= 1024px)');
    });

    test('float-right images maintain 250px width', () => {
      expect(dailyCSS).toContain('width: 250px');
    });

    test('masthead title font-size preserved', () => {
      expect(dailyCSS).toContain('font-size: 5rem');
    });

    test('body background color uses variable', () => {
      expect(dailyCSS).toContain('background-color: var(--bg-color)');
    });
  });

  describe('No Duplicate Styles', () => {
    test('daily.css does not contain reset styles', () => {
      expect(dailyCSS).not.toMatch(/\* \{[^}]*box-sizing/);
    });

    test('daily.css maintains page-specific body styles', () => {
      expect(dailyCSS).toContain('body {');
      expect(dailyCSS).toContain('background-color: var(--bg-color)');
    });
  });
});
