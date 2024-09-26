function homeGet(req, res) {
  console.log(req.body)
  res.render('mainPages/index', { title: "CIGAFI - Nos productions" });
}





 module.exports = {
        homeGet
    };

