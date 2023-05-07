import express from 'express';
import * as userController from '../controllers/user.controller';
import * as StudentController from '../controllers/student.controller';
import { newUserValidator, } from '../validators/user.validator';
import { studentAuth, userAuth } from '../middlewares/auth.middleware';

const router = express.Router();
// const aws = require("aws-sdk");
// const multer = require("multer");
// const multers3 = require("multer-s3");
// const BUCKET = process.env.BUCKET;
// aws.config.update({
//     secretAccessKey: process.env.ACCESS_SECRET,
//     accessKeyId: process.env.ACCESS_KEY,
//     region: process.env.REGION
// })
// const s3 = new aws.S3({

// });
// const upload = multer({
//     storage: multers3({
//         bucket: BUCKET,
//         s3: s3,

//         key: (req, file, cb) => {
//             console.log(file)
//             cb(null, file.originalname+Date.now())
//         }
//     })
// })

// router.post(`/uploadMultipleFiles`,upload.single('sample',10),
// (req, res, next) => {

// console.log("files",res.body.files)
//     //res.send(req.file);
//     // const myBucket = BUCKET
//     // const myKey = 'myImage.png'
//     // const signedUrlExpireSeconds = 10

//     // const url = s3.getSignedUrl('getObject', {
//     //     Bucket: myBucket,
//     //     Key: myKey,
//     //     Expires: signedUrlExpireSeconds
//     // })
//     res.send('hi')
// }

//     )
// router.post(`/upload`, upload.any(), (req, res, next) => {
//     //res.send(req.file);
//     console.log(req.files)
//     const myBucket = BUCKET
//     const myKey = 'myImage.png'
//     const signedUrlExpireSeconds = 10

//     const url = s3.getSignedUrl('getObject', {
//         Bucket: myBucket,
//         Key: myKey,
//         Expires: signedUrlExpireSeconds
//     })

//     res.send(url)
//     // res.send("success")
// })
router.get('/availableCourses/:email', studentAuth, StudentController.availableCourses);

router.get('/myCourses/:email', studentAuth, StudentController.myCourses);

router.post('/enroll', studentAuth, StudentController.enrollInCourse);

router.get('/quiz/:courseId', studentAuth, StudentController.getQuiz);

router.post('/quiz/:courseId', studentAuth, StudentController.submitQuiz);

router.get('/marks/:courseId', StudentController.getHighestMarks);

router.post('/cancelCourse', StudentController.cancelCourse);

router.put('/image/:id',StudentController.getImageById)




export default router;
