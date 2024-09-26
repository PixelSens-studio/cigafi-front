const express = require("express");
const { dashboardGet } = require("../controllers/agentDashboard.controller");
const router = express.Router();



//
router.route('/dashboard').get(dashboardGet);
//router.route('/parametres').get(auth, parametresGet);
//router.route('/mes-projets').get(auth, mesProjetsGet);
//router.route('/ressources').get(auth, ressourcesGet);
//
//
module.exports = router;