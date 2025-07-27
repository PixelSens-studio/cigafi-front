import dotenv from 'dotenv';

dotenv.config();
const Backend_API = process.env.BACKEND_API_ROOT;


export default async function auth(req, res, next) {
    try {
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(401).redirect('/sign-in');
        }

        const response = await fetch(`${Backend_API}/api/auth/refresh-user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        if (!userData.success) {
            return res.status(401).redirect('/sign-in');
        }

        if (!userData.user.isVerified) {
            return res.status(401).redirect('/auth/registration-validation');
        } 

        req.user = userData;
        next();
    } catch (err) {
        console.error("Authentication error:", err);
        return res.status(401).redirect('/sign-in');
    }
}
