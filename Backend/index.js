import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { registerValidation } from "./validations/auth.js";
import { validationResult } from "express-validator";
import UserSchema from "./models/User.js";
import checkAuth from "./utils/checkAuth.js";

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

app.post("/auth/login", async (req, res) => {
    try {
        const user = await UserSchema.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                //? Лучше писать: "Неверный логин или пароль (для безопасности)"
                message: "Пользователь не найден",
            });
        }

        const isValidPassword = await bcrypt.compare(
            req.body.password,
            user._doc.passwordHash
        );
        if (!isValidPassword) {
            return res.status(400).json({
                message: "Неверный логин или пароль",
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secret123",
            {
                expiresIn: "30d", //? Жизненный цикл токена
            }
        );

        const { passwordHash, ...userData } = user._doc;
        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        //? for dev:
        console.log(err);

        //?for user:
        res.status(500).json({
            message: "Не удалось авторизоваться",
        });
    }
});

app.post("/auth/register", registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        //? Зашифровка пароля
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10); //? Алгоритм шифрования
        const hash = await bcrypt.hash(password, salt); //? Пароль, алгоритм шифрования пароля

        //? Create a new model User
        const doc = new UserSchema({
            email: req.body.email,
            passwordHash: hash,
            fullName: req.body.fullName,
            avatarURL: req.body.avatarURL,
        });

        //? Create a User
        const user = await doc.save(); //? Save to DB and return to const user

        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secret123",
            {
                expiresIn: "30d", //? Жизненный цикл токена
            }
        );

        const { passwordHash, ...userData } = user._doc;

        //! Return only 1 answer
        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        //? for dev:
        console.log(err);

        //?for user:
        res.status(500).json({
            message: "Не удалось зарегистрироваться",
        });
    }
});

//? About me section
app.get("/auth/me", checkAuth, async (req, res) => {
    try {
        const user = await UserSchema.findById(req.userId);
        if (!user) {
            return res.status(404).message({
                message: "Пользователь не найден",
            });
        }

        const { passwordHash, ...userData } = user._doc;
        res.json(userData);
    } catch (err) {
        //? for dev:
        console.log(err);

        //?for user:
        res.status(500).json({
            message: "Нет доступа",
        });
    }
});

const port = 4444;

app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log("Server OK");
});
