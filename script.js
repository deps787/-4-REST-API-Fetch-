

const API_URL = "https://6afc2d6c892984c4494b0b2e.mockapi.io/tasks";


// Отримуємо елементи сторінки
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const statusText = document.getElementById("status");
const counter = document.getElementById("counter");
const addButton = document.getElementById("addButton");

// Отримання завдань з сервера (GET)
async function getTasks() {
    statusText.textContent = "Завантаження...";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Помилка отримання завдань");
        }

        const tasks = await response.json();

        renderTasks(tasks);
        statusText.textContent = "";

    } catch (error) {
        statusText.textContent = "Не вдалося завантажити завдання";
        console.error(error);
    }
}

// Відображення завдань на сторінці
function renderTasks(tasks) {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        const span = document.createElement("span");
        span.textContent = task.name;

        // Кнопка виконання завдання
        const completeButton = document.createElement("button");
        completeButton.textContent = task.completed ? "Скасувати" : "Виконано";

        completeButton.addEventListener("click", () => {
            updateTask(task);
        });

        // Кнопка видалення
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Видалити";
        deleteButton.classList.add("delete");

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        li.appendChild(span);
        li.appendChild(completeButton);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });

    counter.textContent = tasks.length;
}

// Додавання завдання (POST)
taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = taskInput.value.trim();

    if (!name) {
        alert("Введіть текст завдання!");
        return;
    }

    addButton.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                completed: false
            })
        });

        if (!response.ok) {
            throw new Error("Помилка додавання");
        }

        taskInput.value = "";
        await getTasks();

    } catch (error) {
        statusText.textContent = "Не вдалося додати завдання";
        console.error(error);

    } finally {
        addButton.disabled = false;
    }
});

// Видалення завдання (DELETE)
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Помилка видалення");
        }

        await getTasks();

    } catch (error) {
        statusText.textContent = "Не вдалося видалити завдання";
        console.error(error);
    }
}

// Оновлення стану завдання (PATCH)
async function updateTask(task) {
    try {
        const response = await fetch(`${API_URL}/${task.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                completed: !task.completed
            })
        });

        if (!response.ok) {
            throw new Error("Помилка оновлення");
        }

        await getTasks();

    } catch (error) {
        statusText.textContent = "Не вдалося оновити завдання";
        console.error(error);
    }
}

// Завантажуємо завдання після відкриття сторінки
getTasks();
