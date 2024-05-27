import { Request, Response, Router } from "express";
import { logIn, signUp, tokenRefresh } from "../controller/user.controller";
import { logInValidation, todoValidator, userValidation } from "../middleware/validator";
import { check } from "../middleware/auth";
import { createTodo, deleteTodo, updateTodo } from "../controller/todo.comtroller";


const router = Router();

// jwt token refresh
router.post('/token', tokenRefresh);

// users sign-in/up routes
router.post('/user/sign-up', userValidation,signUp);
router.post('/user/log-in', logInValidation,logIn);

// todo related routes
router.post('/todo/create', check, todoValidator, createTodo);
router.put('/todo/mark-done/:id', check, updateTodo);
router.delete('/todo/delete/:id', check, deleteTodo);

export default router;