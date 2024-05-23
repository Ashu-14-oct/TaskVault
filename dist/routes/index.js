"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controller/user.controller");
const validator_1 = require("../middleware/validator");
const router = (0, express_1.Router)();
router.post('/user/sign-up', validator_1.userValidation, user_controller_1.signUp);
router.post('/user/log-in', user_controller_1.logIn);
exports.default = router;
