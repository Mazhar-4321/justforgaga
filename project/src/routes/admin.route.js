import express from 'express';
import * as AdminController from '../controllers/admin.controller'


const router = express.Router();
const aws = require("aws-sdk");
const multer = require("multer");
const multers3 = require("multer-s3");
const BUCKET = process.env.BUCKET;
aws.config.update({
    secretAccessKey: process.env.ACCESS_SECRET,
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION
})
const s3 = new aws.S3({

});
const upload = multer({
    storage: multers3({
        bucket: BUCKET,
        s3: s3,
        contentDisposition: 'inline',
        contentType: multers3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            console.log("what",file)
            cb(null, file.originalname)
        }
    })
})


router.post('/addCourse',upload.any(), AdminController.addCourse);



router.get('/courses/:id', AdminController.getAllCourses);


router.delete('/courses/:id', AdminController.deleteCourse);
router.post('/deleteNoteById', AdminController.deleteNoteById);
router.post('/addQuiz/:id', AdminController.addQuiz);

router.get('/certificateRequests/:id', AdminController.getCertificateRequests)

router.get('/courseById/:id', AdminController.getCourseById);

router.post('/checkFiles', AdminController.updateCourse);


router.put('/updateCourse', AdminController.updateCourse);
router.get('/dashboard/:id', AdminController.getDashBoardDetails)



export default router;
