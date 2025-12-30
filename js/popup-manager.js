/**
 * ========================================
 * Popup Manager - Shared Validation & UI
 * ========================================
 *
 * This module provides reusable validation and UI functions
 * for form popups across all pages (daily, game, etc.)
 *
 * Usage:
 *   import { validateUsername, showFieldError } from './popup-manager.js';
 */

// ========== Validation Functions ==========

/**
 * Validates username format
 * @param {string} username - Username to validate
 * @returns {{valid: boolean, error: string}} Validation result
 */
export function validateUsername(username) {
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
export function validateEmail(email) {
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
export function validatePassword(password) {
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
export function validatePasswordMatch(password, confirmPassword) {
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
export function sanitizeInput(input) {
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
export function showFieldError(inputElement, message) {
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
export function hideFieldError(inputElement) {
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
export function markFieldValid(inputElement) {
  hideFieldError(inputElement);
  inputElement.classList.add('valid');
}

/**
 * Shows form-level error message
 * @param {HTMLElement} formElement - Form element
 * @param {string} message - Error message to display
 */
export function showFormError(formElement, message) {
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
export function hideFormError(formElement) {
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
export function updatePasswordStrength(password, strengthElement) {
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

// ========== Password Visibility Toggle ==========

/**
 * Toggles password visibility
 * @param {HTMLElement} toggleButton - Toggle button element
 * @param {HTMLElement} passwordInput - Password input element
 */
export function togglePasswordVisibility(toggleButton, passwordInput) {
  const toggleIcon = toggleButton.querySelector('.toggle-icon');

  if (passwordInput.type === 'password') {
    passwordInput.setAttribute('type', 'text');
    toggleIcon.textContent = '⚫';
  } else {
    passwordInput.setAttribute('type', 'password');
    toggleIcon.textContent = '👁';
  }
}

// ========== Field Attachment Functions ==========

/**
 * Attaches real-time validation to a field
 * @param {HTMLElement} inputElement - Input field element
 * @param {Function} validatorFunction - Validation function to use
 */
export function attachFieldValidation(inputElement, validatorFunction) {
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
export function attachPasswordMatchValidation(passwordInput, confirmInput) {
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

// ========== Modal Functions ==========

/**
 * Opens a form modal
 * @param {string} modalId - ID of the modal to open
 */
export function openFormModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    // Focus first input in the modal
    const firstInput = modal.querySelector('input:not([type="hidden"])');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }
}

/**
 * Closes a form modal
 * @param {string} modalId - ID of the modal to close
 */
export function closeFormModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    // Clear any form errors when closing
    const form = modal.querySelector('form');
    if (form) {
      hideFormError(form);
      // Clear all input errors and validation states
      const inputs = modal.querySelectorAll('input');
      inputs.forEach((input) => {
        input.classList.remove('error', 'valid');
        // Also clear the associated error message
        const errorId = input.getAttribute('aria-describedby');
        if (errorId) {
          const errorIds = errorId.split(' ');
          errorIds.forEach((id) => {
            const errorElement = document.getElementById(id);
            if (errorElement && errorElement.classList.contains('field-error')) {
              errorElement.textContent = '';
              errorElement.classList.remove('visible');
            }
          });
        }
      });
    }
  }
}

/**
 * Closes modal when clicking outside the form
 * @param {Event} event - Click event
 * @param {string} modalId - ID of the modal
 */
export function handleModalOverlayClick(event, modalId) {
  if (event.target.classList.contains('modal-overlay')) {
    closeFormModal(modalId);
  }
}

// ========== Loading/Success Modals ==========

/**
 * Shows loading modal
 * @param {string} modalId - ID of the loading modal
 * @param {string} message - Loading message to display
 */
export function showLoadingModal(modalId, message) {
  const modal = document.getElementById(modalId);
  const modalMessage = modal?.querySelector('.modal-message');

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
 * @param {string} modalId - ID of the loading modal
 */
export function hideLoadingModal(modalId) {
  const modal = document.getElementById(modalId);

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
 * @param {string} modalId - ID of the success modal
 * @param {string} message - Success message
 * @param {string} title - Modal title (optional)
 */
export function showSuccessModal(modalId, message, title = 'Documentation Approved') {
  const modal = document.getElementById(modalId);
  const modalMessage = modal?.querySelector('.modal-message');
  const modalTitle = modal?.querySelector('.modal-title');

  if (modal && modalMessage && modalTitle) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.add('success');
    modal.classList.add('active');
  }
}

// ========== Authentication Helpers ==========

/**
 * Checks if user is already authenticated
 * @returns {boolean} Authentication status
 */
export function isAuthenticated() {
  const token = localStorage.getItem('authToken');
  return !!token;
}

/**
 * Gets stored auth token
 * @returns {string|null} Auth token or null
 */
export function getAuthToken() {
  return localStorage.getItem('authToken');
}

/**
 * Stores auth token
 * @param {string} token - Auth token to store
 */
export function setAuthToken(token) {
  localStorage.setItem('authToken', token);
}

/**
 * Clears auth token
 */
export function clearAuthToken() {
  localStorage.removeItem('authToken');
}

/**
 * Redirects to game page
 */
export function redirectToGame() {
  // Check if in test environment (jsdom doesn't support navigation)
  /* global process */
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    // In test environment, just set a flag instead of navigating
    if (typeof window !== 'undefined') {
      window.__redirectCalled = true;
    }
    return;
  }
  window.location.href = 'game.html';
}

/**
 * Redirects to daily page
 */
export function redirectToDaily() {
  // Check if in test environment
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    if (typeof window !== 'undefined') {
      window.__redirectCalled = true;
    }
    return;
  }
  window.location.href = 'daily.html';
}
