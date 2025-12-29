/**
 * Daily News Page - JavaScript
 * Minimal functionality for collapsible sections and dynamic dates
 */

/**
 * Toggle collapsible section visibility
 * @param {HTMLElement} header - The section header element clicked
 */
function toggleSection(header) {
  header.classList.toggle('collapsed');
  const content = header.nextElementSibling;
  if (content) {
    content.classList.toggle('collapsed');
  }
}

/**
 * Set current year in masthead
 */
function setCurrentYear() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * Set current date in story byline
 */
function setCurrentDate() {
  const dateElement = document.getElementById('currentDate');
  if (dateElement) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString('en-US', options);
    dateElement.textContent = formattedDate;
  }
}

/**
 * Initialize page
 */
function initializePage() {
  setCurrentYear();
  setCurrentDate();
}

// Expose toggleSection to global scope for onclick handlers
window.toggleSection = toggleSection;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  initializePage();
}
