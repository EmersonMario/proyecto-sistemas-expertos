var Post = require('../models/postModel').Post;
var Template = require('../models/TemplateModel').Template;
var Category = require('../models/CategoryModel').Category;
var Comment = require('../models/CommentModel').Comment;
var Configuration = require('../models/ConfigurationModel').Configuration;
var bcrypt = require('bcryptjs');
var User = require('../models/UserModel').User;

module.exports = {
    index: async (peticion, respuesta)=>{
        const posts = await Post.find();
        const categories = await Category.find();
        const templates = await Template.find();
        const configurations = await Configuration.find();
        respuesta.render('default/index', {posts: posts, categories: categories, templates: templates, configurations: configurations});
    },
    /*Login Routes*/
    loginGet: (peticion, respuesta)=>{
        respuesta.render('default/login', {message: peticion.flash('error')});
    },
    loginPost: (peticion, respuesta)=>{
        
    },
    registerGet: (peticion, respuesta)=>{
        respuesta.render('default/register');
    },
    registerPost: (peticion, respuesta)=>{
        let errors = [];

        if(!peticion.body.firstName){
            errors.push({message: 'El nombre es necesario'});
        }

        if(!peticion.body.lastName){
            errors.push({message: 'El apellido es necesario'});
        }

        if(!peticion.body.email){
            errors.push({message: 'El email es necesario'})
        }

        if(!peticion.body.password || !peticion.body.passwordConfirm){
            errors.push({message: 'La contraseña es necesaria'});
        }

        if(peticion.body.password !== peticion.body.passwordConfirm){
            errors.push({message: 'Las contraseñas no coinciden'})
        }

        if(errors.length > 0){
            respuesta.render('default/register', {
                errors: errors,
                firstName: peticion.body.firstName,
                lastName: peticion.body.lastName,
                email: peticion.body.email
            });
        }else{
            User.findOne({email: peticion.body.email}).then(user=>{
                if(user){
                    peticion.flash('error-message', 'Ya existe este correo electrónico, intente iniciar sesión.');
                    respuesta.redirect('/login');
                }else{
                    const newUser = new User(peticion.body);

                    bcrypt.genSalt(10, (err, salt)=>{
                        bcrypt.hash(newUser.password, salt, (err, hash)=>{
                            newUser.password = hash;
                            newUser.save().then(user=>{
                                peticion.flash('success-message', 'Te has registrado satisfactoriamente');
                                respuesta.redirect('/login');
                            });
                        });
                    });
                }
            })
        }
    },

    getSinglePost: async (peticion, respuesta)=>{
        const id = peticion.params.id;
        const configurations = await Configuration.find();
        const categories = await Category.find();

        Post.findById(id).populate({path: 'comments', populate: {path: 'user', model: 'user'}}).then(post=>{
            if(!post){
                respuesta.status(404).json({message: 'Post no encontrado'});
            }else{
                respuesta.render('default/singlePost', {post: post, comments: post.comments, configurations: configurations, categories: categories});
            }
        });
    },

    submitComment: (peticion, respuesta)=>{
        if(peticion.user){
            Post.findById(peticion.body.id).then(post=>{
                const newComment = new Comment({
                    user: peticion.user.id,
                    body: peticion.body.comment_body
                });

                post.comments.push(newComment);
                post.save().then(savedPost=>{
                    newComment.save().then(savedComment=>{
                        peticion.flash('success-message', 'Su comentario fue enviado para su revisión');
                        respuesta.redirect(`/post/${post._id}`);
                    });
                });
            });
        }else{
            peticion.flash('error-message', 'Por favor, inicie sesión para dejar un comentario');
            respuesta.redirect('/login');
        }
    }
    
};