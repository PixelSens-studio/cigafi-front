import dotenv from 'dotenv';

dotenv.config();
const Backend_API = process.env.BACKEND_API_ROOT;

export const homeGet = async (req, res) => { 
  const listingCategory = "habitations-bureaux";
  const page = parseInt(req.query.page) || 1;
  const listingType = "/a-louer/annonces";

  // Extract filter data with defaults
  const filters = {
    type: req.query.type || "All",
    ville: req.query.ville || "All",
    quartier: req.query.quartier || "All",
    minBudget: parseInt(req.query.minBudget) || 0,
    maxBudget: req.query.maxBudget ? parseInt(req.query.maxBudget) : null,
    publicationDate: req.query.publicationDate || "All"
  }; 

  // Get the base URL without query parameters
  const baseUrl = `/a-louer/${listingCategory}`;
  
  // Create URLSearchParams from current query
  const searchParams = new URLSearchParams(req.query);
  // Remove page parameter if it exists
  searchParams.delete('page');
  // Get the query string
  const queryString = searchParams.toString();

  try {
    const response = await fetch(`${Backend_API}/api/locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        listingCategory,
        page,
        filters
      })
    });

    const result = await response.json();
    const properties = result?.data || [];
    const currentPage = result?.currentPage || 1;
    const totalPages = result?.totalPages || 1;

    // Fetch metadata
    const [propertiesType, villes, quartiers] = await Promise.all([
      fetch(`${Backend_API}/api/listing-metadata/type-de-biens`).then(res => res.json()),
      fetch(`${Backend_API}/api/listing-metadata/villes`).then(res => res.json()),
      fetch(`${Backend_API}/api/listing-metadata/quartiers`).then(res => res.json())
    ]);

    res.render('mainPages/index', {
      title: "CIGAFI - Nos productions",
      properties,
      listingCategory,
      baseUrl,
      searchParams: searchParams.toString(),
      currentPage,
      totalPages,
      listingType,
      listingMetadata: {
        propertiesType,
        villes,
        quartiers
      },
      // Pass the selected values
      selectedType: filters.type,
      selectedVille: filters.ville,
      selectedQuartier: filters.quartier,
      minBudget: filters.minBudget,
      maxBudget: filters.maxBudget,
      publicationDate: filters.publicationDate,
      queryString,
    });

  } catch (error) {
    console.error("Error fetching properties:", error);
    res.render('mainPages/index', {
      title: "CIGAFI - Nos productions",
      properties: [],
      listingCategory,
      listingType,
      error: "Une erreur est survenue lors de la récupération des annonces.",
      listingMetadata: {
        propertiesType: { success: false, data: [] },
        villes: { success: false, data: [] },
        quartiers: { success: false, data: [] }
      },
      // Add default values for error state
      selectedType: 'All',
      selectedVille: 'All',
      selectedQuartier: 'All',
      minBudget: 0,
      maxBudget: null,
      publicationDate: 'All'
    });
  }
};


export const locationsGet = async (req, res) => {
  const { category } = req.params;
  const listingCategory = category || "habitations-bureaux";
  const page = parseInt(req.query.page) || 1;
  const listingType = "/a-louer/annonces";

  // Extract filter data with defaults
  const filters = {
    type: req.query.type || "All",
    ville: req.query.ville || "All",
    quartier: req.query.quartier || "All",
    minBudget: parseInt(req.query.minBudget) || 0,
    maxBudget: req.query.maxBudget ? parseInt(req.query.maxBudget) : null,
    publicationDate: req.query.publicationDate || "All"
  }; 

  // Get the base URL without query parameters
  const baseUrl = `/a-louer/${listingCategory}`;
  
  // Create URLSearchParams from current query
  const searchParams = new URLSearchParams(req.query);
  // Remove page parameter if it exists
  searchParams.delete('page');
  // Get the query string
  const queryString = searchParams.toString();

  try {
    const response = await fetch(`${Backend_API}/api/locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        listingCategory,
        page,
        filters
      })
    });

    const result = await response.json();
    const properties = result?.data || [];
    const currentPage = result?.currentPage || 1;
    const totalPages = result?.totalPages || 1;

    // Fetch metadata
    const [propertiesType, villes, quartiers] = await Promise.all([
      fetch(`${Backend_API}/api/listing-metadata/type-de-biens`).then(res => res.json()),
      fetch(`${Backend_API}/api/listing-metadata/villes`).then(res => res.json()),
      fetch(`${Backend_API}/api/listing-metadata/quartiers`).then(res => res.json())
    ]);

    res.render('mainPages/index', {
      title: "CIGAFI - Nos productions",
      properties,
      listingCategory,
      baseUrl,
      searchParams: searchParams.toString(),
      currentPage,
      totalPages,
      listingType,
      listingMetadata: {
        propertiesType,
        villes,
        quartiers
      },
      // Pass the selected values
      selectedType: filters.type,
      selectedVille: filters.ville,
      selectedQuartier: filters.quartier,
      minBudget: filters.minBudget,
      maxBudget: filters.maxBudget,
      publicationDate: filters.publicationDate,
      queryString,
    });

  } catch (error) {
    console.error("Error fetching properties:", error);
    res.render('mainPages/index', {
      title: "CIGAFI - Nos productions",
      properties: [],
      listingCategory,
      listingType,
      error: "Une erreur est survenue lors de la récupération des annonces.",
      listingMetadata: {
        propertiesType: { success: false, data: [] },
        villes: { success: false, data: [] },
        quartiers: { success: false, data: [] }
      },
      // Add default values for error state
      selectedType: 'All',
      selectedVille: 'All',
      selectedQuartier: 'All',
      minBudget: 0,
      maxBudget: null,
      publicationDate: 'All'
    });
  }
};


