var Post = require('../models/postModel').Post;

module.exports = {
    index: (peticion, respuesta)=>{
        respuesta.render('admin/index');
    },
    getPosts: (peticion, respuesta)=>{
        respuesta.render('admin/posts/index');
    },
    submitPosts: (peticion, respuesta)=>{
        const newPost = new Post({
            title: peticion.body.title,
            autor: peticion.body.autor,
            description: peticion.body.description,
            category: peticion.body.category
        });

        newPost.save().then(post =>{
            console.log(post);
            peticion.flash('success message', 'Post creado satisfactoriamente.');
            respuesta.redirect('/admin/posts');
        });
    },
    createPosts: (peticion, respuesta)=>{
        respuesta.render('admin/posts/create');
    },
};