/**
 * @jest-environment jsdom
 */

/* eslint-env node */

import {
  // Validation Functions
  validateUsername,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  sanitizeInput,
  // UI Feedback Functions
  showFieldError,
  hideFieldError,
  markFieldValid,
  showFormError,
  hideFormError,
  updatePasswordStrength,
  // Password Visibility Toggle
  togglePasswordVisibility,
  // Field Attachment Functions
  attachFieldValidation,
  attachPasswordMatchValidation,
  // Modal Functions
  openFormModal,
  closeFormModal,
  handleModalOverlayClick,
  // Loading/Success Modals
  showLoadingModal,
  hideLoadingModal,
  showSuccessModal,
  // Authentication Helpers
  isAuthenticated,
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  redirectToGame,
  redirectToDaily,
} from '../../js/popup-manager';

describe('Popup Manager - Validation Functions', () => {
  describe('validateUsername', () => {
    test('returns error for empty username', () => {
      const result = validateUsername('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Registry name is required');
    });

    test('returns error for whitespace-only username', () => {
      const result = validateUsername('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Registry name is required');
    });

    test('returns error for username too short (less than 3 chars)', () => {
      const result = validateUsername('ab');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Registry name must be 3-20 characters');
    });

    test('returns error for username too long (more than 20 chars)', () => {
      const result = validateUsername('a'.repeat(21));
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Registry name must be 3-20 characters');
    });

    test('returns error for username with spaces', () => {
      const result = validateUsername('user name');
      expect(result.valid).toBe(false);
      // Spaces are caught by the alphanumeric pattern check first
      expect(result.error).toBe('Only alphanumeric characters and underscores allowed');
    });

    test('returns error for username with special characters', () => {
      const result = validateUsername('user@name');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Only alphanumeric characters and underscores allowed');
    });

    test('accepts valid username with letters and numbers', () => {
      const result = validateUsername('user123');
      expect(result.valid).toBe(true);
      expect(result.error).toBe('');
    });

    test('accepts valid username with underscores', () => {
      const result = validateUsername('user_name_123');
      expect(result.valid).toBe(true);
      expect(result.error).toBe('');
    });

    test('trims whitespace before validation', () => {
      const result = validateUsername('  validuser  ');
      expect(result.valid).toBe(true);
      expect(result.error).toBe('');
    });

    test('accepts username at minimum length (3 chars)', () => {
      const result = validateUsername('abc');
      expect(result.valid).toBe(true);
      expect(result.error).toBe('');
    });

    test('accepts username at maximum length (20 chars)', () => {
      const result = validateUsername('a'.repeat(20));
      expect(result.valid).toBe(true);
      expect(result.error).toBe('');
    });
  });

  describe('validateEmail', () => {
    test('returns error for empty email', () => {
      const result = validateEmail('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Postal telegraph address is required');
    });

    test('returns error for whitespace-only email', () => {
      const result = validateEmail('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Postal telegraph address is required');
    });

    test('returns error for email without @', () => {
      const result = validateEmail('userexample.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid telegraph address');
    });

    test('returns error for email without domain', () => {
      const result = validateEmail('user@');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid telegraph address');
    });

    test('returns error for email without TLD', () => {
      const result = validateEmail('user@domain');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid telegraph address');
    });

    test('returns error for email with spaces', () => {
      const result = validateEmail('user @example.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid telegraph address');
    });

    test('accepts valid email', () => {
      const result = validateEmail('user@example.com');
      expect(result.valid).toBe(true);
      expect(result.error).toBe('');
    });

    test('accepts email with subdomains', () => {
      const result = validateEmail('user@mail.example.com');
      expect(result.valid).toBe(true);
      expect(result.error).toBe('');
    });

    test('trims whitespace before validation', () => {
      const result = validateEmail('  user@example.com  ');
      expect(result.valid).toBe(true);
      expect(result.error).toBe('');
    });
  });

  describe('validatePassword', () => {
    test('returns error for empty password', () => {
      const result = validatePassword('');
      expect(result.valid).toBe(false);
      expect(result.strength).toBe('none');
      expect(result.error).toBe('Authentication cipher is required');
    });

    test('returns error for password too short (less than 8 chars)', () => {
      const result = validatePassword('Pass1');
      expect(result.valid).toBe(false);
      expect(result.strength).toBe('weak');
      expect(result.error).toBe('Cipher must be at least 8 characters');
    });

    test('returns error for password without uppercase letter', () => {
      const result = validatePassword('password123');
      expect(result.valid).toBe(false);
      expect(result.strength).toBe('weak');
      expect(result.error).toBe('Cipher must include at least one uppercase letter');
    });

    test('returns error for password without lowercase letter', () => {
      const result = validatePassword('PASSWORD123');
      expect(result.valid).toBe(false);
      expect(result.strength).toBe('weak');
      expect(result.error).toBe('Cipher must include at least one lowercase letter');
    });

    test('returns error for password without number', () => {
      const result = validatePassword('PasswordOnly');
      expect(result.valid).toBe(false);
      expect(result.strength).toBe('weak');
      expect(result.error).toBe('Cipher must include at least one number');
    });

    test('accepts valid password with medium strength (8 chars, no special)', () => {
      const result = validatePassword('Password1');
      expect(result.valid).toBe(true);
      expect(result.strength).toBe('medium');
      expect(result.error).toBe('');
    });

    test('accepts valid password with medium strength (10 chars)', () => {
      const result = validatePassword('Password12');
      expect(result.valid).toBe(true);
      expect(result.strength).toBe('medium');
      expect(result.error).toBe('');
    });

    test('accepts valid password with medium strength (has special char)', () => {
      const result = validatePassword('Pass123!');
      expect(result.valid).toBe(true);
      expect(result.strength).toBe('medium');
      expect(result.error).toBe('');
    });

    test('accepts valid password with strong strength (12+ chars with special)', () => {
      const result = validatePassword('Password123!@#');
      expect(result.valid).toBe(true);
      expect(result.strength).toBe('strong');
      expect(result.error).toBe('');
    });

    test('detects all special characters', () => {
      const specialChars = '!@#$%^&*(),.?":{}|<>';
      const password = `Pass1${specialChars[0]}${specialChars[5]}${specialChars[10]}`;
      const result = validatePassword(password);
      expect(result.valid).toBe(true);
    });
  });

  describe('validatePasswordMatch', () => {
    test('returns error for empty confirmation', () => {
      const result = validatePasswordMatch('Password123', '');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please confirm your cipher');
    });

    test('returns error for mismatched passwords', () => {
      const result = validatePasswordMatch('Password123', 'Password456');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Ciphers do not match');
    });

    test('accepts matching passwords', () => {
      const result = validatePasswordMatch('Password123', 'Password123');
      expect(result.valid).toBe(true);
      expect(result.error).toBe('');
    });

    test('case-sensitive password matching', () => {
      const result = validatePasswordMatch('Password123', 'password123');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Ciphers do not match');
    });
  });

  describe('sanitizeInput', () => {
    test('returns empty string for non-string input', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
      expect(sanitizeInput(123)).toBe('');
      expect(sanitizeInput({})).toBe('');
    });

    test('escapes HTML tags', () => {
      const result = sanitizeInput('<script>alert("xss")</script>');
      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;script&gt;');
    });

    test('escapes special HTML characters', () => {
      const result = sanitizeInput('<>&"\'');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
    });

    test('preserves safe text content', () => {
      const result = sanitizeInput('Hello World 123');
      expect(result).toBe('Hello World 123');
    });
  });
});

