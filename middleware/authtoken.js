const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
    try {
        // Check if the environment variable for the secret key is defined
        if (!process.env.TOKEN_SECRET_KEY) {
            return res.status(500).json({
                message: "Server misconfiguration: TOKEN_SECRET_KEY is missing",
                error: true,
                success: false
            });
        }

        const cookieString = req.headers.cookie;
        
        // Check if the cookie is present
        if (!cookieString) {
            return res.status(401).json({
                message: "Please login...!",
                error: true,
                success: false
            });
        }

        // Find and extract the token from the cookies
        const tokenCookie = cookieString.split('; ').find(row => row.startsWith('token='));
        if (!tokenCookie) {
            return res.status(401).json({
                message: "Token not found in cookies",
                error: true,
                success: false
            });
        }

        const token = tokenCookie.split('=')[1];

        // Verify the JWT token
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    message: "Invalid or expired token",
                    error: true,
                    success: false
                });
            }

            // Attach userId to request object for further use
            req.userId = decoded._id;
            next(); // Continue to next middleware/handler
        });

    } catch (err) {
        console.error("Error in authToken middleware:", err); // For debugging purposes
        res.status(400).json({
            message: err.message || "An error occurred while processing the request",
            data: [],
            error: true,
            success: false,
        });
    }
}

module.exports = authToken;
