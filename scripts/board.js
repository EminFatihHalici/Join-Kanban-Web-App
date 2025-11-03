const BASE_URL = "https://join-kanban-app-14634-default-rtdb.europe-west1.firebasedatabase.app/user";
let urlParams = new URLSearchParams(window.location.search);
let activeUserId = urlParams.get('activeUserId');

async function renderTasks(activeUserId = 0) {
    try {
        let res = await fetch(BASE_URL + "/" + activeUserId + "/tasks" + ".json");
        let resJson = await res.json();
        console.log(resJson);
        
    } catch (error) {
        
    }
}