describe('Popup Manager - UI Feedback Functions', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <input id="testInput" aria-describedby="testError" />
      <div id="testError" class="field-error"></div>
      <input id="testInput2" aria-describedby="error1 error2" />
      <div id="error1" class="field-error"></div>
      <div id="error2"></div>
      <form id="testForm">
        <div class="form-error"></div>
      </form>
      <div class="password-strength">
        <div class="strength-fill"></div>
        <div class="strength-label"></div>
      </div>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('showFieldError', () => {
    test('displays error message in associated error element', () => {
      const input = document.getElementById('testInput');
      showFieldError(input, 'Test error message');

      const errorElement = document.getElementById('testError');
      expect(errorElement.textContent).toBe('Test error message');
    });

    test('adds error class to input', () => {
      const input = document.getElementById('testInput');
      showFieldError(input, 'Test error');

      expect(input.classList.contains('error')).toBe(true);
    });

    test('removes valid class from input', () => {
      const input = document.getElementById('testInput');
      input.classList.add('valid');
      showFieldError(input, 'Test error');

      expect(input.classList.contains('valid')).toBe(false);
    });
  });

  describe('hideFieldError', () => {
    test('clears error message', () => {
      const input = document.getElementById('testInput');
      const errorElement = document.getElementById('testError');
      errorElement.textContent = 'Error message';

      hideFieldError(input);

      expect(errorElement.textContent).toBe('');
    });

    test('removes error class from input', () => {
      const input = document.getElementById('testInput');
      input.classList.add('error');

      hideFieldError(input);

      expect(input.classList.contains('error')).toBe(false);
    });

    test('handles multiple aria-describedby values', () => {
      const input = document.getElementById('testInput2');
      const errorElement = document.getElementById('error1');
      errorElement.textContent = 'Error message';

      hideFieldError(input);

      expect(errorElement.textContent).toBe('');
    });
  });

  describe('markFieldValid', () => {
    test('adds valid class to input', () => {
      const input = document.getElementById('testInput');
      markFieldValid(input);

      expect(input.classList.contains('valid')).toBe(true);
    });

    test('clears error message when marking valid', () => {
      const input = document.getElementById('testInput');
      const errorElement = document.getElementById('testError');
      errorElement.textContent = 'Error';

      markFieldValid(input);

      expect(errorElement.textContent).toBe('');
    });

    test('removes error class when marking valid', () => {
      const input = document.getElementById('testInput');
      input.classList.add('error');

      markFieldValid(input);

      expect(input.classList.contains('error')).toBe(false);
    });
  });

  describe('showFormError', () => {
    test('displays error message in form error element', () => {
      const form = document.getElementById('testForm');
      showFormError(form, 'Form error message');

      const errorElement = form.querySelector('.form-error');
      expect(errorElement.textContent).toBe('Form error message');
    });

    test('adds visible class to error element', () => {
      const form = document.getElementById('testForm');
      showFormError(form, 'Form error');

      const errorElement = form.querySelector('.form-error');
      expect(errorElement.classList.contains('visible')).toBe(true);
    });

    test('sanitizes error message to prevent XSS', () => {
      const form = document.getElementById('testForm');
      showFormError(form, '<script>alert("xss")</script>');

      const errorElement = form.querySelector('.form-error');
      expect(errorElement.textContent).not.toContain('<script>');
    });
  });

  describe('hideFormError', () => {
    test('clears form error message', () => {
      const form = document.getElementById('testForm');
      const errorElement = form.querySelector('.form-error');
      errorElement.textContent = 'Error';

      hideFormError(form);

      expect(errorElement.textContent).toBe('');
    });

    test('removes visible class from error element', () => {
      const form = document.getElementById('testForm');
      const errorElement = form.querySelector('.form-error');
      errorElement.classList.add('visible');

      hideFormError(form);

      expect(errorElement.classList.contains('visible')).toBe(false);
    });
  });

  describe('updatePasswordStrength', () => {
    test('sets strength to "none" for empty password', () => {
      const strengthElement = document.querySelector('.password-strength');
      updatePasswordStrength('', strengthElement);

      const strengthFill = strengthElement.querySelector('.strength-fill');
      const strengthLabel = strengthElement.querySelector('.strength-label');

      expect(strengthFill.getAttribute('data-strength')).toBe('none');
      expect(strengthLabel.textContent).toBe('Not set');
    });

    test('sets strength to "weak" for weak password', () => {
      const strengthElement = document.querySelector('.password-strength');
      updatePasswordStrength('Pass1', strengthElement);

      const strengthFill = strengthElement.querySelector('.strength-fill');
      const strengthLabel = strengthElement.querySelector('.strength-label');

      expect(strengthFill.getAttribute('data-strength')).toBe('weak');
      expect(strengthLabel.textContent).toBe('Inadequate');
    });

    test('sets strength to "medium" for medium password', () => {
      const strengthElement = document.querySelector('.password-strength');
      updatePasswordStrength('Password1', strengthElement);

      const strengthFill = strengthElement.querySelector('.strength-fill');
      const strengthLabel = strengthElement.querySelector('.strength-label');

      expect(strengthFill.getAttribute('data-strength')).toBe('medium');
      expect(strengthLabel.textContent).toBe('Acceptable');
    });

    test('sets strength to "strong" for strong password', () => {
      const strengthElement = document.querySelector('.password-strength');
      updatePasswordStrength('Password123!@#', strengthElement);

      const strengthFill = strengthElement.querySelector('.strength-fill');
      const strengthLabel = strengthElement.querySelector('.strength-label');

      expect(strengthFill.getAttribute('data-strength')).toBe('strong');
      expect(strengthLabel.textContent).toBe('Exemplary');
    });
  });
});

