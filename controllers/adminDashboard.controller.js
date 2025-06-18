const Backend_API = process.env.BACKEND_API_ROOT;

/**
 * Renders the admin dashboard page.
 * 
 * @param {Object} req - The request object, containing user data.
 * @param {Object} res - The response object used to render the view.
 */
export const dashboardGet = (req, res) => {
  const metadata = { 
    title: "Espace admin | CIGAFI",
    pageTitle: "Tableau de bord",
    pageSubtitle: "Bienvenue dans votre tableau de bord administrateur",
  };
  const userData = req.user || {};
  const user = userData ? userData.user : null;
  res.render('adminDashboard/dashboard', { metadata, user });
};


export const testform = (req, res) => {
  const userData = req.user || {};
  const user = userData ? userData.user : null;
  res.render('adminDashboard/form-test', { title: "Krypton - S'enrégistrer", user });
};



export const addNewPropertyGet = async (req, res) => {

    const metadata = { 
    title: "Espace admin | CIGAFI",
    pageTitle: "Création d'annonce",
    pageSubtitle: "Créez une nouvelle annonce",
  };


  const userData = req.user;
  const user = userData.user;
  console.log(user);

    const listingMetadata = {
      propertiesType: await fetch(`${Backend_API}/api/listing-metadata/type-de-biens`).then(res => res.json()),
      villes: await fetch(`${Backend_API}/api/listing-metadata/villes`).then(res => res.json()),
      quartiers: await fetch(`${Backend_API}/api/listing-metadata/quartiers`).then(res => res.json())
    };

  res.render('adminDashboard/addNewProperty', { title: "Krypton - S'enrégistrer", user, listingMetadata, metadata  });
};


