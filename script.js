const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");
const filterButtons = document.querySelectorAll("[data-filter]");

// Load saved tasks from the browser
let tasks = [];

try {
    tasks = JSON.parse(localStorage.getItem("smartTasks")) || [];
} catch (error) {
    tasks = [];
}

// Set the default filter
let activeFilter = "all";

// Save tasks in the browser
function saveTasks() {
    localStorage.setItem("smartTasks", JSON.stringify(tasks));
}

// Display tasks
function displayTasks() {
    taskList.innerHTML = "";

    // Select tasks according to the active filter
    const visibleTasks = tasks.filter(function (task) {
        if (activeFilter === "pending") {
            return !task.completed;
        }

        if (activeFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    // Create each task on the page
    visibleTasks.forEach(function (task) {
        const listItem = document.createElement("li");
        listItem.className = "task-item";

        const taskText = document.createElement("span");
        taskText.textContent = task.text;

        if (task.completed) {
            taskText.classList.add("completed");
        }

        const completeButton = document.createElement("button");
        completeButton.textContent = task.completed ? "Undo" : "Complete";
        completeButton.className = "complete-btn";

        completeButton.addEventListener("click", function () {
            task.completed = !task.completed;
            saveTasks();
            displayTasks();
        });
const editButton = document.createElement("button");
editButton.textContent = "Edit";
editButton.className = "edit-btn";

editButton.addEventListener("click", function () {
    const updatedText = prompt("Edit your task:", task.text);

    if (updatedText === null) {
        return;
    }

    if (updatedText.trim() === "") {
        alert("Task cannot be empty!");
        return;
    }

    task.text = updatedText.trim();

    saveTasks();
    displayTasks();
});
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            saveTasks();
            displayTasks();
        });

        const actions = document.createElement("div");
        actions.className = "task-actions";
        actions.append(editButton, completeButton, deleteButton);
        listItem.append(taskText, actions);
        taskList.appendChild(listItem);
    });

    // Count all pending tasks
    const remainingTasks = tasks.filter(function (task) {
        return !task.completed;
    }).length;

    taskCount.textContent = remainingTasks + " remaining";

    // Update the empty-state message
    if (tasks.length === 0) {
        emptyMessage.textContent = "No tasks yet. Add your first task!";
        emptyMessage.style.display = "block";
    } else if (visibleTasks.length === 0) {
        emptyMessage.textContent = "No tasks in this filter.";
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    // Highlight the selected filter
    filterButtons.forEach(function (button) {
        button.classList.toggle(
            "active",
            button.dataset.filter === activeFilter
        );
    });
}

// Handle adding a task
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";
    taskInput.focus();

    displayTasks();
});

// Handle filter button clicks
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        activeFilter = button.dataset.filter;
        displayTasks();
    });
});

// Show tasks when the page opens
displayTasks();