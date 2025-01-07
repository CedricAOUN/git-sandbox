console.log("Kanban JS loaded...");

// Exemple éventuel de structure
window.addEventListener("DOMContentLoaded", () => {
  // Ici, on récupère les éléments du DOM
  const allCards = document.querySelectorAll('.card');
  const addCardBtn = document.getElementById('addCardBtn');
  const searchInput = document.getElementById('searchInput');
  const sortByPriorityBtn = document.getElementById('sortByPriorityBtn');
  const toDo = document.querySelector('[data-status="todo"]');

  // Chope le plus gros ID des cartes existantes
  let highestId = 0;
  allCards.forEach(card => {
    const cardId = parseInt(card.getAttribute('data-id'), 10);
    if (cardId > highestId) highestId = cardId;
  });

  function choosePriority() {
    return new Promise((resolve) => {
      // Créer menu pour choisir la priorité
      const prioritySelection = document.createElement('div');
      prioritySelection.innerHTML = `
        <p>Sélectionner la priorité :</p>
        <button id="lowPriorityBtn">Basse</button>
        <button id="mediumPriorityBtn">Moyenne</button>
        <button id="highPriorityBtn">Haute</button>
      `;
      document.body.appendChild(prioritySelection);

      // Ajoute la priorité selon le bouton, supprime les boutons après
      document.getElementById('lowPriorityBtn').addEventListener('click', () => {
        resolve('low');
        prioritySelection.remove();
      });
      document.getElementById('mediumPriorityBtn').addEventListener('click', () => {
        resolve('medium');
        prioritySelection.remove();
      });
      document.getElementById('highPriorityBtn').addEventListener('click', () => {
        resolve('high');
        prioritySelection.remove();
      });
    });
  }

  addCardBtn.addEventListener('click', async () => {
    const title = prompt("Titre de la tâche :");
    if (!title) return;

    const texte = prompt("Description de la tâche :");
    
    // On récupère la priorité choisie par l'utilisateur
    const priority = await choosePriority();

    // ID de la carte en fonction des autres
    const id = highestId + 1;

    // On créé la carte
    const newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.setAttribute('data-id', id);
    newCard.setAttribute('data-priority', priority);
    newCard.setAttribute('draggable', 'true');
    newCard.innerHTML = `
      <h3>${title}</h3>
      <p>${texte}</p>
    `;

    toDo.appendChild(newCard);

    // On compte la nouvelle carte dans le calcul du plus gros ID
    highestId = id;
  });

  searchInput.addEventListener('input', () => {
  // ...
  });

  sortByPriorityBtn.addEventListener('click', () => {
  // ...
  });
});
