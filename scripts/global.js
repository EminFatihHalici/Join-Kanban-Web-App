const BASE_URL = "https://join-kanban-app-14634-default-rtdb.europe-west1.firebasedatabase.app/user";  // BASE-URL ersetzen
let activeUserId;
activeUserId = loadActiveUserId();
let isUserMenuListenerAdded = false;
let contacts = [];
let tasks = [];

function loadActiveUserId() {
    const val = localStorage.getItem("activeUserId");
    return val ? JSON.parse(val) : 0;
}

function loadShownGreeting() {
    const val = localStorage.getItem("shownGreeting");
    return val === "true";
}

let contactCircleColor = [
    '#FF7A00',
    '#FF5EB3',
    '#6E52FF',
    '#9327FF',
    '#00BEE8',
    '#1FD7C1',
    '#FF745E',
    '#FFA35E',
    '#FC71FF',
    '#FFC701',
    '#0038FF',
    '#C3FF2B',
    '#FFE62B',
    '#FF4646',
    '#FFBB2B',
]

async function calcNextId(path = "") {
    let nextId;
    try {
        let res = await fetch(BASE_URL + path + ".json");
        let resJson = await res.json();
        let userId = Object.keys(resJson);
        userId.length === 0 ? nextId = 0 : nextId = userId.reduce((a, b) => Math.max(a, b), -Infinity) + 1;
    } catch (error) {
        console.log(`fetch in calcNextId() from ${BASE_URL + path} failed: `, error);
    }
    return nextId;
}

function getInitials(name) {
    return name.split(' ').map(part => part.charAt(0).toUpperCase()).join('');
}

async function putData(path = "", data = {}) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response;

    } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        throw fetchError;
    }
}

async function loadAndRenderContacts(divId, useAtPage) {
    const containerId = document.getElementById(divId);
    let sortedContacts = await fetchAndSortContacts(containerId);
    contacts = sortedContacts;
    containerId.innerHTML = '';
    if (useAtPage === 'addTask') {
        const html = sortedContacts.map((contact, i) => contactRowHTML(contact, i)).join('');
        containerId.innerHTML = html;
    } else if (useAtPage === 'contacts') {
        let groupedContacts = groupContactsByLetter(sortedContacts);
        containerId.innerHTML = renderGroupedContacts(groupedContacts);
    }
}

async function fetchAndSortContacts(containerId = "") {
    try {
        const contactsObj = await fetchData(`/${activeUserId}/contacts`);
        if (contactsObj.length == 0) { throw new Error; }
        const contactsArray = Object.entries(contactsObj || {}).map(([key, contact]) => ({ id: key, ...contact }));
        let contactsWithoutUndefined = contactsArray.filter(i => i.name !== undefined);
        let sortedContacts = contactsWithoutUndefined.sort((a, b) => a.name.localeCompare(b.name));
        return sortedContacts
    } catch (error) {
        containerId.innerHTML = '';
        containerId.innerHTML = emptyContactsHtml();
    }
}

