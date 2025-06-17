import express from "express";
import { reservationsGet } from "../controllers/userDashboard.controller.js";
import auth from "../utils/auth.js";

const router = express.Router();

// Define routes
router.route('/reservations').get(auth, reservationsGet);

// Export the router using ES module syntax
export default router;
