"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const express_validator_1 = require("express-validator");
exports.userValidation = [
    (0, express_validator_1.body)('name').isString().notEmpty().withMessage("Name must be non-empty string"),
    (0, express_validator_1.body)('email').isString().notEmpty().withMessage("Email must be non empty string"),
    (0, express_validator_1.body)('password').isString().notEmpty().withMessage("Password should be non-empty string"),
];
