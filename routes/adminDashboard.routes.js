import express from "express"; 
import multer from 'multer';
import path from 'path';
import * as adminDashboardController from "../controllers/adminDashboard.controller.js";
import authAdmin from "../utils/authAdmin.js";

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets/media/uploads');
  },
  filename: function (req, file, cb) {
    // Create unique ID for the image
    const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    
    // Set filename based on whether it's the main image or other images
    const filename = file.fieldname === 'mainImage' 
      ? `cover-${uniqueId}${ext}`
      : `${uniqueId}${ext}`;
      
    cb(null, filename);
  }
});
const upload = multer({ storage });

const router = express.Router();


router.post(
  '/add-new-property',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'otherImages', maxCount: 9 }
  ]), authAdmin,
  adminDashboardController.addNewPropertyPost
);

router.get('/dashboard', authAdmin, adminDashboardController.dashboardGet); 
router.get('/add-new-property', authAdmin, adminDashboardController.addNewPropertyGet); 

router.get('/utilisateurs', authAdmin, adminDashboardController.usersListGet);
router.get('/details-utilisateurs', authAdmin, adminDashboardController.userDetailsGet);
router.get('/liste-annonces', authAdmin, (req, res, next) => {
  // Define allowed query parameters and their values
  const allowedFilters = {
    createdBy: ['Admin', 'User'],
    state: ['active', 'pending', 'archived'],
    listingGroup: ['location', 'vente']
  };

  // Get query parameters
  const { createdBy, state, listingGroup, page } = req.query;

  // Validate query parameters if present
  try {
    if (createdBy && !allowedFilters.createdBy.includes(createdBy)) {
      throw new Error('Invalid createdBy parameter');
    }

    if (state && !allowedFilters.state.includes(state)) {
      throw new Error('Invalid state parameter');
    }

    if (listingGroup && !allowedFilters.listingGroup.includes(listingGroup)) {
      throw new Error('Invalid listingGroup parameter');
    }

    if (page && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
      throw new Error('Invalid page number');
    }

    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}, adminDashboardController.propertiesListGet);
router.get('/reservations', authAdmin, adminDashboardController.reservationsListGet);
router.get('/messagess-contact', authAdmin, adminDashboardController.contactMessagesListGet);
router.get('/demande-recherche', authAdmin, adminDashboardController.demndeRechercheListGet);
router.get('/parametres', authAdmin, adminDashboardController.parametresGet);
router.get('/comptes-admins', authAdmin, adminDashboardController.comptesAdminGet);
router.get('/transactions', authAdmin, adminDashboardController.transactionsGet);
router.get('/gestion-biens', authAdmin, adminDashboardController.gestionBiensGet);
// router.get('/reservations', auth, adminDashboardController.reservationsGet);
// router.get('/users', auth, adminDashboardController.usersGet);
// router.get('/transactions', auth, adminDashboardController.transactionsGet);
// router.get('/user-details', auth, adminDashboardController.userDetailsGet);
// router.get('/projet-details', auth, adminDashboardController.userDetailsProjectGet);

export default router;