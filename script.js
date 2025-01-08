console.log("Kanban JS loaded...");

// Exemple éventuel de structure
window.addEventListener("DOMContentLoaded", () => {
  // Ici, on récupère les éléments du DOM
  const allCards = document.querySelectorAll('.card');
  const addCardBtn = document.getElementById('addCardBtn');
  const searchInput = document.getElementById('searchInput');
  const sortByPriorityBtn = document.getElementById('sortByPriorityBtn');
  const dropZones = document.querySelectorAll('.column');
  const toDo = document.querySelector('[data-status="todo"]');


  // ADD CARD FEATURE
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
    addDeleteButton(newCard);

    toDo.appendChild(newCard);

    // On compte la nouvelle carte dans le calcul du plus gros ID
    highestId = id;
    makeDraggable();
  });

  searchInput.addEventListener('input', () => {
  // ...
  });

  sortByPriorityBtn.addEventListener('click', () => {
    const columns = document.querySelectorAll('.column');
  
    columns.forEach(column => {
      const header = column.querySelector('h2');
      const cardsTable = Array.from(column.querySelectorAll('.card'));
  
      for (let i = 0; i < cardsTable.length; i++) {
        for (let j = i + 1; j < cardsTable.length; j++) {
          const priorityA = cardsTable[i].getAttribute('data-priority');
          const priorityB = cardsTable[j].getAttribute('data-priority');
          
          const priorityOrder = { low: 1, medium: 2, high: 3 };
  
          if (priorityOrder[priorityA] < priorityOrder[priorityB]) {
            const temp = cardsTable[i];
            cardsTable[i] = cardsTable[j];
            cardsTable[j] = temp;
          }
        }
      }
  
      // Vide les colonnes et remet trié
      column.innerHTML = '';
      column.appendChild(header);
      cardsTable.forEach(card => {
        column.appendChild(card);
      });
    });
  });
  
  

  // DRAG AND DROP FEATURE
  // CARDS
  function makeDraggable() {
    const everyCard = document.querySelectorAll('.card');
    for (let card of everyCard) {
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
  }
  

  // DELETE CARD
  const addDeleteButton = (card) => {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Supprimer';
    deleteBtn.className = 'delete-btn';

    deleteBtn.addEventListener('click', () => {
      if (confirm('Voulez-vous vraiment supprimer cette carte ?')) {
        card.remove(); // Supprime la carte
        console.log('Carte supprimée.');
        makeDraggable();
      }
    });

    card.appendChild(deleteBtn); 
  };

  document.querySelectorAll('.card').forEach((card) => {
    addDeleteButton(card);
  });

  makeDraggable();
});

// Dark mode

document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.getElementById("darkModeToggle");
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    
    // Change le texte du bouton
    if (document.body.classList.contains("dark-mode")) {
      darkModeToggle.textContent = "☀️ Light Mode";
    } else {
      darkModeToggle.textContent = "🌙 Dark Mode";
    }
  });
});
