const express = require('express');
const router = express.Router();
const randomstring = require('randomstring');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const Resend = require('resend');
require("dotenv").config();

const resend = new Resend.Resend(process.env.RESEND_API_KEY);

const {
    CapstoneStudent,
    Group,
    HCIGroupApplication,
    HCIStudent,
    Project,
    ProjectApplication,
    Round,
    UCAccount
} = require("../models/index.js");

const createWebToken = async (username, userType) => {
    return jwt.sign({username, userType}, process.env.WEB_TOKEN_KEY, { expiresIn: 3 * 24 * 60 * 60});
}

const verifySession = async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.WEB_TOKEN_KEY, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      } else {
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Not authorised" });
    throw new Error('Not authorized, no token');
  }
};

const verifyStudentSession = async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.WEB_TOKEN_KEY, (err, decodedToken) => {
      if (err) {
        return res.status(401).send('Invalid token');
      } else {
        if (decodedToken.userType !== 'student') {
            return res.status(401).send('Not a student');
        }
        next();
      }
    });
  } else {
    res.status(401).send('Not authorised');
    throw new Error('Not authorized, no token');
  }
};

const verifyStaffSession = async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.WEB_TOKEN_KEY, (err, decodedToken) => {
      if (err) {
        return res.status(401).send('Invalid token');
      } else {
        if (decodedToken.userType !== 'staff') {
            return res.status(401).send('Not a staff member');
        }
        next();
      }
    });
  } else {
    res.status(401).send('Not authorised');
    throw new Error('Not authorized, no token');
  }
};

const sendPasswordEmail = async (to, password) => {
    const { data, error } = await resend.emails.send({
        from: "Dashboard Web App <auth@curtindashboard.tech>",
        to: to,
        subject: "Welcome, here are your details",
        html: `<strong>Here is your default password: ${password}</strong>`,
    });

    if (error) {
        throw error;
    }
};

const sendOTPEmail = async (to, otp) => {
    const { data, error } = await resend.emails.send({
        from: "Dashboard Web App <auth@curtindashboard.tech>",
        to: to,
        subject: "OTP Code",
        html: `<strong>Here is your one-time-password: ${otp}</strong>`,
    });

    if (error) {
        throw error;
    }
};

const validationSchemas = {
    setupSchema: joi.object({
        email: joi.string().email().required(),
        type: joi.string().valid('staff', 'student').required(),}),
    loginSchema: joi.object({
        username: joi.string().email().required(),
        password: joi.string().required(),
        type: joi.string().valid('staff', 'student').required(),}),
    otpSchema: joi.object({
        username: joi.string().email().required(),
        otp: joi.number().required(),
        type: joi.string().valid('staff', 'student').required(),}),
    emailSchema: joi.object({
        newEmail: joi.string().email().required(),}),
    verifyEmailSchema: joi.object({
        otp: joi.number().required(),}),
    resetPasswordSchema: joi.object().keys({
        password: joi.string().required(),
        reconfirmPassword: joi.string().required()}),
};

const validateParameters = (schema, property) => {
    return async (req, res, next) => {
        const { error } = schema.validate(req.body);

        if (error == null) {
            next();
        } else {
            const { details } = error;
            const errorMsg = details.map(error => error.message).join(',');

            res.status(422).json({ message: errorMsg });
        }
    };
};

router.post('/setup', validateParameters(validationSchemas.setupSchema), async (req, res) => {
    const { email, type } = req.body;
    
    var account = null;

    switch (type) {
        case 'staff':
            account = await UCAccount.findOne({Username: email}).exec();
            break;
        case 'student':
            account = await CapstoneStudent.findOne({Username: email}).exec();
            break;
    }

    if (account) {
        res.status(422).send('Account already exists');
    }
    else if (!(email.endsWith('@student.curtin.edu.au') || email.endsWith('@curtin.edu.au'))) {
        res.status(422).send('Non-Curtin email address');
    } 
    else if (type === 'staff' && !email.endsWith('@curtin.edu.au')) {
        res.status(422).send('Staff must have staff email address');
    } 
    else {
        const newPassword = randomstring.generate(12);
        
        await sendPasswordEmail(email, newPassword);

        const salt = randomstring.generate(16);
        const securePassword = await argon2.hash(salt + newPassword);

        const id = email.substring(0, email.indexOf('@'));

        var createdAccount = null;

        switch (type) {
            case 'staff':
                createdAccount = await UCAccount.create({
                    Name: id,
                    Type: 'ISAD3000',
                    Email: email,
                    Username: email,
                    Password: securePassword,
                    Salt: salt,
                });
                break;
            case 'student':
                createdAccount = await CapstoneStudent.create({
                    Name: id,
                    StudentID: id,
                    TermsAccepted: 0,
                    Unit: 'ISAD3000',
                    Email: email,
                    Username: email,
                    Password: securePassword,
                    Salt: salt,
                });
                break;
        }

        res.status(201).json(createdAccount);
    }
});

router.post('/login', validateParameters(validationSchemas.loginSchema), async (req, res) => {
    const { username, password, type } = req.body;
    
    var account = null;

    switch (type) {
        case 'staff':
            account = await UCAccount.findOne({Username: username}).exec();
            break;
        case 'student':
            account = await CapstoneStudent.findOne({Username: username}).exec();
            break;
    }

    if (account)
    {
        const saltedPassword = account.Salt + password;

        if (await argon2.verify(account.Password, saltedPassword)) {
            const token = await createWebToken(account.Username, type);
            res.cookie("token", token, {withCredentials: true, httpOnly: false});
            res.sendStatus(200);
        } 
        else {
            res.status(401).send('Incorrect password');
        }
    } 
    else {
        res.status(401).send('Username not found');
    }
});

