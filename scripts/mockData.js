const randomstring = require('randomstring');
const mongoose = require('mongoose');
const argon2 = require('argon2');
require("dotenv").config();

mongoose.connect(process.env.MONGODB_STRING);

const CapstoneStudent = require('../models/CapstoneStudent');

const newPassword = "n6fLmXiOdxWi";
const otp = "58197";
const email = "existing.person@student.curtin.edu.au";
const name = "Bob Jones";
const studentID = '231251';
const termsAccepted = 0;
const unit = 'ISAD3000';

const createAccount = async () => {
    const salt = randomstring.generate(16);
    const securePassword = await argon2.hash(salt + newPassword);

    const newAccount = CapstoneStudent({
        Email: email,
        Username: email,
        Name: name,
        StudentID: studentID,
        TermsAccepted: termsAccepted,
        Unit: unit,
        Password: securePassword,
        Salt: salt,
        OTP: otp,
    });

    await newAccount.save();
}

createAccount();

mongoose.connection.close()