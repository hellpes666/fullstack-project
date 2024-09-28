//? User Controller
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import { validationResult } from "express-validator";
import { errorStatusCodeMessage } from "./UserControllerErrors.js";

const createAndSendUserData = (res, user) => {
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
};

export const register = async (req, res) => {
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
        const doc = new UserModel({
            email: req.body.email,
            passwordHash: hash,
            fullName: req.body.fullName,
            avatarURL: req.body.avatarURL,
        });

        //? Create a User
        const user = await doc.save(); //? Save to DB and return to const user

        createAndSendUserData(res, user);
    } catch (err) {
        //? for dev:
        console.log(err);

        //?for user:
        errorStatusCodeMessage(res, 500, "Не удалось зарегистрироваться");
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            errorStatusCodeMessage(res, 404, "Пользователь не найден");
        }

        const isValidPassword = await bcrypt.compare(
            req.body.password,
            user._doc.passwordHash
        );
        if (!isValidPassword) {
            errorStatusCodeMessage(res, 404, "Неверный логин или пароль");
        }
        createAndSendUserData(res, user);
    } catch (err) {
        //? for dev:
        console.log(err);

        //?for user:

        errorStatusCodeMessage(res, 500, "Не удалось авторизоваться");
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            errorStatusCodeMessage(res, 404, "Пользователь не найден");
        }

        const { passwordHash, ...userData } = user._doc;
        res.json(userData);
    } catch (err) {
        //? for dev:
        console.log(err);

        //?for user:
        errorStatusCodeMessage(res, 500, "Нет доступа");
    }
};
