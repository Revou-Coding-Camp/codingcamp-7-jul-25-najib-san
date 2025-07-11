let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editingTaskId = null;

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
  const taskInput = document.getElementById('taskInput').value;
  const dueDateInput = document.getElementById('dueDateInput').value;
  if (taskInput === '' || dueDateInput === '') return;

  const task = {
    id: Date.now(),
    text: taskInput,
    dueDate: dueDateInput,
    status: 'pending'
  };

  tasks.push(task);
  saveTasks();
  displayTasks(document.getElementById('filterSelect').value);
  document.getElementById('taskInput').value = '';
  document.getElementById('dueDateInput').value = '';
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  displayTasks(document.getElementById('filterSelect').value);
}

function editTask(id) {
  editingTaskId = id;
  const task = tasks.find(task => task.id === id);
  document.getElementById('editTaskInput').value = task.text;
  document.getElementById('editDueDateInput').value = task.dueDate;
  document.getElementById('editForm').classList.add('active');
}

function saveEdit() {
  const task = tasks.find(task => task.id === editingTaskId);
  if (task) {
    task.text = document.getElementById('editTaskInput').value;
    task.dueDate = document.getElementById('editDueDateInput').value;
    saveTasks();
    cancelEdit();
    displayTasks(document.getElementById('filterSelect').value);
  }
}

function cancelEdit() {
  editingTaskId = null;
  document.getElementById('editForm').classList.remove('active');
  document.getElementById('editTaskInput').value = '';
  document.getElementById('editDueDateInput').value = '';
}

function toggleStatus(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      task.status = task.status === 'pending' ? 'completed' : 'pending';
    }
    return task;
  });
  saveTasks();
  displayTasks(document.getElementById('filterSelect').value);
}

function deleteAllTasks() {
  tasks = [];
  saveTasks();
  displayTasks(document.getElementById('filterSelect').value);
}

function displayTasks(filter) {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  let filteredTasks = tasks;
  if (filter === 'pending') {
    filteredTasks = tasks.filter(task => task.status === 'pending');
  } else if (filter === 'completed') {
    filteredTasks = tasks.filter(task => task.status === 'completed');
  }

  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<tr><td colspan="4" class="no-tasks">No Task Found</td></tr>';
    return;
  }

  filteredTasks.forEach(task => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${task.text}</td>
      <td>${task.dueDate}</td>
      <td>${task.status === 'pending' ? 'Pending' : 'Completed'}</td>
      <td>
        <button onclick="editTask(${task.id})">Edit</button>
        <button onclick="toggleStatus(${task.id})">Completed</button>
        <button onclick="deleteTask(${task.id})">Delect</button>
      </td>
    `;
    taskList.appendChild(row);
  });
}

function filterTasks(status) {
  displayTasks(status);
}

// Tampilkan semua tugas saat halaman dimuat
displayTasks('all');