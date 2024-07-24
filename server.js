const express= require('express');
const app = express();
const fileUpload =require('express-fileupload')
require('dotenv').config();
const dbConn= require('./config/dbConn.js');
const path=require('path')
dbConn()
const PORT = process.env.PORT || 3000
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.json())
app.use(fileUpload())
app.use(express.static('public'))
app.use('/api/file',require('./router/router.js'));
app.listen(PORT,()=>console.log('app runing on server:-', PORT))