describe('Popup Manager - Password Visibility Toggle', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <input type="password" id="passwordInput" />
      <button class="password-toggle">
        <span class="toggle-icon">👁</span>
      </button>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('togglePasswordVisibility', () => {
    test('changes password input to text type', () => {
      const toggleButton = container.querySelector('.password-toggle');
      const passwordInput = document.getElementById('passwordInput');

      togglePasswordVisibility(toggleButton, passwordInput);

      expect(passwordInput.getAttribute('type')).toBe('text');
    });

    test('changes toggle icon when showing password', () => {
      const toggleButton = container.querySelector('.password-toggle');
      const passwordInput = document.getElementById('passwordInput');

      togglePasswordVisibility(toggleButton, passwordInput);

      const icon = toggleButton.querySelector('.toggle-icon');
      expect(icon.textContent).toBe('⚫');
    });

    test('changes text input back to password type', () => {
      const toggleButton = container.querySelector('.password-toggle');
      const passwordInput = document.getElementById('passwordInput');
      passwordInput.setAttribute('type', 'text');

      togglePasswordVisibility(toggleButton, passwordInput);

      expect(passwordInput.getAttribute('type')).toBe('password');
    });

    test('changes toggle icon when hiding password', () => {
      const toggleButton = container.querySelector('.password-toggle');
      const passwordInput = document.getElementById('passwordInput');
      passwordInput.setAttribute('type', 'text');

      togglePasswordVisibility(toggleButton, passwordInput);

      const icon = toggleButton.querySelector('.toggle-icon');
      expect(icon.textContent).toBe('👁');
    });
  });
});

