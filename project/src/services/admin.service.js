import sequelize from '../config/database';

export const addCourse = async (body) => {
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
                replacements: [course_id, body.name, body.lastDate,
                    body.duration, body.seatsLeft,
                    body.name, body.url],
                type: QueryTypes.INSERT
            }
        );
        var courseInstructorResponse = await sequelize.query(
            `insert into course_notes(c_id,notes)
    values${getMultipleValues(course_id, body.notes)}`,
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

const getMultipleValues = (c_id, notesArray = []) => {
    var string = ''
    for (var i = 0; i < notesArray.length; i++) {

        if (i == notesArray.length - 1)
            string += `('${c_id}','${notesArray[i]}')`
        else
            string += `('${c_id}','${notesArray[i]}'),`
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


