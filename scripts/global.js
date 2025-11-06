const BASE_URL = "https://join-kanban-app-14634-default-rtdb.europe-west1.firebasedatabase.app/user";
let urlParams = new URLSearchParams(window.location.search);
let activeUserId = urlParams.get('activeUserId') || 0;

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

async function fetchUserData(path) {
    try {
        const response = await fetch(`${BASE_URL}${path}`);
        if (!response.ok) {
            throw new Error(`Error fetching data from ${path}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error loading user data:", error);
        return null;
    }
}

function getInitials(name) {
    return name.split(' ').map(part => part.charAt(0).toUpperCase()).join('');
}