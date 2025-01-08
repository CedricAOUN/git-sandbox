console.log("Kanban JS loaded...");

// Exemple éventuel de structure
window.addEventListener("DOMContentLoaded", () => {
  // Ici, on récupère les éléments du DOM
  const allCards = document.querySelectorAll('.card');
  const addCardBtn = document.getElementById('addCardBtn');
  const searchInput = document.getElementById('searchInput'); // Champ de recherche pour filtrage
  const sortByPriorityBtn = document.getElementById('sortByPriorityBtn');
  const dropZones = document.querySelectorAll('.column');
  const toDo = document.querySelector('[data-status="todo"]');

  // INIT DB
  for (let card of allCards) {
    const dataId = card.dataset.id;
    const title = card.querySelector('h3').innerText;
    const desc = card.querySelector('p').innerText;
    const priority = card.dataset.priority;
    const category = card.dataset.category;

    // Ajoute la classe de couleur à la carte selon la priorité
    card.classList.add(priority);
  }

  const allItems = Array.from({ length: localStorage.length }, (_, i) => {
    const key = localStorage.key(i); // Get the key
    const value = localStorage.getItem(key); // Get the value
    return { key, value }; // Return as an object
  });

  // ADD CARD FEATURE
  function choosePriority() {
    return new Promise((resolve) => {
      const prioritySelection = document.createElement('div');
      prioritySelection.innerHTML = `
        <h2>Sélectionner la priorité :</h2>
        <button id="highPriorityBtn">Haute</button>
        <button id="mediumPriorityBtn">Moyenne</button>
        <button id="lowPriorityBtn">Basse</button>
      `;
      document.querySelector('.priority-container').appendChild(prioritySelection);
      prioritySelection.classList.add('priority-container');

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
    const priority = await choosePriority();
    const id = document.querySelectorAll('.card').length + 1;

    const newCard = document.createElement('div');
    newCard.classList.add('card', priority); // Ajoute la classe "low", "medium" ou "high"
    newCard.setAttribute('data-id', id);
    newCard.setAttribute('data-priority', priority);
    newCard.setAttribute('draggable', 'true');
    newCard.innerHTML = `
      <h3>${title}</h3>
      <p>${texte}</p>
    `;
    addDeleteButton(newCard);
    addItem(id, `${title}_${texte}_${priority}_todo`);

    toDo.appendChild(newCard);
    makeDraggable();
  });

  // DRAG AND DROP FEATURE
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
        draggedElement.dataset.category = zone.dataset.status;

        const title = draggedElement.querySelector('h3').innerText;
        const desc = draggedElement.querySelector('p').innerText;
        const priority = draggedElement.dataset.priority;
        const category = draggedElement.dataset.category;
        localStorage.setItem(dataId, `${title}_${desc}_${priority}_${category}`);
        zone.appendChild(draggedElement);
      });
    }
  }

  // SEARCH FILTERS
  searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase(); // Mot-clé saisi par l'utilisateur

    document.querySelectorAll('.card').forEach((card) => {
      const title = card.querySelector('h3').textContent.toLowerCase(); // Titre de la carte
      const content = card.querySelector('p').textContent.toLowerCase(); // Description de la carte

      // Afficher ou masquer la carte selon le mot-clé
      if (title.includes(keyword) || content.includes(keyword)) {
        card.style.display = 'block'; // Affiche la carte si le mot-clé est présent
      } else {
        card.style.display = 'none'; // Cache la carte sinon
      }
    });
  });

  // SORT BUTTON
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

      column.innerHTML = '';
      column.appendChild(header);
      cardsTable.forEach(card => {
        column.appendChild(card);
      });
    });
  });

  // DELETE CARD
  const addDeleteButton = (card) => {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Supprimer';
    deleteBtn.className = 'delete-btn';

    deleteBtn.addEventListener('click', () => {
      if (confirm('Voulez-vous vraiment supprimer cette carte ?')) {
        card.remove(); // Supprime la carte
        console.log('Carte supprimée.');
        removeItem(card.dataset.id);
        makeDraggable();
      }
    });

    card.appendChild(deleteBtn);
  };

  document.querySelectorAll('.card').forEach((card) => {
    addDeleteButton(card);
  });

  makeDraggable();

  // DISPLAY CARDS
  function renderCards() {
    const todo = document.getElementById('todo');
    const doing = document.getElementById('doing');
    const done = document.getElementById('done');

    for (let item of allItems) {
      const dataId = item.key;
      const values = item.value.split('_');

      if (values) {
        const title = values[0].trim();
        const desc = values[1].trim();
        const priority = values[2];
        const category = values[3];

        const newCard = document.createElement('div');
        newCard.classList.add('card', priority); // Ajoute la classe "low", "medium" ou "high"
        newCard.setAttribute('data-id', dataId);
        newCard.setAttribute('data-priority', priority);
        newCard.setAttribute('draggable', 'true');
        newCard.innerHTML = `
        <h3>${title}</h3>
        <p>${desc}</p>
        `;
        addDeleteButton(newCard);

        switch (category) {
          case 'todo':
            todo.appendChild(newCard);
            break;
          case 'doing':
            doing.appendChild(newCard);
            break;
          case 'done':
            done.appendChild(newCard);
            break;
          default:
            todo.appendChild(newCard);
        }
        makeDraggable();
      }
    }
  }
  renderCards();
});

// Dark mode
const darkModeToggle = document.getElementById("darkModeToggle");
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    darkModeToggle.textContent = "☀️ Light Mode";
  } else {
    darkModeToggle.textContent = "🌙 Dark Mode";
  }
});
