const express = require('express');
const auth = require('../middleware/authentication');

const route = express.Router();
const Auth = require('../models/auth');

/*post request for the user singin */
route.post('/auth/signin', async (req, res) => {
    console.log(req.body);
    try { 
        const user = await new Auth(req.body).save();
        const token = await user.generateAuthToken();
        res.status(201).send({
            user,
            token
        })
    } catch (error) {
        res.send(400).send(error)
    }
});

/*post request for the user login */
route.post('/auth/login', async (req, res) => {
    try {
        const user = await Auth.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({
            user, 
            token
        });
    } catch (error) {
        res.status(400).send(error)
    }
});

route.post('/auth/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.status(200).send();
    } catch (error) {
        res.status(500).send(error)
    }
});


route.post('/auth/logout/all', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error)
    }
});


module.exports = route;