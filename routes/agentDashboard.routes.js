import express from "express";
import { 
  dashboardGet,
  parametresGet,
  mesProjetsGet,
  ressourcesGet 
} from "../controllers/agentDashboard.controller.js";

const router = express.Router();

router.route('/dashboard').get(dashboardGet);
router.route('/').get(dashboardGet);
//router.route('/parametres').get(auth, parametresGet);
//router.route('/mes-projets').get(auth, mesProjetsGet);
//router.route('/ressources').get(auth, ressourcesGet);

export default router;