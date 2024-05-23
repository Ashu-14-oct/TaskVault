"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoValidator = exports.logInValidation = exports.userValidation = void 0;
const express_validator_1 = require("express-validator");
exports.userValidation = [
    (0, express_validator_1.body)('name').isString().notEmpty().withMessage("Name must be non-empty string"),
    (0, express_validator_1.body)('email').isString().notEmpty().withMessage("Email must be non empty string"),
    (0, express_validator_1.body)('password').isString().notEmpty().withMessage("Password should be non-empty string"),
];
exports.logInValidation = [
    (0, express_validator_1.body)('email').isString().notEmpty().withMessage("Email must be non empty string"),
    (0, express_validator_1.body)('password').isString().notEmpty().withMessage("Password should be non-empty string"),
];
exports.todoValidator = [
    (0, express_validator_1.body)('title').isString().notEmpty().withMessage("Email must be non empty string"),
    (0, express_validator_1.body)('description').isString().notEmpty().withMessage("Password should be non-empty string"),
];
