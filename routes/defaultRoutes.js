var express = require("express");
var router = express.Router();
var defaultController = require('../controllers/defaultController');


/*Configuración de las rutas*/
router.all('/*', (peticion, respuesta, siguiente)=>{
    peticion.app.locals.layout = 'default';
    siguiente();
});

router.route('/').get( defaultController.index);

router.route('/login').get(defaultController.loginGet).post(defaultController.loginPost);

router.route('/register').get(defaultController.registerGet).post(defaultController.registerPost);

module.exports = router;