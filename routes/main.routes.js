const express = require('express');
const router = express.Router();
const { decors, getAllRessources, getProductions, detailsRessourcesArticles, detailsRessourcesVideos, entreprise,
    entreprises, homeGet
} = require('../controllers/mainPages.controller');

/* GET home page. */
router.get('/', homeGet);
/* GET home page. */
router.get('/home', homeGet);


module.exports = router;
