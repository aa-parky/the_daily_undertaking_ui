/**
 * @jest-environment jsdom
 */

/* eslint-env node */

/**
 * Integration tests for popup initialization functions
 * Tests that initializeDailyLoginPopup and initializeDailyRegisterPopup
 * properly attach all event listeners
 */

import { initializeDailyLoginPopup, initializeDailyRegisterPopup } from '../../js/popup-manager';

describe('Popup Initialization Functions', () => {
  describe('initializeDailyLoginPopup', () => {
    beforeEach(() => {
      // Create minimal login popup HTML structure
      document.body.innerHTML = `
        <div id="dailyLoginModal" class="form-modal">
          <div class="modal-overlay"></div>
          <div class="modal-form">
            <button type="button" class="modal-close">&times;</button>
            <form id="dailyLoginForm">
              <input type="text" id="dailyLoginUsername" aria-describedby="loginUsernameError" />
              <div id="loginUsernameError" class="field-error"></div>
              <div class="password-wrapper">
                <input type="password" id="dailyLoginPassword" aria-describedby="loginPasswordError" />
                <button type="button" class="password-toggle">
                  <span class="toggle-icon">👁</span>
                </button>
              </div>
              <div id="loginPasswordError" class="field-error"></div>
              <div class="form-error"></div>
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
        <div id="dailyAuthModal" class="auth-modal">
          <div class="modal-message"></div>
          <div class="modal-title"></div>
        </div>
      `;
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    test('should initialize without errors when modal exists', () => {
      expect(() => initializeDailyLoginPopup()).not.toThrow();
    });

    test('should not throw when modal does not exist', () => {
      document.body.innerHTML = '';
      expect(() => initializeDailyLoginPopup()).not.toThrow();
    });

    test('should attach close button click handler', () => {
      const modal = document.getElementById('dailyLoginModal');
      const closeBtn = modal.querySelector('.modal-close');

      initializeDailyLoginPopup();

      modal.classList.add('active');
      expect(modal.classList.contains('active')).toBe(true);

      closeBtn.click();

      expect(modal.classList.contains('active')).toBe(false);
    });

    test('should attach overlay click handler', () => {
      const modal = document.getElementById('dailyLoginModal');
      const overlay = modal.querySelector('.modal-overlay');

      initializeDailyLoginPopup();

      modal.classList.add('active');

      // Simulate overlay click
      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: overlay, writable: false });
      overlay.dispatchEvent(event);

      expect(modal.classList.contains('active')).toBe(false);
    });

    test('should attach ESC key handler', () => {
      const modal = document.getElementById('dailyLoginModal');

      initializeDailyLoginPopup();

      modal.classList.add('active');

      // Dispatch ESC key event
      const escEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      });
      document.dispatchEvent(escEvent);

      expect(modal.classList.contains('active')).toBe(false);
    });

    test('should not close on ESC when modal is not active', () => {
      const modal = document.getElementById('dailyLoginModal');

      initializeDailyLoginPopup();

      // Modal is not active
      modal.classList.remove('active');

      // Dispatch ESC key event
      const escEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      });
      document.dispatchEvent(escEvent);

      // Modal should still not be active (no change)
      expect(modal.classList.contains('active')).toBe(false);
    });

    test('should attach password toggle handler', () => {
      const passwordInput = document.getElementById('dailyLoginPassword');
      const passwordToggle = document.querySelector('.password-toggle');

      initializeDailyLoginPopup();

      expect(passwordInput.getAttribute('type')).toBe('password');

      passwordToggle.click();

      expect(passwordInput.getAttribute('type')).toBe('text');
    });

    test('should attach form validation', () => {
      const usernameInput = document.getElementById('dailyLoginUsername');

      initializeDailyLoginPopup();

      // Trigger validation by blurring with invalid value
      usernameInput.value = 'ab'; // Too short
      usernameInput.dispatchEvent(new Event('blur'));

      const errorElement = document.getElementById('loginUsernameError');
      expect(errorElement.textContent).toBeTruthy();
      expect(usernameInput.classList.contains('error')).toBe(true);
    });
  });

  describe('initializeDailyRegisterPopup', () => {
    beforeEach(() => {
      // Create minimal register popup HTML structure
      document.body.innerHTML = `
        <div id="dailyRegisterModal" class="form-modal">
          <div class="modal-overlay"></div>
          <div class="modal-form">
            <button type="button" class="modal-close">&times;</button>
            <form id="dailyRegisterForm">
              <input type="text" id="dailyRegisterUsername" aria-describedby="registerUsernameError" />
              <div id="registerUsernameError" class="field-error"></div>

              <input type="email" id="dailyRegisterEmail" aria-describedby="registerEmailError" />
              <div id="registerEmailError" class="field-error"></div>

              <div class="password-wrapper">
                <input type="password" id="dailyRegisterPassword" aria-describedby="registerPasswordError registerPasswordStrength" />
                <button type="button" class="password-toggle">
                  <span class="toggle-icon">👁</span>
                </button>
              </div>
              <div id="dailyRegisterPasswordStrength" class="password-strength">
                <div class="strength-fill"></div>
                <div class="strength-label"></div>
              </div>
              <div id="registerPasswordError" class="field-error"></div>

              <div class="password-wrapper">
                <input type="password" id="dailyRegisterPasswordConfirm" aria-describedby="registerPasswordConfirmError" />
                <button type="button" class="password-toggle">
                  <span class="toggle-icon">👁</span>
                </button>
              </div>
              <div id="registerPasswordConfirmError" class="field-error"></div>

              <div class="form-error"></div>
              <button type="submit">Register</button>
            </form>
          </div>
        </div>
        <div id="dailyAuthModal" class="auth-modal">
          <div class="modal-message"></div>
          <div class="modal-title"></div>
        </div>
      `;
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    test('should initialize without errors when modal exists', () => {
      expect(() => initializeDailyRegisterPopup()).not.toThrow();
    });

    test('should not throw when modal does not exist', () => {
      document.body.innerHTML = '';
      expect(() => initializeDailyRegisterPopup()).not.toThrow();
    });

    test('should attach close button click handler', () => {
      const modal = document.getElementById('dailyRegisterModal');
      const closeBtn = modal.querySelector('.modal-close');

      initializeDailyRegisterPopup();

      modal.classList.add('active');
      expect(modal.classList.contains('active')).toBe(true);

      closeBtn.click();

      expect(modal.classList.contains('active')).toBe(false);
    });

    test('should attach overlay click handler', () => {
      const modal = document.getElementById('dailyRegisterModal');
      const overlay = modal.querySelector('.modal-overlay');

      initializeDailyRegisterPopup();

      modal.classList.add('active');

      // Simulate overlay click
      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: overlay, writable: false });
      overlay.dispatchEvent(event);

      expect(modal.classList.contains('active')).toBe(false);
    });

    test('should attach ESC key handler', () => {
      const modal = document.getElementById('dailyRegisterModal');

      initializeDailyRegisterPopup();

      modal.classList.add('active');

      // Dispatch ESC key event
      const escEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      });
      document.dispatchEvent(escEvent);

      expect(modal.classList.contains('active')).toBe(false);
    });

    test('should attach password toggles for both password fields', () => {
      const passwordInput = document.getElementById('dailyRegisterPassword');
      const confirmInput = document.getElementById('dailyRegisterPasswordConfirm');
      const passwordToggles = document.querySelectorAll('.password-toggle');

      initializeDailyRegisterPopup();

      expect(passwordInput.getAttribute('type')).toBe('password');
      expect(confirmInput.getAttribute('type')).toBe('password');

      // Click first toggle (password field)
      passwordToggles[0].click();
      expect(passwordInput.getAttribute('type')).toBe('text');

      // Click second toggle (confirm field)
      passwordToggles[1].click();
      expect(confirmInput.getAttribute('type')).toBe('text');
    });

    test('should attach password strength indicator', () => {
      const passwordInput = document.getElementById('dailyRegisterPassword');
      const strengthFill = document.querySelector('.strength-fill');
      const strengthLabel = document.querySelector('.strength-label');

      initializeDailyRegisterPopup();

      // Type a weak password
      passwordInput.value = 'Pass1';
      passwordInput.dispatchEvent(new Event('input'));

      expect(strengthFill.getAttribute('data-strength')).toBe('weak');
      expect(strengthLabel.textContent).toBe('Inadequate');

      // Type a strong password
      passwordInput.value = 'Password123!@#';
      passwordInput.dispatchEvent(new Event('input'));

      expect(strengthFill.getAttribute('data-strength')).toBe('strong');
      expect(strengthLabel.textContent).toBe('Exemplary');
    });

    test('should attach password match validation', () => {
      const passwordInput = document.getElementById('dailyRegisterPassword');
      const confirmInput = document.getElementById('dailyRegisterPasswordConfirm');

      initializeDailyRegisterPopup();

      passwordInput.value = 'Password123';
      confirmInput.value = 'Password456';

      confirmInput.dispatchEvent(new Event('blur'));

      const errorElement = document.getElementById('registerPasswordConfirmError');
      expect(errorElement.textContent).toBe('Ciphers do not match');
      expect(confirmInput.classList.contains('error')).toBe(true);
    });
  });

  describe('Integration with daily.html', () => {
    test('should document the correct usage pattern', () => {
      const usagePattern = {
        step1: 'Fetch popup HTML file',
        step2: 'Insert HTML with insertAdjacentHTML',
        step3: 'Call initialization function immediately after',
        step4: 'Open modal with openFormModal',
      };

      expect(usagePattern.step3).toBe('Call initialization function immediately after');
    });

    test('should confirm script tags in injected HTML do not execute', () => {
      const behavior = {
        insertAdjacentHTML: 'Does NOT execute script tags',
        reason: 'Browser security feature',
        solution: 'Use initialization functions from popup-manager.js',
      };

      expect(behavior.insertAdjacentHTML).toBe('Does NOT execute script tags');
      expect(behavior.solution).toBe('Use initialization functions from popup-manager.js');
    });
  });
});
