import express from "express";
import { 
  signout, 
  signUpPost, 
  signInGet, 
  signInPost 
} from "../controllers/adminAuth.controller.js";

const router = express.Router();

router.post('/signup', signUpPost);
router.get('/signin', signInGet);
router.post('/signin', signInPost);
router.post('/signout', signout);

// router.get('/check-auth', checkUserAuth)

export default router;