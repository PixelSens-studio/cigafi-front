import express from 'express'; 
import { nanoid } from 'nanoid';
import {FedaPay, Transaction} from 'fedapay'
const Backend_API = process.env.BACKEND_API_ROOT;


const generateBookingId = () => {
    const randomPart = nanoid(16); // Generates a 16-character unique string
    return `TXN_CGF-${randomPart.toUpperCase()}`; // Prefix + random part (uppercase for consistency)
};



export const reservationsGet = async (req, res) => {
    let bookings = [];
    let message = null; // For success messages like "No bookings found"
    let errorMessage = null; // For actual errors

    try {
        const userData = req.user;
        const user = userData.user;

        // Ensure status and userId filters are prepared for the API call
        const status = req.query.status || 'active'; // Default to 'active' if no status query param
        const userId = req.query.userId || user._id || user.id; // Use queried userId, or logged-in user's ID

        // --- Make the API call to your backend filter endpoint ---
        const apiResponse = await fetch(`${Backend_API}/api/get-bookings`, { // Ensure Backend_API is defined
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: status,
                userId: userId // Send the user ID for filtering
            })
        });
 
        if (!apiResponse.ok) { // Check for any non-2xx status code (including 404, 500 etc.)
            const errorData = await apiResponse.json().catch(() => ({})); // Try to parse error body
            
            // If it's a 404 and the message indicates "no bookings found", treat it as an empty result, not an error.
            // You'll need to know the exact message your backend sends for "no bookings found".
            if (apiResponse.status === 404 && errorData.message && errorData.message.includes('No bookings found')) {
                bookings = []; // Set bookings to empty array
                message = "Aucune réservation trouvée correspondant aux filtres.";
            } else {
                // For other errors (e.g., 500, 400 with different messages), treat as a true error
                errorMessage = `Erreur API: ${errorData.message || 'Erreur inconnue'}`;
                // Keep bookings as empty array in case of an actual error
            }
        } else {
            // If the response is OK (2xx), parse the successful data
            const data = await apiResponse.json();
            bookings = data.bookings || []; // Ensure bookings is an array, default to empty if not present
            console.log("Fetched bookings:", bookings);
            if (bookings.length === 0) {
                message = "Aucune réservation trouvée.";
            } else {
                message = "Réservations récupérées avec succès.";
            }
        }

        // --- Render the reservations page with fetched data (or empty array) ---
        res.render("userDashboard/reservations", {
            title: "CIGAFI - Mes Réservations",
            user,
            bookings,
            errorMessage, // Will be null if no error, or contain a message
            message,      // Will be null if error, or contain a success/info message
            currentStatus: status, // Ensure form fields are pre-filled
            currentUserId: req.query.userId || ''
        });

    } catch (error) {
        // This catch block handles network errors or errors thrown from the above logic
        console.error("Erreur dans reservationsGet (BFF):", error);
        res.status(500).render("userDashboard/reservations", {
            title: "CIGAFI - Mes Réservations",
            errorMessage: `Une erreur interne est survenue: ${error.message}.`,
            user: req.user ? req.user.user : null, // Pass user data even on error
            bookings: [], // No bookings in case of severe error
            message: null,
            currentStatus: req.query.status || '',
            currentUserId: req.query.userId || ''
        });
    }
};

  

