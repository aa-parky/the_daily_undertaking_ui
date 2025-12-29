/* ========================================
   The Daily Undertaking - Landing Page
   Authentication & Validation Logic
   ======================================== */

// ========== Validation Functions ==========

/**
 * Validates username format
 * @param {string} username - Username to validate
 * @returns {{valid: boolean, error: string}} Validation result
 */
function validateUsername(username) {
  if (!username || username.trim() === '') {
    return { valid: false, error: 'Registry name is required' };
  }

  const trimmed = username.trim();

  if (trimmed.length < 3 || trimmed.length > 20) {
    return {
      valid: false,
      error: 'Registry name must be 3-20 characters',
    };
  }

  const validPattern = /^[a-zA-Z0-9_]+$/;
  if (!validPattern.test(trimmed)) {
    return {
      valid: false,
      error: 'Only alphanumeric characters and underscores allowed',
    };
  }

  if (/\s/.test(trimmed)) {
    return {
      valid: false,
      error: 'Registry name cannot contain spaces',
    };
  }

  return { valid: true, error: '' };
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {{valid: boolean, error: string}} Validation result
 */
function validateEmail(email) {
  if (!email || email.trim() === '') {
    return { valid: false, error: 'Postal telegraph address is required' };
  }

  const trimmed = email.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(trimmed)) {
    return {
      valid: false,
      error: 'Please enter a valid telegraph address',
    };
  }

  return { valid: true, error: '' };
}

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {{valid: boolean, strength: string, error: string}} Validation result
 */
function validatePassword(password) {
  if (!password || password === '') {
    return {
      valid: false,
      strength: 'none',
      error: 'Authentication cipher is required',
    };
  }

  if (password.length < 8) {
    return {
      valid: false,
      strength: 'weak',
      error: 'Cipher must be at least 8 characters',
    };
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUppercase) {
    return {
      valid: false,
      strength: 'weak',
      error: 'Cipher must include at least one uppercase letter',
    };
  }

  if (!hasLowercase) {
    return {
      valid: false,
      strength: 'weak',
      error: 'Cipher must include at least one lowercase letter',
    };
  }

  if (!hasNumber) {
    return {
      valid: false,
      strength: 'weak',
      error: 'Cipher must include at least one number',
    };
  }

  // Calculate strength
  let strength = 'medium';
  if (password.length >= 12 && hasSpecial) {
    strength = 'strong';
  } else if (password.length >= 10 || hasSpecial) {
    strength = 'medium';
  }

  return { valid: true, strength, error: '' };
}

/**
 * Validates password confirmation match
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {{valid: boolean, error: string}} Validation result
 */
function validatePasswordMatch(password, confirmPassword) {
  if (!confirmPassword || confirmPassword === '') {
    return { valid: false, error: 'Please confirm your cipher' };
  }

  if (password !== confirmPassword) {
    return { valid: false, error: 'Ciphers do not match' };
  }

  return { valid: true, error: '' };
}

/**
 * Sanitizes user input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';

  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// ========== UI Feedback Functions ==========

/**
 * Shows field-level error message
 * @param {HTMLElement} inputElement - Input field element
 * @param {string} message - Error message to display
 */
function showFieldError(inputElement, message) {
  const errorId = inputElement.getAttribute('aria-describedby');
  const errorElement = document.getElementById(errorId);

  if (errorElement) {
    errorElement.textContent = message;
    inputElement.classList.add('error');
    inputElement.classList.remove('valid');
  }
}

/**
 * Hides field-level error message
 * @param {HTMLElement} inputElement - Input field element
 */
function hideFieldError(inputElement) {
  const errorId = inputElement.getAttribute('aria-describedby');
  let errorElement = document.getElementById(errorId);

  // Handle multiple aria-describedby values
  if (!errorElement) {
    const describedByValues = inputElement.getAttribute('aria-describedby').split(' ');
    errorElement = document.getElementById(describedByValues[0]);
  }

  if (errorElement) {
    errorElement.textContent = '';
    inputElement.classList.remove('error');
  }
}

/**
 * Marks field as valid
 * @param {HTMLElement} inputElement - Input field element
 */
function markFieldValid(inputElement) {
  hideFieldError(inputElement);
  inputElement.classList.add('valid');
}

