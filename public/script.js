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

}






addTitle();