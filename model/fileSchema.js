const mongoose= require('mongoose');
const Schema= mongoose.Schema

const fileSchema= new Schema({
    fileName:{type:String,required:true},
    path:{type:String,required:true},
    size:{type:String,required:true},
    uuid:{type:String,required:true},
    sender:{type:String,required:false},
    reciver:{type:String,required:false}
},{timestamps:true});

module.exports= mongoose.model("File",fileSchema)
