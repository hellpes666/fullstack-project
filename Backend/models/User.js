//? There is a structure table of users
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        passwordHash: {
            type: String,
            required: true,
        },

        avatarURL: String, //? unrequired
    },
    {
        //? Помимо основных свойств пользователя
        timestamps: true, //? Автоматически добавляется время создания сущности
    }
);

export default mongoose.model("User", UserSchema);
