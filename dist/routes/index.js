"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controller/user.controller");
const validator_1 = require("../middleware/validator");
const auth_1 = require("../middleware/auth");
const todo_comtroller_1 = require("../controller/todo.comtroller");
const router = (0, express_1.Router)();
// users sign-in/up routes
router.post('/user/sign-up', validator_1.userValidation, user_controller_1.signUp);
router.post('/user/log-in', validator_1.logInValidation, user_controller_1.logIn);
// todo related routes
router.post('/todo/create', auth_1.check, validator_1.todoValidator, todo_comtroller_1.createTodo);
exports.default = router;
