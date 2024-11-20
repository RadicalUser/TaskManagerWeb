// Task constructor
function Task(name, priority, dueDate, status) {
    this.name = name;
    this.priority = priority;
    this.dueDate = dueDate;
    this.status = status;
}

let tasks = []; 

const loadTasks = () => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
};

const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

loadTasks();

// Add new task
const addTask = (name, priority, dueDate, status) => {
    let task = new Task(name, priority, dueDate, status);
    tasks.push(task);
    saveTasks();
    renderTasks();
};

// Render tasks on the UI
const renderTasks = () => {
    const taskListContainer = document.querySelector('.task-list');
    taskListContainer.innerHTML = ''; // Clear existing tasks

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskListContainer.appendChild(taskElement);
    });
};

// Create individual task elements
const createTaskElement = (task) => {
    const taskElement = document.createElement('li');
    taskElement.classList.add('task');

    taskElement.innerHTML = `
        <span>${task.name}</span>
        <span class="priority">${task.priority}</span>
        <span class="due-date">${task.dueDate}</span>
        <span class="status">${task.status}</span>
        <button class="btn update-btn" onclick="updateTask('${task.name}')">Update</button>
        <button class="btn delete-btn" onclick="deleteTask('${task.name}')">Delete</button>
    `;

    return taskElement;
};

// Update task status
const updateTask = (name) => {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].name === name) {
            tasks[i].status = tasks[i].status === "completed" ? "pending" : "completed";
            saveTasks();
            renderTasks();
            return;
        }
    }
};

// Delete task
const deleteTask = (name) => {
    tasks = tasks.filter(task => task.name !== name);
    saveTasks();
    renderTasks();
};

// Sort tasks by criteria (priority or date)
const sortingTasks = (criteria) => {
    if (criteria === "priority") {
        const priorityOrder = { urgent: 1, medium: 2, low: 3 };
        tasks.sort((a, b) => (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4));
    } else if (criteria === "date") {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
    renderTasks();
};

const form = document.getElementById('taskForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskName = document.getElementById('taskName').value;
    const priority = document.getElementById('priority').value;
    const dueDate = document.getElementById('dueDate').value;

    if (taskName && priority && dueDate) {
        addTask(taskName, priority, dueDate, "pending");
        form.reset(); // Clear form after submitting
    }
});

// Event listener for theme toggle button
const themeToggleButton = document.querySelector('.theme-toggle');
themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('light-mode'); 
});

// Initial rendering of tasks when the page loads
renderTasks();