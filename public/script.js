function addTitle(){
    let txt = "projects";
    document.getElementById("h1").innerText=txt;
}

async function getData() {
    try {
        let response = await fetch ('/p');
        let data = await response.json();
        createGrid(data);
    } catch (error) {
        alert (error)
    }
}

function createGrid(data){
  let txt= "";
  for(obj of data){
    if(obj){
        txt+=
        `<div class="card">
        <div>
            <img src="../images${obj.myFileName}" alt="${obj.name}">
            <p>${obj.name}</p>
            <div>${obj.description}</div>
        </div>
        <div>
             <button>Delete</button>
             <button>Edit</button>
        </div>
        </div>`
    }
  }
  document.getElementById('main').innerHTML=txt;
}





getData();
addTitle();