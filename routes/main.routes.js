const express = require('express');
const router = express.Router();
const { homeGet,
    servicesGet,
    ressourcesGet,
    aboutGet,
    loginGet,
    detailsProprieteGet,
    requeteGet,
    reservationInfoGet,
    reservationPayGet,
    ressourceDetailsGet
} = require('../controllers/mainPages.controller');

/* GET home page. */
router.get('/', homeGet);
/* GET home page. */
router.get('/home', homeGet);
router.get('/nos-services', servicesGet);
router.get('/ressources', ressourcesGet);
router.get('/a-propos', aboutGet);
router.get('/login', loginGet);
router.get('/details-propriete', detailsProprieteGet);
router.get('/requete', requeteGet);
router.get('/ressource-details', ressourceDetailsGet);
router.get('/reservation-infos', reservationInfoGet);
router.get('/reservation-payment', reservationPayGet);


module.exports = router;
