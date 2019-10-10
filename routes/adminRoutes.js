var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController');
var {isUserAuthenticated} = require('../config/customFunctions');

router.all('/*', isUserAuthenticated, (peticion, respuesta, siguiente)=>{
    peticion.app.locals.layout = 'admin';
    siguiente();
});

router.route('/').get(adminController.index);

router.route('/posts').get(adminController.getPosts);

router.route('/posts/create').get(adminController.createPostsGet).post(adminController.submitPosts);

router.route('/posts/edit/:id').get(adminController.editPost).put(adminController.editPostSubmit);

router.route('/posts/delete/:id').delete(adminController.deletePost);

/*Rutas del administrador de categorías*/

router.route('/category').get(adminController.getCategories).post(adminController.createCategories);

router.route('/category/create').post(adminController.createCategories);

router.route('/category/edit/:id').get(adminController.editCategoriesGetRoute).post(adminController.editCategoriesPostRoute);

router.route('/category/delete/:id').delete(adminController.deleteCategory);

/*Rutas del administrador de comentarios */
router.route('/comment').get(adminController.getComments);

router.route('/comment/edit/:id').put(adminController.approveComment);

/*Rutas del administrador de usuarios*/
router.route('/user').get(adminController.getUsers);

router.route('/user/edit/:id').put(adminController.adminTrue);

/*Rutas del administrador de configuraciones*/
router.route('/configuration').get(adminController.getConfigurations);

router.route('/configuration/editFavicon').put(adminController.editFileFavicon);

router.route('/configuration/editLogo').put(adminController.editFileLogo);

router.route('/configuration/editPageTitle').put(adminController.editPageTitle);

router.route('/configuration/editPageDescription').put(adminController.editPageDescription);

router.route('/configuration/editPageKeyWords').put(adminController.editPageKeyWords);

router.route('/template').get(adminController.getTemplates);

router.route('/template/create').get(adminController.createTemplate).post(adminController.submitTemplates);

router.route('/template/edit/:id').put(adminController.activeTemplate);

module.exports = router;