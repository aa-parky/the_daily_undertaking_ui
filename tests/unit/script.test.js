import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';

describe('Script Functionality', () => {
  beforeEach(() => {
    // Set up DOM structure BEFORE loading script
    document.body.innerHTML = `
      <div id="itemModal" class="modal">
        <div id="modalItemImage"></div>
        <div id="modalItemTitle"></div>
        <div id="modalItemDescription"></div>
        <button class="close-button">×</button>
      </div>
      <div id="gameOutput"></div>
      <textarea id="commandInput"></textarea>
      <div class="menu-item active">Adventure</div>
      <div class="menu-item">Character</div>
      <div class="equipment-item">
        <div class="equipment-image"><img src="test.png" /></div>
        <div class="equipment-name">Test Item</div>
        <div class="equipment-description">Test Description</div>
      </div>
      <div class="inventory-slot filled" data-item-name="Test" data-item-desc="Desc">
        <img src="test.png" />
      </div>
      <div class="section-header">Section</div>
      <div class="section-content"></div>
    `;

    // Now load the actual script.js
    // This will execute all the code and set up event listeners
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require, import/extensions
      require('../../js/script.js');
    });

    // Trigger DOMContentLoaded to initialize event listeners
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('toggleSection', () => {
    it('should toggle collapsed class on header and content', () => {
      const header = document.querySelector('.section-header');
      const content = document.querySelector('.section-content');

      expect(header.classList.contains('collapsed')).toBe(false);
      expect(content.classList.contains('collapsed')).toBe(false);

      // Call the actual function from script.js
      window.toggleSection(header);

      expect(header.classList.contains('collapsed')).toBe(true);
      expect(content.classList.contains('collapsed')).toBe(true);

      // Toggle back
      window.toggleSection(header);

      expect(header.classList.contains('collapsed')).toBe(false);
      expect(content.classList.contains('collapsed')).toBe(false);
    });
  });

  describe('openItemModal', () => {
    it('should populate modal with equipment item data', () => {
      const modal = document.getElementById('itemModal');
      const equipmentItem = document.querySelector('.equipment-item');

      expect(modal.classList.contains('active')).toBe(false);

      // Call the actual function from script.js
      window.openItemModal(equipmentItem);

      expect(document.getElementById('modalItemTitle').textContent).toBe('Test Item');
      expect(document.getElementById('modalItemDescription').textContent).toBe('Test Description');
      expect(modal.classList.contains('active')).toBe(true);
    });

    it('should populate modal with inventory item data', () => {
      const modal = document.getElementById('itemModal');
      const inventorySlot = document.querySelector('.inventory-slot.filled');

      expect(modal.classList.contains('active')).toBe(false);

      // Call the actual function from script.js
      window.openItemModal(inventorySlot);

      expect(document.getElementById('modalItemTitle').textContent).toBe('Test');
      expect(document.getElementById('modalItemDescription').textContent).toBe('Desc');
      expect(modal.classList.contains('active')).toBe(true);
    });
  });

  describe('closeItemModal', () => {
    it('should remove active class from modal', () => {
      const modal = document.getElementById('itemModal');
      modal.classList.add('active');
      expect(modal.classList.contains('active')).toBe(true);

      // Call the actual function from script.js
      window.closeItemModal();

      expect(modal.classList.contains('active')).toBe(false);
    });
  });

  describe('Command Input', () => {
    it('should handle Enter key to submit command', () => {
      const commandInput = document.querySelector('#commandInput');
      const gameOutput = document.querySelector('#gameOutput');

      commandInput.value = 'test command';

      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        shiftKey: false,
        bubbles: true,
      });

      commandInput.dispatchEvent(event);

      expect(gameOutput.children.length).toBeGreaterThan(0);
      expect(gameOutput.children[0].textContent).toContain('test command');
      expect(commandInput.value).toBe('');
    });

    it('should not submit command on Shift+Enter', () => {
      const commandInput = document.querySelector('#commandInput');
      const gameOutput = document.querySelector('#gameOutput');

      commandInput.value = 'test command';
      const initialChildCount = gameOutput.children.length;

      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        shiftKey: true,
        bubbles: true,
      });

      commandInput.dispatchEvent(event);

      expect(gameOutput.children.length).toBe(initialChildCount);
      expect(commandInput.value).toBe('test command');
    });
  });

  describe('Menu Item Interaction', () => {
    it('should toggle active class on menu items when clicked', () => {
      const menuItems = document.querySelectorAll('.menu-item');
      const firstItem = menuItems[0];
      const secondItem = menuItems[1];

      expect(firstItem.classList.contains('active')).toBe(true);
      expect(secondItem.classList.contains('active')).toBe(false);

      // Click second menu item
      fireEvent.click(secondItem);

      expect(firstItem.classList.contains('active')).toBe(false);
      expect(secondItem.classList.contains('active')).toBe(true);
    });
  });

  describe('Modal Escape Key', () => {
    it('should close modal when Escape is pressed', () => {
      const modal = document.getElementById('itemModal');
      modal.classList.add('active');

      expect(modal.classList.contains('active')).toBe(true);

      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      });

      document.dispatchEvent(event);

      expect(modal.classList.contains('active')).toBe(false);
    });
  });
});
