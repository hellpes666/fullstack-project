import express from "express";
import multer from "multer"; //? for upload images
import mongoose from "mongoose";
import dotenv from "dotenv";
import { checkAuth, handleError } from "./utils/handleUtil.js";
import {
    UserController,
    PostController,
} from "./controllers/MainController.js";
import {
    registerValidation,
    loginValidation,
    postCreateValidation,
} from "./validation.js";

//? URL from https://cloud.mongodb.com/
//? use dotenv for security passwords
dotenv.config();
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("DB ok"))
    .catch((err) => console.log("DB error", err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, "uploads"); //? Сохраняем файлы в папку uploads (путь)
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname); //? Сохраняем название файла
    },
}); //? Multer images storage

const upload = multer({ storage });

//? Now we can get JSON from body request
app.use(express.json());
app.use("/uploads", express.static("uploads")); //? Из папки uploads подгружаем файлы GET запрос
//? Login section
app.post("/auth/login", loginValidation, handleError, UserController.login);

//? Register section
app.post(
    "/auth/register",
    registerValidation,
    handleError,
    UserController.register
);

//? About me section
app.get("/auth/me", checkAuth, UserController.getMe);

//! Post section (CRUD) - advice: /post/create or similar -> bad practice
//? Get all Articles
app.get("/posts", PostController.getAll);
//? Get one Article
app.get("/posts/:id", PostController.getOne);
//? Create Article
app.post(
    "/posts",
    checkAuth,
    postCreateValidation,
    handleError,
    PostController.create
);
//? Delete Article
app.delete("/posts/:id", checkAuth, PostController.remove);
//? Update Article
app.patch(
    "/posts/:id",
    checkAuth,
    postCreateValidation,
    handleError,
    PostController.update
);

//! Multer section
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
}); //? Middleware чекает файл image

const port = 4444;

app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log("Server OK");
});
postCreateValidation;