export const addNewPropertyPost = async (req, res) => {
  try {
    const userData = req.user;
    const user = userData.user;

    // Check user status
    if (!user.status || user.status !== "active") {
      return res.status(403).json({ success: false, message: "Votre compte n'est pas actif. Veuillez contacter l'administrateur." });
    }

    const body = req.body;
    const mainImage = req.files?.mainImage?.[0]?.filename || body.mainImage || null;
    const otherImages = req.files?.otherImages?.map(f => f.filename) || body.otherImages || [];
    console.log(body)
    // Determine postedByModel
    let postedByModel = user.role === "superAdmin" ? "Admin" : user.role.charAt(0).toUpperCase() + user.role.slice(1);

    // Compose summary
    let summary = {};
    if (body.categorie_annonce === "habitations-bureaux") {
      summary = {
        propertyType: body.type_bien,
        thumbnail: mainImage,
        area: body.quartier,
        city: body.ville,
      };
      if (body.usage_type === "Appartement meublé") {
        summary.price = {
          daily: Number(body.prix_journalier) || 0,
          Monthly: Number(body.prix_mensuel) || 0
        };
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

    console.log("Financial:", financial);

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
      usageType: body.usage_type,
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
    const response = await fetch(`${Backend_API}/api/addlocations`, {
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
      message: result.message || "Propriété ajoutée avec succès"
    });

  } catch (err) {
    console.error('Error in addNewPropertyPost:', err);
    res.status(500).json({
      success: false,
      message: "Une erreur serveur s'est produite"
    });
  }
};

export const usersListGet = (req, res) => {
  // const userData = req.user;
  // const user = userData.user;
  const user = {
  firstName: 'kokoutse',
  lastName: 'nagbe',
  phone: '92035070',
  email: 'nagbekokoutse@gmail.comv'
};
  res.render('adminDashboard/users-list', { title: "Krypton - S'enrégistrer", user });
};


export const propertiesListGet = async (req, res) => {
    const metadata = { 
    title: "Espace admin | CIGAFI",
    pageTitle: "Liste des annonces",
    pageSubtitle: "Visualisez et gérez les annonces",
  };
  try {
    const userData = req.user;
    const user = userData.user;
    
    // Get query parameters with default values and type coercion
    const filters = {
      createdBy: String(req.query.createdBy || 'Admin'),
      state: String(req.query.state || 'active'),
      listingGroup: String(req.query.listingGroup || 'location'),
      page: Math.max(1, parseInt(req.query.page || '1', 10))
    };

    // Prepare request body
    const requestBody = {
      page: filters.page,
      filters: {
        createdBy: filters.createdBy,
        state: filters.state,
        listingGroup: filters.listingGroup
      }
    };

  
    // Fetch properties with filters
    const response = await fetch(`${Backend_API}/api/admin/liste-annonces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.cookies.token}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const {
      success,
      currentPage,
      totalPages,
      totalItems,
      listingGroup: responseListingGroup,
      state: responseState,
      createdBy: responseCreatedBy,
      data: properties
    } = await response.json();

    if (!success) {
      throw new Error('API request returned failure status');
    }


    // Render the view with all necessary data
    res.render('adminDashboard/properties-list', {
      metadata,
      user,
      properties,
      pagination: {
        currentPage,
        totalPages,
        totalItems
      },
      filters: {
        listingGroup: responseListingGroup,
        state: responseState,
        createdBy: responseCreatedBy
      },
      // Add current query parameters for maintaining state in the UI
      currentQuery: filters
     
    });

  } catch (error) { 
    res.status(500).render('error', {
      message: 'Une erreur est survenue lors du chargement des propriétés',
      error: {
        status: 500,
        stack: process.env.NODE_ENV === 'development' ? error.stack : ''
      }
    });
  }
};

export const reservationsListGet = (req, res) => {
  // const userData = req.user;
  // const user = userData.user;
  const user = {
  firstName: 'kokoutse',
  lastName: 'nagbe',
  phone: '92035070',
  email: 'nagbekokoutse@gmail.comv'
};
  res.render('adminDashboard/reservations', { title: "Krypton - S'enrégistrer", user });
};

export const contactMessagesListGet = (req, res) => {
  // const userData = req.user;
  // const user = userData.user;
  const user = {
  firstName: 'kokoutse',
  lastName: 'nagbe',
  phone: '92035070',
  email: 'nagbekokoutse@gmail.comv'
};
  res.render('adminDashboard/message-contact', { title: "Krypton - S'enrégistrer", user });
};


export const demndeRechercheListGet = (req, res) => {
  // const userData = req.user;
  // const user = userData.user;
  const user = {
  firstName: 'kokoutse',
  lastName: 'nagbe',
  phone: '92035070',
  email: 'nagbekokoutse@gmail.comv'
};
  res.render('adminDashboard/demande-recherche', { title: "Krypton - S'enrégistrer", user });
};

export const parametresGet = (req, res) => {
  // const userData = req.user;
  // const user = userData.user;
  const user = {
  firstName: 'kokoutse',
  lastName: 'nagbe',
  phone: '92035070',
  email: 'nagbekokoutse@gmail.comv'
};
  res.render('adminDashboard/parametres', { title: "Krypton - S'enrégistrer", user });
};


export const comptesAdminGet = (req, res) => {
  // const userData = req.user;
  // const user = userData.user;
  const user = {
  firstName: 'kokoutse',
  lastName: 'nagbe',
  phone: '92035070',
  email: 'nagbekokoutse@gmail.comv'
};
  res.render('adminDashboard/comptes-admins', { title: "Krypton - S'enrégistrer", user });
};

export const transactionsGet = (req, res) => {
  // const userData = req.user;
  // const user = userData.user;
  const user = {
  firstName: 'kokoutse',
  lastName: 'nagbe',
  phone: '92035070',
  email: 'nagbekokoutse@gmail.comv'
};
  res.render('adminDashboard/transactions', { title: "Krypton - S'enrégistrer", user });
};


export const userDetailsGet = (req, res) => {
  // const userData = req.user;
  // const user = userData.user;
  const user = {
  firstName: 'kokoutse',
  lastName: 'nagbe',
  phone: '92035070',
  email: 'nagbekokoutse@gmail.comv'
};
  res.render('adminDashboard/user-profile-details', { title: "Krypton - S'enrégistrer", user });
};

export const gestionBiensGet = (req, res) => {
  // const userData = req.user;
  // const user = userData.user;
  const user = {
  firstName: 'kokoutse',
  lastName: 'nagbe',
  phone: '92035070',
  email: 'nagbekokoutse@gmail.comv'
};
  res.render('adminDashboard/gestion-biens', { title: "Krypton - S'enrégistrer", user });
};



