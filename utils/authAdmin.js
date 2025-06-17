import dotenv from 'dotenv';

dotenv.config();

const Backend_API = process.env.BACKEND_API_ROOT;

export default async function authAdmin(req, res, next) {
    try {
        const token = req.cookies.admin_access_token    ;
        console.log(token)

        if (!token) {
            return res.status(401).redirect('/admin/signin');
        }

        const response = await fetch(`${Backend_API}/api/admin/refresh-user`, {
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
            return res.status(401).redirect('/admin/signin');
        }

        if (userData.user.isBlocked) {
            console.log("Blocked")
            return res.status(401).redirect('/admin/Bloked');
        }

        req.user = userData;
        next();
    } catch (err) {
        console.error("Authentication error:", err);
        return res.status(401).redirect('/admin/signin');
    }
}
