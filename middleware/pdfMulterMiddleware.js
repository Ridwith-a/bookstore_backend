const multer = require('multer')


const storage = multer.diskStorage({
    // path to storage file
    destination:(req,file,Callback)=>{
        Callback(null , './pdfUploads')
    },
    // name in which file is stored
    filename:(req,file,Callback)=>{
        Callback(null,`resume- ${file.originalname}`)
    }
})

const fileFilter = (req , file , Callback)=>{
    // accepts only pdf
    if(file.mimetype == 'application/pdf'){
        Callback(null , true)
    }
    else{
        Callback(null , false)
        return Callback(new Error('only accepts pdf files'))
    }
}

const pdfmulterConfig = multer({
    storage ,
    fileFilter
})

module.exports = pdfmulterConfig