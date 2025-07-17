import express from "express";
import { addNewLocationGet, addNewVenteGet, annoncesGet, favorisGet, gestionBiensGet, parametresGet, reservationsGet } from "../controllers/userDashboard.controller.js";
import auth from "../utils/auth.js";

const router = express.Router();

// Define routes
router.route('/reservations').get(auth, reservationsGet);
router.route('/annonces').get(auth, annoncesGet);
router.route('/favoris').get(auth, favorisGet);
router.route('/gestion-de-biens').get(auth, gestionBiensGet);
router.route('/add-new-location').get(auth, addNewLocationGet);
router.route('/add-new-vente').get(auth, addNewVenteGet);
router.route('/parametres').get(auth, parametresGet);

// Export the router using ES module syntax
export default router;
