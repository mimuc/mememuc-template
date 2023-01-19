import multer from 'multer';
import path from 'path';

function checkFileType(file, callback) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Checks the extension againts the allowed extensions
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Checks the media types of the file against the allowed file types.
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return callback(null, true);
    } else {
        callback('Please only files format jpeg|jpg|png|gif');
    }
}

export const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        checkFileType(file, cb);
    },
});

export const uploadSingleFile = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        checkFileType(file, cb);
    },
}).single('file');

export const uploadFileMiddleWare = (req, res, next) => {
    uploadSingleFile(req, res, function (err) {
        if (err) {
            next(err);
        } else {
            if (req.file == undefined) {
                const fileErr = new Error('No file selected');
                next(fileErr);
            } else {
                next();
            }
        }
    });
};
