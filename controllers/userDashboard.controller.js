export const reservationsGet = async (req, res) => {
  try {
    const userData = req.user;
    const user = userData.user;
    
    res.render("userDashboard/reservations", { 
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


export const annoncesGet = async (req, res) => {
  try {
    const userData = req.user;
    const user = userData.user;
    
    res.render("userDashboard/annonces", { 
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
    
    res.render("userDashboard/add-new-location", { 
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


export const addNewVenteGet = async (req, res) => {
  try {
    const userData = req.user;
    const user = userData.user;
    
    res.render("userDashboard/add-new-vente", { 
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