/**
 * Shows form-level error message
 * @param {HTMLElement} formElement - Form element
 * @param {string} message - Error message to display
 */
function showFormError(formElement, message) {
  const errorElement = formElement.querySelector('.form-error');
  if (errorElement) {
    errorElement.textContent = sanitizeInput(message);
    errorElement.classList.add('visible');
  }
}

/**
 * Hides form-level error message
 * @param {HTMLElement} formElement - Form element
 */
function hideFormError(formElement) {
  const errorElement = formElement.querySelector('.form-error');
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('visible');
  }
}

/**
 * Updates password strength indicator
 * @param {string} password - Password to evaluate
 * @param {HTMLElement} strengthElement - Strength indicator element
 */
function updatePasswordStrength(password, strengthElement) {
  const validation = validatePassword(password);
  const strengthFill = strengthElement.querySelector('.strength-fill');
  const strengthLabel = strengthElement.querySelector('.strength-label');

  if (!password) {
    strengthFill.setAttribute('data-strength', 'none');
    strengthLabel.textContent = 'Not set';
    return;
  }

  strengthFill.setAttribute('data-strength', validation.strength);

  const strengthLabels = {
    weak: 'Inadequate',
    medium: 'Acceptable',
    strong: 'Exemplary',
  };

  strengthLabel.textContent = strengthLabels[validation.strength] || 'Not set';
}

/**
 * Shows loading modal
 * @param {string} message - Loading message to display
 */
function showLoadingModal(message) {
  const modal = document.getElementById('authModal');
  const modalMessage = document.getElementById('modalMessage');

  if (modal && modalMessage) {
    modalMessage.textContent = message;
    modal.classList.remove('success');
    modal.classList.add('active');
  }

  // Disable form buttons
  document.querySelectorAll('.submit-button').forEach((button) => {
    button.disabled = true;
  });
}

/**
 * Hides loading modal
 */
function hideLoadingModal() {
  const modal = document.getElementById('authModal');

  if (modal) {
    modal.classList.remove('active');
  }

  // Re-enable form buttons
  document.querySelectorAll('.submit-button').forEach((button) => {
    button.disabled = false;
  });
}

/**
 * Shows success message in modal
 * @param {string} message - Success message
 */
function showSuccessModal(message) {
  const modal = document.getElementById('authModal');
  const modalMessage = document.getElementById('modalMessage');
  const modalTitle = document.getElementById('modalTitle');

  if (modal && modalMessage && modalTitle) {
    modalTitle.textContent = 'Documentation Approved';
    modalMessage.textContent = message;
    modal.classList.add('success');
    modal.classList.add('active');
  }
}

// ========== Password Visibility Toggle ==========

/**
 * Toggles password visibility
 * @param {HTMLElement} toggleButton - Toggle button element
 * @param {HTMLElement} passwordInput - Password input element
 */
function togglePasswordVisibility(toggleButton, passwordInput) {
  const toggleIcon = toggleButton.querySelector('.toggle-icon');

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.textContent = '⚫';
  } else {
    passwordInput.type = 'password';
    toggleIcon.textContent = '👁';
  }
}

// ========== Authentication Functions ==========

/**
 * Authenticates user credentials (placeholder implementation)
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<{success: boolean, token?: string, error?: string}>}
 */
function authenticateUser(username, password) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Demo credentials: username='demo', password='Demo1234'
      if (username === 'demo' && password === 'Demo1234') {
        resolve({
          success: true,
          token: `demo-jwt-token-${Date.now()}`,
        });
      } else {
        resolve({
          success: false,
          error:
            'Invalid credentials. The Registry has no record of this name and cipher combination.',
        });
      }
    }, 1500);
  });
}

/**
 * Registers new user (placeholder implementation)
 * @param {string} username - Username
 * @param {string} _email - Email (reserved for future use)
 * @param {string} _password - Password (reserved for future use)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
function registerUser(username, _email, _password) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check if username is already taken (demo only)
      if (username.toLowerCase() === 'demo') {
        resolve({
          success: false,
          error: 'This registry name is already enrolled. Please choose another.',
        });
      } else {
        resolve({
          success: true,
        });
      }
    }, 1500);
  });
}

/**
 * Checks if user is already authenticated
 * @returns {boolean} Authentication status
 */
