let tasks = [];
let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filters = document.querySelectorAll(".filter");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function loadTasks() {
  const stored = localStorage.getItem("todo_tasks");
  if (stored) tasks = JSON.parse(stored);

  const mode = localStorage.getItem("todo_theme");
  if (mode === "dark") document.body.classList.add("dark");

  updateThemeIcon();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("todo_tasks", JSON.stringify(tasks));
}

function updateThemeIcon() {
  themeIcon.src = document.body.classList.contains("dark")
    ? "assets/icons/sun.svg"
    : "assets/icons/moon.svg";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "todo_theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
  updateThemeIcon();
});

function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return;

  tasks.push({
    id: Date.now(),
    text,
    completed: false
  });

  saveTasks();
  renderTasks();
  taskInput.value = "";
}

function toggleComplete(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";

  let filtered = tasks;
  if (currentFilter === "active") filtered = tasks.filter(t => !t.completed);
  if (currentFilter === "completed") filtered = tasks.filter(t => t.completed);

  filtered.forEach(task => {
    const li = document.createElement("li");
    li.className = "task" + (task.completed ? " completed" : "");

    li.innerHTML = `
      <button class="icon-btn" onclick="toggleComplete(${task.id})">
        <img src="assets/icons/check.svg">
      </button>

      <span>${task.text}</span>

      <div class="task-icons">
        <button class="icon-btn" onclick="deleteTask(${task.id})">
          <img src="assets/icons/trash.svg">
        </button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

filters.forEach(btn =>
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  })
);

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

loadTasks();
