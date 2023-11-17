const express = require('express');
const router = express.Router();


const {

    callBack,
    getSpotifyCode,
    refreshToken,
    topSongs,
    getSong,
    getTopArtist,
    recommendations,
    getAudio

} = require('../controllers/spotify');  


router.route('/get-token').get(callBack);
router.route('/get-code').get(getSpotifyCode);
router.route('/token').get(refreshToken);
router.route('/top-songs').get(topSongs);
router.route('/get-song').get(getSong);
router.route('/top-artist').get(getTopArtist);
router.route('/recommendations').get(recommendations);
router.route('/audio').get(getAudio);



module.exports = router

