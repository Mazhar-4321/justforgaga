import sequelize from '../config/database';


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


// router.post(`/upload`, upload.any(), (req, res, next) => {
//     //res.send(req.file);
//     console.log(req.files)
//     // const myBucket = BUCKET
//     // const myKey = 'myImage.png'
//     // const signedUrlExpireSeconds = 10

//     // const url = s3.getSignedUrl('getObject', {
//     //     Bucket: myBucket,
//     //     Key: myKey,
//     //     Expires: signedUrlExpireSeconds
//     // })

//     // res.send(url)
//     res.send("success")
// })

export const addCourse = async (body, files) => {
    try {
        const { QueryTypes, JSON } = require('sequelize');
        const course_id = Date.now();

        body.url = 'Youtube Video';
        body.seatsLeft = 10;
        console.log(body)
        var courseInsertResponse = await sequelize.query(
            `insert into course(c_id,name,lastDate,duration,seatsLeft,course_description,url)
    values(?,?,?,?,?,?,?)`,
            {
                replacements: [course_id, body.courseName, body.lastDayToEnroll,
                    body.duration, body.seatsLeft,
                    body.courseDescription, body.url],
                type: QueryTypes.INSERT
            }
        );
        var courseNotesResponse = await sequelize.query(
            `insert into course_notes(c_id,notes)
    values${getMultipleValuesforAWS(course_id,files)}`,
            {
                replacements: [],
                type: QueryTypes.INSERT
            }
        );
        var courseInstructorResponse = await sequelize.query(
            `insert into course_instructor(c_id,instructor)
    values(?,?)`,
            {
                replacements: [course_id, body.instructorName],
                type: QueryTypes.INSERT
            }
        );
        var auditResponse = await await sequelize.query(
            `insert into audit(course_id,created_by)
    values(?,?)`,
            {
                replacements: [course_id, body.email],
                type: QueryTypes.INSERT
            }
        );
        return auditResponse




    } catch (err) {
        console.log("err", err);
        throw new Error('invalid')
    }

}

export const updateCourse = async (req) => {
    console.log(req.body);
    try {
        const { QueryTypes, JSON } = require('sequelize');
        var courseUpdateResponse = await sequelize.query(
            `update course set name=?,lastDate=?,duration=?,course_description=?
                where c_id=?`,
            {
                replacements: [req.body.name, req.body.lastDate, req.body.duration,
                req.body.courseDescription, req.body.courseId],
                type: QueryTypes.UPDATE
            }
        );
        var courseInstructorResponse = await sequelize.query(
            `update course_instructor set instructor=?
                where c_id=?`,
            {
                replacements: [req.body.instructorName, req.body.courseId],
                type: QueryTypes.UPDATE
            }
        );
        var courseInstructorResponse = await sequelize.query(
            `insert into course_notes(c_id,notes)
    values${getMultipleValues(req.body.courseId, req.body.notes)}`,
            {
                replacements: [],
                type: QueryTypes.INSERT
            }
        );
        return courseInstructorResponse
    } catch (err) {
        throw new Error(err)
    }

    return null;
}
export const checkFiles = async (body) => {
    console.log(body);
    return "null";
    // const { QueryTypes } = require('sequelize');
    // var courses = await sequelize.query(
    //     `SELECT s1.notes,course.name,course.lastDate,course.duration,course.course_description,course_instructor.instructor FROM course
    //     inner join course_instructor on
    //     course.c_id=course_instructor.c_id
    //     inner join (select group_concat(notes) as notes from course_notes where c_id=? group by c_id)s1

    //     where course.c_id=?;`,
    //     {
    //         replacements: [courseId,courseId],
    //         type: QueryTypes.SELECT
    //     }
    // );
    // console.log("course fetched By Id", courses)
    // if(courses.length>0)
    // return courses;
    // else{

    //     var courses = await sequelize.query(
    //         `SELECT course.name,course.lastDate,course.duration,course.course_description,course_instructor.instructor FROM course
    //         inner join course_instructor on
    //         course.c_id=course_instructor.c_id

    //         where course.c_id=?`,
    //         {
    //             replacements: [courseId],
    //             type: QueryTypes.SELECT
    //         }
    //     );
    //     console.log("course fetched By Id", courses)
    //     if(courses.length>0)
    //     return courses;
    // }
}
export const getCourseById = async (courseId) => {
    const { QueryTypes } = require('sequelize');
    var courses = await sequelize.query(
        `SELECT s1.notes,course.name,course.lastDate,course.duration,course.course_description,course_instructor.instructor FROM course
        inner join course_instructor on
        course.c_id=course_instructor.c_id
        inner join (select group_concat(notes) as notes from course_notes where c_id=? group by c_id)s1
        
        where course.c_id=?;`,
        {
            replacements: [courseId, courseId],
            type: QueryTypes.SELECT
        }
    );
    console.log("course fetched By Id", courses)
    if (courses.length > 0)
        return courses;
    else {

        var courses = await sequelize.query(
            `SELECT course.name,course.lastDate,course.duration,course.course_description,course_instructor.instructor FROM course
            inner join course_instructor on
            course.c_id=course_instructor.c_id
            
            where course.c_id=?`,
            {
                replacements: [courseId],
                type: QueryTypes.SELECT
            }
        );
        console.log("course fetched By Id", courses)
        if (courses.length > 0)
            return courses;
    }
}
const getMultipleValues = (c_id, notesArray = []) => {
    var string = ''
    for (var i = 0; i < notesArray.length; i++) {
        console.log("This is My Demo", notesArray[i], notesArray[i].path)
        if (i == notesArray.length - 1)
            string += `('${c_id}','${notesArray[i].path + "~" + notesArray[i].name}')`
        else
            string += `('${c_id}','${notesArray[i].path + "~" + notesArray[i].name}'),`
    }
    return string;
}
const getMultipleValuesforAWS = (c_id, notesArray = []) => {
    var string = ''
    for (var i = 0; i < notesArray.length; i++) {
        // console.log("This is My Demo", notesArray[i], notesArray[i].path)
        if (i == notesArray.length - 1)
            string += `('${c_id}','${notesArray[i].key}')`
        else
            string += `('${c_id}','${notesArray[i].key}'),`
    }
    return string;
}

