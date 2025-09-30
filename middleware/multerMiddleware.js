const multer = require('multer')


const storage = multer.diskStorage({
    // path to storage file
    destination:(req,file,Callback)=>{
        Callback(null , './ImgUploads')
    },
    
    filename:(req,file,Callback)=>{
        Callback(null,`Image - ${file.originalname}`)
    }
})

const fileFilter = (req , file , Callback)=>{
    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg'){
        Callback(null , true)
    }
    else{
        Callback(null , false)
        return Callback(new Error('only accepts png jpeg and jpg files'))
    }
}

const multerConfig = multer({
    storage ,
    fileFilter
})

module.exports = multerConfig