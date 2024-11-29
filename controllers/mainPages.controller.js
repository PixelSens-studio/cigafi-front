function homeGet(req, res) {
  console.log(req.body)
  res.render('mainPages/index', { title: "CIGAFI - Nos productions" });
}

function servicesGet(req, res) {
  console.log(req.body)
  res.render('mainPages/services', { title: "CIGAFI - Nos productions" });
}


function ressourcesGet(req, res) {
  console.log(req.body)
  res.render('mainPages/ressources', { title: "CIGAFI - Nos productions" });
}

function aboutGet(req, res) {
  console.log(req.body)
  res.render('mainPages/a-propos', { title: "CIGAFI - Nos productions" });
}

function loginGet(req, res) {
  console.log(req.body)
  res.render('mainPages/login', { title: "CIGAFI - Nos productions" });
}

function detailsProprieteGet(req, res) {
  console.log(req.body)
  res.render('mainPages/details-propriete', { title: "CIGAFI - Nos productions" });
}

function requeteGet(req, res) {
  console.log(req.body)
  res.render('mainPages/requete', { title: "CIGAFI - Nos productions" });
}

function reservationInfoGet(req, res) {
  console.log(req.body)
  res.render('mainPages/reservation-info', { title: "CIGAFI - Nos productions" });
}

function reservationPayGet(req, res) {
  console.log(req.body)
  res.render('mainPages/reservation-pay-mm', { title: "CIGAFI - Nos productions" });
}

function ressourceDetailsGet(req, res) {
  console.log(req.body)
  res.render('mainPages/ressource-details', { title: "CIGAFI - Nos productions" });
}











 module.exports = {
        homeGet,
        servicesGet,
        ressourcesGet,
        aboutGet,
        loginGet,
        detailsProprieteGet,
        requeteGet,
        reservationInfoGet,
        ressourceDetailsGet,
        reservationPayGet
    };

