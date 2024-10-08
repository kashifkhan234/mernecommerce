const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
    try {
        const cookieString = req.headers.cookie;

        // Check if cookies are present
        if (!cookieString) {
            return res.status(401).json({
                message: "Please login to access this resource",
                error: true,
                success: false
            });
        }

        // Extract token from cookies
        const token = cookieString.split('; ').find(row => row.startsWith('token='));

        // Check if token was found in the cookie string
        if (!token) {
            return res.status(401).json({
                message: "Token not found in cookies",
                error: true,
                success: false
            });
        }

        // Extract the token value (after 'token=')
        const tokenValue = token.split('=')[1];

        // Verify JWT token
        jwt.verify(tokenValue, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Invalid or expired token",
                    error: true,
                    success: false
                });
            }

            // Attach userId to request object for further use
            req.userId = decoded._id;
            next(); // Proceed to the next middleware or route handler
        });

    } catch (err) {
        console.error("Error in authToken middleware:", err); // Log detailed error in the console
        res.status(400).json({
            message: err.message || "An error occurred during token processing",
            error: true,
            success: false,
        });
    }
}

module.exports = authToken;

