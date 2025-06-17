import express from "express";
import {
  signUpPost,
  registrationVerificationPost,
  signInPost,
  signout,
  registrationVerificationGet
} from "../controllers/userAuth.controller.js";

const router = express.Router();

router.post('/signup', signUpPost);
router.post('/registration-validation', registrationVerificationPost);
router.post('/signin', signInPost);
router.post('/signout', signout);
router.get('/registration-validation', registrationVerificationGet);

export default router;