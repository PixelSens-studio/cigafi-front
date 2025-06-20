import express from "express";
import * as mainController from "../controllers/mainPages.controller.js";

const router = express.Router();

router.get('/', mainController.homeGet);
router.get("/a-louer/:category?", mainController.locationsGet); 
router.get("/a-vendre/:category?", mainController.getAllAnnoncesVentes); 
router.get('/nos-services', mainController.servicesGet);
router.get('/ressources', mainController.ressourcesGet); 
router.get('/a-propos', mainController.aboutGet);
router.get('/sign-in', mainController.signInGet);
router.get('/sign-up', mainController.signUpGet);
router.get('/a-louer/annonces/:slug', mainController.locationsByIdGet); 
router.get('/a-vendre/annonces/:slug', mainController.annonceVenteByIdGet); 
router.get('/requete', mainController.requeteGet);
router.get('/reservation-info', mainController.reservationInfoGet);
router.get('/ressource-details', mainController.ressourceDetailsGet);
router.get('/reservation-pay', mainController.reservationPayGet);

router.get('/admin', (req, res) => {
  res.redirect('/admin/dashboard');
});


export default router;
