const express = require('express');
const router = express.Router();
const multer =require('multer');
const path = require('path');
const fs = require('fs');

let projects = [];
let nextID =1;

if(!fs.existsSync('images')){
    fs.mkdirSync('images');
}
const storage =multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images/');
    },
    filename: (req,file,cb)=>{
        let id =req.params.id ? req.params.id : nextID;
        let finalFileName= `${id}${path.extname(file.originalname)}`;
        cb(null,finalFileName);
    }
});
const upload = multer({storage: storage});

router.get('/',upload.single('myFile'),(req,res)=>{
    res.json(projects);
});

router.post('/',(req,res)=>{
    let name = req.body.name;
    id = nextID;
    let description=req.body.description;
    let myFileName = req.file ? req.file.filename : null;
    let project = {id,name,description,myFileName};
    projects[id] = project;
    res.json({massege:"ok"});

});
router.delete('/:id',(req,res)=>{
 let id = Number(req.params.id);
 if(isNaN(id)){
    return res.json({massege:"לא חוקי"})
 }
let project =projects[id];
if(!project){
return res.json("לא קיים");
}
projects[id] = null;
if(!fs.existsSync(path.join('image',project.myFileName))){
    fs.unlinkSync(path.join('image',project.myFileName))
}
});




module.exports =router;