describe('Popup Manager - Field Attachment Functions', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <input id="usernameInput" aria-describedby="usernameError" />
      <div id="usernameError" class="field-error"></div>
      <input id="passwordInput" />
      <input id="confirmInput" aria-describedby="confirmError" />
      <div id="confirmError" class="field-error"></div>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('attachFieldValidation', () => {
    test('validates field on blur event', () => {
      const input = document.getElementById('usernameInput');
      const mockValidator = jest.fn(() => ({ valid: true, error: '' }));

      attachFieldValidation(input, mockValidator);
      input.value = 'testuser';
      input.dispatchEvent(new Event('blur'));

      expect(mockValidator).toHaveBeenCalledWith('testuser');
    });

    test('shows error on blur if validation fails', () => {
      const input = document.getElementById('usernameInput');
      const mockValidator = () => ({ valid: false, error: 'Invalid input' });

      attachFieldValidation(input, mockValidator);
      input.value = 'ab';
      input.dispatchEvent(new Event('blur'));

      const errorElement = document.getElementById('usernameError');
      expect(errorElement.textContent).toBe('Invalid input');
      expect(input.classList.contains('error')).toBe(true);
    });

    test('marks field valid on blur if validation succeeds', () => {
      const input = document.getElementById('usernameInput');
      const mockValidator = () => ({ valid: true, error: '' });

      attachFieldValidation(input, mockValidator);
      input.value = 'validuser';
      input.dispatchEvent(new Event('blur'));

      expect(input.classList.contains('valid')).toBe(true);
    });

    test('hides error on input if field has error class', () => {
      const input = document.getElementById('usernameInput');
      const errorElement = document.getElementById('usernameError');
      const mockValidator = () => ({ valid: false, error: 'Error' });

      attachFieldValidation(input, mockValidator);
      input.classList.add('error');
      errorElement.textContent = 'Error';

      input.dispatchEvent(new Event('input'));

      expect(errorElement.textContent).toBe('');
    });

    test('does not validate on blur if field is empty', () => {
      const input = document.getElementById('usernameInput');
      const mockValidator = jest.fn(() => ({ valid: true, error: '' }));

      attachFieldValidation(input, mockValidator);
      input.value = '';
      input.dispatchEvent(new Event('blur'));

      expect(mockValidator).not.toHaveBeenCalled();
    });
  });

  describe('attachPasswordMatchValidation', () => {
    test('validates password match on blur', () => {
      const passwordInput = document.getElementById('passwordInput');
      const confirmInput = document.getElementById('confirmInput');

      attachPasswordMatchValidation(passwordInput, confirmInput);
      passwordInput.value = 'Password123';
      confirmInput.value = 'Password123';
      confirmInput.dispatchEvent(new Event('blur'));

      expect(confirmInput.classList.contains('valid')).toBe(true);
    });

    test('shows error on blur if passwords do not match', () => {
      const passwordInput = document.getElementById('passwordInput');
      const confirmInput = document.getElementById('confirmInput');

      attachPasswordMatchValidation(passwordInput, confirmInput);
      passwordInput.value = 'Password123';
      confirmInput.value = 'Password456';
      confirmInput.dispatchEvent(new Event('blur'));

      const errorElement = document.getElementById('confirmError');
      expect(errorElement.textContent).toBe('Ciphers do not match');
      expect(confirmInput.classList.contains('error')).toBe(true);
    });

    test('hides error on input if confirm field has error class', () => {
      const passwordInput = document.getElementById('passwordInput');
      const confirmInput = document.getElementById('confirmInput');
      const errorElement = document.getElementById('confirmError');

      attachPasswordMatchValidation(passwordInput, confirmInput);
      confirmInput.classList.add('error');
      errorElement.textContent = 'Error';

      confirmInput.dispatchEvent(new Event('input'));

      expect(errorElement.textContent).toBe('');
    });
  });
});

