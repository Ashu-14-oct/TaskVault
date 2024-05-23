import { Router } from "express";
import { logIn, signUp } from "../controller/user.controller";
import { logInValidation, todoValidator, userValidation } from "../middleware/validator";
import { check } from "../middleware/auth";
import { createTodo, updateTodo } from "../controller/todo.comtroller";


const router = Router();

// users sign-in/up routes
router.post('/user/sign-up', userValidation,signUp);
router.post('/user/log-in', logInValidation,logIn);

// todo related routes
router.post('/todo/create', check, todoValidator, createTodo);
router.put('/todo/mark-done/:id', check, updateTodo);

export default router;