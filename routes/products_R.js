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
        let id =req.params.id ? req.params.id : nextId;
        let finalFileName= `${id}${path.extname(file.originalname)}`;
        cb(null,finalFileName);
    }
});

router.get('/',(req,res)=>{
    res.json(projects);
});

router.post('/',(req,res)=>{
   let name =req.body.name;
    id=nextID;
    let project ={id,name};
    projects[id]=project;
    res.json({massege:"ok"});

});



module.exports =router;