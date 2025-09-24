function addTitle(){
    let txt = "projects";
    document.getElementById("h1").innerText=txt;
}

async function getData() {
    try {
        let response = await fetch ('/p');
        let data = await response.json();
        createGrid(data);
    } catch (err) {
        alert (err)
    }
}

function createGrid(data){
  let txt= "";
  for(obj of data){
    if(obj){
        txt+=
        `<div class="card">
        <div>
           <img src="/images/${obj.myFileName}" alt="${obj.name}">
            <p>${obj.name}</p>
            <div>${obj.description}</div>
        </div>
        <div>
             <button onClick="deleteProject(${obj.id})">Delete</button>
             <button onClick="getById(${obj.id})">Edit</button>
        </div>
        </div>`
    }
  }
  document.getElementById('main').innerHTML=txt;
}

async function addProject() {
    try {
        let name =document.getElementById('name').value;
         let description =document.getElementById('description').value;
          let myFile =document.getElementById('myFile').files[0];
          let formData = new FormData();
         formData.append('name', name);
         formData.append('description', description);
          if(myFile){
           formData.append('myFile', myFile)
   ;       }
         await fetch ('/p',{
            method: 'POST',
            body:formData
         })
         getData();
         clearInput();
    } catch (err) {
        alert (err)
    }
}
function clearInput(){
    //  document.getElementById('id').value="";
      document.getElementById('name').value="";
       document.getElementById('description').value="";
        document.getElementById('myFile').value="";
}
async function deleteProject(id) {
    try {
        await fetch(`/p/${id}`,{
            method: 'DELETE'
        })
        getData();
    } catch (err) {
        alert(err)
        
    }
}

async function getById(id) {
    try {
        let response = await fetch (`/p/${id}`);
        let obj = await response.json();
        document.getElementById('id').value = obj.id;
        document.getElementById('name').value = obj.name;
        document.getElementById('description').value = obj.description;
        document.getElementById('myImage').src ="../images/"+ obj.myFileName;
    } catch (err) {
        alert(err)
        
    }
}


getData();
addTitle();