export const locationsByIdGet = async (req, res) => {
  try {
    // Get both listingCategory and slug from URL
    const { slug } = req.params;

    // Extract the ID from the slug (last part after the last dash)
    const propertyId = slug.split('-').pop();
    console.log("Property ID:", propertyId);

    // Fetch property details
    const propertyResponse = await fetch(`${Backend_API}/api/locations/${propertyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!propertyResponse.ok) {
      throw new Error(`Erreur API: ${propertyResponse.statusText}`);
    }

    const propertyResult = await propertyResponse.json();
    const property = propertyResult?.data || null;
    console.log("Property Details:", property);

    

    res.render('mainPages/details-propriete', {
      title: "CIGAFI - Détail propriété",
      property,
     
    });

  } catch (error) {
    console.error('Erreur lors du chargement des détails de la propriété:', error.message);
    res.status(500).render('error', {
      message: 'Erreur serveur. Veuillez réessayer plus tard.',
      error: { status: 500 }
    });
  }
};



export const getAllAnnoncesVentes = async (req, res) => {
  const { category } = req.params;

  // Category conversion mapping
  const categoryMap = {
    'terrain-urbain': 'Terrain urbain',
    'terrain-rural': 'Terrain rural', // Adjusted for correct spelling (was 'terrain-ruraul')
    'maison-et-immeuble': 'Villas et autres constructions'
  };

  // Convert category or use default
  const listingCategory = categoryMap[category] || 'Villas et autres constructions';

  const page = parseInt(req.query.page) || 1;
  const listingType = '/a-vendre/annonces';

  // Extract filter data with defaults
  const filters = {
    type: req.query.type || 'All',
    ville: req.query.ville || 'All',
    quartier: req.query.quartier || 'All',
    minBudget: parseInt(req.query.minBudget) || 0,
    maxBudget: req.query.maxBudget ? parseInt(req.query.maxBudget) : null,
    publicationDate: req.query.publicationDate || 'All'
  };

  // Get the base URL without query parameters
  const baseUrl = `/a-vendre/${category || 'maison-et-immeuble'}`; // Keep kebab-case for URL

  // Create URLSearchParams from current query
  const searchParams = new URLSearchParams(req.query);
  // Remove page parameter if it exists
  searchParams.delete('page');
  // Get the query string
  const queryString = searchParams.toString();

  try {
    const response = await fetch(`${Backend_API}/api/getAllAnnoncesVentes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        listingCategory, // Use human-readable category
        page,
        filters
      })
    });

    const result = await response.json();
    const properties = result?.data || [];
    const currentPage = result?.currentPage || 1;
    const totalPages = result?.totalPages || 1;

    // Fetch metadata
    const [propertiesType, villes, quartiers] = await Promise.all([
      fetch(`${Backend_API}/api/listing-metadata/type-de-biens`).then(res => res.json()),
      fetch(`${Backend_API}/api/listing-metadata/villes`).then(res => res.json()),
      fetch(`${Backend_API}/api/listing-metadata/quartiers`).then(res => res.json())
    ]);
console.log("Properties:", properties);
    res.render('mainPages/annonce-vente', {
      title: 'CIGAFI - Nos productions',
      properties,
      listingCategory, // Human-readable category
      baseUrl,
      searchParams: searchParams.toString(),
      currentPage,
      totalPages,
      listingType,
      listingMetadata: {
        propertiesType,
        villes,
        quartiers
      },
      // Pass the selected values
      selectedType: filters.type,
      selectedVille: filters.ville,
      selectedQuartier: filters.quartier,
      minBudget: filters.minBudget,
      maxBudget: filters.maxBudget,
      publicationDate: filters.publicationDate,
      queryString
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.render('mainPages/annonce-vente', {
      title: 'CIGAFI - Nos productions',
      properties: [],
      listingCategory, // Human-readable category
      listingType,
      error: 'Une erreur est survenue lors de la récupération des annonces.',
      listingMetadata: {
        propertiesType: { success: false, data: [] },
        villes: { success: false, data: [] },
        quartiers: { success: false, data: [] }
      },
      // Add default values for error state
      selectedType: 'All',
      selectedVille: 'All',
      selectedQuartier: 'All',
      minBudget: 0,
      maxBudget: null,
      publicationDate: 'All'
    });
  }
};