router.post('/otp', validateParameters(validationSchemas.otpSchema), async (req, res) => {
    const { username, otp, type } = req.body;
    
    var account = null;

    switch (type) {
        case 'staff':
            account = await UCAccount.findOne({Username: username}).exec();
            break;
        case 'student':
            account = await CapstoneStudent.findOne({Username: username}).exec();
            break;
    }

    if (account)
    {
        if (account.OTP === otp) {
            const token = await createWebToken(account.Username, type);
            res.cookie("token", token, {withCredentials: true, httpOnly: false});
            res.sendStatus(200);
        } 
        else {
            res.status(401).send('Incorrect OTP');
        }
    } 
    else {
        res.status(401).send('Username not found');
    }
});

/* Forgot Password process:
0. Front-end displays forgot password page
1. User enters email and user type and front-end calls /forgotPassword
2. /forgotPassword sends OTP to supplied email
3. Front-end changes to OTP entry page
4. User enters OTP and front-end calls /otp
5. /otp establishes a user session
6. Front-end changes to reset password page
7. User enters password and front-end calls /resetPassword
8. Upon successful response, front-end navigates to dashboard
*/

router.post('/forgotPassword', validateParameters(validationSchemas.setupSchema), async (req, res) => {
    const { email, type } = req.body;
    
    var account = null;

    switch (type) {
        case 'staff':
            account = await UCAccount.findOne({Username: email}).exec();
            break;
        case 'student':
            account = await CapstoneStudent.findOne({Username: email}).exec();
            break;
    }

    if (account)
    {
        var OTP = randomstring.generate({length: 5, charset: 'numeric'});
        
        await sendOTPEmail(email, OTP);

        account.OTP = OTP;
        await account.save();

        res.sendStatus(200);
    } 
    else {
        res.status(401).send('Account not found');
    }
});

router.post('/resetPassword', validateParameters(validationSchemas.resetPasswordSchema), verifySession, async(req, res) => {
    console.log("Reset Password");
    console.log("User input:", req.body);

    // From user session + body
    const decodedToken = jwt.verify(req.cookies.token, process.env.WEB_TOKEN_KEY);

    const username = decodedToken.username;
    const type = decodedToken.userType;

    const { password, reconfirmPassword } = req.body;

    if (password !== reconfirmPassword) {
        console.log("Passwords do not match");
        return res.status(400).json({
            message: "Passwords do not match"
        });
    }

    var user = null;

    switch (type) {
        case 'staff':
            user = await UCAccount.findOne({Username: username}).exec();
            break;
        case 'student':
            user = await CapstoneStudent.findOne({Username: username}).exec();
            break;
    }

    if (user) {
        try {
            const newPassword = await argon2.hash(user.Salt + password);

            user.Password = newPassword;
            await user.save();

            console.log("Password Changed Successfully!")

            return res.status(200).json({
                message: "Password Changed Successfully!"
            });
        }
        catch (err) {
            console.error("Reset Password Error:", err)

            return res.status(500).json({
                message: "Failed to reset password!"
            });
        }
    } else {
        res.status(401).send('Account not found');
    }
});

router.post('/email', validateParameters(validationSchemas.emailSchema), verifySession, async (req, res) => {
    // From user session + body
    const decodedToken = jwt.verify(req.cookies.token, process.env.WEB_TOKEN_KEY);

    const username = decodedToken.username;
    const type = decodedToken.userType;

    const { newEmail } = req.body;

    var account = null;

    switch (type) {
        case 'staff':
            return res.status(403).send('Only students can set personal email')
            break;
        case 'student':
            account = await CapstoneStudent.findOne({Username: username}).exec();
            break;
    }

    if (account)
    {
        if (account.Email !== newEmail) {
            account.emailVerified = false;
            account.Email = newEmail;

            var OTP = randomstring.generate({length: 5, charset: 'numeric'});
        
            await sendOTPEmail(newEmail, OTP);

            account.OTP = OTP;
            await account.save();
            // OTP necessary to verify email, otherwise Curtin email is used, though new email is stored
        }

        res.status(200).json(account);
    } 
    else {
        res.status(401).send('Account not found');
    }
});

router.post('/verifyEmail', validateParameters(validationSchemas.verifyEmailSchema), verifySession, async (req, res) => {
    // From user session + body
    const decodedToken = jwt.verify(req.cookies.token, process.env.WEB_TOKEN_KEY);

    const username = decodedToken.username;
    const type = decodedToken.userType;

    const { otp } = req.body;
    
    var account = null;

    switch (type) {
        case 'staff':
            return res.status(403).send('Only students can set personal email')
            break;
        case 'student':
            account = await CapstoneStudent.findOne({Username: username}).exec();
            break;
    }

    if (account)
    {
        if (account.OTP === otp) {
            account.emailVerified = true;
            await account.save();

            res.sendStatus(200);
        } 
        else {
            res.status(401).send('Incorrect OTP');
        }
    } 
    else {
        res.status(401).send('Account not found');
    }
});

module.exports = { router, verifySession, verifyStudentSession, verifyStaffSession };