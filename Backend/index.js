import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
t9in:h0c9.V2=w2>
//? URL from https://cloud.mongodb.com/
mongoose
    .connect(
        "mongodb+srv://admin:<pass>@fullstack-app-blog.6znmk.mongodb.net/?retryWrites=true&w=majority&appName=fullstack-app-BLOG"
    )
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
