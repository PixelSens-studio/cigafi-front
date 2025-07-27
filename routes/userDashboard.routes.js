import express from "express";
import multer from 'multer';
import path from 'path';
import { addNewLocationGet, addNewLocationPost, addNewVenteGet, addNewVentePost, addReservationsPost, annoncesGet, favorisGet, gestionBiensGet, parametresGet, paymentTest, reservationsGet } from "../controllers/userDashboard.controller.js";
import auth from "../utils/auth.js";
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

// Define routes
router.route('/reservations').get(auth, reservationsGet);
router.route('/reservation').post(auth, addReservationsPost);
router.route('/annonces').get(auth, annoncesGet);
router.route('/favoris').get(auth, favorisGet);
router.route('/gestion-de-biens').get(auth, gestionBiensGet);
router.route('/add-new-location').get(auth, addNewLocationGet);

router.post('/add-new-location',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'otherImages', maxCount: 9 }
  ]), auth, addNewLocationPost
);



router.post('/add-new-vente',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'otherImages', maxCount: 9 }
  ]), auth, addNewVentePost
);


router.route('/add-new-vente').get(auth, addNewVenteGet); 

router.route('/parametres').get(auth, parametresGet);

router.route('/payment-test').post(paymentTest)


// Export the router using ES module syntax
export default router;
