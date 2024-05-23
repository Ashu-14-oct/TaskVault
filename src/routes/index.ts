import { Router } from "express";
import { logIn, signUp } from "../controller/user.controller";
import { logInValidation, userValidation } from "../middleware/validator";


const router = Router();

// users sign-in/up routes
router.post('/user/sign-up', userValidation,signUp);
router.post('/user/log-in', logInValidation,logIn);

// todo related routes
router.post('/todo/create', );

export default router;