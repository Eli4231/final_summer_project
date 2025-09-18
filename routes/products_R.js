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
    let myFileName = req.file ? req.file.filename : null;
    let project = {id,name,myFileName};
    projects[id] = project;
    res.json({massege:"ok"});

});



module.exports =router;