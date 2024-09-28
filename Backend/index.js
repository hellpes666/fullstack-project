import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
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

//? Now we can get JSON from body request
app.use(express.json());

//? Login section
app.post("/auth/login", loginValidation, UserController.login);

//? Register section
app.post("/auth/register", registerValidation, UserController.register);

//? About me section
app.get("/auth/me", checkAuth, UserController.getMe);

//! Post section (CRUD) - advice: /post/create or similar -> bad practice
//? Get all Articles
app.get("/posts", PostController.getAll);
//? Get one Article
app.get("/posts/:id", PostController.getOne);
//? Create Article
app.post("/posts", checkAuth, postCreateValidation, PostController.create);
//? Delete Article
app.delete("/posts/:id", checkAuth, PostController.remove);
//? Update Article
app.patch("/posts/:id", checkAuth, PostController.update);

const port = 4444;

app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log("Server OK");
});
postCreateValidation;
