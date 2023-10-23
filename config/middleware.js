const jwt = require('jsonwebtoken');
require('dotenv').config()
// console.log(process.env.skey)

const secretKey = process.env.skey; // Replace with your actual secret key

// Middleware to authenticate and authorize the request
const authenticateAndAuthorize = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized Bearer' });
    }

    const token = authHeader.slice(7); // Remove 'Bearer ' to get the actual token
    // console.log(token)
    // const decoded = jwt.verify(token, secretKey);
    // console.log(decoded)
    try {
        
        if (token !== secretKey) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    } catch (error) {
        // console.log(error)
        
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = authenticateAndAuthorize
