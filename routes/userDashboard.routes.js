const express = require("express");
const router = express.Router();
const { reservationsGet, favorisGet } = require("../controllers/userDashboard.controller");
const auth = require("../utils/auth");

//
router.route('/reservations').get(reservationsGet);
router.route('/favoris').get(favorisGet);
//router.route('/parametres').get(auth, parametresGet);
//router.route('/mes-projets').get(auth, mesProjetsGet);
//router.route('/ressources').get(auth, ressourcesGet);
//
//
module.exports = router;