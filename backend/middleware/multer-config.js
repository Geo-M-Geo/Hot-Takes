const multer = require('multer');
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};
// Constant that tell to multer where and how to name the image
const storage = multer.diskStorage({
    // Where the image will be store
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    // Which name it will be given
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        const imageName = name.split('.')[0];
        callback(null, imageName + Date.now() + '.' + extension);
    }
});
module.exports = multer({storage: storage}).single('image');