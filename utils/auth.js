const jwt = require ("jsonwebtoken");
const JWTSecret = process.env.JWT_SECRET

const auth = async (req, res, next) => {

        try {
          const token = req.cookies.access_token;

        if (!token) {
          return res.status(401).redirect('/user/login');
        }
        const apiRoot = process.env.API_ROOT;
        const response = await fetch(`${apiRoot}/api/auth/refresh-user`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization':token
          }
        })
        
        const userData = await response.json()
        // console.log(userData)
        if (!userData.success) {
          return res.status(401).redirect('/user/login');
        }
        req.user = userData;
        next();

      } catch (err) {
          return res.status(401).redirect('/user/login');
      }
  };
  module.exports = auth;