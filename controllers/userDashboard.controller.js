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
