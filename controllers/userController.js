const db = require('../models/connection')

const getLogin =  (req, res) => {
    const { username, password } = req.body;
    console.log(username, password)
    try {
        const sql = 'SELECT * FROM user WHERE username = ? AND password = ?'
        db.query(sql, [username,password], (error, result) => {
            if (error) {
                console.error('Error during login:', error);
                return res.status(500).json({ message: 'Error during login', error: error.message });
            }

            if (result.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const user = result[0].username;
            return res.json({ message: 'success', user });
        })
        
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Error during login', error: error.message });
    }
};

module.exports = {
    getLogin
}