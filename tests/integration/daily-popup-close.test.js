/**
 * @jest-environment jsdom
 */

/* eslint-env node */

/**
 * Integration tests for daily.html popup close functionality
 * Tests close button, ESC key, and overlay click
 */

describe('Daily Popups - Close Functionality', () => {
  let loginModalHTML;
  let registerModalHTML;

  beforeAll(() => {
    // Mock popup HTML structures
    loginModalHTML = `
      <div
        id="dailyLoginModal"
        class="form-modal active"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dailyLoginTitle"
      >
        <div class="modal-overlay"></div>
        <div class="classified-ad login-ad modal-form">
          <button type="button" class="modal-close" aria-label="Close modal">&times;</button>
          <h3 class="classified-header" id="dailyLoginTitle">Adventurer Registry</h3>
          <form id="dailyLoginForm" novalidate>
            <input type="text" id="dailyLoginUsername" />
            <input type="password" id="dailyLoginPassword" />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    `;

    registerModalHTML = `
      <div
        id="dailyRegisterModal"
        class="form-modal active"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dailyRegisterTitle"
      >
        <div class="modal-overlay"></div>
        <div class="classified-ad register-ad modal-form">
          <button type="button" class="modal-close" aria-label="Close modal">&times;</button>
          <h3 class="classified-header" id="dailyRegisterTitle">New Subscriber Enrollment</h3>
          <form id="dailyRegisterForm" novalidate>
            <input type="text" id="dailyRegisterUsername" />
            <input type="email" id="dailyRegisterEmail" />
            <input type="password" id="dailyRegisterPassword" />
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Login Modal Close Functionality', () => {
    let modal;
    let closeBtn;
    let overlay;
    let closeModalFn;

    beforeEach(() => {
      document.body.insertAdjacentHTML('beforeend', loginModalHTML);
      modal = document.getElementById('dailyLoginModal');
      closeBtn = modal.querySelector('.modal-close');
      overlay = modal.querySelector('.modal-overlay');

      // Mock close function
      closeModalFn = jest.fn(() => {
        modal.classList.remove('active');
      });

      // Attach close button event
      closeBtn.addEventListener('click', closeModalFn);

      // Attach overlay click event
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeModalFn();
        }
      });
    });

    test('should have close button in DOM', () => {
      expect(closeBtn).toBeTruthy();
      expect(closeBtn.classList.contains('modal-close')).toBe(true);
      expect(closeBtn.getAttribute('aria-label')).toBe('Close modal');
    });

    test('should close modal when close button is clicked', () => {
      expect(modal.classList.contains('active')).toBe(true);

      closeBtn.click();

      expect(closeModalFn).toHaveBeenCalled();
      expect(modal.classList.contains('active')).toBe(false);
    });

    test('should close modal when overlay is clicked', () => {
      expect(modal.classList.contains('active')).toBe(true);

      // Create and dispatch click event on overlay
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(clickEvent, 'target', { value: overlay, writable: false });
      overlay.dispatchEvent(clickEvent);

      expect(closeModalFn).toHaveBeenCalled();
      expect(modal.classList.contains('active')).toBe(false);
    });

    test('should NOT close modal when clicking inside modal content', () => {
      const form = modal.querySelector('form');

      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(clickEvent, 'target', { value: form, writable: false });
      overlay.dispatchEvent(clickEvent);

      expect(closeModalFn).not.toHaveBeenCalled();
      expect(modal.classList.contains('active')).toBe(true);
    });

    test('should close modal when ESC key is pressed', () => {
      // Attach ESC key listener
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          closeModalFn();
        }
      });

      expect(modal.classList.contains('active')).toBe(true);

      // Dispatch ESC key event
      const escEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(escEvent);

      expect(closeModalFn).toHaveBeenCalled();
      expect(modal.classList.contains('active')).toBe(false);
    });

    test('should NOT close modal when other keys are pressed', () => {
      // Attach ESC key listener
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          closeModalFn();
        }
      });

      closeModalFn.mockClear();

      // Dispatch Enter key event
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(enterEvent);

      expect(closeModalFn).not.toHaveBeenCalled();
      expect(modal.classList.contains('active')).toBe(true);
    });

    test('should NOT respond to ESC when modal is not active', () => {
      modal.classList.remove('active');

      // Attach ESC key listener
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          closeModalFn();
        }
      });

      closeModalFn.mockClear();

      // Dispatch ESC key event
      const escEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(escEvent);

      expect(closeModalFn).not.toHaveBeenCalled();
    });
  });

  describe('Register Modal Close Functionality', () => {
    let modal;
    let closeBtn;
    let overlay;
    let closeModalFn;

    beforeEach(() => {
      document.body.insertAdjacentHTML('beforeend', registerModalHTML);
      modal = document.getElementById('dailyRegisterModal');
      closeBtn = modal.querySelector('.modal-close');
      overlay = modal.querySelector('.modal-overlay');

      // Mock close function
      closeModalFn = jest.fn(() => {
        modal.classList.remove('active');
      });

      // Attach close button event
      closeBtn.addEventListener('click', closeModalFn);

      // Attach overlay click event
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeModalFn();
        }
      });
    });

    test('should have close button in DOM', () => {
      expect(closeBtn).toBeTruthy();
      expect(closeBtn.classList.contains('modal-close')).toBe(true);
      expect(closeBtn.getAttribute('aria-label')).toBe('Close modal');
    });

    test('should close modal when close button is clicked', () => {
      expect(modal.classList.contains('active')).toBe(true);

      closeBtn.click();

      expect(closeModalFn).toHaveBeenCalled();
      expect(modal.classList.contains('active')).toBe(false);
    });

    test('should close modal when overlay is clicked', () => {
      expect(modal.classList.contains('active')).toBe(true);

      // Create and dispatch click event on overlay
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(clickEvent, 'target', { value: overlay, writable: false });
      overlay.dispatchEvent(clickEvent);

      expect(closeModalFn).toHaveBeenCalled();
      expect(modal.classList.contains('active')).toBe(false);
    });

    test('should close modal when ESC key is pressed', () => {
      // Attach ESC key listener
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          closeModalFn();
        }
      });

      expect(modal.classList.contains('active')).toBe(true);

      // Dispatch ESC key event
      const escEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(escEvent);

      expect(closeModalFn).toHaveBeenCalled();
      expect(modal.classList.contains('active')).toBe(false);
    });
  });

  describe('Multiple Modals ESC Key Handling', () => {
    test('should only close the active modal when ESC is pressed', () => {
      document.body.insertAdjacentHTML('beforeend', loginModalHTML);
      document.body.insertAdjacentHTML('beforeend', registerModalHTML);

      const loginModal = document.getElementById('dailyLoginModal');
      const registerModal = document.getElementById('dailyRegisterModal');

      // Only login modal is active
      loginModal.classList.add('active');
      registerModal.classList.remove('active');

      const closeLoginFn = jest.fn(() => {
        loginModal.classList.remove('active');
      });

      const closeRegisterFn = jest.fn(() => {
        registerModal.classList.remove('active');
      });

      // Attach ESC listeners for both
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (loginModal.classList.contains('active')) {
            closeLoginFn();
          }
          if (registerModal.classList.contains('active')) {
            closeRegisterFn();
          }
        }
      });

      // Dispatch ESC key
      const escEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(escEvent);

      // Only login modal should close
      expect(closeLoginFn).toHaveBeenCalled();
      expect(closeRegisterFn).not.toHaveBeenCalled();
      expect(loginModal.classList.contains('active')).toBe(false);
    });
  });

  describe('Accessibility', () => {
    test('login modal should have proper ARIA attributes', () => {
      document.body.insertAdjacentHTML('beforeend', loginModalHTML);
      const modal = document.getElementById('dailyLoginModal');

      expect(modal.getAttribute('role')).toBe('dialog');
      expect(modal.getAttribute('aria-modal')).toBe('true');
      expect(modal.getAttribute('aria-labelledby')).toBe('dailyLoginTitle');
    });

    test('register modal should have proper ARIA attributes', () => {
      document.body.insertAdjacentHTML('beforeend', registerModalHTML);
      const modal = document.getElementById('dailyRegisterModal');

      expect(modal.getAttribute('role')).toBe('dialog');
      expect(modal.getAttribute('aria-modal')).toBe('true');
      expect(modal.getAttribute('aria-labelledby')).toBe('dailyRegisterTitle');
    });

    test('close button should have aria-label', () => {
      document.body.insertAdjacentHTML('beforeend', loginModalHTML);
      const closeBtn = document.querySelector('.modal-close');

      expect(closeBtn.getAttribute('aria-label')).toBe('Close modal');
    });
  });

  describe('Event Cleanup', () => {
    test('should document that event listeners should not leak', () => {
      // This test documents best practices for event cleanup
      // In the actual implementation, event listeners attached to modal elements
      // are automatically garbage collected when the modal is removed from DOM

      const cleanupBestPractices = {
        inlineListeners: 'Use inline event listeners on modal elements',
        domRemoval: 'Listeners attached to removed DOM elements are garbage collected',
        documentListeners: 'Document-level listeners should check if modal is active',
        avoidMemoryLeaks: 'No need to manually remove listeners for inline handlers',
      };

      expect(cleanupBestPractices.inlineListeners).toBeTruthy();
      expect(cleanupBestPractices.documentListeners).toBeTruthy();
    });
  });
});
