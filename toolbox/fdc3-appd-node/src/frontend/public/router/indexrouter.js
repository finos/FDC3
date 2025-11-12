const express = require('express');
const router = express.Router();

router.get('/apps', (req, res) => {
    try {
        res.render('apps', {
            title: 'Applications Dashboard',
            layout: 'home'
        });
    } catch (error) {
        console.error('Error rendering view:', error);
        res.status(500).send(error);
    }
});

router.get('/search', (req, res) => {
    try {
        res.render('search', {
            title: 'Search Applications',
            layout: 'home'
        });
    } catch (error) {
        console.error('Error rendering view:', error);
        res.status(500).send(error);
    }
});

router.get('/appDetails', (req, res) => {
    try {
        const appId = req.query.appId;
        res.render('appDetails', {
            title: `Application Details - ${appId || 'Not Found'}`,
            layout: 'home',
            appId: appId
        });
    } catch (error) {
        console.error('Error rendering view:', error);
        res.status(500).send(error);
    }
});

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login',
        layout: 'home'
    });
});

module.exports = router;