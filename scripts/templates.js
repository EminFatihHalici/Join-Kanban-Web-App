function renderTasksHTML(task) {
    return `
    <article class="drag-item" draggable="true" ondragstart="dragstartHandler(event, '${task.id}')" ondragend="dragendHandler(event)">
        <div class="card-inner">
            <p class="${categoryColor(task)}">${task.category}</p>
            <h3>${task.title}</h3>
            <p class="gray-text">${task.description}</p>
            <div class="flex">
                <progress value="1" max="2" style="width:96px"></progress>
                <span>1/2 Subtasks</span>
            </div>
            <div class="flex spacebetween">
                <div class="spacing">
                    <div class="color-one">
                        AM
                    </div>
                    <div class="color-two">
                        EM
                    </div>
                    <div class="color-three">
                        MB
                    </div>
                </div>
                <img src="/assets/icons/prio_medium_orange_icon.svg" alt="urgency icon">
            </div>
        </div>
    </article>`
}

function renderTasksHtmlEmptyArray(categoryId) {
    const categoryNames = {
        'categoryToDo': 'To Do',
        'categoryInProgress': 'In Progress',
        'categoryAwaitFeedback': 'Await Feedback',
        'categoryDone': 'Done'
    };
    return `
    <article class="empty-task-box">
        <span class="card-inner">
            No Task ${categoryNames[categoryId]}
        </span>
    </article>
    `
}

function getAddTaskOverlayTemplate() {
    return `
       <div id="add-task-overlay" class="add-task-overlay">
            <section class="add-task-section overlay-add-task">
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
        </div>
    `;
}