import PostModel from "../models/Post.js";
import { errorStatusCodeMessage } from "./UserControllerErrors.js";

export const getAll = async (req, res) => {
    try {
        //? return all articles
        //? populate('rel') - с чем связь идет
        const posts = await PostModel.find().populate("user").exec();

        res.json(posts);
    } catch (err) {
        errorStatusCodeMessage(res, 500, "Не удалось получить статьи");
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id; //? Из строки .../posts/:id - достаем id

        //? Находим один пост по ID
        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 }, //? Увеличиваем кол-во просмотров поста на 1
            },
            {
                //? После обновления данных, возвращаемый объект будет актуальным
                returnDocument: "after",
            }
        )
            .then((doc) => res.json(doc))
            .catch((err) =>
                errorStatusCodeMessage(res, 500, "Статья не найдена")
            );
    } catch (err) {
        errorStatusCodeMessage(res, 500, "Не удалось получить статьи");
    }
};

export const create = async (req, res) => {
    try {
        if (!req.body.title || !req.body.text) {
            return errorStatusCodeMessage(
                res,
                400,
                "Title and text are required"
            );
        }
        if (!req.userId) {
            return errorStatusCodeMessage(res, 401, "User not authorized");
        }

        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        });

        const post = await doc.save();
        res.status(201).json({
            message: "Post created successfully",
            post,
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        errorStatusCodeMessage(res, 500, "Не удалось создать статью");
    }
};

export const remove = async (req, res) => {
    try {
        const postToDeleteId = req.params.id; //? Из строки .../posts/:id - достаем id

        //? Находим один пост по ID
        PostModel.findOneAndDelete({
            _id: postToDeleteId,
        })
            .then((doc) => res.json({ success: true }))
            .catch((err) =>
                errorStatusCodeMessage(res, 500, "Не удалось удалить статью")
            );
    } catch (err) {}
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                imageUrl: req.body.imageUrl,
                user: req.userId,
            }
        );

        res.json({
            success: true,
        });
    } catch (err) {
        errorStatusCodeMessage(res, 500, "Не удалось обновить статью");
    }
};
