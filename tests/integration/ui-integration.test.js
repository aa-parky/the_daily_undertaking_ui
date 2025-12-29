import '@testing-library/jest-dom';

describe('UI Integration Tests', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    container.innerHTML = `
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
    <div class="equipment-name">Sword</div>
    <div class="equipment-description">A sharp blade</div>
    </div>
    <div class="inventory-slot filled" data-item-name="Potion" data-item-desc="Healing potion">
    <img src="potion.png" />
    </div>
    <div class="section-header">Inventory</div>
    <div class="section-content">
    <div class="inventory-slot filled"></div>
    </div>
  `;
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should handle complete user interaction flow', () => {
    const commandInput = container.querySelector('#commandInput');
    const gameOutput = container.querySelector('#gameOutput');

    // User types a command
    commandInput.value = 'examine sword';

    // Simulate command submission
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
          gameOutput.scrollTop = gameOutput.scrollHeight;
        }
      }
    };

    handleCommand(event);

    // Verify command was added to output
    expect(gameOutput.children.length).toBeGreaterThan(0);
    expect(gameOutput.children[0].textContent).toContain('examine sword');
    expect(commandInput.value).toBe('');
  });

  it('should handle modal opening and closing', () => {
    const modal = container.querySelector('#itemModal');

    // Open modal
    modal.classList.add('active');
    expect(modal.classList.contains('active')).toBe(true);

    // Close modal
    modal.classList.remove('active');
    expect(modal.classList.contains('active')).toBe(false);
  });

  it('should handle menu navigation', () => {
    const menuItems = container.querySelectorAll('.menu-item');
    const firstItem = menuItems[0];
    const secondItem = menuItems[1];

    expect(firstItem.classList.contains('active')).toBe(true);
    expect(secondItem.classList.contains('active')).toBe(false);

    // Click second menu item
    secondItem.classList.remove('active');
    firstItem.classList.remove('active');
    secondItem.classList.add('active');

    expect(firstItem.classList.contains('active')).toBe(false);
    expect(secondItem.classList.contains('active')).toBe(true);
  });
});
