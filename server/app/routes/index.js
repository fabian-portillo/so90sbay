'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/members', require('./members'));
router.use('/cart', require('./cart'));
router.use('/product', require('./products'));
router.use('/user', require('./user'));
router.use('/review', require('./review'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
