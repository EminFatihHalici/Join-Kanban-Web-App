let BASE_URL = "https://join-kanban-app-14634-default-rtdb.europe-west1.firebasedatabase.app/";
const urlParams = new URLSearchParams(window.location.search);
const activeUserId = urlParams.get('activeUserId') || 0;



function init() {
    setupFormButtons();
    setupPriorityButtons();
    loadContacts();
}

/** Setup form buttons */
function setupFormButtons() {
    let createBtn = document.getElementById("create-btn");
    let clearBtn = document.getElementById("clear-btn");

    createBtn.addEventListener("click", handleCreateTask);
    clearBtn.addEventListener("click", clearForm);
}

/** Setup priority buttons */
function setupPriorityButtons() {
    let buttons = document.querySelectorAll(".priority-btn");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
        });
    });
}

/** Handle create task */
async function handleCreateTask() {
    let title = document.getElementById("title").value.trim();
    let description = document.getElementById("description").value.trim();
    let dueDate = document.getElementById("due-date").value;
    let category = document.getElementById("category").value;
    let checkedBoxes = document.querySelectorAll('#assigned-dropdown input[type="checkbox"]:checked');
    let assigned = Array.from(checkedBoxes).map(checkbox => checkbox.value);
    let subtaskText = document.getElementById("subtask").value.trim();
    let subtasksArray = [];
    if (subtaskText) {
        const rawSubtasks = subtaskText.split('\n').filter(line => line.trim() !== '');
        subtasksArray = rawSubtasks.map((title, index) => ({
            done: "false",
            title: title.trim()
        }));
    }
    let activePriority = document.querySelector(".priority-btn.active");
    let priority = activePriority ? activePriority.classList[1] : "medium";

    if (!title || !dueDate || !category) {
        alert("Please fill in all required fields.");
        return;
    }

    let newTask = {
        title,
        description,
        dueDate,
        category,
        assigned,
        priority,
        subtasks: subtasksArray,
        createdAt: new Date().toISOString()
    }

    console.log("New Task Created:", newTask);

    try {
        let taskPath = `user/${activeUserId}/tasks`;
        let nextTaskId = await calcNextId(taskPath);
        await putData(`${taskPath}/${nextTaskId}`, newTask);
        clearForm();
    } catch (error) {
        console.error("Error creating task:", error);
    }

}

/** Clear form */
function clearForm() {
    document.getElementById("task-form").reset();
    document.querySelectorAll(".priority-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelector(".priority-btn.medium").classList.add("active");
}



/** Post data to backend */
async function putData(path = "", data = {}) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error posting data:", error);
        throw error;
    }

}

function toggleDropDownMenu() {
    let userMenu = document.getElementById('user-menu');
    userMenu.classList.toggle('show');
    if (!isUserMenuListenerAdded) {
        document.addEventListener('click', function (event) {
            let userMenu = document.getElementById('user-menu');
            let userCircle = document.querySelector('.user-circle');
            if (!userCircle.contains(event.target) && !userMenu.contains(event.target)) {
                userMenu.classList.remove('show');
            }
        });

        isUserMenuListenerAdded = true;
    }
}

function toggleContactDropdown() {
    let dropdown = document.getElementById('assigned-dropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

/** function to calculate the next taskId */
async function calcNextId(path) {
    let res = await fetch(`${BASE_URL}${path}.json`);
    let resJson = await res.json();

    if (!resJson) return 1;

    let keys = Object.keys(resJson).map(Number);
    let nextId = Math.max(...keys) + 1;
    return nextId;
}


/** Load data from backend */
async function loadData(path = "") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

async function loadContacts() {
    let dropdownContainer = document.getElementById("assigned-dropdown");
    dropdownContainer.innerHTML = ''; // Leere den Container

    try {
        let contacts = await loadData(`user/${activeUserId}/contacts`);

        if (contacts) {
            Object.keys(contacts).forEach(key => {
                const contact = contacts[key];

                if (contact && contact.name) {
                    // Erstelle Label und Checkbox für jeden Kontakt
                    let contactItem = document.createElement('label');
                    contactItem.className = 'contact-item';

                    // Checkbox
                    let checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.value = key; // Speichere die ID

                    // Text
                    let textSpan = document.createElement('span');
                    textSpan.textContent = contact.name;

                    contactItem.appendChild(checkbox);
                    contactItem.appendChild(textSpan);
                    dropdownContainer.appendChild(contactItem);
                }
            });
        }
    } catch (error) {
        console.error("Could not load contacts:", error);
        dropdownContainer.innerHTML = '(Error loading contacts)';
    }
}


//overlay add_task


function renderTaskCard(task) {
    return `
        <div class="task-card" draggable="true">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <div class="task-assignees">
                ${task.assignees ? task.assignees.map(a => `<span>${a}</span>`).join('') : ''}
            </div>
        </div>
    `;
}


function getAddTaskTemplate() {
    return `
       <section class="add-task-section">
            <h1>Add Task</h1>

            <form id="task-form" class="task-form">
                <div class="form-left">
                    <label for="title">Title*</label>
                    <input id="title" type="text" placeholder="Enter a title">

                    <label for="description">Description</label>
                    <textarea id="description" placeholder="Enter a Description"></textarea>

                    <label for="due-date">Due date*</label>
                    <input id="due-date" type="date" required>

                </div>

                <div class="divider"></div>

                <div class="form-right">
                    <label>Priority</label>
                    <div class="priority-buttons">
                        <button type="button" class="priority-btn urgent">
                            Urgent
                            <img src="/assets/icons/prio_urgent_icon.svg" alt="urgent icon">
                        </button>
                        <button type="button" class="priority-btn medium active">
                            Medium
                            <img src="/assets/icons/prio_medium_icon.svg" alt="medium icon">
                        </button>
                        <button type="button" class="priority-btn low">
                            Low
                            <img src="/assets/icons/prio_low_icon.svg" alt="low icon">
                        </button>
                    </div>

                    <label for="assigned">Assigned to</label>
                    <div class="custom-select-container">
                        <div id="assigned-display" class="select-display" onclick="toggleContactDropdown()">
                            Select contacts to assign
                        </div>

                        <div id="assigned-dropdown" class="select-dropdown" style="display: none;">
                        </div>
                    </div>

                    <label for="category">Category*</label>
                    <select id="category" required>
                        <option value="" disabled selected>Select task category</option>
                        <option value="technical">Technical Task</option>
                        <option value="user-story">User Story</option>
                    </select>

                    <label for="subtask">Subtasks</label>
                    <input type="text" id="subtask" placeholder="Add new subtask">
                </div>
            </form>

            <div class="form-footer">

                <p class="form-hint">
                    <span class="required-marker">*</span>This field is required
                </p>


                <div class="form-actions">
                    <button id="clear-btn" type="button" class="clear">Clear ✖</button>
                    <button id="create-btn" type="button" class="create">Create Task ✔</button>
                </div>


            </div>


        </section>
    `;
}

function renderOverlay() {

    let overlay = document.getElementById("add-task-overlay");
    overlay.innerHTML = getAddTaskTemplate();
}