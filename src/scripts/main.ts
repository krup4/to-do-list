const input = document.querySelector<HTMLInputElement>('#taskInput')!;
const addBtn = document.querySelector<HTMLButtonElement>('#addBtn')!;
const taskList = document.querySelector<HTMLUListElement>('#taskList')!;

interface Task {
    text: string;
    completed: boolean;
    isEditing: boolean;
}

let tasks: Map<string, Task> = new Map(
    Object.entries(JSON.parse(localStorage.getItem('tasks') || '{}'))
);

function renderTasks(): void {
    taskList.innerHTML = '';

    tasks.forEach((task, id) => {
        const li = document.createElement('li');

        if (task.isEditing) {
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = task.text;
            editInput.classList.add('edit-input');

            editInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') saveEdit(id, editInput.value);
            });

            const saveBtn = document.createElement('button');
            saveBtn.textContent = '💾';
            saveBtn.classList.add('edit');
            saveBtn.addEventListener('click', () => saveEdit(id, editInput.value));

            li.appendChild(editInput);
            li.appendChild(saveBtn);
        } else {
            const span = document.createElement('span');
            span.textContent = task.text;

            if (task.completed) {
                li.classList.add('completed');
            }

            li.addEventListener('click', () => toggleTask(id));

            const btnContainer = document.createElement('div');
            btnContainer.classList.add('buttons');

            const editBtn = document.createElement('button');
            editBtn.textContent = '✏️';
            editBtn.classList.add('edit');
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                editTask(id);
            });

            const delBtn = document.createElement('button');
            delBtn.textContent = '🗑️';
            delBtn.classList.add('delete');
            delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTask(id);
            });

            btnContainer.append(editBtn, delBtn);
            li.append(span, btnContainer);
        }

        taskList.appendChild(li);
    });
}

function addTask(): void {
    const text = input.value.trim();
    if (text === '') return;

    const id = Date.now().toString();
    tasks.set(id, { text, completed: false, isEditing: false });

    input.value = '';
    saveTasks();
}

function toggleTask(id: string): void {
    const task = tasks.get(id);
    if (!task) return;
    task.completed = !task.completed;
    tasks.set(id, task);
    saveTasks();
}

function deleteTask(id: string): void {
    tasks.delete(id);
    saveTasks();
}

function editTask(id: string): void {
    const task = tasks.get(id);
    if (!task) return;
    task.isEditing = true;
    tasks.set(id, task);
    renderTasks();
}

function saveEdit(id: string, newText: string): void {
    const task = tasks.get(id);
    if (!task) return;
    task.text = newText.trim() || task.text;
    task.isEditing = false;
    tasks.set(id, task);
    saveTasks();
}

function saveTasks(): void {
    const obj = Object.fromEntries(tasks);
    localStorage.setItem('tasks', JSON.stringify(obj));
    renderTasks();
}

addBtn.addEventListener('click', addTask);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

renderTasks();
