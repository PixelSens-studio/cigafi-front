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

export const signInGet = async (req, res) => {
    const metadata = { 
    title: "Espace admin | CIGAFI",
    pageTitle: "Création d'annonce",
    pageSubtitle: "Créez une nouvelle annonce",
  };

  try {


  console.log('Metadata:', metadata);
  
    const token = req.cookies.admin_access_token;

    // If no token, render the admin login page
    if (!token) {
      return res.render('adminDashboard/signin', {metadata} );
    }

    // Fetch the admin user data
    const response = await fetch(`${Backend_API}/api/admin/refresh-user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    // If the fetch fails or response is not okay
    if (!response.ok) {
      res.clearCookie('admin_access_token', { path: '/' }); // Clear the cookie
      return res.render('adminDashboard/signin', {metadata});
    }

    const userData = await response.json();

    // If admin data is not valid or user is not verified
    if (!userData.success ) {
      res.clearCookie('access_token', { path: '/' }); // Clear the cookie if not verified
      return res.render('adminDashboard/signin', {metadata});
    }

    // If admin is verified, redirect to the admin dashboard
    return res.redirect('/admin/dashboard');

  } catch (err) {
    return res.render('adminDashboard/signin', {metadata});
  }
};


export const signInPost = async (req, res) => {
    try {
      const formData = req.body;
      const response = await fetch(`${Backend_API}/api/admin/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (data.success) {
        res.cookie("admin_access_token", data.accessToken, {
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
      const token = req.cookies.admin_access_token;
      // const token = req.headers.authorization.split(" ")[1];
      console.log(token)

      if (!token) {
          return res.status(401).json({ message: "No token provided" });
      }

      const response = await fetch(`${Backend_API}/api/admin/signout`, {
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
      res.clearCookie("admin_access_token", { path: '/' });

      return res.status(200).json({ 
          success: true, 
          message: data.message || "Signed out successfully" 
      });

  } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ message: "Server error, try again later" });
  }
};