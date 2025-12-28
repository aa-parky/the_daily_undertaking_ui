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
    // Get item data from the equipment item
    const itemImage = itemElement.querySelector('.equipment-image img');
    const itemTitle = itemElement.querySelector('.equipment-name');
    const itemDescription = itemElement.querySelector('.equipment-description');
    
    // Populate modal with item data
    document.getElementById('modalItemImage').src = itemImage.src;
    document.getElementById('modalItemTitle').textContent = itemTitle.textContent;
    document.getElementById('modalItemDescription').textContent = itemDescription.textContent;
    
    // Show modal
    document.getElementById('itemModal').classList.add('active');
}

function closeItemModal() {
    document.getElementById('itemModal').classList.remove('active');
}

// Close modal when clicking outside the content
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('itemModal');
    
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
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeItemModal();
        }
    });
});