describe('Popup Manager - Modal Functions', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <div id="testModal" class="form-modal">
        <div class="modal-overlay"></div>
        <form>
          <input type="text" id="firstInput" />
          <input type="text" id="secondInput" aria-describedby="secondError" />
          <div id="secondError" class="field-error"></div>
          <div class="form-error"></div>
        </form>
      </div>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('openFormModal', () => {
    test('adds active class to modal', () => {
      const modal = document.getElementById('testModal');
      openFormModal('testModal');

      expect(modal.classList.contains('active')).toBe(true);
    });

    test('focuses first input in modal', (done) => {
      const firstInput = document.getElementById('firstInput');
      openFormModal('testModal');

      setTimeout(() => {
        expect(document.activeElement).toBe(firstInput);
        done();
      }, 150);
    });

    test('does nothing if modal does not exist', () => {
      expect(() => {
        openFormModal('nonexistentModal');
      }).not.toThrow();
    });
  });

  describe('closeFormModal', () => {
    test('removes active class from modal', () => {
      const modal = document.getElementById('testModal');
      modal.classList.add('active');

      closeFormModal('testModal');

      expect(modal.classList.contains('active')).toBe(false);
    });

    test('clears form error when closing', () => {
      const modal = document.getElementById('testModal');
      const formError = modal.querySelector('.form-error');
      formError.textContent = 'Error message';
      formError.classList.add('visible');

      closeFormModal('testModal');

      expect(formError.textContent).toBe('');
      expect(formError.classList.contains('visible')).toBe(false);
    });

    test('clears all input errors and validation states', () => {
      const firstInput = document.getElementById('firstInput');
      const secondInput = document.getElementById('secondInput');
      const errorElement = document.getElementById('secondError');

      firstInput.classList.add('error', 'valid');
      secondInput.classList.add('error');
      errorElement.textContent = 'Field error';
      errorElement.classList.add('visible');

      closeFormModal('testModal');

      expect(firstInput.classList.contains('error')).toBe(false);
      expect(firstInput.classList.contains('valid')).toBe(false);
      expect(secondInput.classList.contains('error')).toBe(false);
      expect(errorElement.textContent).toBe('');
    });
  });

  describe('handleModalOverlayClick', () => {
    test('closes modal when clicking on overlay', () => {
      const modal = document.getElementById('testModal');
      const overlay = modal.querySelector('.modal-overlay');
      modal.classList.add('active');

      const event = new Event('click');
      Object.defineProperty(event, 'target', { value: overlay, writable: false });

      handleModalOverlayClick(event, 'testModal');

      expect(modal.classList.contains('active')).toBe(false);
    });

    test('does not close modal when clicking on non-overlay element', () => {
      const modal = document.getElementById('testModal');
      const form = modal.querySelector('form');
      modal.classList.add('active');

      const event = new Event('click');
      Object.defineProperty(event, 'target', { value: form, writable: false });

      handleModalOverlayClick(event, 'testModal');

      expect(modal.classList.contains('active')).toBe(true);
    });
  });
});

