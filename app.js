document.addEventListener("DOMContentLoaded" , async () => {
    await fetch_tasks();
})


document.getElementById("task_form").addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("Fetching data...");
    const task = document.getElementById("task").value.trim()
    if (!task) {
        console.error("No task found");
        return;
    }
    try{
        const response = await fetch("http://127.0.0.1:5000/add_task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({task})
        });

        if (!response.ok){
            throw new Error("Could not fetch data");
        }
    }
    catch (error) {
        console.error(error);
    }
    await fetch_tasks();
})


document.getElementById("clear").addEventListener("click", async () => {
    try{
        const response = await fetch("http://127.0.0.1:5000/delete_finished_task", {
            method: "DELETE"
        });
        if (!response.ok){
            throw new Error("Could not fetch data")
        }
    }
    catch (error){
        console.log(error);
    }
    await fetch_tasks();
})

document.getElementById("task_list").addEventListener("click", async (event) => {
    if (event.target.classList.contains("complete-btn")){
        const id = event.target.value;
        await update(id);
    }
    else if (event.target.classList.contains("delete-btn")){
        const id = event.target.value;
        await delete_task(id);
    }
})

async function update(task_id){
    try {
        const response = await fetch("http://127.0.0.1:5000/update_task", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({task_id})
        })
        if (!response.ok) {
            throw new Error("Could not update task");
        }
    }
    catch (error) {
        console.error(error);
    }
    await fetch_tasks();
}

async function delete_task(task_id){
    try {
        const response = await fetch("http://127.0.0.1:5000/delete_task", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({task_id})
        });
        if (!response.ok) {
            throw new Error("Could not delete task");
        }
    }
    catch (error) {
        console.error(error);
    }
    await fetch_tasks();
}

async function fetch_tasks(){
    try{
        const response = await fetch("http://127.0.0.1:5000/get_tasks");
        if (!response.ok){
            throw new Error("Could not fetch data");
        }

        const data = await response.json();

        const task_list = document.getElementById("task_list");
        task_list.innerHTML = "";
        data.tasks.forEach((task) => {
            let li = document.createElement("li");
            li.classList.add(task[2]);

            let taskText = document.createElement("span");
            taskText.textContent = task[1];

            let buttonContainer = document.createElement("span");
            buttonContainer.innerHTML = `<button class="btn complete-btn" value=${task[0]}>✅</button><button
                class="btn delete-btn" value=${task[0]}>🗑️</button>`;
            li.appendChild(taskText);
            li.appendChild(buttonContainer);
            task_list.appendChild(li);

        })
    } catch (error) {
        console.error(error);
    }
}