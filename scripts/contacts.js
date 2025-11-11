let contacts;

async function fetchTasks(activeUserId = 0) {
    try {
        let res = await fetch(FIREBASE_URL + "/" + activeUserId + "/contacts" + ".json");
        let tasks = await res.json();
        let contacts = Object.entries(tasks).map(([id, contactsData]) => ({
            id: id,
            ...contactsData
        }));
        return contacts
    } catch (error) {
        console.log("Error fetchTasks(): ", error);
    }
}

async function init() {
    await renderContacts()
}

async function renderContacts() {
    let contactListRef = document.getElementById('contactList');
    let contacts = await fetchTasks();
    console.log(contacts);
    let groupedContacts = groupContactsByLetter(contacts)
    contactListRef.innerHTML = renderGroupedContacts(groupedContacts)
    // let categories = {
    //     'categoryToDo': tasksWithId.filter(cat => cat.board === "toDo") || [],
    //     'categoryInProgress': tasksWithId.filter(cat => cat.board === "inProgress") || [],
    //     'categoryAwaitFeedback': tasksWithId.filter(cat => cat.board === "awaitFeedback") || [],
    //     'categoryDone': tasksWithId.filter(cat => cat.board === "done") || []
    // }
    // Object.entries(groupedContacts).forEach(([htmlContainerId, tasksWithId]) => {
    //     const container = document.getElementById(htmlContainerId);
    //     tasksWithId.length === 0 ? container.innerHTML = renderTasksHtmlEmptyArray(htmlContainerId) : container.innerHTML = tasksWithId.map(task => renderTasksHTML(task)).join('');
    // });

    // for (const key of Object.keys(groupedContacts).sort()){
    //     console.log(element);
    //     contactListRef.innerHTML += renderContactsHtml(groupedContacts)
    // }

    // for (const key of Object.keys(groupedContacts).sort()) {
    //     const users = groupedContacts[key];
    //     users.forEach(user => {
    //         // Create container
    //         const container = document.createElement('div');
    //         container.style.display = "flex";
    //         container.style.alignItems = "center";
    //         container.style.margin = "20px 0";
    //         // Circle with Initials
    //         const initials = document.createElement('div');
    //         initials.textContent = user.name
    //             .split(' ')
    //             .map(n => n[0])
    //             .join('');
    //         initials.style.background = '#ff9800';
    //         initials.style.color = 'white';
    //         initials.style.borderRadius = '50%';
    //         initials.style.width = '48px';
    //         initials.style.height = '48px';
    //         initials.style.display = 'flex';
    //         initials.style.alignItems = 'center';
    //         initials.style.justifyContent = 'center';
    //         initials.style.fontWeight = 'bold';
    //         initials.style.fontSize = '1.5rem';
    //         initials.style.marginRight = '12px';
    //         // User details
    //         const details = document.createElement('div');
    //         details.innerHTML = `
    //         <div style="font-weight: bold; font-size: 1.1rem">${user.name}</div>
    //         <div style="color: #888; font-size: 1rem">${user.email}</div>
    //         `;

    //         container.appendChild(initials);
    //         container.appendChild(details);
    //         contactListRef.appendChild(container);
    //     });
    // }

}

function renderGroupedContacts(groupedContacts) {
    let html = '';
  // Keys alphabetisch sortieren:
    const sortedKeys = Object.keys(groupedContacts).sort(); 
    for (const key of sortedKeys) {
        console.log(key);
        
        html += `<div style="font-size: 1.2em; font-weight: bold; margin-top: 24px;">${key}</div>`;
        console.log(groupedContacts[key]);
        
        groupedContacts[key].forEach(contact => {
            html += `
                <div style="display: flex; align-items: center; margin: 16px 0;">
                    <div style="
                    width: 40px;
                    height: 40px;
                    background: orange;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    color: white;
                    margin-right: 16px;
                    font-size: 20px;
                ">
                ${initialsFromName(contact.name)}
                </div>
                <div>
                    <div style="font-weight: bold;">
                        ${contact.name}
                    </div>
                    <div style="color: gray;">
                        ${contact.email}
                    </div>
                </div>
            </div>
            `;
        });
    }
    return html;
}

function initialsFromName(name) {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
}

function groupContactsByLetter(contacts) {
    const grouped = {};
    contacts.forEach((c) => {
        const letter = (c.name?.[0] || "?").toUpperCase();
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(c);
    });
    console.log(grouped);

    return grouped;
}

// document.addEventListener('DOMContentLoaded', () => {
//     const contacts = [
//         { firstName: 'Anton', lastName: 'Mayer', email: 'antonm@gmail.com', initials: 'AM', color: '#FF7A00' },
//         { firstName: 'Anja', lastName: 'Schulz', email: 'schulz@hotmail.com', initials: 'AS', color: '#9327FF' },
//         { firstName: 'Benedikt', lastName: 'Ziegler', email: 'benedikt@gmail.com', initials: 'BZ', color: '#6E52FF' },
//         { firstName: 'David', lastName: 'Eisenberg', email: 'davidberg@gmail.com', initials: 'DE', color: '#FC71FF' },
//         { firstName: 'Eva', lastName: 'Fischer', email: 'eva@gmail.com', initials: 'EF', color: '#FFBB2B' },
//         { firstName: 'Emmanuel', lastName: 'Mauer', email: 'emmanuelma@gmail.com', initials: 'EM', color: '#1FD7C1' },
//     ];
// });

//     function renderContacts() {
//         const contactListContainer = document.querySelector('.contact-list-container');
//         contactListContainer.innerHTML = ''; // Clear existing content

//         const groupedContacts = contacts.reduce((acc, contact) => {
//             const firstLetter = contact.lastName.charAt(0).toUpperCase();
//             if (!acc[firstLetter]) {
//                 acc[firstLetter] = [];
//             }
//             acc[firstLetter].push(contact);
//             return acc;
//         }, {});

//         const sortedLetters = Object.keys(groupedContacts).sort();

//         sortedLetters.forEach(letter => {
//             const letterGroup = document.createElement('div');
//             letterGroup.classList.add('contact-letter-group');
//             letterGroup.innerHTML = `<div class="contact-letter-header">${letter}</div><div class="contact-separator"></div>`;

//             groupedContacts[letter].sort((a, b) => a.lastName.localeCompare(b.lastName)).forEach(contact => {
//                 const contactItem = document.createElement('div');
//                 contactItem.classList.add('contact-item');
//                 contactItem.innerHTML = `
//                     <div class="contact-initials" style="background-color: ${contact.color};">${contact.initials}</div>
//                     <div class="contact-details">
//                         <div class="contact-name">${contact.firstName} ${contact.lastName}</div>
//                         <div class="contact-email">${contact.email}</div>
//                     </div>
//                 `;
//                 letterGroup.appendChild(contactItem);
//             });
//             contactListContainer.appendChild(letterGroup);
//         });
//     }

//     renderContacts();
// });