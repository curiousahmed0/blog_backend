import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});


const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },  
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/; 
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extname && mimeType) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});

export default upload;
