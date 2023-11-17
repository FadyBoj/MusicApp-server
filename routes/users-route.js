const express = require('express');
const router = express.Router();

const {
    checkUser,
    addUser
} = require('../controllers/users');

router.route('/check-user').post(checkUser);
router.route('/add-user').post(addUser);

module.exports = router