const express=require('express');
const app = express();
const port = 3550;

app.use(express.static('public'));
app.use(express.json());
app.use('/images', express.static('images'));
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html')
})
app.use('/p',require('./routes/products_R'))


app.listen(port,()=>{console.log(`http://localhost:${port}`)});