function isAuthenticated() {
  const token = localStorage.getItem('authToken');
  return !!token;
}

/**
 * Redirects to game page
 */
function redirectToGame() {
  // Check if in test environment (jsdom doesn't support navigation)
  /* global process */
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    // In test environment, just set a flag instead of navigating
    if (typeof window !== 'undefined') {
      window.__redirectCalled = true;
    }
    return;
  }
  window.location.href = 'index.html';
}

// ========== Form Handlers ==========

/**
 * Handles login form submission
 * @param {Event} event - Submit event
 */
async function handleLoginSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const usernameInput = document.getElementById('loginUsername');
  const passwordInput = document.getElementById('loginPassword');

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  // Hide previous errors
  hideFormError(form);
  hideFieldError(usernameInput);
  hideFieldError(passwordInput);

  // Validate inputs
  const usernameValidation = validateUsername(username);
  const passwordValidation = validatePassword(password);

  let isValid = true;

  if (!usernameValidation.valid) {
    showFieldError(usernameInput, usernameValidation.error);
    isValid = false;
  }

  if (!passwordValidation.valid) {
    showFieldError(passwordInput, passwordValidation.error);
    isValid = false;
  }

  if (!isValid) {
    showFormError(form, 'Please correct the errors above');
    return;
  }

  // Show loading state
  showLoadingModal('Submitting credentials to the Bureau...');

  try {
    const result = await authenticateUser(username, password);

    if (result.success) {
      // Store token
      localStorage.setItem('authToken', result.token);

      // Show success message
      showSuccessModal('Enrollment confirmed! Redirecting to your undertakings...');

      // Redirect after short delay
      setTimeout(() => {
        redirectToGame();
      }, 1500);
    } else {
      hideLoadingModal();
      showFormError(form, result.error);
    }
  } catch (error) {
    hideLoadingModal();
    showFormError(form, 'Unable to reach the Bureau. Please verify your connection and try again.');
  }
}

/**
 * Handles registration form submission
 * @param {Event} event - Submit event
 */
async function handleRegisterSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const usernameInput = document.getElementById('registerUsername');
  const emailInput = document.getElementById('registerEmail');
  const passwordInput = document.getElementById('registerPassword');
  const confirmPasswordInput = document.getElementById('registerPasswordConfirm');

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // Hide previous errors
  hideFormError(form);
  hideFieldError(usernameInput);
  hideFieldError(emailInput);
  hideFieldError(passwordInput);
  hideFieldError(confirmPasswordInput);

  // Validate all inputs
  const usernameValidation = validateUsername(username);
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);
  const passwordMatchValidation = validatePasswordMatch(password, confirmPassword);

  let isValid = true;

  if (!usernameValidation.valid) {
    showFieldError(usernameInput, usernameValidation.error);
    isValid = false;
  }

  if (!emailValidation.valid) {
    showFieldError(emailInput, emailValidation.error);
    isValid = false;
  }

  if (!passwordValidation.valid) {
    showFieldError(passwordInput, passwordValidation.error);
    isValid = false;
  }

  if (!passwordMatchValidation.valid) {
    showFieldError(confirmPasswordInput, passwordMatchValidation.error);
    isValid = false;
  }

  if (!isValid) {
    showFormError(form, 'Please correct the errors above');
    return;
  }

  // Show loading state
  showLoadingModal('Processing enrollment documentation...');

  try {
    const result = await registerUser(username, email, password);

    if (result.success) {
      // Show success and auto-login
      showSuccessModal('Enrollment successful! Logging you in...');

      // Simulate auto-login
      const loginResult = await authenticateUser(username, password);

      if (loginResult.success) {
        localStorage.setItem('authToken', loginResult.token);

        setTimeout(() => {
          redirectToGame();
        }, 1500);
      } else {
        hideLoadingModal();
        showFormError(
          form,
          'Enrollment successful, but auto-login failed. Please log in manually.',
        );
      }
    } else {
      hideLoadingModal();
      showFormError(form, result.error);
    }
  } catch (error) {
    hideLoadingModal();
    showFormError(form, 'Unable to process enrollment. Please try again later.');
  }
}

/**
 * Attaches real-time validation to a field
 * @param {HTMLElement} inputElement - Input field element
 * @param {Function} validatorFunction - Validation function to use
 */