async function fetchData(path = "") {
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

async function eachPageSetCurrentUserInitials() {
    let currentUserInitials = document.getElementById('currentUserInitials');
    let currentUser = await fetchData(`/${activeUserId}/name`);
    let initials = await getInitials(currentUser);
    currentUserInitials.innerHTML = initials;
}

async function deletePath(path = "") {
    try {
        const response = await fetch(BASE_URL + path + ".json", {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

function getInitials(name) {
    if (!name) return "?";
    return name.split(' ').map(word => word[0].toUpperCase()).join('');
}

function logout() {
    localStorage.removeItem('activeUserId');
    localStorage.removeItem('shownGreeting');
    for (let i = 0; i < 50; i++) {
        history.pushState(null, null, '../index.html');
    }
    window.location.replace(window.location.origin + '/index.html');
}

function checkLoggedInPageSecurity() {
    if (!localStorage.getItem('activeUserId')) {
        // window.location.href = '../index.html';
        for (let i = 0; i < 50; i++) {
            history.pushState(null, null, '../index.html');
        }
        window.location.replace(window.location.origin + '/index.html');
        return;
    }
}

function toggleDropDownMenu(event) {
    if (event && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); }
    let userMenu = document.getElementById('user-menu');
    let userCircle = document.querySelector('.user-circle');
    if (!userMenu || !userCircle) return;
    const isOpen = userMenu.classList.contains('show');
    if (isOpen) { closeDropDownAndResetFocus(userMenu, userCircle);
    } else { openDropDownResetFocusAndAddListener(userMenu, userCircle); }
    if (!isUserMenuListenerAdded) {
        clickOutsideEventListener();
        isUserMenuListenerAdded = true;
    }
}

function clickOutsideEventListener() {
    document.addEventListener('click', function (event) {
        let userMenu = document.getElementById('user-menu');
        let userCircle = document.querySelector('.user-circle');
        if (userMenu && userMenu.classList.contains('show') &&
            !userCircle?.contains(event.target) &&
            !userMenu.contains(event.target)) {
            closeDropDownAndResetFocus(userMenu, userCircle);
        }
    });
}

function openDropDownResetFocusAndAddListener(userMenu, userCircle) {
    userMenu.classList.add('show');
    userMenu.setAttribute('aria-hidden', 'false');
    userCircle.setAttribute('aria-expanded', 'true');
    
    // Längerer Delay um sicherzustellen, dass CSS-Transition abgeschlossen ist
    setTimeout(() => {
        const firstMenuItem = userMenu.querySelector('a[role="menuitem"]');
        if (firstMenuItem) {
            firstMenuItem.focus();
        } else {
            // Fallback: versuche alle Links im Menu
            const menuLinks = userMenu.querySelectorAll('a');
            if (menuLinks.length > 0) {
                menuLinks[0].focus();
            }
        }
    }, 150);
    
    document.addEventListener('keydown', handleMenuEscapeKey);
}

function closeDropDownAndResetFocus(userMenu, userCircle) {
    userMenu.classList.remove('show');
    userMenu.setAttribute('aria-hidden', 'true');
    userCircle.setAttribute('aria-expanded', 'false');
    userCircle.focus();
    
    document.removeEventListener('keydown', handleMenuEscapeKey);
}

/**
 * Keyboard event handler for menu escape key
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleMenuEscapeKey(event) {
    if (event.key === 'Escape') {
        event.preventDefault();
        let userMenu = document.getElementById('user-menu');
        let userCircle = document.querySelector('.user-circle');
        if (userMenu && userMenu.classList.contains('show')) {
            closeDropDownAndResetFocus(userMenu, userCircle);
        }
    }
}

/**Event listener to close dropdown when clicking outside
 */
document.addEventListener('click', function (event) {
    let dropdown = document.getElementById('assigned-dropdown');
    let displayElement = document.getElementById('assigned-display');
    checkIfElementIsNotDropdownOrDisplayElement(dropdown, event, displayElement);
    handleEditDropdown(event);
});

function handleEditDropdown(event) {
    let dropdownEdit = document.getElementById('assigned-dropdown-edit');
    let displayElementEdit = document.getElementById('assigned-display-edit');

    if (dropdownEdit && dropdownEdit.style.display === 'block' &&
        !dropdownEdit.contains(event.target) &&
        !displayElementEdit?.contains(event.target)) {
        dropdownEdit.style.display = 'none';
        if (displayElementEdit) {
            displayElementEdit.setAttribute('aria-expanded', 'false');
        }
    }
}

function checkIfElementIsNotDropdownOrDisplayElement(dropdown, event, displayElement) {
    if (dropdown && dropdown.style.display === 'block' &&
        !dropdown.contains(event.target) &&
        !displayElement.contains(event.target)) {
        dropdown.style.display = 'none';

        // Update ARIA states for accessibility
        if (displayElement) {
            displayElement.setAttribute('aria-expanded', 'false');
        }
    }
}

/**
 * Keyboard event handler for subtask toggle
 * @param {KeyboardEvent} event - The keyboard event
 * @param {string} taskId - The ID of the task
 * @param {number} index - The subtask index
 */
function handleSubtaskToggleKeydown(event, taskId, index) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleSubtask(taskId, index);
    }
}

/**
 * Keyboard event handler for search input
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleSearchKeydown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchTasks();
    }
}

/**
 * Keyboard event handler for search button
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleSearchButtonKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        searchAndClearSearchField();
    }
}

/**
 * Keyboard event handler for user menu toggle
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleUserMenuKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleDropDownMenu();
    }
}