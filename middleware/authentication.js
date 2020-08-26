const jwt = require('jsonwebtoken');;
const User = require('../models/auth');

/* Mioddingware function for authentication */
const auth = async (req, res, next) => {
    try {
        /* Getting Autherization token from request */
        const token = req.header('Authorization').replace('Bearer ', '');

        /* Verifying Autherization token from jwt */
        const decoded = jwt.verify(token, 'StarkFlowAssignmnet');

        /* Finding logged in user */
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if(!user) {
            throw new Error();
        }

        /* Adding token and user in the request */
        req.token = token;
        req.user = user;
        next();

    } catch (error) {
        res.status(401).send({ error: 'Please authenticate!' })
    }
}

module.exports = auth;