var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController');


router.all('/*', (peticion, respuesta, siguiente)=>{
    peticion.app.locals.layout = 'admin';
    siguiente();
});

router.route('/').get(adminController.index);

router.route('/posts').get(adminController.getPosts);

router.route('/posts/create').get(adminController.createPosts).post(adminController.submitPosts);

module.exports = router;