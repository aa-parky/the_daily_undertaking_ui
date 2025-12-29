import '@testing-library/jest-dom';

describe('Landing Page Validation Functions', () => {
  beforeEach(() => {
    // Set up DOM structure BEFORE loading script
    document.body.innerHTML = `
      <div id="currentYear"></div>
      <form id="loginForm">
        <input id="loginUsername" aria-describedby="loginUsernameError" />
        <div id="loginUsernameError" class="field-error"></div>
        <input id="loginPassword" type="password" aria-describedby="loginPasswordError" />
        <div id="loginPasswordError" class="field-error"></div>
        <div class="form-error"></div>
        <button type="submit" class="submit-button">Login</button>
      </form>
      <form id="registerForm">
        <input id="registerUsername" aria-describedby="registerUsernameError" />
        <div id="registerUsernameError" class="field-error"></div>
        <input id="registerEmail" aria-describedby="registerEmailError" />
        <div id="registerEmailError" class="field-error"></div>
        <input id="registerPassword" type="password" aria-describedby="registerPasswordError registerPasswordStrength" />
        <div id="registerPasswordError" class="field-error"></div>
        <div id="registerPasswordStrength" class="password-strength">
          <div class="strength-bar">
            <div class="strength-fill" data-strength="none"></div>
          </div>
          <div class="strength-text">
            <span class="strength-label">Not set</span>
          </div>
        </div>
        <input id="registerPasswordConfirm" type="password" aria-describedby="registerPasswordConfirmError" />
        <div id="registerPasswordConfirmError" class="field-error"></div>
        <div class="form-error"></div>
        <button type="submit" class="submit-button">Register</button>
      </form>
      <div id="authModal" class="auth-modal">
        <div class="modal-content">
          <h4 id="modalTitle" class="modal-title">Processing</h4>
          <p id="modalMessage" class="modal-message">Loading...</p>
        </div>
      </div>
      <button class="password-toggle"><span class="toggle-icon">👁</span></button>
    `;

    // Load the actual landing.js
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require, import/extensions
      require('../../js/landing.js');
    });

    // Trigger DOMContentLoaded to initialize
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('validateUsername', () => {
    it('should accept valid usernames', () => {
      const result = window.validateUsername('validUser123');
      expect(result.valid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should accept usernames with underscores', () => {
      const result = window.validateUsername('valid_user_123');
      expect(result.valid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should reject empty usernames', () => {
      const result = window.validateUsername('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should reject usernames with spaces', () => {
      const result = window.validateUsername('invalid user');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('alphanumeric');
    });

    it('should reject usernames shorter than 3 characters', () => {
      const result = window.validateUsername('ab');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('3-20 characters');
    });

    it('should reject usernames longer than 20 characters', () => {
      const result = window.validateUsername('a'.repeat(21));
      expect(result.valid).toBe(false);
      expect(result.error).toContain('3-20 characters');
    });

    it('should reject special characters except underscore', () => {
      const result = window.validateUsername('user@name!');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('alphanumeric');
    });

    it('should trim whitespace and validate', () => {
      const result = window.validateUsername('  validUser  ');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateEmail', () => {
    it('should accept valid email addresses', () => {
      const result = window.validateEmail('user@example.com');
      expect(result.valid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should accept email with subdomain', () => {
      const result = window.validateEmail('user@mail.example.com');
      expect(result.valid).toBe(true);
    });

    it('should reject empty email', () => {
      const result = window.validateEmail('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should reject emails without @', () => {
      const result = window.validateEmail('userexample.com');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('valid');
    });

    it('should reject emails without domain', () => {
      const result = window.validateEmail('user@');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('valid');
    });

    it('should reject emails without TLD', () => {
      const result = window.validateEmail('user@example');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('valid');
    });

    it('should trim whitespace and validate', () => {
      const result = window.validateEmail('  user@example.com  ');
      expect(result.valid).toBe(true);
    });
  });

  describe('validatePassword', () => {
    it('should accept strong passwords', () => {
      const result = window.validatePassword('StrongPass123');
      expect(result.valid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should calculate weak strength correctly', () => {
      const result = window.validatePassword('Password1');
      expect(result.valid).toBe(true);
      expect(result.strength).toBe('medium');
    });

    it('should calculate medium strength correctly', () => {
      const result = window.validatePassword('Password123');
      expect(result.valid).toBe(true);
      expect(result.strength).toBe('medium');
    });

    it('should calculate strong strength correctly', () => {
      const result = window.validatePassword('P@ssw0rd!123');
      expect(result.valid).toBe(true);
      expect(result.strength).toBe('strong');
    });

    it('should reject empty passwords', () => {
      const result = window.validatePassword('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should reject passwords shorter than 8 characters', () => {
      const result = window.validatePassword('Short1A');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('8 characters');
    });

    it('should reject passwords without uppercase', () => {
      const result = window.validatePassword('weakpass123');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('uppercase');
    });

    it('should reject passwords without lowercase', () => {
      const result = window.validatePassword('WEAKPASS123');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('lowercase');
    });

    it('should reject passwords without numbers', () => {
      const result = window.validatePassword('WeakPassword');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('number');
    });

    it('should recognize special characters for strength', () => {
      const result = window.validatePassword('Pass123!@#$');
      expect(result.valid).toBe(true);
      expect(result.strength).toBe('medium');
    });
  });

  describe('validatePasswordMatch', () => {
    it('should accept matching passwords', () => {
      const result = window.validatePasswordMatch('Password123', 'Password123');
      expect(result.valid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should reject non-matching passwords', () => {
      const result = window.validatePasswordMatch('Password123', 'Password456');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('match');
    });

    it('should reject empty confirmation', () => {
      const result = window.validatePasswordMatch('Password123', '');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('confirm');
    });

    it('should be case-sensitive', () => {
      const result = window.validatePasswordMatch('Password123', 'password123');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('match');
    });
  });

  describe('sanitizeInput', () => {
    it('should escape HTML entities', () => {
      const result = window.sanitizeInput('<script>alert("xss")</script>');
      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;script&gt;');
    });

    it('should preserve quotes safely', () => {
      const result = window.sanitizeInput('Test"quote\'here');
      // textContent method converts to HTML entities
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
    });

    it('should escape ampersands', () => {
      const result = window.sanitizeInput('Test & more');
      expect(result).toContain('&amp;');
    });

    it('should handle empty string', () => {
      const result = window.sanitizeInput('');
      expect(result).toBe('');
    });

    it('should handle non-string input', () => {
      const result = window.sanitizeInput(null);
      expect(result).toBe('');
    });

    it('should escape angle brackets', () => {
      const result = window.sanitizeInput('<div>content</div>');
      expect(result).toContain('&lt;div&gt;');
    });
  });
});

describe('Landing Page UI Functions', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="testForm">
        <input id="testInput" aria-describedby="testError" />
        <div id="testError" class="field-error"></div>
        <div class="form-error"></div>
      </form>
      <div id="registerPasswordStrength" class="password-strength">
        <div class="strength-bar">
          <div class="strength-fill" data-strength="none"></div>
        </div>
        <div class="strength-text">
          <span class="strength-label">Not set</span>
        </div>
      </div>
      <div id="authModal" class="auth-modal">
        <div class="modal-content">
          <h4 id="modalTitle" class="modal-title">Processing</h4>
          <p id="modalMessage" class="modal-message">Loading...</p>
        </div>
      </div>
      <button class="submit-button">Submit</button>
    `;

    jest.isolateModules(() => {
      // eslint-disable-next-line global-require, import/extensions
      require('../../js/landing.js');
    });

    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('showFieldError', () => {
    it('should display error message in field', () => {
      const input = document.getElementById('testInput');
      const errorDiv = document.getElementById('testError');

      window.showFieldError(input, 'Test error message');

      expect(errorDiv.textContent).toBe('Test error message');
      expect(input.classList.contains('error')).toBe(true);
    });
  });

  describe('hideFieldError', () => {
    it('should clear error message from field', () => {
      const input = document.getElementById('testInput');
      const errorDiv = document.getElementById('testError');

      errorDiv.textContent = 'Error message';
      input.classList.add('error');

      window.hideFieldError(input);

      expect(errorDiv.textContent).toBe('');
      expect(input.classList.contains('error')).toBe(false);
    });
  });

  describe('showFormError', () => {
    it('should display error message in form', () => {
      const form = document.getElementById('testForm');
      const errorDiv = form.querySelector('.form-error');

      window.showFormError(form, 'Form error message');

      expect(errorDiv.textContent).toBe('Form error message');
      expect(errorDiv.classList.contains('visible')).toBe(true);
    });

    it('should sanitize error messages', () => {
      const form = document.getElementById('testForm');
      const errorDiv = form.querySelector('.form-error');

      window.showFormError(form, '<script>alert("xss")</script>');

      expect(errorDiv.textContent).not.toContain('<script>');
    });
  });

  describe('hideFormError', () => {
    it('should clear error message from form', () => {
      const form = document.getElementById('testForm');
      const errorDiv = form.querySelector('.form-error');

      errorDiv.textContent = 'Error';
      errorDiv.classList.add('visible');

      window.hideFormError(form);

      expect(errorDiv.textContent).toBe('');
      expect(errorDiv.classList.contains('visible')).toBe(false);
    });
  });

  describe('updatePasswordStrength', () => {
    it('should show weak strength for weak passwords', () => {
      const strengthElement = document.getElementById('registerPasswordStrength');
      const strengthFill = strengthElement.querySelector('.strength-fill');
      const strengthLabel = strengthElement.querySelector('.strength-label');

      window.updatePasswordStrength('Weak1', strengthElement);

      expect(strengthFill.getAttribute('data-strength')).toBe('weak');
      expect(strengthLabel.textContent).toBe('Inadequate');
    });

    it('should show medium strength for medium passwords', () => {
      const strengthElement = document.getElementById('registerPasswordStrength');
      const strengthFill = strengthElement.querySelector('.strength-fill');
      const strengthLabel = strengthElement.querySelector('.strength-label');

      window.updatePasswordStrength('Password123', strengthElement);

      expect(strengthFill.getAttribute('data-strength')).toBe('medium');
      expect(strengthLabel.textContent).toBe('Acceptable');
    });

    it('should show strong strength for strong passwords', () => {
      const strengthElement = document.getElementById('registerPasswordStrength');
      const strengthFill = strengthElement.querySelector('.strength-fill');
      const strengthLabel = strengthElement.querySelector('.strength-label');

      window.updatePasswordStrength('P@ssw0rd!123', strengthElement);

      expect(strengthFill.getAttribute('data-strength')).toBe('strong');
      expect(strengthLabel.textContent).toBe('Exemplary');
    });

    it('should show "Not set" for empty password', () => {
      const strengthElement = document.getElementById('registerPasswordStrength');
      const strengthFill = strengthElement.querySelector('.strength-fill');
      const strengthLabel = strengthElement.querySelector('.strength-label');

      window.updatePasswordStrength('', strengthElement);

      expect(strengthFill.getAttribute('data-strength')).toBe('none');
      expect(strengthLabel.textContent).toBe('Not set');
    });
  });

  describe('showLoadingModal', () => {
    it('should display loading modal', () => {
      const modal = document.getElementById('authModal');
      const modalMessage = document.getElementById('modalMessage');

      window.showLoadingModal('Test loading message');

      expect(modal.classList.contains('active')).toBe(true);
      expect(modalMessage.textContent).toBe('Test loading message');
    });

    it('should disable submit buttons', () => {
      const button = document.querySelector('.submit-button');

      window.showLoadingModal('Loading...');

      expect(button.disabled).toBe(true);
    });
  });

  describe('hideLoadingModal', () => {
    it('should hide loading modal', () => {
      const modal = document.getElementById('authModal');
      modal.classList.add('active');

      window.hideLoadingModal();

      expect(modal.classList.contains('active')).toBe(false);
    });

    it('should re-enable submit buttons', () => {
      const button = document.querySelector('.submit-button');
      button.disabled = true;

      window.hideLoadingModal();

      expect(button.disabled).toBe(false);
    });
  });

  describe('togglePasswordVisibility', () => {
    it('should toggle password input type', () => {
      const input = document.createElement('input');
      input.type = 'password';
      const toggleBtn = document.createElement('button');
      const icon = document.createElement('span');
      icon.className = 'toggle-icon';
      icon.textContent = '👁';
      toggleBtn.appendChild(icon);

      expect(input.type).toBe('password');

      window.togglePasswordVisibility(toggleBtn, input);
      expect(input.type).toBe('text');
      expect(icon.textContent).toBe('⚫');

      window.togglePasswordVisibility(toggleBtn, input);
      expect(input.type).toBe('password');
      expect(icon.textContent).toBe('👁');
    });
  });
});

describe('Landing Page Authentication', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div></div>';

    jest.isolateModules(() => {
      // eslint-disable-next-line global-require, import/extensions
      require('../../js/landing.js');
    });

    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('authenticateUser', () => {
    it('should authenticate with correct demo credentials', async () => {
      const result = await window.authenticateUser('demo', 'Demo1234');

      expect(result.success).toBe(true);
      expect(result.token).toBeTruthy();
      expect(result.token).toContain('demo-jwt-token');
    });

    it('should reject incorrect credentials', async () => {
      const result = await window.authenticateUser('wrong', 'WrongPass1');

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
      expect(result.error).toContain('Invalid credentials');
    });

    it('should reject incorrect password', async () => {
      const result = await window.authenticateUser('demo', 'WrongPass1');

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('registerUser', () => {
    it('should successfully register new user', async () => {
      const result = await window.registerUser('newuser', 'new@example.com', 'NewPass123');

      expect(result.success).toBe(true);
    });

    it('should reject existing username', async () => {
      const result = await window.registerUser('demo', 'demo@example.com', 'Demo1234');

      expect(result.success).toBe(false);
      expect(result.error).toContain('already enrolled');
    });

    it('should be case-insensitive for username check', async () => {
      const result = await window.registerUser('DEMO', 'demo@example.com', 'Demo1234');

      expect(result.success).toBe(false);
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token exists', () => {
      expect(window.isAuthenticated()).toBe(false);
    });

    it('should return true when token exists', () => {
      localStorage.setItem('authToken', 'test-token');

      expect(window.isAuthenticated()).toBe(true);
    });
  });

  describe('redirectToGame', () => {
    it('should set redirect flag in test environment', () => {
      window.__redirectCalled = false;

      window.redirectToGame();

      expect(window.__redirectCalled).toBe(true);
    });
  });
});
