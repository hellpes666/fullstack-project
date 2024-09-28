//? There is a structure table of users
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        text: {
            type: String,
            required: true,
            unique: true,
        },

        tags: {
            type: Array,
            default: [],
        },
        viewsCount: {
            type: Number,
            default: 0,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", //? Ссылается по Id на модель User
            required: true,
        },

        imageUrl: String,
    },
    {
        //? Помимо основных свойств пользователя
        timestamps: true, //? Автоматически добавляется время создания сущности
    }
);

export default mongoose.model("Post", PostSchema);
