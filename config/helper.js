 const allowedFormart=(size,mime)=>{
    const suporttedImg=['image/png',
        'image/jpg','image/jpeg','image/svg','image/webp','image/gif'];
        if(bytesToMb(size) > 5){
            return "Image size must be less than 5 MB"
        }else if(!suporttedImg.includes(mime)){
        return "image type must be"+suporttedImg.join(",");
    }
    return null
        
}
 const bytesToMb= (bytes)=>{
    return bytes / (1024 * 1024);
}
module.exports={
    allowedFormart,bytesToMb
}