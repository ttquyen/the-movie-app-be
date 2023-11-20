const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");
const sendEmail = async (user, token, subject) => {
    try {
        console.log(user);
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            port: 587,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // point to the template folder
        const handlebarOptions = {
            viewEngine: {
                partialsDir: path.resolve("./views/"),
                defaultLayout: false,
            },
            viewPath: path.resolve("./views/"),
        };
        transporter.use("compile", hbs(handlebarOptions));

        const mailOptions = {
            from: process.env.EMAIL_USER, // sender address
            template: "email", // the name of the template file, i.e., email.handlebars
            to: user.email,
            subject: subject,
            context: {
                username: user.name,
                company: "The Movie Application",
                verifyLink: `${process.env.BASE_URL}/users/verify/${user._id}/${token.token}`,
            },
        };

        await transporter.sendMail(mailOptions);
        console.log("email sent sucessfully");
    } catch (error) {
        console.log("email not sent");
        console.log(error);
    }
};

module.exports = sendEmail;
