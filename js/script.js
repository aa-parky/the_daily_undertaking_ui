// Collapsible section toggle
function toggleSection(header) {
    header.classList.toggle('collapsed');
    const content = header.nextElementSibling;
    content.classList.toggle('collapsed');
}

// Menu item interaction
const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuItems.forEach(mi => mi.classList.remove('active'));
        item.classList.add('active');
        
        // Placeholder for menu functionality
        console.log(`Menu clicked: ${item.textContent}`);
    });
});

// Simple interaction example
const commandInput = document.getElementById('commandInput');
const gameOutput = document.getElementById('gameOutput');

commandInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const command = commandInput.value.trim();
        
        if (command) {
            // Add player command to output
            const commandDiv = document.createElement('div');
            commandDiv.className = 'output-text';
            commandDiv.innerHTML = `<strong>▸ You: </strong>${command}`;
            gameOutput.appendChild(commandDiv);

            // Simulate response (in real app, this would call your LLM)
            setTimeout(() => {
                const responseDiv = document.createElement('div');
                responseDiv.className = 'output-text';
                responseDiv.innerHTML = `<em style="opacity: 0.85;">Processing command... The realm acknowledges your action.</em>`;
                gameOutput.appendChild(responseDiv);
                gameOutput.scrollTop = gameOutput.scrollHeight;
            }, 300);

            commandInput.value = '';
            gameOutput.scrollTop = gameOutput.scrollHeight;
        }
    }
});

// Item Detail Modal Functions
function openItemModal(itemElement) {
    let itemImage, itemTitle, itemDescription;
    
    // Check if it's an equipment item or inventory slot
    if (itemElement.classList.contains('equipment-item')) {
        // Equipment item from Useful Rubbish
        itemImage = itemElement.querySelector('.equipment-image img');
        itemTitle = itemElement.querySelector('.equipment-name');
        itemDescription = itemElement.querySelector('.equipment-description');
        
        if (itemImage && itemTitle && itemDescription) {
            document.getElementById('modalItemImage').src = itemImage.src;
            document.getElementById('modalItemTitle').textContent = itemTitle.textContent;
            document.getElementById('modalItemDescription').textContent = itemDescription.textContent;
        }
    } else if (itemElement.classList.contains('inventory-slot')) {
        // Inventory slot from Satchel
        itemImage = itemElement.querySelector('img');
        itemTitle = itemElement.getAttribute('data-item-name');
        itemDescription = itemElement.getAttribute('data-item-desc');
        
        if (itemImage && itemImage.src && itemTitle) {
            document.getElementById('modalItemImage').src = itemImage.src;
            document.getElementById('modalItemTitle').textContent = itemTitle;
            document.getElementById('modalItemDescription').textContent = itemDescription || '';
        }
    }
    
    // Show modal if we have data
    if (itemImage && itemImage.src) {
        document.getElementById('itemModal').classList.add('active');
    }
}

function closeItemModal() {
    document.getElementById('itemModal').classList.remove('active');
}

// Initialize modal interactions
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('itemModal');
    
    // Close modal when clicking outside the content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeItemModal();
        }
    });
    
    // Add click handlers to equipment items
    const equipmentItems = document.querySelectorAll('.equipment-item');
    equipmentItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            openItemModal(this);
        });
    });
    
    // Add click handlers to filled inventory slots
    const inventorySlots = document.querySelectorAll('.inventory-slot.filled');
    inventorySlots.forEach(slot => {
        slot.style.cursor = 'pointer';
        slot.addEventListener('click', function() {
            openItemModal(this);
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeItemModal();
        }
    });
});
