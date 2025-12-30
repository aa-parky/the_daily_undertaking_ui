/**
 * @jest-environment jsdom
 */

/* eslint-env node */

const fs = require('fs');
const path = require('path');

describe('Landing.html CSS Refactoring - Layout Preservation Tests', () => {
  let landingHTML;
  let landingCSS;
  let sharedBaseCSS;

  beforeAll(() => {
    // Load the HTML and CSS files
    landingHTML = fs.readFileSync(path.join(__dirname, '../../landing.html'), 'utf8');
    landingCSS = fs.readFileSync(path.join(__dirname, '../../css/landing.css'), 'utf8');
    sharedBaseCSS = fs.readFileSync(path.join(__dirname, '../../css/shared-base.css'), 'utf8');
  });

  beforeEach(() => {
    document.documentElement.innerHTML = landingHTML;

    // Inject both stylesheets in correct order
    const sharedTag = document.createElement('style');
    sharedTag.textContent = sharedBaseCSS;
    document.head.appendChild(sharedTag);

    const landingTag = document.createElement('style');
    landingTag.textContent = landingCSS;
    document.head.appendChild(landingTag);
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });

  describe('Stylesheet Loading', () => {
    test('landing.html loads shared-base.css first, then landing.css', () => {
      const linkTags = landingHTML.match(/<link[^>]*stylesheet[^>]*>/gi);
      expect(linkTags).toBeTruthy();

      const stylesheetLinks = linkTags.filter((tag) => tag.includes('href="css/'));
      expect(stylesheetLinks[0]).toContain('shared-base.css');
      expect(stylesheetLinks[1]).toContain('landing.css');
    });
  });

  describe('CSS Variables - Unified System', () => {
    test('shared-base.css defines base color palette', () => {
      expect(sharedBaseCSS).toContain('--paper:');
      expect(sharedBaseCSS).toContain('--newsprint-black:');
      expect(sharedBaseCSS).toContain('--ink-gray:');
      expect(sharedBaseCSS).toContain('--faded-ink:');
      expect(sharedBaseCSS).toContain('--light-gray:');
    });

    test('landing.css defines ONLY landing-specific color variables', () => {
      expect(landingCSS).toContain('--accent-gold:');
      expect(landingCSS).toContain('--error-red:');
      expect(landingCSS).toContain('--success-green:');
      expect(landingCSS).toContain('--weak-orange:');
      expect(landingCSS).toContain('--medium-blue:');
    });

    test('landing.css does NOT duplicate base color variables', () => {
      // Should not redefine these - they come from shared-base.css
      const rootBlocks = landingCSS.match(/:root\s*{[^}]*}/g) || [];
      const rootContent = rootBlocks.join(' ');

      // These should NOT be in landing.css :root
      expect(rootContent).not.toContain('--paper: #');
      expect(rootContent).not.toContain('--paper-dark: #');
      expect(rootContent).not.toContain('--newsprint-black: #');
    });
  });

  describe('Layout Preservation - Critical Dimensions', () => {
    test('container has fixed width of 1250px', () => {
      expect(landingCSS).toContain('width: 1250px');
    });

    test('container has fixed height of 590px', () => {
      expect(landingCSS).toContain('height: 590px');
    });

    test('container uses flexbox vertical layout', () => {
      expect(landingCSS).toContain('display: flex');
      expect(landingCSS).toContain('flex-direction: column');
    });

    test('body uses flexbox centering', () => {
      expect(landingCSS).toContain('justify-content: center');
      expect(landingCSS).toContain('align-items: center');
    });

    test('body has dark background', () => {
      expect(landingCSS).toContain('background: var(--color-page-bg)');
    });
  });

  describe('HTML Structure', () => {
    test('container element exists', () => {
      const container = document.querySelector('.container');
      expect(container).toBeTruthy();
    });

    test('masthead section exists', () => {
      const masthead = document.querySelector('.masthead');
      expect(masthead).toBeTruthy();
    });

    test('headline section exists', () => {
      const headline = document.querySelector('.headline-section');
      expect(headline).toBeTruthy();
    });

    test('forms section exists', () => {
      const forms = document.querySelector('.forms-section');
      expect(forms).toBeTruthy();
    });

    test('footer notice exists', () => {
      const footer = document.querySelector('.footer-notice');
      expect(footer).toBeTruthy();
    });

    test('login modal exists', () => {
      const loginModal = document.querySelector('#loginModal');
      expect(loginModal).toBeTruthy();
    });

    test('register modal exists', () => {
      const registerModal = document.querySelector('#registerModal');
      expect(registerModal).toBeTruthy();
    });
  });

  describe('Form Elements', () => {
    test('login form has all required fields', () => {
      const usernameField = document.querySelector('#loginUsername');
      const passwordField = document.querySelector('#loginPassword');
      const submitButton = document.querySelector('#loginForm .submit-button');

      expect(usernameField).toBeTruthy();
      expect(passwordField).toBeTruthy();
      expect(submitButton).toBeTruthy();
    });

    test('register form has all required fields', () => {
      const usernameField = document.querySelector('#registerUsername');
      const emailField = document.querySelector('#registerEmail');
      const passwordField = document.querySelector('#registerPassword');
      const confirmField = document.querySelector('#registerPasswordConfirm');
      const submitButton = document.querySelector('#registerForm .submit-button');

      expect(usernameField).toBeTruthy();
      expect(emailField).toBeTruthy();
      expect(passwordField).toBeTruthy();
      expect(confirmField).toBeTruthy();
      expect(submitButton).toBeTruthy();
    });

    test('password toggle buttons exist', () => {
      const toggleButtons = document.querySelectorAll('.password-toggle');
      expect(toggleButtons.length).toBeGreaterThan(0);
    });

    test('password strength indicator exists in register form', () => {
      const strengthIndicator = document.querySelector('.password-strength');
      expect(strengthIndicator).toBeTruthy();
    });
  });

  describe('Typo Fix', () => {
    test('form-footnote uses correct font family variable', () => {
      expect(landingCSS).toContain('.form-footnote {' || '.form-footnote{');
      expect(landingCSS).toMatch(/\.form-footnote\s*{[^}]*font-family:\s*var\(--font-garamond\)/);
    });

    test('landing.css does NOT contain typo "EB Garadam"', () => {
      expect(landingCSS).not.toContain('EB Garadam');
    });
  });

  describe('No Duplicate Styles', () => {
    test('landing.css has its own body styling', () => {
      expect(landingCSS).toContain('body {');
      expect(landingCSS).toContain('background: var(--color-page-bg)');
    });

    test('landing.css maintains page-specific container styles', () => {
      expect(landingCSS).toContain('.container {');
      expect(landingCSS).toContain('width: 1250px');
      expect(landingCSS).toContain('height: 590px');
    });

    test('landing.css does not contain reset styles', () => {
      // Reset should come from shared-base.css
      const hasStandaloneReset = landingCSS.match(/^\*\s*{[^}]*}/m);
      expect(hasStandaloneReset).toBeFalsy();
    });
  });

  describe('Background and Texture', () => {
    test('container has background texture image', () => {
      expect(landingCSS).toContain('background-image:');
      expect(landingCSS).toContain('assult.png');
    });

    test('container has paper background color', () => {
      expect(landingCSS).toContain('background: var(--paper)');
    });

    test('container has ornamental border effect', () => {
      expect(landingCSS).toContain('box-shadow:');
      expect(landingCSS).toContain('3px solid var(--newsprint-black)');
    });
  });

  describe('Modal Structure', () => {
    test('modals have proper ARIA attributes', () => {
      const loginModal = document.querySelector('#loginModal');
      expect(loginModal.getAttribute('role')).toBe('dialog');
      expect(loginModal.getAttribute('aria-modal')).toBe('true');
      expect(loginModal.hasAttribute('aria-labelledby')).toBe(true);
    });

    test('form inputs have proper accessibility attributes', () => {
      const usernameInput = document.querySelector('#loginUsername');
      expect(usernameInput.hasAttribute('aria-describedby')).toBe(true);
      expect(usernameInput.getAttribute('required')).toBe('');
    });

    test('error containers have proper ARIA roles', () => {
      const errorContainers = document.querySelectorAll('.field-error');
      errorContainers.forEach((container) => {
        expect(container.getAttribute('role')).toBe('alert');
      });
    });
  });

  describe('Responsive Behavior', () => {
    test('landing.css includes responsive media queries', () => {
      expect(landingCSS).toContain('@media');
      expect(landingCSS).toContain('width <= 1280px');
      expect(landingCSS).toContain('width <= 1250px');
    });
  });
});
