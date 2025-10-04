const input = document.querySelector('#taskInput');
const addBtn = document.querySelector('#addBtn');
const taskList = document.querySelector('#taskList');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text;

        if (task.completed) {
            li.classList.add('completed');
        }

        li.addEventListener('click', () => toggleTask(index));

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Удалить';
        delBtn.classList.add('delete');
        delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(index);
        });

        li.appendChild(delBtn);
        taskList.appendChild(li);
    });
}

function addTask() {
    const text = input.value.trim();
    if (text === '') return;
    tasks.push({ text, completed: false });
    input.value = '';
    saveTasks();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

addBtn.addEventListener('click', addTask);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

renderTasks();
