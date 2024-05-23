import { Router } from "express";
import { logIn, signUp } from "../controller/user.controller";
import { logInValidation, userValidation } from "../middleware/validator";


const router = Router();

router.post('/user/sign-up', userValidation,signUp);
router.post('/user/log-in', logInValidation,logIn);

export default router;