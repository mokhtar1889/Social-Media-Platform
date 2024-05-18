import multer , {diskStorage} from "multer";

export let uploadFile = (fileTypes)=>{

    let storage = diskStorage({})

    let fileFilter = (req , file , cb)=>{
        if(!fileTypes.includes(file.mimetype)){
            return cb(new Error("invalid file type") , false)
        }
    
        return cb(null , true)
    }
    
    let multerUpload = multer({storage , fileFilter})
    
    return multerUpload
}

export const fileValidation = {
    // all files allowed when uploading profile picture
    profilePicture:['image/apng' , 'image/avif' , 'image/bmp', 'image/gif', 'image/jpeg' , 'image/png' , 'image/svg+xml',
        'image/tiff' , 'image/webp'] ,

    // all files allowed when uploading post attachments
    postAttachments: ['image/apng' , 'image/avif' , 'image/bmp', 'image/gif', 'image/jpeg' , 'image/png' , 'image/svg+xml',
        'image/tiff' , 'image/webp' , 'video/x-msvideo', 'video/mp4', 'video/mpeg' , 'video/ogg' , 'video/mp2t','video/webm' , 'application/pdf']
    
}











