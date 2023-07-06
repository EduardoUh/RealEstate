import multer from 'multer';
import path from 'path';
import { generateId } from '../helpers/tokens.js';

// doing some configuration
const storage = multer.diskStorage({
    // destination of the picture
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    // name of the picture
    filename: function (req, file, cb) {
        cb(null, generateId() + path.extname(file.originalname))
    }
})

// adding the previous configuration to multer
const upload = multer({ storage })

export default upload;
