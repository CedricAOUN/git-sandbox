console.log("Kanban JS loaded...");

// Exemple éventuel de structure
window.addEventListener("DOMContentLoaded", () => {
  // Ici, on récupère les éléments du DOM
  const addCardBtn = document.getElementById('addCardBtn');
  const searchInput = document.getElementById('searchInput');
  const sortByPriorityBtn = document.getElementById('sortByPriorityBtn');
  const allCards = document.querySelectorAll('.card');
  const dropZones = document.querySelectorAll('.column');

  // Éventuellement, on écoute les événements
  addCardBtn.addEventListener('click', () => {
    // ...
  });

  searchInput.addEventListener('input', () => {
    // ...
  });

  sortByPriorityBtn.addEventListener('click', () => {
    // ...
  });


  // DRAG AND DROP FEATURE
  // CARDS
  for (let card of allCards) {
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', card.dataset.id);
      card.style.opacity = '0.5';
    });

    card.addEventListener('dragend', () => {
      card.style.opacity = '1';
    });
  }
  // DROPZONES
  for (let zone of dropZones) {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('hover');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('hover');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('hover');
      const dataId = e.dataTransfer.getData('text/plain');
      const draggedElement = document.querySelector(`[data-id="${dataId}"]`);
      zone.appendChild(draggedElement);
    });
  }


});