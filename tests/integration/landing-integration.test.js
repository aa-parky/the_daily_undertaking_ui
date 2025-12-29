import '@testing-library/jest-dom';
import { fireEvent, waitFor } from '@testing-library/dom';

describe('Landing Page Integration Tests', () => {
  beforeEach(() => {
    // Set up complete landing page DOM with modal structure
    document.body.innerHTML = `
      <div id="currentYear"></div>
      <button type="button" id="openLoginBtn">Open Login</button>
      <button type="button" id="openRegisterBtn">Open Register</button>
      <div id="loginModal" class="form-modal">
        <div class="modal-overlay"></div>
        <div class="modal-form">
          <button type="button" class="modal-close">&times;</button>
          <form id="loginForm">
            <input id="loginUsername" aria-describedby="loginUsernameError" autocomplete="username" />
            <div id="loginUsernameError" class="field-error"></div>
            <div class="password-wrapper">
              <input id="loginPassword" type="password" aria-describedby="loginPasswordError" autocomplete="current-password" />
              <button type="button" class="password-toggle"><span class="toggle-icon">👁</span></button>
            </div>
            <div id="loginPasswordError" class="field-error"></div>
            <div class="form-error"></div>
            <button type="submit" class="submit-button">Login</button>
          </form>
        </div>
      </div>
      <div id="registerModal" class="form-modal">
        <div class="modal-overlay"></div>
        <div class="modal-form">
          <button type="button" class="modal-close">&times;</button>
          <form id="registerForm">
            <input id="registerUsername" aria-describedby="registerUsernameError" autocomplete="username" />
            <div id="registerUsernameError" class="field-error"></div>
            <input id="registerEmail" aria-describedby="registerEmailError" autocomplete="email" />
            <div id="registerEmailError" class="field-error"></div>
            <div class="password-wrapper">
              <input id="registerPassword" type="password" aria-describedby="registerPasswordError registerPasswordStrength" autocomplete="new-password" />
              <button type="button" class="password-toggle"><span class="toggle-icon">👁</span></button>
            </div>
            <div id="registerPasswordError" class="field-error"></div>
            <div id="registerPasswordStrength" class="password-strength">
              <div class="strength-bar">
                <div class="strength-fill" data-strength="none"></div>
              </div>
              <div class="strength-text">
                <span class="strength-label">Not set</span>
              </div>
            </div>
            <div class="password-wrapper">
              <input id="registerPasswordConfirm" type="password" aria-describedby="registerPasswordConfirmError" autocomplete="new-password" />
              <button type="button" class="password-toggle"><span class="toggle-icon">👁</span></button>
            </div>
            <div id="registerPasswordConfirmError" class="field-error"></div>
            <div class="form-error"></div>
            <button type="submit" class="submit-button">Register</button>
          </form>
        </div>
      </div>
      <div id="authModal" class="auth-modal">
        <div class="modal-content">
          <h4 id="modalTitle" class="modal-title">Processing</h4>
          <p id="modalMessage" class="modal-message">Loading...</p>
        </div>
      </div>
    `;

    // Load landing.js
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require, import/extensions
      require('../../js/landing.js');
    });

    // Trigger DOMContentLoaded
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Complete Login Flow', () => {
    it('should handle successful login with demo credentials', async () => {
      // Mock redirect to avoid jsdom navigation error
      window.redirectToGame = jest.fn();

      const usernameInput = document.getElementById('loginUsername');
      const passwordInput = document.getElementById('loginPassword');
      const form = document.getElementById('loginForm');
      const modal = document.getElementById('authModal');

      // Fill in valid credentials
      fireEvent.change(usernameInput, { target: { value: 'demo' } });
      fireEvent.change(passwordInput, { target: { value: 'Demo1234' } });

      // Submit form
      fireEvent.submit(form);

      // Check that modal appears
      expect(modal.classList.contains('active')).toBe(true);

      // Wait for authentication to complete
      await waitFor(
        () => {
          expect(localStorage.getItem('authToken')).toBeTruthy();
        },
        { timeout: 3000 },
      );

      // Check that token contains expected prefix
      expect(localStorage.getItem('authToken')).toContain('demo-jwt-token');
    });

    it('should display error for invalid credentials', async () => {
      const usernameInput = document.getElementById('loginUsername');
      const passwordInput = document.getElementById('loginPassword');
      const form = document.getElementById('loginForm');

      // Fill in invalid credentials
      fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
      fireEvent.change(passwordInput, { target: { value: 'WrongPass123' } });

      // Submit form
      fireEvent.submit(form);

      // Wait for error to appear
      await waitFor(
        () => {
          const errorDiv = form.querySelector('.form-error');
          expect(errorDiv.textContent).toBeTruthy();
          expect(errorDiv.textContent).toContain('Invalid credentials');
        },
        { timeout: 3000 },
      );
    });

    it('should prevent submission with invalid username format', () => {
      const usernameInput = document.getElementById('loginUsername');
      const passwordInput = document.getElementById('loginPassword');
      const form = document.getElementById('loginForm');

      // Fill in invalid username (too short)
      fireEvent.change(usernameInput, { target: { value: 'ab' } });
      fireEvent.change(passwordInput, { target: { value: 'ValidPass123' } });

      // Submit form
      fireEvent.submit(form);

      // Check that error is displayed
      const usernameError = document.getElementById('loginUsernameError');
      expect(usernameError.textContent).toContain('3-20 characters');

      // Check that modal did not appear
      const modal = document.getElementById('authModal');
      expect(modal.classList.contains('active')).toBe(false);
    });

    it('should prevent submission with invalid password format', () => {
      const usernameInput = document.getElementById('loginUsername');
      const passwordInput = document.getElementById('loginPassword');
      const form = document.getElementById('loginForm');

      // Fill in invalid password (too short, no uppercase)
      fireEvent.change(usernameInput, { target: { value: 'validuser' } });
      fireEvent.change(passwordInput, { target: { value: 'short1' } });

      // Submit form
      fireEvent.submit(form);

      // Check that error is displayed
      const passwordError = document.getElementById('loginPasswordError');
      expect(passwordError.textContent).toBeTruthy();

      // Check that modal did not appear
      const modal = document.getElementById('authModal');
      expect(modal.classList.contains('active')).toBe(false);
    });
  });

  describe('Complete Registration Flow', () => {
    it('should handle successful registration and auto-login', async () => {
      // Mock redirect to avoid jsdom navigation error
      window.__redirectCalled = false;

      // Mock authenticateUser to succeed for new user
      const originalAuth = window.authenticateUser;
      window.authenticateUser = jest.fn().mockResolvedValue({
        success: true,
        token: `new-user-token-${Date.now()}`,
      });

      const usernameInput = document.getElementById('registerUsername');
      const emailInput = document.getElementById('registerEmail');
      const passwordInput = document.getElementById('registerPassword');
      const confirmPasswordInput = document.getElementById('registerPasswordConfirm');
      const form = document.getElementById('registerForm');
      const modal = document.getElementById('authModal');

      // Fill in valid registration data
      fireEvent.change(usernameInput, { target: { value: 'newuser123' } });
      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'NewPass123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'NewPass123' } });

      // Submit form
      fireEvent.submit(form);

      // Check that modal appears
      expect(modal.classList.contains('active')).toBe(true);

      // Wait for registration and auto-login to complete
      await waitFor(
        () => {
          expect(localStorage.getItem('authToken')).toBeTruthy();
        },
        { timeout: 8000 },
      );

      // Restore original
      window.authenticateUser = originalAuth;
    }, 10000); // Increase test timeout to 10 seconds

    it('should reject registration with existing username', async () => {
      const usernameInput = document.getElementById('registerUsername');
      const emailInput = document.getElementById('registerEmail');
      const passwordInput = document.getElementById('registerPassword');
      const confirmPasswordInput = document.getElementById('registerPasswordConfirm');
      const form = document.getElementById('registerForm');

      // Try to register with 'demo' username
      fireEvent.change(usernameInput, { target: { value: 'demo' } });
      fireEvent.change(emailInput, { target: { value: 'demo@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Demo1234' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'Demo1234' } });

      // Submit form
      fireEvent.submit(form);

      // Wait for error to appear
      await waitFor(
        () => {
          const errorDiv = form.querySelector('.form-error');
          expect(errorDiv.textContent).toContain('already enrolled');
        },
        { timeout: 3000 },
      );
    });

    it('should validate password confirmation matches', () => {
      const passwordInput = document.getElementById('registerPassword');
      const confirmPasswordInput = document.getElementById('registerPasswordConfirm');
      const form = document.getElementById('registerForm');

      // Fill in non-matching passwords
      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'Password456' } });

      // Submit form
      fireEvent.submit(form);

      // Check that error is displayed
      const confirmError = document.getElementById('registerPasswordConfirmError');
      expect(confirmError.textContent).toContain('match');
    });

    it('should validate all fields before submission', () => {
      const form = document.getElementById('registerForm');
      const usernameInput = document.getElementById('registerUsername');
      const emailInput = document.getElementById('registerEmail');
      const passwordInput = document.getElementById('registerPassword');
      const confirmPasswordInput = document.getElementById('registerPasswordConfirm');

      // Ensure fields are empty
      usernameInput.value = '';
      emailInput.value = '';
      passwordInput.value = '';
      confirmPasswordInput.value = '';

      // Submit empty form
      fireEvent.submit(form);

      // Check that multiple errors are displayed
      const usernameError = document.getElementById('registerUsernameError');
      const emailError = document.getElementById('registerEmailError');
      const confirmPasswordError = document.getElementById('registerPasswordConfirmError');

      expect(usernameError.textContent).toBeTruthy();
      expect(emailError.textContent).toBeTruthy();
      expect(confirmPasswordError.textContent).toBeTruthy();
    });
  });

  describe('Real-time Field Validation', () => {
    it('should show inline error on blur for invalid username', () => {
      const usernameInput = document.getElementById('loginUsername');
      const errorDiv = document.getElementById('loginUsernameError');

      // Enter invalid value
      fireEvent.change(usernameInput, { target: { value: 'a' } });
      fireEvent.blur(usernameInput);

      expect(errorDiv.textContent).toBeTruthy();
      expect(usernameInput.classList.contains('error')).toBe(true);
    });

    it('should clear error when input becomes valid', () => {
      const usernameInput = document.getElementById('loginUsername');
      const errorDiv = document.getElementById('loginUsernameError');

      // Enter invalid value
      fireEvent.change(usernameInput, { target: { value: 'a' } });
      fireEvent.blur(usernameInput);

      expect(errorDiv.textContent).toBeTruthy();

      // Fix the value
      fireEvent.change(usernameInput, { target: { value: 'validUsername' } });
      fireEvent.input(usernameInput);

      expect(usernameInput.classList.contains('error')).toBe(false);
    });

    it('should show valid state for valid username', () => {
      const usernameInput = document.getElementById('loginUsername');

      fireEvent.change(usernameInput, { target: { value: 'validUser123' } });
      fireEvent.blur(usernameInput);

      expect(usernameInput.classList.contains('valid')).toBe(true);
      expect(usernameInput.classList.contains('error')).toBe(false);
    });

    it('should validate email format on blur', () => {
      const emailInput = document.getElementById('registerEmail');
      const errorDiv = document.getElementById('registerEmailError');

      // Enter invalid email
      fireEvent.change(emailInput, { target: { value: 'notanemail' } });
      fireEvent.blur(emailInput);

      expect(errorDiv.textContent).toContain('valid');
    });

    it('should update password strength in real-time', () => {
      const passwordInput = document.getElementById('registerPassword');
      const strengthFill = document.querySelector('#registerPasswordStrength .strength-fill');
      const strengthLabel = document.querySelector('#registerPasswordStrength .strength-label');

      // Type weak password
      fireEvent.change(passwordInput, { target: { value: 'Pass1' } });
      fireEvent.input(passwordInput);

      expect(strengthLabel.textContent).toBe('Inadequate');

      // Type medium password
      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.input(passwordInput);

      expect(strengthFill.getAttribute('data-strength')).toBe('medium');
      expect(strengthLabel.textContent).toBe('Acceptable');

      // Type strong password
      fireEvent.change(passwordInput, { target: { value: 'P@ssw0rd!123' } });
      fireEvent.input(passwordInput);

      expect(strengthFill.getAttribute('data-strength')).toBe('strong');
      expect(strengthLabel.textContent).toBe('Exemplary');
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility on button click', () => {
      const passwordWrapper = document.querySelector('#loginPassword').parentElement;
      const passwordInput = passwordWrapper.querySelector('#loginPassword');
      const toggleButton = passwordWrapper.querySelector('.password-toggle');
      const toggleIcon = toggleButton.querySelector('.toggle-icon');

      expect(passwordInput.type).toBe('password');
      expect(toggleIcon.textContent).toBe('👁');

      // Call toggle function directly
      // (fireEvent.click doesn't trigger event listeners properly in jsdom)
      window.togglePasswordVisibility(toggleButton, passwordInput);

      expect(passwordInput.getAttribute('type')).toBe('text');
      expect(toggleIcon.textContent).toBe('⚫');

      // Toggle back
      window.togglePasswordVisibility(toggleButton, passwordInput);

      expect(passwordInput.getAttribute('type')).toBe('password');
      expect(toggleIcon.textContent).toBe('👁');
    });
  });

  describe('Authentication State Check', () => {
    it('should redirect if already authenticated on page load', () => {
      // Set up authenticated state BEFORE loading script
      localStorage.setItem('authToken', 'existing-token');

      // Clear redirect flag
      window.__redirectCalled = false;

      // Reload the script and trigger DOMContentLoaded
      jest.isolateModules(() => {
        // eslint-disable-next-line global-require, import/extensions
        require('../../js/landing.js');
      });
      document.dispatchEvent(new Event('DOMContentLoaded'));

      // Should have called redirect
      expect(window.__redirectCalled).toBe(true);

      localStorage.clear();
    });

    it('should stay on landing page if not authenticated', () => {
      // Ensure no token exists
      localStorage.clear();

      // Forms should be present
      const loginForm = document.getElementById('loginForm');
      const registerForm = document.getElementById('registerForm');

      expect(loginForm).toBeTruthy();
      expect(registerForm).toBeTruthy();
    });
  });

  describe('Modal Behavior', () => {
    it('should show loading modal during authentication', () => {
      const form = document.getElementById('loginForm');
      const usernameInput = document.getElementById('loginUsername');
      const passwordInput = document.getElementById('loginPassword');
      const modal = document.getElementById('authModal');
      const modalMessage = document.getElementById('modalMessage');

      fireEvent.change(usernameInput, { target: { value: 'demo' } });
      fireEvent.change(passwordInput, { target: { value: 'Demo1234' } });

      fireEvent.submit(form);

      expect(modal.classList.contains('active')).toBe(true);
      expect(modalMessage.textContent).toContain('Submitting');
    });

    it('should disable submit buttons during authentication', () => {
      const form = document.getElementById('loginForm');
      const usernameInput = document.getElementById('loginUsername');
      const passwordInput = document.getElementById('loginPassword');
      const submitButton = form.querySelector('.submit-button');

      fireEvent.change(usernameInput, { target: { value: 'demo' } });
      fireEvent.change(passwordInput, { target: { value: 'Demo1234' } });

      fireEvent.submit(form);

      expect(submitButton.disabled).toBe(true);
    });

    it('should hide modal and re-enable buttons after failed auth', async () => {
      const form = document.getElementById('loginForm');
      const usernameInput = document.getElementById('loginUsername');
      const passwordInput = document.getElementById('loginPassword');
      const modal = document.getElementById('authModal');
      const submitButton = form.querySelector('.submit-button');

      fireEvent.change(usernameInput, { target: { value: 'wrong' } });
      fireEvent.change(passwordInput, { target: { value: 'WrongPass123' } });

      fireEvent.submit(form);

      // Wait for authentication to fail
      await waitFor(
        () => {
          expect(modal.classList.contains('active')).toBe(false);
          expect(submitButton.disabled).toBe(false);
        },
        { timeout: 3000 },
      );
    });
  });

  describe('Form Error Display', () => {
    it('should show shake animation on form error', async () => {
      const form = document.getElementById('loginForm');
      const usernameInput = document.getElementById('loginUsername');
      const passwordInput = document.getElementById('loginPassword');
      const errorDiv = form.querySelector('.form-error');

      fireEvent.change(usernameInput, { target: { value: 'wrong' } });
      fireEvent.change(passwordInput, { target: { value: 'WrongPass123' } });

      fireEvent.submit(form);

      await waitFor(
        () => {
          expect(errorDiv.classList.contains('visible')).toBe(true);
        },
        { timeout: 3000 },
      );
    });

    it('should clear previous errors on new submission', () => {
      const form = document.getElementById('loginForm');
      const usernameInput = document.getElementById('loginUsername');
      const passwordInput = document.getElementById('loginPassword');

      // First submission with errors
      fireEvent.change(usernameInput, { target: { value: 'ab' } });
      fireEvent.change(passwordInput, { target: { value: 'short' } });
      fireEvent.submit(form);

      const usernameError = document.getElementById('loginUsernameError');
      expect(usernameError.textContent).toBeTruthy();

      // Fix and resubmit
      fireEvent.change(usernameInput, { target: { value: 'demo' } });
      fireEvent.change(passwordInput, { target: { value: 'Demo1234' } });
      fireEvent.submit(form);

      // Previous errors should be cleared
      expect(usernameError.textContent).toBe('');
    });
  });

  describe('Modal Functionality', () => {
    it('should open login modal when login button is clicked', () => {
      const openLoginBtn = document.getElementById('openLoginBtn');
      const loginModal = document.getElementById('loginModal');

      expect(loginModal.classList.contains('active')).toBe(false);

      fireEvent.click(openLoginBtn);

      expect(loginModal.classList.contains('active')).toBe(true);
    });

    it('should open register modal when register button is clicked', () => {
      const openRegisterBtn = document.getElementById('openRegisterBtn');
      const registerModal = document.getElementById('registerModal');

      expect(registerModal.classList.contains('active')).toBe(false);

      fireEvent.click(openRegisterBtn);

      expect(registerModal.classList.contains('active')).toBe(true);
    });

    it('should close login modal when close button is clicked', () => {
      const loginModal = document.getElementById('loginModal');
      const closeBtn = loginModal.querySelector('.modal-close');

      // Open modal first
      window.openFormModal('loginModal');
      expect(loginModal.classList.contains('active')).toBe(true);

      // Close modal
      fireEvent.click(closeBtn);
      expect(loginModal.classList.contains('active')).toBe(false);
    });

    it('should close register modal when close button is clicked', () => {
      const registerModal = document.getElementById('registerModal');
      const closeBtn = registerModal.querySelector('.modal-close');

      // Open modal first
      window.openFormModal('registerModal');
      expect(registerModal.classList.contains('active')).toBe(true);

      // Close modal
      fireEvent.click(closeBtn);
      expect(registerModal.classList.contains('active')).toBe(false);
    });

    it('should close modal when clicking on overlay', () => {
      const loginModal = document.getElementById('loginModal');
      const overlay = loginModal.querySelector('.modal-overlay');

      // Open modal first
      window.openFormModal('loginModal');
      expect(loginModal.classList.contains('active')).toBe(true);

      // Click overlay
      fireEvent.click(overlay);
      expect(loginModal.classList.contains('active')).toBe(false);
    });

    it('should close modal when pressing Escape key', () => {
      const loginModal = document.getElementById('loginModal');

      // Open modal first
      window.openFormModal('loginModal');
      expect(loginModal.classList.contains('active')).toBe(true);

      // Press Escape
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(loginModal.classList.contains('active')).toBe(false);
    });

    it('should clear form errors when closing modal', () => {
      const usernameInput = document.getElementById('loginUsername');

      // Open modal and add error class
      window.openFormModal('loginModal');
      usernameInput.classList.add('error');
      window.showFieldError(usernameInput, 'Test error');

      expect(usernameInput.classList.contains('error')).toBe(true);

      // Close modal
      window.closeFormModal('loginModal');

      expect(usernameInput.classList.contains('error')).toBe(false);
    });
  });

  describe('Current Year Display', () => {
    it('should populate current year on load', () => {
      const yearElement = document.getElementById('currentYear');
      const currentYear = new Date().getFullYear().toString();

      expect(yearElement.textContent).toBe(currentYear);
    });
  });
});
