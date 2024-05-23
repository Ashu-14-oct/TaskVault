import { body } from "express-validator";

export const userValidation = [
    body('name').isString().notEmpty().withMessage("Name must be non-empty string"),
    body('email').isString().notEmpty().withMessage("Email must be non empty string"),
    body('password').isString().notEmpty().withMessage("Password should be non-empty string"),
];

export const logInValidation = [
    body('email').isString().notEmpty().withMessage("Email must be non empty string"),
    body('password').isString().notEmpty().withMessage("Password should be non-empty string"),
]