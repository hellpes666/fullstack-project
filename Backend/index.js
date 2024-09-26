import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";

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

//? Если запрос пришёл на главный адрес
app.get("/", (req, res) => {
    //? req - from user; res - to user
    res.send("hello,world!");
});

app.post("/auth/login", (req, res) => {
    console.log(req.body);

    //? Generate JWT
    const token = jwt.sign(
        {
            email: req.body.email,
            fullName: "hell pes",
        },
        "jiandgpidsujdipgasj1223124"
    );
    res.json({
        success: true,
        token,
    });
});

const port = 4444;

app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log("Server OK");
});
