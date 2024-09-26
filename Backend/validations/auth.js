//? There is valid auth of user
import { body } from "express-validator";

export const registerValidation = [
    body("email", "Неверный формат почты").isEmail(), //? is the field email isEmail
    body(
        "password",
        "Пароль должен содержать по меньшей мере 6 символов"
    ).isLength({ min: 6 }),
    body("fullName", "Укажите имя").isLength({ min: 2 }),
    body("avatarUrl", "Неверная ссылка на аватар").optional().isURL(),
];
