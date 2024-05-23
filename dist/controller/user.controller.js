"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logIn = exports.signUp = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
// user sigm up
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // passing req to express validator middleware for validation
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password } = req.body;
        // check if user already present in our db
        const checkUser = yield user_model_1.default.findOne({ email: email });
        if (checkUser) {
            return res.status(409).json({ message: "User with this mail already exist, try differnt mail." });
        }
        // hashing password before creating account
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield user_model_1.default.create({
            name,
            email,
            password: hashedPassword,
        });
        const newUser = {
            name: user.name,
            email: user.email
        };
        return res.status(201).json({ message: "Signed up successfully!", newUser });
    }
    catch (error) {
        console.log('error in sign-up endpoint', error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.signUp = signUp;
// log in
const logIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        const user = yield user_model_1.default.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ message: "Email is incorrect" });
        }
        // comparing hashed password with original password using bcrypt
        const checkPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!checkPassword) {
            return res.status(401).json({ message: "Wrong password" });
        }
        // creating jwt token for logged in user
        const token = yield jsonwebtoken_1.default.sign({ _id: user.id }, 'jwtkeyexample', { expiresIn: '1h' });
        return res.status(200).json({ message: "Logged in successfully", token });
    }
    catch (error) {
        console.log('error in log-in endpoint', error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.logIn = logIn;
