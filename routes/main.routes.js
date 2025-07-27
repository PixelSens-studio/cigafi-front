import express from "express";
import * as mainController from "../controllers/mainPages.controller.js";
import auth from "../utils/auth.js";

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
router.get('/reservation/:propertyId', mainController.reservationGet);
router.get('/ressource-details', mainController.ressourceDetailsGet); 

router.get('/admin', (req, res) => {
  res.redirect('/admin/dashboard');
});

router.post('/fedapay/webhook', mainController.fedapayWebhook)


export default router;
