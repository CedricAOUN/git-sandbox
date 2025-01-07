console.log("Kanban JS loaded...");

// Exemple éventuel de structure
window.addEventListener("DOMContentLoaded", () => {
  // Ici, on récupère les éléments du DOM
  const addCardBtn = document.getElementById('addCardBtn');
  const searchInput = document.getElementById('searchInput');
  const sortByPriorityBtn = document.getElementById('sortByPriorityBtn');

  const addDeleteButton = (card) => {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Supprimer';
    deleteBtn.className = 'delete-btn';

    deleteBtn.addEventListener('click', () => {
      if (confirm('Voulez-vous vraiment supprimer cette carte ?')) {
        card.remove(); // Supprime la carte
        console.log('Carte supprimée.');
      }
    });

    card.appendChild(deleteBtn); 
  };

  document.querySelectorAll('.card').forEach((card) => {
    addDeleteButton(card);
  });
});
