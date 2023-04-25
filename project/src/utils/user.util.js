const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'syedmazharali742@gmail.com',
        pass: 'wifncqjudispvcld'
    }
});


export const sendEmail = async (recipient, message,subject,response) => {
    console.log("reached")
    try {
    var result=    await transporter.sendMail({
            from: 'syedmazharali742@gmail.com',
            to: recipient,
            subject: subject,
            text: `${message}`
        }, (err, res) => {
            if (err) {
                response.status(400).json({
                    code: 400,
                    error: "Email Sending Failed",
                  });
            }
            response.status(200).json({
                code: 200,
                message: "Email Sent Successfully",
              });
        });
    } catch (err) {
        throw new Error(err);
    }
}