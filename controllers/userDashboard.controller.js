const { formatDate, formatFullDate } = require('../helpers/dateformat.js');
const { decorLinkFormat } = require('../helpers/decorName.js')

async function reservationsGet(req, res) {
//        const userData = req.user
//        const user = userData.user
//        try {
//
//          const token = req.cookies.access_token;
//
//          if (!token) {
//            return res.status(401).redirect('/user/login');
//          }
//          const response = await fetch(`${process.env.API_ROOT}/api/booking`, {
//            method: 'GET',
//            headers: {
//              'Content-Type': 'application/json',
//              'Authorization':  `Bearer ${token}`
//            }
//          });
//
//          const data = await response.json();
//
//          if (data.success) {
//            console.log(data)
//            res.render('userDashboard/reservations', { title: "Krypton - S'enrégistrer", user,  bookings:data.bookings, formatDate, formatFullDate, decorLinkFormat});
//
//
//          } else {
//            res.render('userDashboard/reservations', { title: "Krypton - S'enrégistrer", user, errorMessage: data.message});
//          }
//        } catch (error) {
//          res.render('userDashboard/reservations', { title: "Krypton - S'enrégistrer", user,   errorMessage: 'Erreur serveur, merci de réessayer'});
//        }

        res.render('userDashboard/reservations', { title: "Krypton - S'enrégistrer",   errorMessage: 'Erreur serveur, merci de réessayer'});

      }

async function favorisGet(req, res) {
        
          res.render('userDashboard/favoris', { title: "Krypton - Mon compte"});
      }

async function mesProjetsGet(req, res) {
        const userData = req.user
        const user = userData.user
          res.render('userDashboard/projets', { title: "Krypton - Mon compte", user});
      }

async function ressourcesGet(req, res) {
        const userData = req.user
        const user = userData.user
          res.render('userDashboard/ressources', { title: "Krypton - Mon compte", user});
      }










  module.exports = {
  reservationsGet,
  favorisGet
  };
