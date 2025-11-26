document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    const dateDisplay = document.getElementById('date-display');

    // Set current date
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateEmptyState();
    }

    function updateEmptyState() {
        if (tasks.length === 0) {
            emptyState.classList.add('visible');
        } else {
            emptyState.classList.remove('visible');
        }
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            createTaskElement(task, index);
        });
        updateEmptyState();
    }

    function createTaskElement(task, index) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.index = index;

        li.innerHTML = `
            <div class="task-content">
                <div class="custom-checkbox"></div>
                <span class="task-text">${escapeHtml(task.text)}</span>
            </div>
            <button class="delete-btn" aria-label="Delete task">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
        `;

        // Toggle completion
        const taskContent = li.querySelector('.task-content');
        taskContent.addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            li.classList.toggle('completed');
        });

        // Delete task
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            li.classList.add('removing');
            li.addEventListener('animationend', () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks(); // Re-render to update indices
            });
        });

        taskList.appendChild(li);
    }

    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text, completed: false });
            saveTasks();
            renderTasks();
            taskInput.value = '';
            taskInput.focus();
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    addBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Initial render
    renderTasks();
});
