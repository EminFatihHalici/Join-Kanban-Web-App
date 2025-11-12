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

function getAddTaskOverlayTemplate(board) {
    return `
            <section class="add-task-section overlay-add-task">
        <div class= overlay-header>
            <h1 class="overlay-headline">Add Task</h1>
        </div>
        <img onclick="closeAddTaskOverlay()" class="close-add-task-overlay" src="/assets/icons/close.svg" alt="close">
                <form id="task-form" class="task-form">
                    <div class="form-left form-left-overlay">
                        <div class="overlay-add-task-div">
                            <label for="title" class="form-headline-text">Title*</label>
                               <div class="title-input-container-overlay">
                                    <input id="title" class="title-input-overlay" type="text" placeholder="Enter a title">
                                 </div>
                        </div>

                        <div class="description-overlay">
                            <label for="description">Description</label>
                            <textarea style="width: 440px" id="description" class="description-input-overlay" placeholder="Enter a Description"></textarea>
                        </div>

                        <div class="date-overlay">
                            <label for="due-date">Due date*</label>
                            <input id="due-date" class="due-date-overlay" type="date" required>
                        </div>
                    </div>

                    <div class="divider divider-overlay"></div>

                    <div class="form-right form-right-overlay">
                            <label class="at-overlay-text">Priority</label>
                        <div class="priority-buttons priority-buttons-overlay">
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

                        
                        <div class="custom-select-container">
                        <label for="assigned">Assigned to</label>
                            <div id="assigned-display" class="select-display" onclick="toggleContactDropdown()">
                                Select contacts to assign
                            </div>

                            <div id="assigned-dropdown" class="select-dropdown" style="display: none;">
                            </div>
                        </div>

                        
                        <select id="category" required>
                        <label for="category">Category*</label>
                            <option value="" disabled selected>Select task category</option>
                            <option value="technical">Technical Task</option>
                            <option value="user-story">User Story</option>
                        </select>
                        <div class="subtask-overlay">
                            <label for="subtask">Subtasks</label>
                            <input type="text" id="subtask" placeholder="Add new subtask">
                        </div>

                    </div>
                </form>

                <div class="form-footer">
                    <p class="form-hint form-hint-overlay">
                        <span class="required-marker">*</span>This field is required
                    </p>

                    <div class="form-actions form-actions-overlay">
                        <button onclick="clearForm(), closeAddTaskOverlay()" id="clear-btn" type="button" class="clear">Clear ✖</button>
                        <button onclick="handleCreateTask('${board}')" id="create-btn" type="button" class="create">Create Task ✔</button>
                    </div>
                </div>
            </section>
    `;
}