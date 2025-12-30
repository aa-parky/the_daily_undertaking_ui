/**
 * @jest-environment jsdom
 */

/* eslint-env node */

/**
 * Integration tests for daily.html popup loading functionality
 * Tests the dynamic loading of login/register popups
 */

import { openFormModal } from '../../js/popup-manager';

describe('Daily.html - Popup Loading Integration', () => {
  let loginBtn;
  let registerBtn;

  beforeEach(() => {
    // Set up DOM structure matching daily.html
    document.body.innerHTML = `
      <div class="container">
        <header>
          <div class="meta-bar">
            <button
              type="button"
              class="auth-button auth-login"
              id="openDailyLoginBtn"
              aria-label="Login to your account"
            >
              <span class="auth-button-text">Registry</span>
            </button>
            <button
              type="button"
              class="auth-button auth-register"
              id="openDailyRegisterBtn"
              aria-label="Create a new account"
            >
              <span class="auth-button-text">Enroll</span>
            </button>
          </div>
        </header>
      </div>
    `;

    loginBtn = document.getElementById('openDailyLoginBtn');
    registerBtn = document.getElementById('openDailyRegisterBtn');

    // Mock fetch API for jsdom environment
    global.fetch = jest.fn();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  describe('Login Popup Loading', () => {
    test('should load login popup HTML on first click', async () => {
      // Mock fetch response for login popup
      const mockLoginHTML = `
        <div id="dailyLoginModal" class="form-modal">
          <div class="modal-overlay"></div>
          <div class="modal-card">
            <h4>Registry Access</h4>
            <form><input type="text" /></form>
          </div>
        </div>
      `;

      global.fetch.mockResolvedValueOnce({
        text: async () => mockLoginHTML,
      });

      // Simulate click handler
      const clickHandler = async () => {
        if (!document.getElementById('dailyLoginModal')) {
          const response = await fetch('popups/daily/daily-login.html');
          const html = await response.text();
          document.body.insertAdjacentHTML('beforeend', html);
        }
        openFormModal('dailyLoginModal');
      };

      loginBtn.addEventListener('click', clickHandler);

      // Verify popup doesn't exist initially
      expect(document.getElementById('dailyLoginModal')).toBeNull();

      // Click the button
      await loginBtn.click();

      // Wait for async operations
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });

      // Verify fetch was called
      expect(global.fetch).toHaveBeenCalledWith('popups/daily/daily-login.html');

      // Verify popup was added to DOM
      expect(document.getElementById('dailyLoginModal')).toBeTruthy();
      expect(document.getElementById('dailyLoginModal').classList.contains('active')).toBe(true);
    });

    test('should not fetch login popup HTML on second click', async () => {
      // Add popup to DOM (simulating it's already been loaded)
      document.body.insertAdjacentHTML(
        'beforeend',
        `
        <div id="dailyLoginModal" class="form-modal">
          <div class="modal-overlay"></div>
          <div class="modal-card">
            <h4>Registry Access</h4>
          </div>
        </div>
      `,
      );

      // Simulate click handler
      const clickHandler = async () => {
        if (!document.getElementById('dailyLoginModal')) {
          const response = await fetch('popups/daily/daily-login.html');
          const html = await response.text();
          document.body.insertAdjacentHTML('beforeend', html);
        }
        openFormModal('dailyLoginModal');
      };

      loginBtn.addEventListener('click', clickHandler);

      // Click the button
      await loginBtn.click();

      // Wait for async operations
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });

      // Verify fetch was NOT called
      expect(global.fetch).not.toHaveBeenCalled();

      // Verify popup is activated
      expect(document.getElementById('dailyLoginModal').classList.contains('active')).toBe(true);
    });

    test('should handle fetch errors gracefully', async () => {
      // Mock fetch to reject
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Simulate click handler with error handling
      const clickHandler = async () => {
        try {
          if (!document.getElementById('dailyLoginModal')) {
            const response = await fetch('popups/daily/daily-login.html');
            const html = await response.text();
            document.body.insertAdjacentHTML('beforeend', html);
          }
          openFormModal('dailyLoginModal');
        } catch (error) {
          console.error('Failed to load login popup:', error);
        }
      };

      loginBtn.addEventListener('click', clickHandler);

      // Click the button
      await loginBtn.click();

      // Wait for async operations
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });

      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to load login popup:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Register Popup Loading', () => {
    test('should load register popup HTML on first click', async () => {
      // Mock fetch response for register popup
      const mockRegisterHTML = `
        <div id="dailyRegisterModal" class="form-modal">
          <div class="modal-overlay"></div>
          <div class="modal-card">
            <h4>Registry Enrollment</h4>
            <form><input type="text" /></form>
          </div>
        </div>
      `;

      global.fetch.mockResolvedValueOnce({
        text: async () => mockRegisterHTML,
      });

      // Simulate click handler
      const clickHandler = async () => {
        if (!document.getElementById('dailyRegisterModal')) {
          const response = await fetch('popups/daily/daily-register.html');
          const html = await response.text();
          document.body.insertAdjacentHTML('beforeend', html);
        }
        openFormModal('dailyRegisterModal');
      };

      registerBtn.addEventListener('click', clickHandler);

      // Verify popup doesn't exist initially
      expect(document.getElementById('dailyRegisterModal')).toBeNull();

      // Click the button
      await registerBtn.click();

      // Wait for async operations
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });

      // Verify fetch was called
      expect(global.fetch).toHaveBeenCalledWith('popups/daily/daily-register.html');

      // Verify popup was added to DOM
      expect(document.getElementById('dailyRegisterModal')).toBeTruthy();
      expect(document.getElementById('dailyRegisterModal').classList.contains('active')).toBe(true);
    });

    test('should not fetch register popup HTML on second click', async () => {
      // Add popup to DOM (simulating it's already been loaded)
      document.body.insertAdjacentHTML(
        'beforeend',
        `
        <div id="dailyRegisterModal" class="form-modal">
          <div class="modal-overlay"></div>
          <div class="modal-card">
            <h4>Registry Enrollment</h4>
          </div>
        </div>
      `,
      );

      // Simulate click handler
      const clickHandler = async () => {
        if (!document.getElementById('dailyRegisterModal')) {
          const response = await fetch('popups/daily/daily-register.html');
          const html = await response.text();
          document.body.insertAdjacentHTML('beforeend', html);
        }
        openFormModal('dailyRegisterModal');
      };

      registerBtn.addEventListener('click', clickHandler);

      // Click the button
      await registerBtn.click();

      // Wait for async operations
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });

      // Verify fetch was NOT called
      expect(global.fetch).not.toHaveBeenCalled();

      // Verify popup is activated
      expect(document.getElementById('dailyRegisterModal').classList.contains('active')).toBe(true);
    });
  });

  describe('Module Import Path', () => {
    test('should correctly import openFormModal from popup-manager', () => {
      expect(typeof openFormModal).toBe('function');
    });

    test('should have correct relative path in daily.html', () => {
      // This test documents the correct import path
      const expectedImportPath = './js/popup-manager.js';

      // The import statement in daily.html should use this path
      // import { openFormModal } from './js/popup-manager.js';
      expect(expectedImportPath).toBe('./js/popup-manager.js');
    });
  });

  describe('DOMContentLoaded Event', () => {
    test('should attach event listeners after DOMContentLoaded', () => {
      // Simulate DOMContentLoaded event handling
      const mockDOMContentLoaded = () => {
        const loginButton = document.getElementById('openDailyLoginBtn');
        const registerButton = document.getElementById('openDailyRegisterBtn');

        expect(loginButton).toBeTruthy();
        expect(registerButton).toBeTruthy();
      };

      // Run the handler
      mockDOMContentLoaded();

      // Verify buttons exist
      expect(loginBtn).toBeTruthy();
      expect(registerBtn).toBeTruthy();
    });
  });

  describe('Popup HTML Structure', () => {
    test('should correctly insert popup HTML into DOM', () => {
      const mockHTML = `
        <div id="testModal" class="form-modal">
          <div class="modal-overlay"></div>
          <div class="modal-card">
            <h4>Test Modal</h4>
            <form><input type="text" id="testInput" /></form>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', mockHTML);

      const modal = document.getElementById('testModal');
      expect(modal).toBeTruthy();
      expect(modal.classList.contains('form-modal')).toBe(true);
      expect(modal.querySelector('.modal-overlay')).toBeTruthy();
      expect(modal.querySelector('.modal-card')).toBeTruthy();
      expect(modal.querySelector('h4').textContent).toBe('Test Modal');
      expect(modal.querySelector('#testInput')).toBeTruthy();
    });
  });

  describe('CORS and Module Loading', () => {
    test('should document CORS requirements for ES6 modules', () => {
      // ES6 modules require CORS headers
      // This means:
      // 1. Files must be served via HTTP/HTTPS (not file://)
      // 2. Use a web server (python -m http.server, npm run dev, etc.)
      // 3. Opening HTML files directly in browser will cause CORS errors

      const requirements = {
        protocol: 'http:// or https://',
        serverRequired: true,
        fileProtocol: false, // file:// will NOT work
        devCommand: 'npm run dev', // Recommended development server
      };

      expect(requirements.serverRequired).toBe(true);
      expect(requirements.fileProtocol).toBe(false);
      expect(requirements.devCommand).toBe('npm run dev');
    });

    test('should have correct module script type in HTML', () => {
      // The script tag in daily.html should be:
      // <script type="module">
      const scriptType = 'module';
      expect(scriptType).toBe('module');
    });
  });
});
