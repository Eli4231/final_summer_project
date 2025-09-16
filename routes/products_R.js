const express = require('express');
const router = express.Router();

let products = [];
let nextID =1;

router.get('/',(req,res)=>{
    res.json(products)
});

module.exports =router;