function addTitle() {
  let txt = "projects";
  document.getElementById("h1").innerText = txt;
}

async function getData() {
  try {
    let response = await fetch("/p");
    let data = await response.json();
    createGrid(data);
  } catch (err) {
    alert(err);
  }
}

function createGrid(data) {
  let voted = JSON.parse(localStorage.getItem("votedProjects")) || [];
  voted = voted.map(Number); 
  let txt = "";
  for (let obj of data) {
    if (obj) {
      let disabled = voted.includes(obj.id) ? "disabled" : "";
      txt += `
      <div class="card">
        <div onclick="openProject(${obj.id})" style="cursor:pointer">
           <img src="/images/${obj.myFileName}?t=${Date.now()}" alt="${obj.name}">
           <p>${obj.name}</p>
           <div>${obj.description}</div>
        </div>
        <div>
             <button onClick="deleteProject(${obj.id})">Delete</button>
             <button onClick="getById(${obj.id})">Edit</button>
             <button onClick="vote(${obj.id})" ${disabled}>👍 הצבע (${obj.votes || 0})</button>
        </div>
      </div>`;
    }
  }
  document.getElementById("main").innerHTML = txt;
}
async function addProject() {
  try {
    let name = document.getElementById("name").value;
    let description = document.getElementById("description").value;
    let myFile = document.getElementById("myFile").files[0];

    let formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (myFile) {
      formData.append("myFile", myFile);
    }

    let response = await fetch("/p", {
      method: "POST",
      body: formData,
    });
    let data = await response.json();

    clearInput();

    if (data.project && data.project.id) {
      window.location.href = `project.html?id=${data.project.id}`;
    } else {
      getData();
    }
  } catch (err) {
    alert(err);
  }
}

function clearInput() {
  document.getElementById("id").value = "";
  document.getElementById("name").value = "";
  document.getElementById("description").value = "";
  document.getElementById("myFile").value = "";
  if (document.getElementById("myImage")) {
    document.getElementById("myImage").src = "";
  }
}

async function deleteProject(id) {
  try {
    if (confirm("האם אתה בטוח?")) {
      await fetch(`/p/${id}`, {
        method: "DELETE",
      });
      getData();
    }
  } catch (err) {
    alert(err);
  }
}

async function getById(id) {
  try {
    let response = await fetch(`/p/${id}`);
    let obj = await response.json();
    document.getElementById("id").value = obj.id;
    document.getElementById("name").value = obj.name;
    document.getElementById("description").value = obj.description;
    if (document.getElementById("myImage")) {
      document.getElementById("myImage").src = "../images/" + obj.myFileName;
    }
  } catch (err) {
    alert(err);
  }
}

async function editProject(id) {
  try {
    let name = document.getElementById("name").value;
    let description = document.getElementById("description").value;
    let myFile = document.getElementById("myFile").files[0];
    let formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (myFile) {
      formData.append("myFile", myFile);
    }
    await fetch(`/p/${id}`, {
      method: "PATCH",
      body: formData,
    });
    getData();
    clearInput();
  } catch (err) {
    alert(err);
  }
}

function addOrEdit() {
  let id = document.getElementById("id").value;
  if (id) {
    editProject(id);
  } else {
    addProject();
  }
}

// -- הגדרת פרויקטים ברירת מחדל ---
function initProjects() {
  if (!localStorage.getItem("votedProjects")) {
    localStorage.setItem("votedProjects", JSON.stringify([]));
  }
  if (!localStorage.getItem("userId")) {
    localStorage.setItem("userId", Date.now().toString());
  }
}
// --- הצבעה חד פעמית ---
function vote(id) {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = Date.now().toString();
    localStorage.setItem("userId", userId);
  }

  fetch(`/p/${id}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);

    let voted = JSON.parse(localStorage.getItem("votedProjects")) || [];
    if (!voted.includes(id)) {
      voted.push(id);
      localStorage.setItem("votedProjects", JSON.stringify(voted));
    }

    
    getData();  
  });
}
// --- פתיחת דף פרויקט מורחב ---
function openProject(id) {
  window.location.href = `project.html?id=${id}`;
}


// --- טעינת ברירת מחדל ---
// initProjects();
getData();
addTitle();