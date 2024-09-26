async function reservationsGet(req, res) {
    // const userData = req.user
    // const user = userData.user
    // try {

    //   const token = req.cookies.access_token;

    //   if (!token) {
    //     return res.status(401).redirect('/user/login');
    //   }
    //   const response = await fetch(`${process.env.API_ROOT}/api/booking`, {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization':  `Bearer ${token}`
    //     }
    //   });

    //   const data = await response.json();

    //   if (data.success) {
    //     console.log(data)
    //     res.render('userDashboard/reservations', { title: "Krypton - S'enrégistrer", user,  bookings:data.bookings, formatDate, formatFullDate, decorLinkFormat});


    //   } else {
    //     res.render('userDashboard/reservations', { title: "Krypton - S'enrégistrer", user, errorMessage: data.message});
    //   }
    // } catch (error) {
    //   res.render('userDashboard/reservations', { title: "Krypton - S'enrégistrer", user,   errorMessage: 'Erreur serveur, merci de réessayer'});
    // }


  }


  function reservationsGet(req, res) {
    res.render('adminDashboard/reservations', { title: "Krypton - S'enrégistrer" });
  }

function usersGet(req, res) {
  res.render('adminDashboard/users', { title: "Krypton - S'enrégistrer" });
}

function dashboardGet(req, res) {
  res.render('adminDashboard/dashboard', { title: "Krypton - S'enrégistrer" });
}


function transactionsGet(req, res) {
    res.render('adminDashboard/transactions', { title: "Krypton - S'enrégistrer" });
  }

function userDetailsGet(req, res) {
  res.render('adminDashboard/user-details', { title: "Krypton - S'enrégistrer" });
}

function adminsGet(req, res) {
    res.render('adminDashboard/comptes-admin', { title: "Krypton - S'enrégistrer" });
  }

function devisGet(req, res) {
  res.render('adminDashboard/demandes-devis', { title: "Krypton - S'enrégistrer" });
}
function contactMessagesGet(req, res) {
    res.render('adminDashboard/message-contact', { title: "Krypton - S'enrégistrer" });
  }

  function userDetailsProjectGet(req, res) {
      res.render('adminDashboard/user-details-project', { title: "Krypton - S'enrégistrer" });
    }


  module.exports = {
    dashboardGet,
    reservationsGet,
    usersGet,
    transactionsGet,
    userDetailsGet,
    adminsGet,
    devisGet,
    contactMessagesGet,
    userDetailsProjectGet
    };
