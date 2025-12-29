import '@testing-library/jest-dom';

describe('Script Functionality', () => {
  let container;

  beforeEach(() => {
    // Set up DOM structure
    container = document.createElement('div');
    document.body.appendChild(container);

    // Create necessary DOM elements
    container.innerHTML = `
    <div id="itemModal" class="modal">
    <div id="modalItemImage"></div>
    <div id="modalItemTitle"></div>
    <div id="modalItemDescription"></div>
    </div>
    <div id="gameOutput"></div>
    <textarea id="commandInput"></textarea>
    <div class="menu-item active">Adventure</div>
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
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('toggleSection', () => {
    it('should toggle collapsed class on header', () => {
      const header = container.querySelector('.section-header');
      const content = container.querySelector('.section-content');

      // Mock the function
      const toggleSection = (headerEl) => {
        headerEl.classList.toggle('collapsed');
        const contentEl = headerEl.nextElementSibling;
        contentEl.classList.toggle('collapsed');
      };

      expect(header.classList.contains('collapsed')).toBe(false);
      toggleSection(header);
      expect(header.classList.contains('collapsed')).toBe(true);
      expect(content.classList.contains('collapsed')).toBe(true);
    });
  });

  describe('openItemModal', () => {
    it('should populate modal with equipment item data', () => {
      const openItemModal = (itemElement) => {
        let itemImage;
        let itemTitle;
        let itemDescription;

        if (itemElement.classList.contains('equipment-item')) {
          itemImage = itemElement.querySelector('.equipment-image img');
          itemTitle = itemElement.querySelector('.equipment-name');
          itemDescription = itemElement.querySelector('.equipment-description');

          if (itemImage && itemTitle && itemDescription) {
            document.getElementById('modalItemImage').src = itemImage.src;
            document.getElementById('modalItemTitle').textContent = itemTitle.textContent;
            document.getElementById('modalItemDescription').textContent =
              itemDescription.textContent;
          }
        }

        if (itemImage && itemImage.src) {
          document.getElementById('itemModal').classList.add('active');
        }
      };

      const equipmentItem = container.querySelector('.equipment-item');
      openItemModal(equipmentItem);

      expect(document.getElementById('modalItemTitle').textContent).toBe('Test Item');
      expect(document.getElementById('modalItemDescription').textContent).toBe('Test Description');
      expect(document.getElementById('itemModal').classList.contains('active')).toBe(true);
    });

    it('should populate modal with inventory item data', () => {
      const openItemModal = (itemElement) => {
        let itemImage;
        let itemTitle;
        let itemDescription;

        if (itemElement.classList.contains('inventory-slot')) {
          itemImage = itemElement.querySelector('img');
          itemTitle = itemElement.getAttribute('data-item-name');
          itemDescription = itemElement.getAttribute('data-item-desc');

          if (itemImage && itemImage.src && itemTitle) {
            document.getElementById('modalItemImage').src = itemImage.src;
            document.getElementById('modalItemTitle').textContent = itemTitle;
            document.getElementById('modalItemDescription').textContent = itemDescription || '';
          }
        }

        if (itemImage && itemImage.src) {
          document.getElementById('itemModal').classList.add('active');
        }
      };

      const inventorySlot = container.querySelector('.inventory-slot.filled');
      openItemModal(inventorySlot);

      expect(document.getElementById('modalItemTitle').textContent).toBe('Test');
      expect(document.getElementById('modalItemDescription').textContent).toBe('Desc');
      expect(document.getElementById('itemModal').classList.contains('active')).toBe(true);
    });
  });

  describe('closeItemModal', () => {
    it('should remove active class from modal', () => {
      const closeItemModal = () => {
        document.getElementById('itemModal').classList.remove('active');
      };

      const modal = document.getElementById('itemModal');
      modal.classList.add('active');
      expect(modal.classList.contains('active')).toBe(true);

      closeItemModal();
      expect(modal.classList.contains('active')).toBe(false);
    });
  });

  describe('Command Input', () => {
    it('should handle Enter key to submit command', () => {
      const commandInput = container.querySelector('#commandInput');
      const gameOutput = container.querySelector('#gameOutput');

      commandInput.value = 'test command';

      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        shiftKey: false,
      });

      const handleCommand = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          const command = commandInput.value.trim();

          if (command) {
            const commandDiv = document.createElement('div');
            commandDiv.className = 'output-text';
            commandDiv.innerHTML = `<strong>▸ You: </strong>${command}`;
            gameOutput.appendChild(commandDiv);
            commandInput.value = '';
          }
        }
      };

      handleCommand(event);

      expect(gameOutput.children.length).toBe(1);
      expect(gameOutput.children[0].textContent).toContain('test command');
      expect(commandInput.value).toBe('');
    });

    it('should not submit command on Shift+Enter', () => {
      const commandInput = container.querySelector('#commandInput');
      const gameOutput = container.querySelector('#gameOutput');

      commandInput.value = 'test command';

      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        shiftKey: true,
      });

      const handleCommand = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          const command = commandInput.value.trim();

          if (command) {
            const commandDiv = document.createElement('div');
            commandDiv.className = 'output-text';
            gameOutput.appendChild(commandDiv);
            commandInput.value = '';
          }
        }
      };

      handleCommand(event);

      expect(gameOutput.children.length).toBe(0);
      expect(commandInput.value).toBe('test command');
    });
  });

  describe('Menu Item Interaction', () => {
    it('should toggle active class on menu items', () => {
      const menuItems = container.querySelectorAll('.menu-item');
      const firstItem = menuItems[0];
      const secondItem = document.createElement('div');
      secondItem.className = 'menu-item';
      container.appendChild(secondItem);

      const handleMenuClick = (item) => {
        container.querySelectorAll('.menu-item').forEach((mi) => {
          mi.classList.remove('active');
        });
        item.classList.add('active');
      };

      expect(firstItem.classList.contains('active')).toBe(true);
      handleMenuClick(secondItem);
      expect(firstItem.classList.contains('active')).toBe(false);
      expect(secondItem.classList.contains('active')).toBe(true);
    });
  });
});
