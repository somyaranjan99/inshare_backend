//const multer= require('multer');
const path= require('path');
const File= require('../model/fileSchema.js');
const {v4:uuid4} =require('uuid');
const { allowedFormart} =require("../config/helper.js");
const emailTemplate= require("../config/emailTemplate.js")
// const storage= multer.diskStorage({
//     destination:(req,file,cb)=>cb(null,'uploads/'),
//     filename:(req,file,cb)=>{
//         const fileName= `${new Date()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`
//         cb(null,fileName);
//     }
// });
// let upload=multer({
//     storage,
//     limit:{fileSize:1000000*100}
// }).single('myfile');

const fileUpload= async (req,res)=>{
    if(!req.files || Object.keys(req.files).length < 1){
        return res.status(400).json({ status: 400, message: "Profile image is required." });
      }
      const allowedImg =allowedFormart(req.files.myfile.size,req.files.myfile.mimetype)
      if(allowedImg !==null){
        return res.status(400).json({msg:allowedImg})
      }
      const fileExt= req.files.myfile?.name.split('.')[1]
      
      const fileName= `${Date.now()}-${Math.round(Math.random()*1E9)}.${fileExt}`;
      const uploadedPath= process.cwd() +'/public/uploads/'+fileName
      req.files.myfile.mv(uploadedPath,(err)=>{
        if(err){
            return res.send(400).json({msg:'Unable uploads'})
        }
      })
     
        const file = new File({
            fileName:fileName,
            uuid:uuid4(),
            path:uploadedPath,
            size:req.files.myfile.size
        });
        const response = await file.save()
        return res.json({file:`${process.env.APP_BASE_URL}/file/${response.uuid}`})
}
const showfiles=async (req,res)=>{
    try {
        if(!req.params.uuid){
            return res.render('download',{error:'something went wrong'});
        }
        const file= await File.findOne({uuid:req.params.uuid})
        if(!file){
            return res.render('download',{error:'something went wrong'});
        }
        return res.render('download',{
            uuid:file.uuid,
            fileName:file.fileName,
            fileSize:file.size,
            downloadLink:`${process.env.APP_BASE_URL}/files/download/${file.uuid}`
        })
    } catch (error) {
        return res.render('download',{error:'something went wrong',error});
    }
}
const downloadFiles=async (req,res)=>{
    const uuid= req.params.uuid
    try {
        const file = await File.findOne({uuid:uuid});
        if(!file){
            return res.render('download',{error:'Something went wrong'})
        }
       return res.download(file.path)
    } catch (error) {
        console.log(error)
        return res.render('download',{error:'Something went wrong'})
    }
}
const sendMail= async (req,res)=>{
    const {uuid,emailFrom,emailTo} =req.body;
    try {
        if(!uuid || !emailFrom || !emailTo){
            return res.status(422).json({msg:'Inavlid request'})
        }
        const file= await File.findOne({uuid:uuid})
        if(file.sender){
            return res.status(422).json({msg:'Email already sent before'})
        }
        file.sender= emailFrom
        file.reciver=emailTo
        await file.save()
        const sendMail= require("../config/emailservice.js");
        sendMail({
            from:emailFrom,
            to:emailTo,
            subject:"inshare file sharing",
            text:`${emailFrom} shared a file with you.`,
            html:emailTemplate({
                emailFrom, 
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email` ,
                size: parseInt(file.size/1000) + ' KB',
                expires: '24 hours'
            })
        }).then(()=>{
            return res.json({success: true});
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg:'Please,try again'})
    }
}
module.exports={
    fileUpload,
    showfiles,
    downloadFiles,
    sendMail
}