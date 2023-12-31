const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");
const sendEmail = async (user, token) => {
    try {
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

        const registerMailOptions = {
            from: process.env.EMAIL_USER, // sender address
            template: "register", // the name of the template file, i.e., email.handlebars
            to: user.email,
            subject: "Account Verification",
            context: {
                username: user.name,
                company: "The Movie Application",
                verifyLink: `${process.env.BASE_URL}/users/verify/${user._id}/${token.token}`,
            },
        };
        const changePasswordMailOptions = {
            from: process.env.EMAIL_USER, // sender address
            template: "changePassword", // the name of the template file, i.e., email.handlebars
            to: user.email,
            subject: "Change Password Verification",
            context: {
                username: user.name,
                company: "The Movie Application",
                numberToken: token.token,
            },
        };
        const forgotPasswordMailOptions = {
            from: process.env.EMAIL_USER, // sender address
            template: "forgotPassword", // the name of the template file, i.e., email.handlebars
            to: user.email,
            subject: "Forgot Password",
            context: {
                username: user.name,
                company: "The Movie Application",
                numberToken: token.token,
            },
        };

        if (token.type === "register") {
            await transporter.sendMail(registerMailOptions);
        } else if (token.type === "change-password") {
            await transporter.sendMail(changePasswordMailOptions);
        } else if (token.type === "forgot-password") {
            await transporter.sendMail(forgotPasswordMailOptions);
        }
        console.log("email sent sucessfully");
    } catch (error) {
        console.log("email not sent");
        console.log(error);
    }
};

module.exports = sendEmail;
