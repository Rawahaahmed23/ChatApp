import multer from "multer";


const MAX_FILE_SIZE =25*1024*1024 


export const  upload = multer({
   storage:multer.memoryStorage(),
   limits:{fileSize:MAX_FILE_SIZE},
   fileFilter:(re,res,next)=>{
     const image = file.mimetype.startsWith("image/");
  const video = file.mimetype.startsWith("video/");

  if (image || video) {
    cb(new Error('onlyimag and video upload allow'))
    return
  }
  cb(null,true)
   }
})