const getMultipleValuesForQuiz = (c_id, notesArray = []) => {
    var string = ''
    for (var i = 0; i < notesArray.length; i++) {

        if (i == notesArray.length - 1)
            string += `('${c_id}','${notesArray[i].question_id}','${notesArray[i].question}','${notesArray[i].correctAnswer}')`
        else
            string += `('${c_id}','${notesArray[i].question_id}','${notesArray[i].question}','${notesArray[i].correctAnswer}'),`
    }
    return string;
}


export const deleteCourse = async (courseId) => {
    const { QueryTypes } = require('sequelize');
    var courseInsertResponse = await sequelize.query(
        `delete from course where c_id=?`,
        {
            replacements: [courseId],
            type: QueryTypes.DELETE
        }
    );
    var courseInsertResponse = await sequelize.query(
        `delete from audit where course_id=?`,
        {
            replacements: [courseId],
            type: QueryTypes.DELETE
        }
    );

}

export const deleteNoteById = async (body) => {
    console.log("reached")
    console.log(body.courseId)
    const { QueryTypes } = require('sequelize');

    var courseInsertResponse = await sequelize.query(
        `delete from course_notes where c_id=? and notes=?`,
        {

            replacements: [body.courseId, body.fileId],
            type: QueryTypes.DELETE
        }
    );
    return courseInsertResponse;
}

export const getAllCourses = async (adminId) => {
    const { QueryTypes } = require('sequelize');
    var courses = await sequelize.query(
        `select c.c_id,c.name,ci.instructor,c.lastDate,c.duration,c.seatsLeft,c.course_description 
        from course c
        inner join course_instructor ci
        on c.c_id=ci.c_id
        inner join (select course_id from audit where created_by=?)s1
        on s1.course_id=c.c_id
        and c.seatsLeft>0`,
        {
            replacements: [adminId],
            type: QueryTypes.SELECT
        }
    );
    console.log("courses fetched", courses)
    return courses;
}
const getMultipleValuesForQuestions = (questions = []) => {
    var string = ''
    for (var j = 0; j < questions.length; j++) {

        for (var i = 0; i < questions[j].options.length; i++) {

            if (j == questions.length - 1 && i == questions[j].options.length - 1)
                string += `('${questions[j].question_id}','${questions[j].options[i]}')`
            else
                string += `('${questions[j].question_id}','${questions[j].options[i]}'),`
        }
    }
    return string;
}
export const addQuiz = async (req) => {
    try {
        var courseId = req.params.id;
        console.log(courseId, req.body)
        const { QueryTypes } = require('sequelize');
        // console.log(getMultipleValuesForQuiz(courseId, req.body))
        var quizResponse = await sequelize.query(
            `insert into quiz(c_id,question_id,question,answer)
    values ${getMultipleValuesForQuiz(courseId, req.body)}`,
            {
                replacements: [],
                type: QueryTypes.INSERT
            }
        );
        var questionsResponse = await sequelize.query(
            `insert into questions(question_id,options)
    values ${getMultipleValuesForQuestions(req.body)}`,
            {
                replacements: [],
                type: QueryTypes.INSERT
            }
        );

        return questionsResponse;
    } catch (err) {
        console.log(err);
        return 'null'
    }
}

export const getCertificateRequests = async (adminId) => {

    const { QueryTypes } = require('sequelize');
    var courses = await sequelize.query(
        `select c.name,cc.student_id from course c
    inner join audit a
    on a.course_id=c.c_id
    inner join course_certificate_request cc
    on cc.course_id=c.c_id
    where a.created_by=?`,
        {
            replacements: [adminId],
            type: QueryTypes.SELECT
        }
    );
    console.log("courses fetched", courses)
    return courses;
}
export const getDashBoardDetails = async (adminId) => {

    const { QueryTypes } = require('sequelize');
    var courses = await sequelize.query(
        `select audit.course_id,course.name,s1.count from audit 
    inner join 
    (select count(c_id) as count,c_id  from courses_enrolled group by c_id)s1 on
    audit.course_id=s1.c_id
    inner join course on
    course.c_id=audit.course_id
    where audit.created_by=?`,
        {
            replacements: [adminId],
            type: QueryTypes.SELECT
        }
    );
    console.log("courses fetched", courses)
    return courses;
}


