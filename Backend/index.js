import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { registerValidation } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";

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
app.post("/auth/login", UserController.login);

//? Register section
app.post("/auth/register", registerValidation, UserController.register);

//? About me section
app.get("/auth/me", checkAuth, UserController.getMe);

const port = 4444;

app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log("Server OK");
});
