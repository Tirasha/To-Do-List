const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('openModal');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('searchInput');
const modeToggle = document.getElementById('modeToggle');
const modeIcon = modeToggle.querySelector('i');

let tasks = [];
let currentSort = ''; 

openModalBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});


addTaskBtn.addEventListener('click', () => {
  const name = document.getElementById('taskName').value.trim();
  const date = document.getElementById('dueDate').value;
  const priority = document.getElementById('priority').value;

  if (!name || !date || !priority) return alert("Please fill all fields");

  const task = {
    id: Date.now(),
    name,
    date,
    priority,
    completed: false,
  };

  tasks.push(task);
  renderTasks(getActiveFilter(), searchInput.value.trim().toLowerCase());
  modal.style.display = 'none';

  document.getElementById('taskName').value = '';
  document.getElementById('dueDate').value = '';
  document.getElementById('priority').value = '';
});


clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.completed);
  renderTasks(getActiveFilter(), searchInput.value.trim().toLowerCase());
});


filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.active')?.classList.remove('active');
    btn.classList.add('active');
    searchInput.value = '';
    renderTasks(btn.dataset.filter, '');
  });
});


sortSelect.addEventListener('change', () => {
  currentSort = sortSelect.value; 
  renderTasks(getActiveFilter(), searchInput.value.trim().toLowerCase());
});


searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  renderTasks(getActiveFilter(), query);
});


modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  if (document.body.classList.contains('dark-mode')) {
    modeIcon.classList.remove('fa-moon');
    modeIcon.classList.add('fa-sun');
  } else {
    modeIcon.classList.remove('fa-sun');
    modeIcon.classList.add('fa-moon');
  }
});

function getActiveFilter() {
  return document.querySelector('.filter-btn.active').dataset.filter;
}

function renderTasks(filter = 'all', searchQuery = '') {
  taskList.innerHTML = '';

  let filtered = tasks;

  
  if (filter === 'active') filtered = tasks.filter(task => !task.completed);
  else if (filter === 'completed') filtered = tasks.filter(task => task.completed);

  if (searchQuery) {
    filtered = filtered.filter(task => task.name.toLowerCase().includes(searchQuery));
  }

  
  if (currentSort === 'priority') {
    const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
    filtered = filtered.slice().sort((a, b) => {
      return priorityOrder[a.priority.toLowerCase()] - priorityOrder[b.priority.toLowerCase()];
    });
  } else if (currentSort === 'date') {
    filtered = filtered.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  
  filtered.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';

    taskItem.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
      <div class="task-info">
        <strong>${task.name}</strong>
        <div class="meta">
          Due: ${task.date}
          <span class="priority-dot ${task.priority.toLowerCase()}"></span> 
          ${task.priority}
        </div>
      </div>
    `;

    
    const checkbox = taskItem.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      tasks = tasks.map(t => t.id === id ? { ...t, completed: e.target.checked } : t);
      renderTasks(filter, searchQuery);
    });

    taskList.appendChild(taskItem);
  });
}


renderTasks();
