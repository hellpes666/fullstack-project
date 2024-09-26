import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { registerValidation } from "./validations/auth.js";
import { validationResult } from "express-validator";
import UserSchema from "./models/User.js";

//? URL from https://cloud.mongodb.com/
//? use dotenv for security passwords
dotenv.config();
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("DB ok"))
    .catch((err) => console.log("DB error", err));

const app = express();

//? Now we can get JSON from body request
app.use(express.json());

app.post("/auth/register", registerValidation, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    //? Зашифровка пароля
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10); //? Алгоритм шифрования
    const passwordHash = await bcrypt.hash(password, salt); //? Пароль, алгоритм шифрования пароля

    //? Create a new model User
    const doc = new UserSchema({
        email: req.body.email,
        passwordHash,
        fullName: req.body.fullName,
        avatarURL: req.body.avatarURL,
    });

    //? Create a User
    const user = await doc.save(); //? Save to DB and return to const user

    res.json(user);
});

const port = 4444;

app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log("Server OK");
});