export const addReservationsPost = async (req, res) => {
    // Helper function to format date in French (e.g., "1er Août 2025")
    const formatFrenchDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const year = date.getFullYear();
        const monthNames = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
        const month = monthNames[date.getMonth()];
        // Use "1er" for the 1st day, otherwise just the number
        const formattedDay = day === 1 ? '1er' : day;
        return `${formattedDay} ${month} ${year}`;
    };

    try {
        const body = req.body;  
        const userData = req.user;
        const user = userData.user;

        const {
            arrivalDate,
            departureDate,
            firstName,
            lastName,
            phone,
            email,
            address,
            cartTotal,
            propertyId,
            listingOwner,
            listingOwnerModel,
            listingTitle,
            mobileMoneyNumber,
            mobileMoneyService
        } = body;

        const bookingId = generateBookingId();

        // Determine countryCode based on mobileMoneyService
        let countryCode;
        switch (mobileMoneyService) {
            case 'togocel':
            case 'moov_tg':
                countryCode = 'TG';
                break;
            case 'sbin':
            case 'moov':
            case 'mtn_open':
                countryCode = 'BJ';
                break;
            case 'mtn_ci':
                countryCode = 'CI';
                break;
            case 'airtel_ne':
                countryCode = 'NE';
                break;
            case 'free_sn':
                countryCode = 'SN';
                break;
            case 'mtn_open_gn':
                countryCode = 'GN';
                break;
            default:
                countryCode = 'TG'; // Default to TG if service is unknown
        }

        FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY);  
        FedaPay.setEnvironment('live'); 

        let transaction;
        try {
            transaction = await Transaction.create({
                description: `Réservation de ${firstName} ${lastName} - ${listingTitle} du ${formatFrenchDate(arrivalDate)} au ${formatFrenchDate(departureDate)}`,
                amount: parseInt(cartTotal),  
                currency: { iso: 'XOF' },  
                customer: {
                    firstname: firstName,
                    lastname: lastName,
                    email: email,
                    phone_number: {
                        number: mobileMoneyNumber,  
                        country: countryCode 
                    }
                },
                metadata: {
                    booking_id: bookingId,  
                    user_id: user._id.toString(), 
                    property_id: propertyId.toString(),
                    listing_owner_id: listingOwner.toString(),
                    mobile_money_service: mobileMoneyService,
                    customer_email: email, 
                    customer_phone: phone,
                    customer_adress: address
                }
            });
        } catch (fedapayError) {
            console.error('FedaPay Transaction Creation Error:', fedapayError);
            throw new Error(fedapayError.message || 'FedaPay transaction creation failed');
        }

        const token = transaction.payment_token; 
        if (!token) {
            throw new Error('Aucun payment_token retourné par la transaction');
        }

        const mode = mobileMoneyService;
        const phone_number = mobileMoneyNumber ? {
            number: mobileMoneyNumber,
            country: countryCode
        } : null; 
        await transaction.sendNowWithToken(mode, token, phone_number);
        const updatedTransaction = await Transaction.retrieve(transaction.id);

        console.log(updatedTransaction)
        if (updatedTransaction.status === 'approved') { 
            const bookingData = {
                bookedBy: user._id.toString(),
                firstName,
                lastName,
                listingOwner: listingOwner.toString(),
                listingOwnerModel: listingOwnerModel,
                property: propertyId.toString(),
                arrivalDate,
                departureDate,
                amount: parseInt(cartTotal),
                transaction: transaction.id.toString(),
                status: 'active',
                cancellation: {
                    requested: false
                }
            };

            // Call the /api/bookings endpoint using fetch
            try {
                const bookingResponse = await fetch(`${Backend_API}/api/bookings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Add authorization header if required, e.g., 'Authorization': `Bearer ${req.user.token}`
                    },
                    body: JSON.stringify({ bookingData })
                });

                const bookingDataResponse = await bookingResponse.json();

                if (bookingResponse.status !== 201 || !bookingDataResponse.success) {
                    throw new Error('Failed to create booking in /api/bookings');
                }

                return res.status(200).json({
                    success: true,
                    message: 'Paiement et réservation effectués avec succès',
                    booking: bookingDataResponse.booking
                });
            } catch (bookingError) {
                console.error('Error calling /api/bookings:', bookingError);
                throw new Error('Failed to save booking after successful payment');
            }
        } else {
            // Transaction non approuvée
            return res.status(400).json({
                success: false,
                message: `Échec du paiement. Statut: ${updatedTransaction.status}`
            });
        }
    } catch (error) {
        console.error('Erreur lors du traitement de la réservation:', error);
        return res.status(500).json({
            success: false,
            message: 'Une erreur est survenue lors du traitement de la réservation',
            error: error.message
        });
    }
};





export const annoncesGet = async (req, res) => {
  try {
    const userData = req.user;
    const user = userData.user;
    
    res.render("userDashboard/annonces", {   
      user 
    });
  } catch (error) {
    console.error("Error in reservationsGet:", error);
    res.status(500).render("userDashboard/reservations", {
      title: "Krypton - S'enrégistrer",
      errorMessage: "Une erreur interne est survenue. Merci de réessayer.",
      user: null,
    });
  }
};



export const favorisGet = async (req, res) => {
  try {
    const userData = req.user;
    const user = userData.user;
    
    res.render("userDashboard/favoris", { 
      title: "Krypton - S'enrégistrer", 
      errorMessage: "Erreur serveur, merci de réessayer", 
      user 
    });
  } catch (error) {
    console.error("Error in reservationsGet:", error);
    res.status(500).render("userDashboard/reservations", {
      title: "Krypton - S'enrégistrer",
      errorMessage: "Une erreur interne est survenue. Merci de réessayer.",
      user: null,
    });
  }
};

export const gestionBiensGet = async (req, res) => {
  try {
    const userData = req.user;
    const user = userData.user;
    
    res.render("userDashboard/gestion-biens", { 
      title: "Krypton - S'enrégistrer", 
      errorMessage: "Erreur serveur, merci de réessayer", 
      user 
    });
  } catch (error) {
    console.error("Error in reservationsGet:", error);
    res.status(500).render("userDashboard/reservations", {
      title: "Krypton - S'enrégistrer",
      errorMessage: "Une erreur interne est survenue. Merci de réessayer.",
      user: null,
    });
  }
};

export const addNewLocationGet = async (req, res) => {
  try {
    const userData = req.user;
    const user = userData.user; 
    console.log(user)
    const listingMetadata = {
      propertiesTypeMeuble: await fetch(`${Backend_API}/api/listing-metadata/type-de-biens-meuble`).then(res => res.json()),
      propertiesTypeHabitation: await fetch(`${Backend_API}/api/listing-metadata/type-de-biens-habitation`).then(res => res.json()),
      villes: await fetch(`${Backend_API}/api/listing-metadata/villes`).then(res => res.json()),
      quartiers: await fetch(`${Backend_API}/api/listing-metadata/quartiers`).then(res => res.json())
    };
    console.log("Listing Metadata:", listingMetadata);

    res.render("userDashboard/add-new-location", {user, 
      listingMetadata
    });

  } catch (error) {
    console.error("Error in reservationsGet:", error);
    res.status(500).render("userDashboard/reservations", {
      title: "Krypton - S'enrégistrer",
      errorMessage: "Une erreur interne est survenue. Merci de réessayer.",
      user: null,
    });
  }
};



export const addNewLocationPost = async (req, res) => {
  try {
    const userData = req.user;
    const user = userData.user;
 const body = req.body;
 console.log("Request body:", body); 
     // Check user status
    if (!user.listingApproval) {
      return res.status(403).json({ success: false, message: "Votre compte n'est pas actif. Veuillez contacter l'administrateur." });
    }
  
    const mainImage = req.files?.mainImage?.[0]?.filename || body.mainImage || null;
    const otherImages = req.files?.otherImages?.map(f => f.filename) || body.otherImages || [];

    // Determine postedByModel
    let postedByModel = body.user_role === "superAdmin" ? "Admin" : user.role.charAt(0).toUpperCase() + user.role.slice(1);

    // Compose summary
    let summary = {};

    if (body.categorie_annonce === "habitations-bureaux") {
      summary = {
        propertyType: body.usage_type === 'Habitation' || body.usage_type === 'Bureaux ou Magasin' ? body.type_bien_habitations : body.type_bien_meuble,
        thumbnail: mainImage,
        area: body.quartier,
        city: body.ville,
      };
      if (body.usage_type === "Appartement meublé") {
        summary.price = Number(body.prix_journalier)
        summary.hostName = body.hostName;
      } else {
        summary.price = Number(body.loyer_mensuel) || 0;
      }
    } else if (
      body.categorie_annonce === "terrains-ruraux" ||
      body.categorie_annonce === "terrains-urbain"
    ) {
      summary = {
        thumbnail: mainImage,
        area: body.quartier,
        city: body.ville,
        surface: body.caracteristique_superficie,
        price: Number(body.prix_terrain) || 0
      };
    }

    let usageType;

    if (body.categorie_annonce === "habitations-bureaux") {
      usageType = body.usage_type;
    } else if (
      body.categorie_annonce === "terrains-ruraux" ||
      body.categorie_annonce === "terrains-urbain"
    ) {
      usageType = body.caracteristique_type_usage;
    }

    // Compose characteristics
    let characteristics = [];
    if (body.categorie_annonce === "habitations-bureaux") {
      characteristics = [
        { nom: "Salon", valeur: body.caracteristique_salon },
        { nom: "Chambres", valeur: body.caracteristique_chambres },
        { nom: "Cuisine", valeur: body.caracteristique_cuisine },
        { nom: "Salle de bain", valeur: body.caracteristique_salle_de_bain },
        { nom: "Dépendances", valeur: body.caracteristique_dependance }
      ].filter(c => c.valeur);
    } else if (
      body.categorie_annonce === "terrains-ruraux" ||
      body.categorie_annonce === "terrains-urbain"
    ) {
      characteristics = [
        { nom: "Superficie", valeur: body.caracteristique_superficie },
        { nom: "Type d’usage", valeur: body.caracteristique_type_usage },
        { nom: "Document", valeur: body.caracteristique_document },
        { nom: "Cloture", valeur: body.caracteristique_cloture },
        { nom: "Accès", valeur: body.caracteristique_acces }
      ].filter(c => c.valeur);
    }

    // Compose financial
    let financial = undefined;
    if (body.categorie_annonce === "habitations-bureaux") {
      if (
        body.usage_type === "Bureaux ou Magasin" ||
        body.usage_type === "Habitation"
      ) {
        financial = {
          deposit: Number(body.avance) || 0,
          caution: Number(body.caution) || 0
        };
      } else if (body.usage_type === "Appartement meublé") {
        financial = {
          caution: Number(body.caution_meuble) || 0
        };
      }
    }

    // Compose rules
    let rules = undefined;
    if (body.categorie_annonce === "habitations-bureaux") {
      rules = Array.isArray(body.regle_propriete)
        ? body.regle_propriete.filter(Boolean)
        : (body.regle_propriete ? [body.regle_propriete] : []);
    }

    // Compose amenities
    let amenities = Array.isArray(body.amenities)
      ? body.amenities.filter(Boolean)
      : (body.amenities ? [body.amenities] : []);

    // Compose media
    let media = {
      photos: Array.isArray(otherImages)
        ? otherImages.filter(Boolean)
        : (otherImages ? [otherImages] : [])
    };

    // Build payload
    const payload = {
      listingCategory: body.categorie_annonce,
      usageType,
      summary,
      locationText: body.description_emplacement,
      description: body.description_bien,
      characteristics,
      amenities,
      media,
      postedBy: user._id,
      postedByModel,
    };

    if (financial) payload.financial = financial;
    if (rules) payload.rules = rules;

    // Make API call to backend
    const response = await fetch(`${Backend_API}/api/create-annonce-location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log("Font from server", result);

    if (!response.ok) {
      console.log('Error response from backend:', result);
      return res.status(response.status).json({
        success: false,
        message: result.message || "Une erreur s'est produite lors de l'ajout de la propriété"
      });
    }

    res.status(200).json({
      success: true,
      message: result.message || "Propriété ajoutée avec succès"
    });

  } catch (err) {
    console.error('Error in addNewLocationPost:', err);
    res.status(500).json({
      success: false,
      message: "Une erreur serveur s'est produite"
    });
  }
};






export const addNewVenteGet = async (req, res) => {
  try {
    const userData = req.user;
    const user = userData.user;

    const listingMetadata = {
      propertiesType: await fetch(`${Backend_API}/api/listing-metadata/type-de-biens-vente`).then(res => res.json()),
      villes: await fetch(`${Backend_API}/api/listing-metadata/villes`).then(res => res.json()),
      quartiers: await fetch(`${Backend_API}/api/listing-metadata/quartiers`).then(res => res.json())
    };

    console.log(user)
    
    res.render("userDashboard/add-new-vente", {user,
      listingMetadata
    });
  } catch (error) {
    console.error("Error in reservationsGet:", error);
    res.status(500).render("userDashboard/reservations", {
      title: "Krypton - S'enrégistrer",
      errorMessage: "Une erreur interne est survenue. Merci de réessayer.",
      user: null,
    });
  }
};

export const addNewVentePost = async (req, res) => {
  try {
    const userData = req.user;
    const user = userData.user;

    // Check user status
    if (!user.listingApproval) {
      return res.status(403).json({ success: false, message: "Votre compte n'est pas actif. Veuillez contacter l'administrateur." });
    }

    const body = req.body;
    const mainImage = req.files?.mainImage?.[0]?.filename || body.mainImage || null;
    const otherImages = req.files?.otherImages?.map(f => f.filename) || body.otherImages || [];
   
    // Determine postedByModel
    let postedByModel = "User"

    // Compose summary
    let summary = {
      thumbnail: mainImage,
      city: body.ville,
      price: Number(body.prix) || 0
    }; 
    if (body.ville === 'Lomé') {
      summary.area = body.quartier;
    } 

    if (body.categorie_annonce === "Terrain rural" || body.categorie_annonce === "Terrain urbain") {
      summary.surface = body.caracteristique_superficie; 
    }


    if (body.categorie_annonce === "Villas et autres constructions") {
  summary.propertyType = body.type_bien; // Use = for assignment
} else if (body.categorie_annonce === "Terrain rural" ||
  body.categorie_annonce === "Terrain urbain") {
  summary.propertyType = body.caracteristique_type_usage
}

    // Compose characteristics
    let characteristics = [];
    if (body.categorie_annonce === "Villas et autres constructions") {
      characteristics = [
        { nom: "Salon", valeur: body.caracteristique_salon },
        { nom: "Chambres", valeur: body.caracteristique_chambres },
        { nom: "Cuisine", valeur: body.caracteristique_cuisine },
        { nom: "Salle de bain", valeur: body.caracteristique_salle_de_bain },
        { nom: "Dépendances", valeur: body.caracteristique_dependance }
      ].filter(c => c.valeur);
    } else if (
      body.categorie_annonce === "Terrain rural" ||
      body.categorie_annonce === "Terrain urbain"
    ) {
      characteristics = [
        { nom: "Superficie", valeur: body.caracteristique_superficie },
        { nom: "Type d’usage", valeur: body.caracteristique_type_usage },
        { nom: "Document", valeur: body.caracteristique_document },
        { nom: "Cloture", valeur: body.caracteristique_cloture },
        { nom: "Accès", valeur: body.caracteristique_acces }
      ].filter(c => c.valeur);
    }


    // Compose amenities
    let amenities = Array.isArray(body.amenities)
      ? body.amenities.filter(Boolean)
      : (body.amenities ? [body.amenities] : []);

    // Compose media
    let media = {
      photos: Array.isArray(otherImages)
        ? otherImages.filter(Boolean)
        : (otherImages ? [otherImages] : [])
    };

    // Build payload
    const payload = {
      listingCategory: body.categorie_annonce, 
      summary,
      locationText: body.description_emplacement,
      description: body.description_bien,
      characteristics,
      amenities,
      media,
      postedBy: user._id,
      postedByModel,
    };
 

    // Make API call to backend
    const response = await fetch(`${Backend_API}/api/create-annonce-vente`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: result.message || "Une erreur s'est produite lors de l'ajout de la propriété"
      });
    }

    res.status(200).json({
      success: true,
      message: result.message || "Annonce crée avec succès"
    });

  } catch (err) {
    console.error('Error in addNewLocationPost:', err);
    res.status(500).json({
      success: false,
      message: "Une erreur serveur s'est produite"
    });
  }
};

