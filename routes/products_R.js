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

// שליפה של כל הפרוייקטים
router.get('/',(req,res)=>{
    res.json(projects);
});

// תצוגה של פרוייקט בודד לפי id
router.get('/:id', (req, res) => {
  let id = Number(req.params.id);
  let project = projects.find(p => p.id === id);
  if (!project) {
    return res.status(404).json({ message: "פרויקט לא נמצא" });
  }
  res.json(project);
});

// יצירת פרוייקט חדש
router.post('/',upload.single('myFile'),(req,res)=>{
    let name = req.body.name;
    let id = nextID++;
    let description=req.body.description;
    let myFileName = req.file ? req.file.filename : null;
    let project = {id,name,description,myFileName};
    projects.push(project);
    res.json({massege:"ok"});

});

// מחיקה של פרוייקט
router.delete('/:id',(req,res)=>{
 let id = Number(req.params.id);
 if(isNaN(id)){
    return res.json({massege:"לא חוקי"})
 }
let index = projects.findIndex(p => p.id === id);
  if (index === -1) {
return res.json("לא קיים");
}
let project = projects[index];
  projects.splice(index, 1);
  if (project.myFileName && fs.existsSync(path.join('images', project.myFileName))) {
    fs.unlinkSync(path.join('images', project.myFileName));
  }
 res.json({ message: "נמחק בהצלחה" });
});


// עידכון של פרוייקט קיים 
router.patch('/:id', upload.single('myFile'), (req, res) => {
    let id = Number(req.params.id);

    if (isNaN(id)) {
        return res.json({ message: "מזהה לא חוקי" });
    }

    let index = projects.findIndex(p => p.id === id);
    if (index === -1) {
        return res.json({ message: "פרויקט לא קיים" });
    }

    let project = projects[index];

    // עידכון שדות אם נשלחו
    if (req.body.name) project.name = req.body.name;
    if (req.body.description) project.description = req.body.description;

    // עידכון קובץ אם נשלח חדש
    if (req.file) {
        if (project.myFileName && fs.existsSync(path.join('images', project.myFileName))) {
            fs.unlinkSync(path.join('images', project.myFileName));
        }
        project.myFileName = req.file.filename;
    }

    res.json({ message: "עודכן בהצלחה", project });
});

// דירוג של פרוייקט

router.post('/:id/vote', (req, res) => {
    let id = Number(req.params.id);
    let userId = req.body.userId; 

    if (isNaN(id) || !userId) {
        return res.json({ message: "פרויקט או משתמש לא חוקיים" });
    }

    let project = projects.find(p => p.id === id);
    if (!project) return res.json({ message: "פרויקט לא נמצא" });

    // בדיקה אם המשתמש כבר הצביע
    if (!project.voters) project.voters = [];
    if (!project.votes) project.votes = 0;

    if (project.voters.includes(userId)) {
        return res.json({ message: "כבר הצבעת על פרויקט זה", votes: project.votes });
    }

    project.votes++;
    project.voters.push(userId);

    res.json({ message: "הצבעת בהצלחה", votes: project.votes });
});




module.exports =router;