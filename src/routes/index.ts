import { Router } from "express";
import { signUp } from "../controller/user.controller";
import { userValidation } from "../middleware/validator";


const router = Router();

router.post('/user/sign-up', userValidation,signUp);

export default router;