export const annonceVenteByIdGet = async (req, res) => {
  try {
    // Get both listingCategory and slug from URL
    const { slug } = req.params;

    // Extract the ID from the slug (last part after the last dash)
    const propertyId = slug.split('-').pop();
    console.log("Property ID:", propertyId);

    // Fetch property details
    const propertyResponse = await fetch(`${Backend_API}/api/annonce-vente/${propertyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!propertyResponse.ok) {
      throw new Error(`Erreur API: ${propertyResponse.statusText}`);
    }

    const propertyResult = await propertyResponse.json();
    const property = propertyResult?.data || null;
    console.log("Property Details:", property);

    

    res.render('mainPages/details-vente', {
      title: "CIGAFI - Détail propriété",
      property,
     
    });

  } catch (error) {
    console.error('Erreur lors du chargement des détails de la propriété:', error.message);
    res.status(500).render('error', {
      message: 'Erreur serveur. Veuillez réessayer plus tard.',
      error: { status: 500 }
    });
  }
};












export const servicesGet = (req, res) => {
  console.log(req.body)
  res.render('mainPages/services', { title: "CIGAFI - Nos productions" });
};

export const ressourcesGet = (req, res) => {
  console.log(req.body)
  res.render('mainPages/ressources', { title: "CIGAFI - Nos productions" });
};

export const aboutGet = (req, res) => {
  console.log(req.body)
  res.render('mainPages/a-propos', { title: "CIGAFI - Nos productions" });
};

export const signInGet = async (req, res) => {
  try {
    const token = req.cookies.access_token;

    // If no token, render the sign-in page
    if (!token) {
      return res.render('mainPages/sign-in', { title: "CIGAFI - Nos productions" });
    }

    // Fetch user data from the backend
    const response = await fetch(`${Backend_API}/api/auth/refresh-user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    // If the fetch fails or response is not okay, clear cookie and render sign-in page
    if (!response.ok) {
      res.clearCookie('access_token', { path: '/' });
      return res.render('mainPages/sign-in', { title: "CIGAFI - Nos productions" });
    }

    const userData = await response.json();

    // If user data is not valid or user is not verified
    if (!userData.success) {
      res.clearCookie('access_token', { path: '/' });
      return res.render('mainPages/sign-in', { title: "CIGAFI - Nos productions" });
    }

    // If user is verified, redirect to reservations page
    return res.redirect('/user/reservations');

  } catch (err) {
    console.error("Error in signInGet:", err);
    return res.render('mainPages/sign-in', { title: "CIGAFI - Nos productions" });
  }
};

export const signUpGet = async (req, res) => {
  try {
    const token = req.cookies.access_token;

    // If no token, render the sign-up page
    if (!token) {
      return res.render('mainPages/sign-up', { title: "CIGAFI - Nos productions" });
    }

    // Fetch user data from the backend
    const response = await fetch(`${Backend_API}/api/auth/refresh-user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    // If the fetch fails or response is not okay, clear cookie and render sign-up page
    if (!response.ok) {
      res.clearCookie('access_token', { path: '/' });
      return res.render('mainPages/sign-up', { title: "CIGAFI - Nos productions" });
    }

    const userData = await response.json();

    // If user data is invalid or user is not verified
    if (!userData.success || !userData.user || !userData.user.isVerified) {
      res.clearCookie('access_token', { path: '/' });
      return res.render('mainPages/sign-up', { title: "CIGAFI - Nos productions" });
    }

    // If user is verified, redirect to reservations page
    return res.redirect('/user/reservations');

  } catch (err) {
    console.error("Error in signUpGet:", err);
    return res.render('mainPages/sign-up', { title: "CIGAFI - Nos productions" });
  }
};



export const requeteGet = (req, res) => {
  console.log(req.body)
  res.render('mainPages/requete', { title: "CIGAFI - Nos productions" });
};

export const reservationInfoGet = (req, res) => {
  console.log(req.body)
  res.render('mainPages/reservation-info', { title: "CIGAFI - Nos productions" });
};

export const reservationPayGet = (req, res) => {
  console.log(req.body)
  res.render('mainPages/reservation-pay-mm', { title: "CIGAFI - Nos productions" });
};

export const ressourceDetailsGet = (req, res) => {
  console.log(req.body)
  res.render('mainPages/ressource-details', { title: "CIGAFI - Nos productions" });
};

