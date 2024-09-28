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

export const loginValidation = [
    body("email", "Неверный формат почты").isEmail(), //? is the field email isEmail
    body(
        "password",
        "Пароль должен содержать по меньшей мере 6 символов"
    ).isLength({ min: 6 }),
];

export const postCreateValidation = [
    body("title", "Введите заголовок статьи").isLength({ min: 3 }).isString(),
    body("text", "Введите текст статьи").isLength({ min: 5 }),
    body("tags", "Неверный формат тегов (введите массив данных)")
        .optional()
        .isArray(),
    body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
];