export const parametresGet = async (req, res) => {
  try {
    const userData = req.user;
    const user = userData.user;
    
    res.render("userDashboard/parametres", { 
      title: "Krypton - S'enrégistrer", 
      errorMessage: "Erreur serveur, merci de réessayer", 
      user 
    });
  } catch (error) {
    console.error("Error in reservationsGet:", error);
    res.status(500).render("userDashboard/reservations", {
      title: "Krypton - S'enrégistrer",
      errorMessage: "Une erreur interne est survenue. Merci de réessayer.",
      user: null,
    });
  }
};



export const paymentTest = async (req, res) => {
  try {
    const response = await fetch('https://api.fedapay.com/v1/transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FEDAPAY_SECRET_KEY}`, // Ensure FEDAPAY_SECRET_KEY is loaded
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "description": "Test Transaction Direct Link",
        "amount": 900,
        "mode": "moov_tg",
        "callback_url": "https://maplateforme.com/callback",
        "currency": {
          "iso": "XOF"
        },
        "customer": {
          "firstname": "John",
          "lastname": "Doe",
          "email": "john.doe@example.com",
          "phone_number": {
            "number": "92035070",
            "country": "tg"
          }
        }
      }),
    });

    const data = await response.json();
    console.log("FedaPay Create Transaction Response Data:", data);

    if (!response.ok) {
      console.error('FedaPay API Error during transaction creation:', data);
      throw new Error(data.message || (data.errors ? JSON.stringify(data.errors) : 'Failed to create transaction'));
    }

    // ⭐ CORRECT WAY TO RETRIEVE THE LINK AND ID
    const transactionData = data['v1/transaction']; // Access the nested object

    if (!transactionData) {
      throw new Error('Transaction data not found in FedaPay response under "v1/transaction" key.');
    }

    const paymentLink = transactionData.payment_url;
    const transactionId = transactionData.id;

    if (!paymentLink) {
      throw new Error('Payment link (payment_url) not found in FedaPay response.');
    }

    res.status(200).json({
      success: true,
      message: 'Test transaction created successfully, payment link provided directly.',
      paymentLink: paymentLink,
      transactionId: transactionId,
      fedapayResponse: data // Keep full response for debugging if needed
    });

  } catch (error) {
    console.error('Error creating test transaction:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create test transaction',
      error: error.message,
    });
  }
};

