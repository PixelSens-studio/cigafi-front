import dotenv from 'dotenv';

dotenv.config();

const Backend_API = process.env.BACKEND_API_ROOT;

export const signUpPost = async (req, res) => {
    try {
      const formData = req.body;
      const response = await fetch(`${Backend_API}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (data.success) {
        return res.status(201).json({ success: true, message: 'success' });
      } else if (response.status === 409) {
        return res.status(409).json({ message: 'Ce mail est déjà associé à un compte' });
      } else {
        return res.status(400).json({ message: 'Une erreur est survenue, merci de réessayer' });
      }
    } catch (error) {
      return res.status(400).json({ message: 'Une erreur est survenue, merci de réessayer' });
    }
};

export const registrationVerificationPost = async (req, res) => {
    try {
      const formData = req.body; 
      const response = await fetch(`${Backend_API}/api/auth/user-registration-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (data.success) {
        res.cookie("access_token", data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
        
        return res.status(201).json({ success: true, message: 'success'});
      } else if (response.status === 410) {
        return res.status(410).json({ message: 'Code de vérification invalide ou expiré' });
      } else {
        return res.status(400).json({ message: 'Une erreur est survenue, merci de réessayer' });
      }
    } catch (error) {
      console.error("Verification error:", error);
      return res.status(400).json({ message: 'Une erreur est survenue, merci de réessayer' });
    }
};

export const signInPost = async (req, res) => {
    try {
      const formData = req.body;
      const response = await fetch(`${Backend_API}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (data.success) {
        res.cookie("access_token", data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
        
        return res.status(201).json({ success: true, message: 'success'});
     
      } else {
        return res.status(400).json({ message: data.message });
      }
    } catch (error) {
      return res.status(400).json({ message: 'Erreur serveur, merci de réessayer' });
    }
};

export const signout = async (req, res) => {
  try {
      const token = req.cookies.access_token;

      if (!token) {
          return res.status(401).json({ message: "No token provided" });
      }

      const response = await fetch(`${Backend_API}/api/auth/signout`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          },
      });

      if (!response.ok) {
          return res.status(response.status).json({ 
              message: "Failed to sign out. Please try again." 
          });
      }

      let data;
      try {
          data = await response.json();
      } catch (err) {
          console.error("Error parsing logout response:", err);
          return res.status(500).json({ message: "Unexpected server response" });
      }

      // Clear the cookie if signout was successful
      res.clearCookie("access_token", { path: '/' });

      return res.status(200).json({ 
          success: true, 
          message: data.message || "Signed out successfully" 
      });

  } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ message: "Server error, try again later" });
  }
};

export const registrationVerificationGet = async (req, res) => {
  try {
      const token = req.cookies.access_token;

      // If no token, render the account verification page
      if (!token) {
          return res.render('userDashboard/account-verification', {
              title: "CIGAFI - Vérifiez votre compte"
          });
      }

      // Fetch the user data
      const response = await fetch(`${Backend_API}/api/auth/refresh-user`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      });

      // If the fetch fails or response is not okay, clear the cookie and render the page
      if (!response.ok) {
          res.clearCookie('access_token', { path: '/' });
          return res.render('userDashboard/account-verification', {
              title: "CIGAFI - Vérifiez votre compte"
          });
      }

      const userData = await response.json();
      
      // Debugging log (remove in production)
      console.log(userData);

      // If user data is invalid or user is not verified, clear the cookie and render the page
      if (!userData.success || !userData.user || !userData.user.isVerified) {
          res.clearCookie('access_token', { path: '/' });
          return res.render('userDashboard/account-verification', {
              title: "CIGAFI - Vérifiez votre compte"
          });
      }

      // If user is verified, redirect to reservations page
      return res.redirect('/user/reservations');
      
  } catch (err) {
      console.error("Error in registrationVerificationGet:", err);
      return res.render('userDashboard/account-verification', {
          title: "CIGAFI - Vérifiez votre compte"
      });
  }
};