function attachFieldValidation(inputElement, validatorFunction) {
  inputElement.addEventListener('blur', () => {
    const value = inputElement.value.trim();

    if (value) {
      const validation = validatorFunction(value);

      if (validation.valid) {
        markFieldValid(inputElement);
      } else {
        showFieldError(inputElement, validation.error);
      }
    }
  });

  inputElement.addEventListener('input', () => {
    if (inputElement.classList.contains('error')) {
      hideFieldError(inputElement);
    }
  });
}

/**
 * Attaches password confirmation validation
 * @param {HTMLElement} passwordInput - Password input element
 * @param {HTMLElement} confirmInput - Confirmation input element
 */
function attachPasswordMatchValidation(passwordInput, confirmInput) {
  confirmInput.addEventListener('blur', () => {
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    if (confirm) {
      const validation = validatePasswordMatch(password, confirm);

      if (validation.valid) {
        markFieldValid(confirmInput);
      } else {
        showFieldError(confirmInput, validation.error);
      }
    }
  });

  confirmInput.addEventListener('input', () => {
    if (confirmInput.classList.contains('error')) {
      hideFieldError(confirmInput);
    }
  });
}

// ========== Initialization ==========

document.addEventListener('DOMContentLoaded', () => {
  // Set current year in subtitle
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Check if already authenticated
  if (isAuthenticated()) {
    redirectToGame();
    return;
  }

  // Get form elements
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  // Attach form submission handlers
  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
  }

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegisterSubmit);
  }

  // Attach real-time validation to login form
  const loginUsername = document.getElementById('loginUsername');
  const loginPassword = document.getElementById('loginPassword');

  if (loginUsername) {
    attachFieldValidation(loginUsername, validateUsername);
  }

  if (loginPassword) {
    attachFieldValidation(loginPassword, validatePassword);
  }

  // Attach real-time validation to registration form
  const registerUsername = document.getElementById('registerUsername');
  const registerEmail = document.getElementById('registerEmail');
  const registerPassword = document.getElementById('registerPassword');
  const registerPasswordConfirm = document.getElementById('registerPasswordConfirm');

  if (registerUsername) {
    attachFieldValidation(registerUsername, validateUsername);
  }

  if (registerEmail) {
    attachFieldValidation(registerEmail, validateEmail);
  }

  if (registerPassword) {
    attachFieldValidation(registerPassword, validatePassword);

    // Attach password strength indicator
    const strengthIndicator = document.getElementById('registerPasswordStrength');
    if (strengthIndicator) {
      registerPassword.addEventListener('input', () => {
        updatePasswordStrength(registerPassword.value, strengthIndicator);
      });
    }
  }

  if (registerPassword && registerPasswordConfirm) {
    attachPasswordMatchValidation(registerPassword, registerPasswordConfirm);
  }

  // Attach password visibility toggles
  document.querySelectorAll('.password-toggle').forEach((button) => {
    button.addEventListener('click', function () {
      // Find the input within the same password-wrapper
      const wrapper = this.closest('.password-wrapper') || this.parentElement;
      const input = wrapper.querySelector('input[type="password"], input[type="text"]');
      if (input) {
        togglePasswordVisibility(this, input);
      }
    });
  });

  // Expose functions for testing
  if (typeof window !== 'undefined') {
    window.validateUsername = validateUsername;
    window.validateEmail = validateEmail;
    window.validatePassword = validatePassword;
    window.validatePasswordMatch = validatePasswordMatch;
    window.sanitizeInput = sanitizeInput;
    window.showFieldError = showFieldError;
    window.hideFieldError = hideFieldError;
    window.markFieldValid = markFieldValid;
    window.showFormError = showFormError;
    window.hideFormError = hideFormError;
    window.updatePasswordStrength = updatePasswordStrength;
    window.showLoadingModal = showLoadingModal;
    window.hideLoadingModal = hideLoadingModal;
    window.showSuccessModal = showSuccessModal;
    window.togglePasswordVisibility = togglePasswordVisibility;
    window.authenticateUser = authenticateUser;
    window.registerUser = registerUser;
    window.isAuthenticated = isAuthenticated;
    window.redirectToGame = redirectToGame;
    window.handleLoginSubmit = handleLoginSubmit;
    window.handleRegisterSubmit = handleRegisterSubmit;
  }
});