describe('Popup Manager - Loading/Success Modals', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <div id="authModal" class="auth-modal">
        <div class="modal-title">Processing</div>
        <div class="modal-message"></div>
      </div>
      <button class="submit-button">Submit</button>
      <button class="submit-button">Another Submit</button>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('showLoadingModal', () => {
    test('displays loading message', () => {
      showLoadingModal('authModal', 'Loading data...');

      const messageElement = document.querySelector('.modal-message');
      expect(messageElement.textContent).toBe('Loading data...');
    });

    test('adds active class to modal', () => {
      showLoadingModal('authModal', 'Loading...');

      const modal = document.getElementById('authModal');
      expect(modal.classList.contains('active')).toBe(true);
    });

    test('removes success class from modal', () => {
      const modal = document.getElementById('authModal');
      modal.classList.add('success');

      showLoadingModal('authModal', 'Loading...');

      expect(modal.classList.contains('success')).toBe(false);
    });

    test('disables all submit buttons', () => {
      showLoadingModal('authModal', 'Loading...');

      const buttons = document.querySelectorAll('.submit-button');
      buttons.forEach((button) => {
        expect(button.disabled).toBe(true);
      });
    });
  });

  describe('hideLoadingModal', () => {
    test('removes active class from modal', () => {
      const modal = document.getElementById('authModal');
      modal.classList.add('active');

      hideLoadingModal('authModal');

      expect(modal.classList.contains('active')).toBe(false);
    });

    test('re-enables all submit buttons', () => {
      const buttons = document.querySelectorAll('.submit-button');
      buttons.forEach((button) => {
        button.disabled = true;
      });

      hideLoadingModal('authModal');

      buttons.forEach((button) => {
        expect(button.disabled).toBe(false);
      });
    });
  });

  describe('showSuccessModal', () => {
    test('displays success message', () => {
      showSuccessModal('authModal', 'Success!');

      const messageElement = document.querySelector('.modal-message');
      expect(messageElement.textContent).toBe('Success!');
    });

    test('sets custom title', () => {
      showSuccessModal('authModal', 'Success!', 'Custom Title');

      const titleElement = document.querySelector('.modal-title');
      expect(titleElement.textContent).toBe('Custom Title');
    });

    test('uses default title if not provided', () => {
      showSuccessModal('authModal', 'Success!');

      const titleElement = document.querySelector('.modal-title');
      expect(titleElement.textContent).toBe('Documentation Approved');
    });

    test('adds success and active classes to modal', () => {
      showSuccessModal('authModal', 'Success!');

      const modal = document.getElementById('authModal');
      expect(modal.classList.contains('success')).toBe(true);
      expect(modal.classList.contains('active')).toBe(true);
    });
  });
});

describe('Popup Manager - Authentication Helpers', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear redirect flag
    if (typeof window !== 'undefined') {
      delete window.__redirectCalled;
    }
  });

  afterEach(() => {
    localStorage.clear();
    if (typeof window !== 'undefined') {
      delete window.__redirectCalled;
    }
  });

  describe('isAuthenticated', () => {
    test('returns false when no token exists', () => {
      expect(isAuthenticated()).toBe(false);
    });

    test('returns true when token exists', () => {
      localStorage.setItem('authToken', 'fake-token-123');
      expect(isAuthenticated()).toBe(true);
    });
  });

  describe('getAuthToken', () => {
    test('returns null when no token exists', () => {
      expect(getAuthToken()).toBe(null);
    });

    test('returns token when it exists', () => {
      localStorage.setItem('authToken', 'fake-token-123');
      expect(getAuthToken()).toBe('fake-token-123');
    });
  });

  describe('setAuthToken', () => {
    test('stores token in localStorage', () => {
      setAuthToken('new-token-456');
      expect(localStorage.getItem('authToken')).toBe('new-token-456');
    });

    test('overwrites existing token', () => {
      localStorage.setItem('authToken', 'old-token');
      setAuthToken('new-token');
      expect(localStorage.getItem('authToken')).toBe('new-token');
    });
  });

  describe('clearAuthToken', () => {
    test('removes token from localStorage', () => {
      localStorage.setItem('authToken', 'token-to-remove');
      clearAuthToken();
      expect(localStorage.getItem('authToken')).toBe(null);
    });

    test('does not throw error if token does not exist', () => {
      expect(() => {
        clearAuthToken();
      }).not.toThrow();
    });
  });

  describe('redirectToGame', () => {
    test('sets redirect flag in test environment', () => {
      redirectToGame();
      expect(window.__redirectCalled).toBe(true);
    });
  });

  describe('redirectToDaily', () => {
    test('sets redirect flag in test environment', () => {
      redirectToDaily();
      expect(window.__redirectCalled).toBe(true);
    });
  });
});
