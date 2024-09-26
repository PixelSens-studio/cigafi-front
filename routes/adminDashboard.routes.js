const express = require("express");
const {
   reservationsGet,
   dashboardGet,

} = require("../controllers/adminDashboard.controller");

const router = express.Router();




router.get('/dashboard', dashboardGet);

module.exports = router;