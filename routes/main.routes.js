import express from "express";
import * as mainController from "../controllers/mainPages.controller.js";

const router = express.Router();

router.get('/', mainController.homeGet);
router.get("/locations/:category?", mainController.locationsGet); 
router.get('/services', mainController.servicesGet);
router.get('/ressources', mainController.ressourcesGet); 
router.get('/a-propos', mainController.aboutGet);
router.get('/sign-in', mainController.signInGet);
router.get('/sign-up', mainController.signUpGet);
router.get('/locations/annonces/:slug', mainController.locationsByIdGet); 
router.get('/requete', mainController.requeteGet);
router.get('/reservation-info', mainController.reservationInfoGet);
router.get('/ressource-details', mainController.ressourceDetailsGet);
router.get('/reservation-pay', mainController.reservationPayGet);

export default router;
