import sequelize from '../config/database';
const aws = require("aws-sdk");
const BUCKET = process.env.BUCKET;
aws.config.update({
    secretAccessKey: process.env.ACCESS_SECRET,
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION
})
const s3 = new aws.S3({

});


export const availableCourses = async () => {
    const { QueryTypes } = require('sequelize');
    var response = await sequelize.query(`
    select c.c_id,c.name,ci.instructor,c.lastDate,c.duration,c.seatsLeft,c.course_description 
    from course c
    inner join course_instructor ci
    on c.c_id=ci.c_id
    and c.seatsLeft>0`
        , {
            type: QueryTypes.SELECT
        })

    return response;

}

export const getImageById = async (id) => {
    const myBucket = BUCKET
    const myKey = id
    const signedUrlExpireSeconds = 10

    const url = s3.getSignedUrl('getObject', {
        Bucket: myBucket,
        Key: myKey,
        Expires: signedUrlExpireSeconds,
        
        
    })
    return url


}

export const myCourses = async (email) => {
    const { QueryTypes } = require('sequelize');
    var response = await sequelize.query(`select c.c_id,c.name ,cn.notes ,ci.instructor 
    ,c.lastDate ,
     c.duration ,c.course_description 
        from course c
        inner join courses_enrolled ce
        on c.c_id=ce.c_id
        inner join course_instructor ci
        on c.c_id=ci.c_id
        inner join (select c_id,group_concat(notes) as notes from course_notes group by c_id order by c_id
    ) cn
        on cn.c_id=c.c_id
        where ce.student_id=?
        and c.seatsLeft>0 
    
  `
        , {
            replacements: [email],
            type: QueryTypes.SELECT
        })
    console.log("my Baby", response)

    return response;

}

export const myProfile = async (body) => {
    const { QueryTypes } = require('sequelize');
    var response = await sequelize.query(`select firstName,lastName,email from users where 
    email=?`
        , {
            replacements: [body.email],
            type: QueryTypes.SELECT
        })

    return response;

}

export const updateProfile = async (body) => {
    const { QueryTypes } = require('sequelize');
    var response = await sequelize.query(`update users set firstName=?,lastName=? where 
    email=?`
        , {
            replacements: [body.firstName, body.lastName, body.email],
            type: QueryTypes.SELECT
        })

    return response;

}

export const enrollInCourse = async (body) => {
    try {
        const { QueryTypes } = require('sequelize');
        console.log("body type", body)
        var response = await sequelize.query(`insert into courses_enrolled(c_id,student_id,status)
    values(?,?,0)`
            , {
                replacements: [body.courseId, body.studentId],
                type: QueryTypes.INSERT
            })
        if (response) {
            var updateCourseSeatsResponse = await sequelize.query(`update course set seatsLeft=seatsLeft-1 where c_id=?`
                , {
                    replacements: [body.courseId],
                    type: QueryTypes.UPDATE
                })
            var couseCertificateDownloadResponse = await sequelize.query(`insert into 
            course_certificate_download(course_id,student_id,status)
            values(?,?,0)`, {
                replacements: [body.courseId, body.studentId],
                type: QueryTypes.INSERT
            })
            if (couseCertificateDownloadResponse) {
                return 'Success'
            }
        }
    } catch (err) {
        console.log("err", err)
    }
}

export const getQuiz = async (courseId) => {
    const { QueryTypes } = require('sequelize');
    var response = await sequelize.query(`
    select  qu.question_id,qu.question,q.options from quiz qu
inner join (select question_id,group_concat(options) as options
from questions group by question_id order by question_id)q
on q.question_id=qu.question_id 
where qu.c_id=? ;`
        , {
            replacements: [courseId],
            type: QueryTypes.SELECT
        })

    return response;
}

export const submitQuiz = async (req) => {
    const { QueryTypes } = require('sequelize');
    var count = 0;
    var questionAnswersMap = new Map()
    var paramsArray = req.params.courseId.split(",")
    req.body.data.forEach(e => questionAnswersMap.set(e.question_id, e.answer))
    console.log(questionAnswersMap)
    var response = await sequelize.query(`
    select question_id,answer from quiz where c_id=?`
        , {
            replacements: [paramsArray[0]],
            type: QueryTypes.SELECT
        })
    if (response) {

        try {
            var marks = response.filter(e => questionAnswersMap.get(e.question_id) === e.answer).length
            var response = await sequelize.query(
                ` insert into quiz_students(c_id,marks,entry,student_id)
    values(?,?,?,?);`,
                {
                    replacements: [paramsArray[0], marks, Date.now(), paramsArray[1]],
                    type: QueryTypes.INSERT
                }
            );

            if (response) {
                return {
                    marks: marks
                }
            }
        } catch (err) {

        }
    } else {
        throw new Error('error')
    }



}

export const getHighestMarks = async (req) => {
    var paramsArray = req.params.courseId.split(",")
    const { QueryTypes } = require('sequelize');
    console.log(paramsArray)
    var certificateDownloadResponse = await sequelize.query(`
select status from course_certificate_download where course_id=? and student_id=?;`
        , {
            replacements: [paramsArray[0], paramsArray[1]],
            type: QueryTypes.SELECT
        })
    console.log(certificateDownloadResponse)
    if (certificateDownloadResponse[0].status == 0) {
        var response = await sequelize.query(`
    select MAX(s1.m) as max from (select c_id,student_id,marks m
        from express.quiz_students where c_id=? and student_id=?)s1;`
            , {
                replacements: [paramsArray[0], paramsArray[1]],
                type: QueryTypes.SELECT
            })
        console.log(response[0])

        if (response[0].max > 6) {
            return "Success"
        } else {
            return "Fail"
        }

        return response;
    } else {
        return "Cant Download , Request Admin For Redownload"
    }
}

export const cancelCourse = async (req) => {
    const { QueryTypes } = require('sequelize');
    console.log(req.body)
    //delete from courses_enrolled where c_id='1682909657988' and student_id='rebecca.asely@gmail.com'
    var response = await sequelize.query(`
    delete from courses_enrolled where c_id=? and student_id=?`
        , {
            replacements: [req.body.courseId, req.body.studentId],
            type: QueryTypes.DELETE
        })
    var response = await sequelize.query(`
    delete from course_certificate_download where course_id=? and student_id=?`
        , {
            replacements: [req.body.courseId, req.body.studentId],
            type: QueryTypes.DELETE
        })


    return response;
}